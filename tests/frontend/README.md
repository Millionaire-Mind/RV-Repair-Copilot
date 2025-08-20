# Frontend Testing Guide

## Overview

This directory contains comprehensive tests for the RV Repair Copilot React frontend application. Our testing strategy ensures component reliability, user experience consistency, and maintainable code through automated testing at multiple levels.

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

1. **Unit Tests**: Individual component and hook testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Complete user workflow testing
4. **Visual Tests**: UI consistency and regression testing

## Test Structure

```
tests/frontend/
├── unit/                 # Unit tests for individual components
│   ├── components/      # Component tests
│   ├── hooks/           # Custom hook tests
│   ├── utils/           # Utility function tests
│   └── services/        # Service layer tests
├── integration/          # Integration tests for component interactions
│   ├── forms/           # Form component testing
│   ├── navigation/      # Navigation flow testing
│   └── api/             # API integration testing
├── e2e/                 # End-to-end user workflow tests
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
npm test -- src/components/SearchBar.test.tsx

# Run tests matching pattern
npm test -- --grep "SearchBar"

# Run tests in specific directory
npm test -- src/components/
```

### Environment Setup

```bash
# Set test environment
export NODE_ENV=test

# Use test API endpoint
export REACT_APP_API_URL=http://localhost:3001

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

### Component Unit Test Example

```typescript
// tests/unit/components/SearchBar.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from '../../../src/components/SearchBar';
import { mockSearchResponse } from '../../helpers/mocks';

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('SearchBar', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should render search input and button', () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/search for repairs/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should handle search submission', async () => {
    const mockOnSearch = jest.fn();
    
    render(
      <TestWrapper>
        <SearchBar onSearch={mockOnSearch} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText(/search for repairs/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'water pump issues' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('water pump issues');
    });
  });

  it('should show loading state during search', async () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText(/search for repairs/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/searching/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should display error message on search failure', async () => {
    // Mock API error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText(/search for repairs/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'error query' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
```

### Hook Unit Test Example

```typescript
// tests/unit/hooks/useVoiceInput.test.ts
import { renderHook, act } from '@testing-library/react';
import { useVoiceInput } from '../../../src/hooks/useVoiceInput';

// Mock Speech Recognition API
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

Object.defineProperty(window, 'SpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition)
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition)
});

describe('useVoiceInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVoiceInput());

    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe('');
    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should start listening when startListening is called', () => {
    const { result } = renderHook(() => useVoiceInput());

    act(() => {
      result.current.startListening();
    });

    expect(mockSpeechRecognition.start).toHaveBeenCalled();
  });

  it('should stop listening when stopListening is called', () => {
    const { result } = renderHook(() => useVoiceInput());

    act(() => {
      result.current.stopListening();
    });

    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
  });

  it('should clear transcript when clearTranscript is called', () => {
    const { result } = renderHook(() => useVoiceInput());

    act(() => {
      result.current.setTranscript('test transcript');
      result.current.clearTranscript();
    });

    expect(result.current.transcript).toBe('');
    expect(result.current.error).toBe(null);
  });
});
```

### Integration Test Example

```typescript
// tests/integration/forms/SearchForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import SearchForm from '../../../src/components/SearchForm';
import { mockSearchAPI } from '../../helpers/mocks';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('SearchForm Integration', () => {
  beforeEach(() => {
    mockSearchAPI();
  });

  it('should complete full search workflow', async () => {
    render(
      <TestWrapper>
        <SearchForm />
      </TestWrapper>
    );

    // 1. Fill search form
    const queryInput = screen.getByPlaceholderText(/search for repairs/i);
    const brandSelect = screen.getByLabelText(/brand/i);
    const componentSelect = screen.getByLabelText(/component/i);

    fireEvent.change(queryInput, { target: { value: 'electrical issues' } });
    fireEvent.change(brandSelect, { target: { value: 'Winnebago' } });
    fireEvent.change(componentSelect, { target: { value: 'Electrical' } });

    // 2. Submit search
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // 3. Verify loading state
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
    expect(searchButton).toBeDisabled();

    // 4. Wait for results
    await waitFor(() => {
      expect(screen.getByText(/search results/i)).toBeInTheDocument();
    });

    // 5. Verify search results
    expect(screen.getByText(/electrical issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Winnebago/i)).toBeInTheDocument();
  });

  it('should handle form validation errors', async () => {
    render(
      <TestWrapper>
        <SearchForm />
      </TestWrapper>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/question is required/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/searchWorkflow.test.tsx
import { test, expect } from '@playwright/test';

test.describe('Search Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should complete full search workflow', async ({ page }) => {
    // 1. Navigate to home page
    await expect(page.locator('h1')).toContainText('RV Repair Copilot');

    // 2. Enter search query
    const searchInput = page.locator('[placeholder*="search"]');
    await searchInput.fill('water pump not working');

    // 3. Select filters
    const brandSelect = page.locator('select[name="brand"]');
    await brandSelect.selectOption('Winnebago');

    const componentSelect = page.locator('select[name="component"]');
    await componentSelect.selectOption('Plumbing');

    // 4. Submit search
    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();

    // 5. Wait for results
    await expect(page.locator('.search-results')).toBeVisible();

    // 6. Verify search results
    await expect(page.locator('.answer-card')).toContainText('water pump');
    await expect(page.locator('.sources')).toContainText('Winnebago');

    // 7. Click on source citation
    const firstSource = page.locator('.source-link').first();
    await firstSource.click();

    // 8. Verify source opens in new tab
    const newPage = await page.waitForEvent('popup');
    await expect(newPage.locator('body')).toContainText('Winnebago');
  });

  test('should handle search errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/query', route => 
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );

    const searchInput = page.locator('[placeholder*="search"]');
    await searchInput.fill('test query');

    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();

    await expect(page.locator('.error-message')).toContainText('something went wrong');
  });
});
```

## Test Helpers and Utilities

### Mock Factories

```typescript
// tests/helpers/mocks.ts
export const mockSearchResponse = {
  answer: 'To fix a water pump issue, first check the power supply...',
  sources: [
    'Winnebago Service Manual - Electrical Systems (2023)',
    'RV Plumbing Troubleshooting Guide'
  ],
  metadata: {
    question: 'How do I fix a water pump?',
    searchResults: 5,
    processingTime: 1500,
    modelUsed: 'GPT-4'
  }
};

export const mockSearchAPI = () => {
  // Mock fetch or axios
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse)
    })
  ) as jest.Mock;
};

export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  preferences: {
    theme: 'light',
    language: 'en'
  },
  ...overrides
});
```

### Component Test Utilities

```typescript
// tests/helpers/componentUtils.ts
import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

export const renderWithProviders = (
  ui: React.ReactElement,
  options = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export const createMockEvent = (value: string) => ({
  target: { value }
});

export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(element).not.toBeInTheDocument();
};
```

### Mock Service Workers

```typescript
// tests/helpers/msw.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/query', (req, res, ctx) => {
    return res(
      ctx.json({
        answer: 'Mock repair answer',
        sources: ['Mock source 1', 'Mock source 2']
      })
    );
  }),

  rest.post('/api/ingest/pdf', (req, res, ctx) => {
    return res(
      ctx.json({
        message: 'PDF processed successfully',
        chunks: 15,
        vectors: 15
      })
    );
  })
];

export const server = setupServer(...handlers);
```

## Test Configuration

### Jest Configuration

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000
};
```

### Testing Library Setup

```typescript
// tests/setup/jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock Resize Observer
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

## Testing Best Practices

### Component Testing

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test User Interactions**: Simulate real user behavior
4. **Verify Accessibility**: Ensure components are accessible

### Hook Testing

1. **Test State Changes**: Verify hooks update state correctly
2. **Test Side Effects**: Ensure cleanup and effects work properly
3. **Mock Dependencies**: Mock external dependencies and APIs
4. **Test Edge Cases**: Handle error states and boundary conditions

### Integration Testing

1. **Test Component Communication**: Verify components work together
2. **Test Data Flow**: Ensure data flows correctly through the app
3. **Test Error Handling**: Verify error states are handled gracefully
4. **Test User Workflows**: Test complete user journeys

### Performance Testing

```typescript
// tests/performance/componentPerformance.test.tsx
import { render } from '@testing-library/react';
import { SearchBar } from '../../../src/components/SearchBar';

describe('SearchBar Performance', () => {
  it('should render within performance budget', () => {
    const startTime = performance.now();
    
    render(<SearchBar />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('should handle large input efficiently', () => {
    const largeInput = 'a'.repeat(10000);
    
    const { rerender } = render(<SearchBar />);
    
    const startTime = performance.now();
    rerender(<SearchBar initialValue={largeInput} />);
    const endTime = performance.now();
    
    const updateTime = endTime - startTime;
    expect(updateTime).toBeLessThan(50); // 50ms budget
  });
});
```

## Visual Testing

### Screenshot Testing

```typescript
// tests/visual/screenshots.test.tsx
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('home page should match screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveScreenshot('home-page.png');
  });

  test('search results should match screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const searchInput = page.locator('[placeholder*="search"]');
    await searchInput.fill('water pump');
    
    const searchButton = page.locator('button:has-text("Search")');
    await searchButton.click();
    
    await page.waitForSelector('.search-results');
    await expect(page).toHaveScreenshot('search-results.png');
  });
});
```

### Accessibility Testing

```typescript
// tests/accessibility/a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SearchBar from '../../../src/components/SearchBar';

expect.extend(toHaveNoViolations);

describe('SearchBar Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<SearchBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveAttribute('aria-label');
    
    const searchButton = screen.getByRole('button');
    expect(searchButton).toHaveAttribute('aria-label');
  });
});
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/frontend-test.yml
name: Frontend Tests

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
      run: npm test -- --coverage --watchAll=false
      
    - name: Run E2E tests
      run: npm run test:e2e
      
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
      "pre-push": "npm test && npm run test:e2e"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout values for async operations
2. **Mock Issues**: Ensure mocks are properly reset between tests
3. **Provider Wrapping**: Wrap components with necessary providers
4. **Async Operations**: Use `waitFor` for async state changes

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with verbose output
npm test -- --verbose src/components/SearchBar.test.tsx

# Run tests with console output
npm test -- --detectOpenHandles
```

## Coverage Requirements

### Minimum Coverage

- **Overall Coverage**: 70%
- **Critical Components**: 100%
- **Custom Hooks**: 90%
- **Utility Functions**: 85%
- **Service Functions**: 80%

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