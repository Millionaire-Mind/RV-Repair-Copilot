# Backend Testing Guide

## Overview

This directory contains comprehensive tests for the RV Repair Copilot backend API. Our testing strategy ensures code quality, reliability, and maintainability through automated testing at multiple levels.

## Testing Strategy

### Test Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    Integration Tests (Some)
 /      \   Unit Tests (Many)
/________\
```

### Test Types

1. **Unit Tests**: Individual function and class testing
2. **Integration Tests**: API endpoint and service testing
3. **E2E Tests**: Complete workflow testing
4. **Performance Tests**: Load and stress testing

## Test Structure

```
tests/backend/
├── unit/                 # Unit tests for individual functions
│   ├── services/        # Service layer tests
│   ├── utils/           # Utility function tests
│   └── middleware/      # Middleware tests
├── integration/          # Integration tests for API endpoints
│   ├── routes/          # Route testing
│   ├── database/        # Database integration tests
│   └── external/        # External service tests
├── e2e/                 # End-to-end workflow tests
├── fixtures/            # Test data and mock files
├── helpers/             # Test helper functions
└── setup/               # Test configuration and setup
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/services/openaiClient.test.ts

# Run tests matching pattern
npm test -- --grep "OpenAI"

# Run tests in specific directory
npm test -- tests/unit/services/
```

### Environment Setup

```bash
# Set test environment
export NODE_ENV=test

# Use test database
export PINECONE_INDEX=rv-repair-copilot-test

# Run with specific config
npm test -- --config jest.config.test.js
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open coverage in browser
npm run test:coverage:open

# Generate coverage badge
npm run test:coverage:badge
```

## Writing Tests

### Unit Test Example

```typescript
// tests/unit/services/openaiClient.test.ts
import { OpenAIClient } from '../../../src/services/openaiClient';
import { mockOpenAI } from '../../helpers/mocks';

describe('OpenAIClient', () => {
  let client: OpenAIClient;
  let mockOpenAIInstance: jest.Mocked<typeof mockOpenAI>;

  beforeEach(() => {
    mockOpenAIInstance = mockOpenAI();
    client = new OpenAIClient(mockOpenAIInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateEmbeddings', () => {
    it('should generate embeddings successfully', async () => {
      const text = 'test text';
      const mockEmbedding = [0.1, 0.2, 0.3];
      
      mockOpenAIInstance.embeddings.create.mockResolvedValue({
        data: [{ embedding: mockEmbedding }]
      } as any);

      const result = await client.generateEmbeddings(text);

      expect(result).toEqual(mockEmbedding);
      expect(mockOpenAIInstance.embeddings.create).toHaveBeenCalledWith({
        model: 'text-embedding-ada-002',
        input: text
      });
    });

    it('should handle API errors gracefully', async () => {
      const text = 'test text';
      const error = new Error('API Error');
      
      mockOpenAIInstance.embeddings.create.mockRejectedValue(error);

      await expect(client.generateEmbeddings(text))
        .rejects
        .toThrow('Failed to generate embeddings: API Error');
    });
  });
});
```

### Integration Test Example

```typescript
// tests/integration/routes/query.test.ts
import request from 'supertest';
import { app } from '../../../src/app';
import { setupTestDatabase, teardownTestDatabase } from '../../helpers/database';
import { mockOpenAI, mockPinecone } from '../../helpers/mocks';

describe('Query Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(() => {
    mockOpenAI();
    mockPinecone();
  });

  describe('POST /api/query', () => {
    it('should process query successfully', async () => {
      const query = {
        question: 'How do I fix a water pump?'
      };

      const response = await request(app)
        .post('/api/query')
        .send(query)
        .expect(200);

      expect(response.body).toHaveProperty('answer');
      expect(response.body).toHaveProperty('sources');
      expect(response.body.answer).toContain('water pump');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/query')
        .send({})
        .expect(400);

      expect(response.body.error).toContain('question is required');
    });

    it('should handle OpenAI API errors', async () => {
      // Mock OpenAI error
      mockOpenAI().mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .post('/api/query')
        .send({ question: 'test question' })
        .expect(500);

      expect(response.body.error).toContain('Internal server error');
    });
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/completeWorkflow.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { setupTestEnvironment, cleanupTestEnvironment } from '../helpers/e2e';

describe('Complete RV Repair Workflow', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await cleanupTestEnvironment();
  });

  it('should complete full repair query workflow', async () => {
    // 1. Upload PDF manual
    const pdfResponse = await request(app)
      .post('/api/ingest/pdf')
      .attach('file', 'tests/fixtures/sample-manual.pdf')
      .field('brand', 'Winnebago')
      .field('component', 'Electrical')
      .expect(200);

    expect(pdfResponse.body).toHaveProperty('message', 'PDF processed successfully');

    // 2. Search for repair information
    const searchResponse = await request(app)
      .post('/api/query')
      .send({ question: 'How do I troubleshoot electrical issues?' })
      .expect(200);

    expect(searchResponse.body).toHaveProperty('answer');
    expect(searchResponse.body).toHaveProperty('sources');
    expect(searchResponse.body.sources.length).toBeGreaterThan(0);

    // 3. Verify source citations
    const source = searchResponse.body.sources[0];
    expect(source).toContain('Winnebago');
    expect(source).toContain('Electrical');
  });
});
```

## Test Helpers and Utilities

### Mock Factories

```typescript
// tests/helpers/mocks.ts
export const mockOpenAI = () => {
  return {
    embeddings: {
      create: jest.fn()
    },
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  };
};

export const mockPinecone = () => {
  return {
    index: jest.fn().mockReturnValue({
      upsert: jest.fn(),
      query: jest.fn(),
      deleteOne: jest.fn()
    })
  };
};

export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});
```

### Database Helpers

```typescript
// tests/helpers/database.ts
import { PineconeClient } from '@pinecone-database/pinecone';

export const setupTestDatabase = async () => {
  // Create test index
  // Seed test data
  // Setup test environment
};

export const teardownTestDatabase = async () => {
  // Clean up test data
  // Remove test index
  // Reset test environment
};

export const createTestVector = (metadata = {}) => ({
  id: `test-vector-${Date.now()}`,
  values: Array(1536).fill(0.1),
  metadata: {
    brand: 'TestBrand',
    component: 'TestComponent',
    manualType: 'service',
    ...metadata
  }
});
```

### Test Utilities

```typescript
// tests/helpers/utils.ts
export const waitForCondition = async (
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Condition not met within timeout');
};

export const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides
});

export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
```

## Test Configuration

### Jest Configuration

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  testTimeout: 10000
};
```

### Environment Setup

```typescript
// tests/setup/jest.setup.ts
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Setup test database
  // Initialize test services
  // Setup global mocks
});

afterAll(async () => {
  // Cleanup test resources
  // Close database connections
  // Reset global state
});

// Global test utilities
global.testUtils = {
  createMockUser: () => ({ /* mock user */ }),
  createMockRequest: () => ({ /* mock request */ }),
  createMockResponse: () => ({ /* mock response */ })
};
```

## Testing Best Practices

### Test Organization

1. **Group Related Tests**: Use describe blocks to organize related tests
2. **Clear Test Names**: Use descriptive test names that explain the scenario
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **One Assertion Per Test**: Focus each test on a single behavior

### Mocking Strategy

1. **Mock External Dependencies**: Mock OpenAI, Pinecone, and other external services
2. **Use Real Database**: Use test database for integration tests
3. **Mock Time**: Mock timestamps and time-dependent operations
4. **Reset Mocks**: Clear mocks between tests to avoid interference

### Test Data Management

1. **Use Fixtures**: Store test data in fixture files
2. **Generate Unique Data**: Use timestamps or UUIDs to avoid conflicts
3. **Clean Up**: Always clean up test data after tests
4. **Isolate Tests**: Ensure tests don't interfere with each other

### Performance Testing

```typescript
// tests/performance/load.test.ts
import { app } from '../../src/app';
import request from 'supertest';

describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      request(app)
        .post('/api/query')
        .send({ question: 'test question' })
    );

    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();

    const successCount = responses.filter(r => r.status === 200).length;
    const avgResponseTime = (endTime - startTime) / responses.length;

    expect(successCount).toBeGreaterThan(95); // 95% success rate
    expect(avgResponseTime).toBeLessThan(5000); // 5 second average
  });
});
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Generate coverage
      run: npm run test:coverage
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:quick && npm run lint",
      "pre-push": "npm test"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout values for slow operations
2. **Database Conflicts**: Use unique test data and proper cleanup
3. **Mock Issues**: Ensure mocks are properly reset between tests
4. **Environment Variables**: Check test environment configuration

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with verbose output
npm test -- --verbose tests/unit/services/openaiClient.test.ts

# Run tests with console output
npm test -- --detectOpenHandles
```

## Coverage Requirements

### Minimum Coverage

- **Overall Coverage**: 80%
- **Critical Paths**: 100%
- **Service Layer**: 90%
- **Utility Functions**: 85%
- **Route Handlers**: 80%

### Coverage Exclusions

```typescript
// Exclude from coverage
/* istanbul ignore next */
export function ignoredFunction() {
  // This function is excluded from coverage
}

// Exclude specific lines
export function partiallyCoveredFunction() {
  if (process.env.NODE_ENV === 'production') {
    /* istanbul ignore next */
    console.log('Production log');
  }
  return 'result';
}
```

---

**Note**: This testing guide should be updated as the testing strategy evolves. Regular reviews ensure alignment with development practices and quality standards.