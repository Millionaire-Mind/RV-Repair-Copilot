# Integration Testing Guide

## Overview

This directory contains integration tests that verify the complete RV Repair Copilot system works together as expected. Integration tests ensure that all components, services, and external dependencies work correctly in combination.

## Testing Strategy

### Integration Test Types

1. **API Integration Tests**: End-to-end API workflow testing
2. **Database Integration Tests**: Vector database operations and data flow
3. **External Service Tests**: OpenAI and Pinecone service integration
4. **Full System Tests**: Complete user journey testing
5. **Performance Integration Tests**: System performance under load

### Test Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                    Integration Test Environment                 │
├─────────────────────────────────────────────────────────────────┤
│  Test Runner  │  Backend API  │  Frontend App  │  Test Database │
└─────────────────────────────────────────────────────────────────┤
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
├─────────────────────────────────────────────────────────────────┤
│  OpenAI API   │  Pinecone DB  │  File Storage  │  Logging      │
└─────────────────────────────────────────────────────────────────┤
```

## Test Structure

```
tests/integration/
├── api/                    # API endpoint integration tests
│   ├── query/             # Search and query workflow tests
│   ├── ingest/            # Content ingestion workflow tests
│   └── health/            # Health check and monitoring tests
├── database/               # Database integration tests
│   ├── vector/            # Vector database operations
│   ├── metadata/          # Metadata management tests
│   └── performance/       # Database performance tests
├── workflows/              # Complete user workflow tests
│   ├── search/            # Search workflow testing
│   ├── ingestion/         # Content ingestion workflow
│   └── admin/             # Administrative operations
├── external/               # External service integration tests
│   ├── openai/            # OpenAI API integration
│   ├── pinecone/          # Pinecone service integration
│   └── file/              # File storage integration
├── performance/            # System performance tests
│   ├── load/              # Load testing
│   ├── stress/            # Stress testing
│   └── scalability/       # Scalability testing
├── fixtures/               # Test data and configuration
├── helpers/                # Integration test utilities
└── setup/                  # Test environment setup
```

## Running Integration Tests

### Basic Commands

```bash
# Run all integration tests
npm run test:integration

# Run specific integration test category
npm run test:integration:api
npm run test:integration:database
npm run test:integration:workflows

# Run tests with specific environment
NODE_ENV=test npm run test:integration

# Run tests with verbose output
npm run test:integration -- --verbose
```

### Environment Setup

```bash
# Set up test environment
export NODE_ENV=test
export PINECONE_INDEX=rv-repair-copilot-test
export OPENAI_API_KEY=your_test_api_key
export PINECONE_API_KEY=your_test_pinecone_key

# Start test services
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration
```

### Test Configuration

```typescript
// tests/integration/config/testConfig.ts
export const testConfig = {
  api: {
    baseUrl: process.env.TEST_API_URL || 'http://localhost:3001',
    timeout: 30000
  },
  database: {
    index: process.env.TEST_PINECONE_INDEX || 'rv-repair-copilot-test',
    environment: process.env.TEST_PINECONE_ENV || 'us-west1-gcp'
  },
  openai: {
    apiKey: process.env.TEST_OPENAI_API_KEY,
    model: 'gpt-4-1106-preview',
    embeddingModel: 'text-embedding-ada-002'
  },
  testData: {
    maxTestVectors: 100,
    testPdfPath: './tests/fixtures/sample-manual.pdf',
    cleanupAfterTests: true
  }
};
```

## Writing Integration Tests

### API Integration Test Example

```typescript
// tests/integration/api/query.test.ts
import request from 'supertest';
import { app } from '../../../src/app';
import { setupTestDatabase, teardownTestDatabase } from '../helpers/database';
import { mockOpenAI, mockPinecone } from '../helpers/mocks';
import { createTestVector, createTestQuery } from '../helpers/testData';

describe('Query API Integration', () => {
  let testVectorId: string;
  let testQuery: string;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test vector in database
    const testVector = createTestVector({
      brand: 'Winnebago',
      component: 'Electrical',
      content: 'Water pump troubleshooting guide...'
    });
    
    const result = await createTestVector(testVector);
    testVectorId = result.id;
    testQuery = 'How do I fix water pump issues?';
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(() => {
    // Reset mocks
    mockOpenAI();
    mockPinecone();
  });

  describe('POST /api/query', () => {
    it('should complete full query workflow', async () => {
      // 1. Send query request
      const response = await request(app)
        .post('/api/query')
        .send({ question: testQuery })
        .expect(200);

      // 2. Verify response structure
      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('sources');
      expect(response.body).toHaveProperty('metadata');

      // 3. Verify answer content
      expect(response.body.answer).toContain('water pump');
      expect(response.body.answer).toContain('Winnebago');

      // 4. Verify sources
      expect(response.body.sources).toHaveLength(1);
      expect(response.body.sources[0]).toContain('Winnebago');

      // 5. Verify metadata
      expect(response.body.metadata.searchResults).toBeGreaterThan(0);
      expect(response.body.metadata.processingTime).toBeGreaterThan(0);
    });

    it('should handle vector search correctly', async () => {
      const response = await request(app)
        .post('/api/query')
        .send({ question: testQuery });

      // Verify Pinecone was queried with correct parameters
      expect(mockPinecone().index).toHaveBeenCalledWith(testConfig.database.index);
      expect(mockPinecone().query).toHaveBeenCalledWith({
        vector: expect.any(Array),
        topK: 5,
        includeMetadata: true
      });
    });

    it('should generate appropriate OpenAI embeddings', async () => {
      const response = await request(app)
        .post('/api/query')
        .send({ question: testQuery });

      // Verify OpenAI embeddings were generated
      expect(mockOpenAI().embeddings.create).toHaveBeenCalledWith({
        model: testConfig.openai.embeddingModel,
        input: testQuery
      });
    });

    it('should handle OpenAI API errors gracefully', async () => {
      // Mock OpenAI error
      mockOpenAI().embeddings.create.mockRejectedValue(
        new Error('OpenAI API Error')
      );

      const response = await request(app)
        .post('/api/query')
        .send({ question: testQuery })
        .expect(500);

      expect(response.body.error).toContain('Internal server error');
    });
  });
});
```

### Database Integration Test Example

```typescript
// tests/integration/database/vector.test.ts
import { VectorDBService } from '../../../src/services/vectorDB';
import { setupTestDatabase, teardownTestDatabase } from '../helpers/database';
import { createTestVector, cleanupTestVectors } from '../helpers/testData';

describe('Vector Database Integration', () => {
  let vectorDB: VectorDBService;
  let testVectors: any[];

  beforeAll(async () => {
    await setupTestDatabase();
    vectorDB = new VectorDBService();
    await vectorDB.initialize();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    // Create test vectors
    testVectors = await Promise.all([
      createTestVector({
        brand: 'Winnebago',
        component: 'Electrical',
        content: 'Electrical system troubleshooting...'
      }),
      createTestVector({
        brand: 'Airstream',
        component: 'Plumbing',
        content: 'Plumbing system maintenance...'
      })
    ]);
  });

  afterEach(async () => {
    // Clean up test vectors
    await cleanupTestVectors(testVectors.map(v => v.id));
  });

  describe('Vector Operations', () => {
    it('should upsert vectors correctly', async () => {
      const testVector = {
        id: 'test-vector-123',
        values: Array(1536).fill(0.1),
        metadata: {
          brand: 'TestBrand',
          component: 'TestComponent',
          manualType: 'service'
        }
      };

      const result = await vectorDB.upsertVectors([testVector]);
      expect(result.upsertedCount).toBe(1);
    });

    it('should search vectors with metadata filtering', async () => {
      const queryVector = Array(1536).fill(0.1);
      const filter = { brand: 'Winnebago' };

      const results = await vectorDB.searchVectors(queryVector, 5, filter);
      
      expect(results.matches).toHaveLength(1);
      expect(results.matches[0].metadata.brand).toBe('Winnebago');
    });

    it('should handle large batch operations', async () => {
      const largeBatch = Array(100).fill(null).map((_, i) => ({
        id: `batch-vector-${i}`,
        values: Array(1536).fill(0.1),
        metadata: {
          brand: 'BatchBrand',
          component: 'BatchComponent',
          manualType: 'service'
        }
      }));

      const result = await vectorDB.upsertVectors(largeBatch);
      expect(result.upsertedCount).toBe(100);
    });

    it('should maintain data consistency under concurrent access', async () => {
      const concurrentOperations = Array(10).fill(null).map(async (_, i) => {
        const vector = {
          id: `concurrent-vector-${i}`,
          values: Array(1536).fill(0.1),
          metadata: { brand: 'Concurrent', component: 'Test' }
        };
        return vectorDB.upsertVectors([vector]);
      });

      const results = await Promise.all(concurrentOperations);
      const totalUpserted = results.reduce((sum, r) => sum + r.upsertedCount, 0);
      expect(totalUpserted).toBe(10);
    });
  });

  describe('Performance Tests', () => {
    it('should handle search queries within performance budget', async () => {
      const queryVector = Array(1536).fill(0.1);
      const startTime = performance.now();

      const results = await vectorDB.searchVectors(queryVector, 5);

      const endTime = performance.now();
      const queryTime = endTime - startTime;

      expect(queryTime).toBeLessThan(1000); // 1 second budget
      expect(results.matches).toHaveLength(5);
    });

    it('should scale with vector count', async () => {
      // Create larger dataset
      const largeDataset = Array(1000).fill(null).map((_, i) => ({
        id: `scale-vector-${i}`,
        values: Array(1536).fill(0.1),
        metadata: { brand: 'Scale', component: 'Test' }
      }));

      const startTime = performance.now();
      await vectorDB.upsertVectors(largeDataset);
      const endTime = performance.now();

      const batchTime = endTime - startTime;
      expect(batchTime).toBeLessThan(10000); // 10 second budget for 1000 vectors
    });
  });
});
```

### Complete Workflow Test Example

```typescript
// tests/integration/workflows/searchWorkflow.test.ts
import request from 'supertest';
import { app } from '../../../src/app';
import { setupTestEnvironment, cleanupTestEnvironment } from '../helpers/environment';
import { createTestPDF, uploadTestPDF } from '../helpers/testData';

describe('Complete Search Workflow', () => {
  let testPdfPath: string;
  let uploadedVectorIds: string[];

  beforeAll(async () => {
    await setupTestEnvironment();
    testPdfPath = await createTestPDF();
  });

  afterAll(async () => {
    await cleanupTestEnvironment();
  });

  it('should complete full RV repair workflow', async () => {
    // Phase 1: Content Ingestion
    const ingestionResponse = await request(app)
      .post('/api/ingest/pdf')
      .attach('file', testPdfPath)
      .field('brand', 'Winnebago')
      .field('component', 'Electrical')
      .field('manualType', 'service')
      .expect(200);

    expect(ingestionResponse.body.message).toBe('PDF processed successfully');
    expect(ingestionResponse.body.chunks).toBeGreaterThan(0);
    expect(ingestionResponse.body.vectors).toBeGreaterThan(0);

    // Store vector IDs for cleanup
    uploadedVectorIds = ingestionResponse.body.vectorIds;

    // Phase 2: Search Query
    const searchResponse = await request(app)
      .post('/api/query')
      .send({
        question: 'How do I troubleshoot electrical issues in my Winnebago?'
      })
      .expect(200);

    expect(searchResponse.body.answer).toContain('electrical');
    expect(searchResponse.body.answer).toContain('Winnebago');
    expect(searchResponse.body.sources).toHaveLength(1);
    expect(searchResponse.body.sources[0]).toContain('Winnebago');

    // Phase 3: Verify Search Quality
    const answer = searchResponse.body.answer.toLowerCase();
    expect(answer).toContain('troubleshoot');
    expect(answer).toContain('electrical');
    expect(answer).toContain('winnebago');

    // Phase 4: Check Performance
    expect(searchResponse.body.metadata.processingTime).toBeLessThan(5000);
    expect(searchResponse.body.metadata.searchResults).toBeGreaterThan(0);
  });

  it('should handle complex multi-component queries', async () => {
    // Upload additional content for different components
    const plumbingPdf = await createTestPDF('plumbing-content');
    await uploadTestPDF(plumbingPdf, 'Winnebago', 'Plumbing');

    // Query spanning multiple components
    const response = await request(app)
      .post('/api/query')
      .send({
        question: 'What are common issues with both electrical and plumbing systems?'
      });

    expect(response.body.answer).toContain('electrical');
    expect(response.body.answer).toContain('plumbing');
    expect(response.body.sources.length).toBeGreaterThan(1);
  });

  it('should provide accurate source citations', async () => {
    const response = await request(app)
      .post('/api/query')
      .send({
        question: 'Winnebago electrical troubleshooting'
      });

    // Verify sources are relevant and accurate
    const sources = response.body.sources;
    sources.forEach(source => {
      expect(source).toContain('Winnebago');
      expect(source).toContain('Electrical');
    });

    // Verify metadata consistency
    expect(response.body.metadata.searchResults).toBe(sources.length);
  });
});
```

### Performance Integration Test Example

```typescript
// tests/integration/performance/load.test.ts
import request from 'supertest';
import { app } from '../../../src/app';
import { setupLoadTest, cleanupLoadTest } from '../helpers/loadTest';

describe('System Performance Tests', () => {
  beforeAll(async () => {
    await setupLoadTest();
  });

  afterAll(async () => {
    await cleanupLoadTest();
  });

  it('should handle concurrent search requests', async () => {
    const concurrentRequests = 50;
    const testQuery = 'How do I fix common RV issues?';

    const requests = Array(concurrentRequests).fill(null).map(() =>
      request(app)
        .post('/api/query')
        .send({ question: testQuery })
    );

    const startTime = performance.now();
    const responses = await Promise.all(requests);
    const endTime = performance.now();

    const totalTime = endTime - startTime;
    const successCount = responses.filter(r => r.status === 200).length;
    const avgResponseTime = totalTime / responses.length;

    // Performance assertions
    expect(successCount).toBeGreaterThan(concurrentRequests * 0.95); // 95% success rate
    expect(avgResponseTime).toBeLessThan(3000); // 3 second average
    expect(totalTime).toBeLessThan(concurrentRequests * 5000); // 5 second per request max
  });

  it('should maintain performance under sustained load', async () => {
    const sustainedLoad = 100;
    const duration = 60000; // 1 minute
    const interval = 1000; // 1 request per second

    const startTime = Date.now();
    const results: any[] = [];

    while (Date.now() - startTime < duration) {
      const response = await request(app)
        .post('/api/query')
        .send({ question: 'RV maintenance tips' });

      results.push({
        status: response.status,
        responseTime: response.body.metadata?.processingTime || 0
      });

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    // Performance analysis
    const successRate = results.filter(r => r.status === 200).length / results.length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const maxResponseTime = Math.max(...results.map(r => r.responseTime));

    expect(successRate).toBeGreaterThan(0.95); // 95% success rate
    expect(avgResponseTime).toBeLessThan(3000); // 3 second average
    expect(maxResponseTime).toBeLessThan(10000); // 10 second maximum
  });

  it('should handle large content ingestion efficiently', async () => {
    const largePdfPath = await createLargeTestPDF(50); // 50 pages

    const startTime = performance.now();
    const response = await request(app)
      .post('/api/ingest/pdf')
      .attach('file', largePdfPath)
      .field('brand', 'TestBrand')
      .field('component', 'TestComponent');

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    expect(response.status).toBe(200);
    expect(processingTime).toBeLessThan(30000); // 30 second budget for 50 pages
    expect(response.body.chunks).toBeGreaterThan(100);
  });
});
```

## Test Helpers and Utilities

### Environment Setup Helpers

```typescript
// tests/integration/helpers/environment.ts
import { PineconeClient } from '@pinecone-database/pinecone';
import { createTestIndex, deleteTestIndex } from './database';

export const setupTestEnvironment = async () => {
  // Create test Pinecone index
  await createTestIndex();
  
  // Setup test file storage
  await setupTestFileStorage();
  
  // Initialize test services
  await initializeTestServices();
};

export const cleanupTestEnvironment = async () => {
  // Clean up test data
  await cleanupTestData();
  
  // Delete test index
  await deleteTestIndex();
  
  // Reset test services
  await resetTestServices();
};

export const setupTestFileStorage = async () => {
  // Create test directories
  // Setup test file permissions
  // Initialize test storage
};

export const initializeTestServices = async () => {
  // Initialize OpenAI client with test config
  // Setup Pinecone client for test environment
  // Configure logging for tests
};
```

### Test Data Helpers

```typescript
// tests/integration/helpers/testData.ts
import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export const createTestPDF = async (content = 'Test content') => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  page.drawText(content, {
    x: 50,
    y: page.getHeight() - 50,
    size: 12,
    font
  });

  const pdfBytes = await pdfDoc.save();
  const tempPath = path.join(__dirname, '../fixtures/temp-test.pdf');
  fs.writeFileSync(tempPath, pdfBytes);
  
  return tempPath;
};

export const createLargeTestPDF = async (pageCount: number) => {
  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    page.drawText(`Page ${i + 1} content`, {
      x: 50,
      y: page.getHeight() - 50,
      size: 12,
      font
    });
  }

  const pdfBytes = await pdfDoc.save();
  const tempPath = path.join(__dirname, `../fixtures/large-test-${pageCount}.pdf`);
  fs.writeFileSync(tempPath, pdfBytes);
  
  return tempPath;
};

export const createTestVector = async (metadata: any) => {
  const vector = {
    id: `test-vector-${Date.now()}`,
    values: Array(1536).fill(0.1),
    metadata: {
      brand: 'TestBrand',
      component: 'TestComponent',
      manualType: 'service',
      ...metadata
    }
  };

  // Insert into test database
  const result = await insertTestVector(vector);
  return result;
};
```

### Load Testing Helpers

```typescript
// tests/integration/helpers/loadTest.ts
import { performance } from 'perf_hooks';

export interface LoadTestResult {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  percentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export const runLoadTest = async (
  requestFn: () => Promise<any>,
  concurrency: number,
  duration: number
): Promise<LoadTestResult> => {
  const startTime = performance.now();
  const results: number[] = [];
  const errors: Error[] = [];

  const makeRequest = async () => {
    const requestStart = performance.now();
    try {
      await requestFn();
      const requestTime = performance.now() - requestStart;
      results.push(requestTime);
    } catch (error) {
      errors.push(error as Error);
    }
  };

  // Run concurrent requests
  const workers = Array(concurrency).fill(null).map(() => makeRequest());
  await Promise.all(workers);

  const endTime = performance.now();
  const totalTime = endTime - startTime;

  // Calculate statistics
  const sortedTimes = results.sort((a, b) => a - b);
  const avgResponseTime = results.reduce((sum, time) => sum + time, 0) / results.length;

  return {
    totalRequests: results.length + errors.length,
    successCount: results.length,
    failureCount: errors.length,
    avgResponseTime,
    minResponseTime: sortedTimes[0],
    maxResponseTime: sortedTimes[sortedTimes.length - 1],
    percentiles: {
      p50: sortedTimes[Math.floor(sortedTimes.length * 0.5)],
      p90: sortedTimes[Math.floor(sortedTimes.length * 0.9)],
      p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)],
      p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)]
    }
  };
};
```

## Test Configuration

### Integration Test Setup

```typescript
// tests/integration/setup/integration.setup.ts
import { setupTestEnvironment, cleanupTestEnvironment } from '../helpers/environment';

beforeAll(async () => {
  await setupTestEnvironment();
}, 60000); // 60 second timeout for setup

afterAll(async () => {
  await cleanupTestEnvironment();
}, 30000); // 30 second timeout for cleanup

// Global test configuration
global.integrationTestConfig = {
  timeout: 30000,
  retries: 2,
  cleanup: true
};
```

### Performance Test Configuration

```typescript
// tests/integration/config/performance.ts
export const performanceConfig = {
  thresholds: {
    responseTime: {
      p50: 1000,   // 50% of requests under 1 second
      p90: 3000,   // 90% of requests under 3 seconds
      p95: 5000,   // 95% of requests under 5 seconds
      p99: 10000   // 99% of requests under 10 seconds
    },
    successRate: 0.95,  // 95% success rate
    throughput: 100      // 100 requests per second
  },
  loadTest: {
    concurrency: 50,
    duration: 60000,     // 1 minute
    rampUp: 10000        // 10 second ramp up
  }
};
```

## Best Practices

### Test Organization

1. **Group Related Tests**: Use describe blocks to organize related functionality
2. **Clear Test Names**: Use descriptive names that explain the test scenario
3. **Setup and Teardown**: Properly manage test environment and cleanup
4. **Test Isolation**: Ensure tests don't interfere with each other

### Performance Testing

1. **Baseline Measurements**: Establish performance baselines
2. **Realistic Load**: Use realistic load patterns and data
3. **Monitoring**: Monitor system resources during tests
4. **Analysis**: Analyze results for trends and patterns

### Error Handling

1. **Graceful Degradation**: Test system behavior under failure conditions
2. **Error Recovery**: Verify system recovery after errors
3. **Logging**: Ensure proper error logging and monitoring
4. **User Experience**: Test error handling from user perspective

### Data Management

1. **Test Data Isolation**: Use separate test databases and indexes
2. **Data Cleanup**: Always clean up test data after tests
3. **Realistic Data**: Use realistic test data that matches production
4. **Data Consistency**: Verify data consistency across operations

## Continuous Integration

### GitHub Actions Integration

```yaml
# .github/workflows/integration-test.yml
name: Integration Tests

on: [push, pull_request]

jobs:
  integration-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Setup test environment
      run: npm run test:integration:setup
      
    - name: Run integration tests
      run: npm run test:integration
      
    - name: Run performance tests
      run: npm run test:integration:performance
      
    - name: Upload test results
      uses: actions/upload-artifact@v3
      with:
        name: integration-test-results
        path: test-results/
```

### Test Reporting

```typescript
// tests/integration/reporting/testReporter.ts
export class IntegrationTestReporter {
  private results: any[] = [];

  addResult(result: any) {
    this.results.push(result);
  }

  generateReport() {
    const summary = {
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      performance: this.analyzePerformance()
    };

    return summary;
  }

  private analyzePerformance() {
    const responseTimes = this.results
      .filter(r => r.responseTime)
      .map(r => r.responseTime);

    return {
      average: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
      p95: this.calculatePercentile(responseTimes, 95),
      p99: this.calculatePercentile(responseTimes, 99)
    };
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}
```

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout values for slow operations
2. **Resource Cleanup**: Ensure proper cleanup of test resources
3. **Environment Issues**: Verify test environment configuration
4. **External Dependencies**: Check external service availability

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm run test:integration

# Run specific test with verbose output
npm run test:integration -- --verbose tests/integration/api/query.test.ts

# Run tests with performance profiling
npm run test:integration -- --profile
```

## Coverage Requirements

### Integration Coverage

- **API Endpoints**: 100% endpoint coverage
- **Workflows**: 100% user workflow coverage
- **Error Scenarios**: 90% error handling coverage
- **Performance**: 80% performance scenario coverage

---

**Note**: This integration testing guide should be updated as the testing strategy evolves. Regular reviews ensure alignment with development practices and quality standards.