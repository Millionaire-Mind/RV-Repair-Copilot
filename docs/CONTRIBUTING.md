# Contributing to RV Repair Copilot

Thank you for your interest in contributing to RV Repair Copilot! This document provides guidelines and information for contributors to help make the development process smooth and effective.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Pull Request Process](#pull-request-process)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Docker** and **Docker Compose** (for local development)
- **Code Editor** with TypeScript support (VS Code recommended)

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/rv-repair-copilot.git
   cd rv-repair-copilot
   ```

2. **Set Up Remote**
   ```bash
   # Add upstream remote
   git remote add upstream https://github.com/original-owner/rv-repair-copilot.git
   
   # Verify remotes
   git remote -v
   ```

3. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit with your API keys
   nano .env
   ```

5. **Start Development Environment**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Or start individually
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

## Development Workflow

### Branch Strategy

We use a simplified Git flow approach:

```
main (production)
├── develop (integration)
├── feature/feature-name
├── bugfix/bug-description
└── hotfix/critical-fix
```

### Branch Naming Convention

- **Feature branches**: `feature/descriptive-name`
- **Bug fix branches**: `bugfix/bug-description`
- **Hotfix branches**: `hotfix/critical-issue`
- **Documentation**: `docs/document-name`
- **Testing**: `test/test-description`

### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Changes**
   ```bash
   # Stage changes
   git add .
   
   # Commit with conventional commit message
   git commit -m "feat: add new search filtering options"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(search): add advanced filtering options"
git commit -m "fix(api): resolve rate limiting issue"
git commit -m "docs(readme): update installation instructions"
```

## Code Standards

### TypeScript Standards

#### General Rules
- **Strict Mode**: Always use strict TypeScript configuration
- **Type Safety**: Avoid `any` type, use proper typing
- **Interfaces**: Prefer interfaces over types for object shapes
- **Enums**: Use const enums for better performance

#### Code Style
```typescript
// Good: Proper typing and interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User | null> => {
  // Implementation
};

// Bad: Using any and loose typing
const getUser: any = async (id: any) => {
  // Implementation
};
```

#### Naming Conventions
- **Variables**: camelCase (`userName`, `isActive`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Functions**: camelCase (`getUserById`, `validateInput`)
- **Classes**: PascalCase (`UserService`, `DatabaseConnection`)
- **Interfaces**: PascalCase with `I` prefix (`IUser`, `IApiResponse`)

### React Standards

#### Component Structure
```typescript
// Functional component with proper typing
interface ComponentProps {
  title: string;
  onAction: () => void;
  disabled?: boolean;
}

const MyComponent: React.FC<ComponentProps> = ({
  title,
  onAction,
  disabled = false
}) => {
  // Component logic
  
  return (
    <div className="component">
      <h2>{title}</h2>
      <button onClick={onAction} disabled={disabled}>
        Action
      </button>
    </div>
  );
};

export default MyComponent;
```

#### Hooks Usage
- Use custom hooks for reusable logic
- Follow React hooks rules
- Prefer `useCallback` and `useMemo` for performance optimization

### Backend Standards

#### Service Structure
```typescript
// Service class with proper error handling
export class UserService {
  private readonly logger = logger.child({ service: 'UserService' });

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error('Failed to get user by id', { id, error });
      throw error;
    }
  }
}
```

#### Error Handling
- Use custom error classes
- Log errors with context
- Return appropriate HTTP status codes
- Provide meaningful error messages

### File Organization

#### Frontend Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles and CSS
```

#### Backend Structure
```
backend/src/
├── routes/             # API route definitions
├── services/           # Business logic services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── middleware/         # Express middleware
├── config/             # Configuration files
└── tests/              # Test files
```

## Testing Guidelines

### Testing Strategy

#### Test Types
- **Unit Tests**: Individual function/component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing

#### Test Coverage Requirements
- **Backend**: Minimum 80% coverage
- **Frontend**: Minimum 70% coverage
- **Critical Paths**: 100% coverage required

### Writing Tests

#### Backend Tests
```typescript
// Jest test example
import { UserService } from '../services/UserService';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    userService = new UserService(mockUserRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = createMockUser();
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById('user-id');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundError when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.getUserById('user-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
```

#### Frontend Tests
```typescript
// React Testing Library example
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('should call onSearch when form is submitted', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for repairs...');
    const submitButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'water pump' } });
    fireEvent.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith('water pump');
  });
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# Frontend tests
cd frontend
npm test                   # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Integration tests
npm run test:integration  # Full test suite
```

## Documentation

### Code Documentation

#### JSDoc Comments
```typescript
/**
 * Retrieves a user by their unique identifier.
 * 
 * @param id - The unique identifier of the user
 * @param options - Optional parameters for the query
 * @returns Promise resolving to the user or null if not found
 * @throws {ValidationError} When id is invalid
 * @throws {DatabaseError} When database operation fails
 * 
 * @example
 * ```typescript
 * const user = await userService.getUserById('user-123');
 * if (user) {
 *   console.log(`Found user: ${user.name}`);
 * }
 * ```
 */
async getUserById(id: string, options?: GetUserOptions): Promise<User | null> {
  // Implementation
}
```

#### README Files
- Each major directory should have a README.md
- Include setup instructions, usage examples, and API documentation
- Keep documentation up-to-date with code changes

### API Documentation

#### OpenAPI/Swagger
- Maintain OpenAPI specification for all endpoints
- Include request/response examples
- Document error codes and messages
- Keep API versioning information current

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Clear Description**: What happened vs. what was expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**: OS, browser, Node.js version, etc.
4. **Error Messages**: Full error logs and stack traces
5. **Screenshots**: Visual evidence if applicable
6. **Additional Context**: Any relevant information

### Feature Requests

For feature requests, please provide:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Use Cases**: Real-world scenarios where this would help
4. **Alternatives**: Other solutions you've considered
5. **Mockups**: Visual examples if applicable

### Issue Templates

Use the provided GitHub issue templates:
- Bug Report
- Feature Request
- Documentation Update
- Security Issue

## Pull Request Process

### PR Guidelines

1. **Title**: Clear, descriptive title
2. **Description**: Detailed explanation of changes
3. **Related Issues**: Link to relevant issues
4. **Type**: Feature, bugfix, documentation, etc.
5. **Breaking Changes**: Note any breaking changes

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass and coverage is adequate
- [ ] Documentation is updated
- [ ] No console.log or debug code
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Security implications reviewed

### Review Process

1. **Automated Checks**: CI/CD pipeline validation
2. **Code Review**: At least one maintainer approval
3. **Testing**: Manual testing if needed
4. **Documentation**: Review of documentation changes
5. **Merge**: Squash and merge to maintain clean history

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on technical discussions
- Avoid personal attacks or harassment
- Help newcomers and answer questions
- Report inappropriate behavior

### Communication

#### GitHub Discussions
- Use discussions for questions and ideas
- Tag discussions appropriately
- Search before creating new discussions
- Provide context and examples

#### Discord/Slack
- Join community channels
- Ask questions in appropriate channels
- Share progress and achievements
- Help other community members

### Recognition

#### Contributors
- All contributors are recognized in README
- Significant contributions get special mention
- Regular contributors may become maintainers
- Community awards for outstanding contributions

#### Contribution Types
- Code contributions
- Documentation improvements
- Bug reports and testing
- Community support
- Design and UX feedback

## Getting Help

### Resources

- **Documentation**: Check docs/ directory first
- **Issues**: Search existing issues for solutions
- **Discussions**: Ask questions in GitHub discussions
- **Community**: Join Discord/Slack for real-time help

### Mentorship

- New contributors can request mentorship
- Experienced contributors help newcomers
- Pair programming sessions available
- Code review guidance provided

## Release Process

### Version Management

- Semantic versioning (MAJOR.MINOR.PATCH)
- Release notes for each version
- Changelog maintenance
- Backward compatibility considerations

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Deployment tested
- [ ] Release published

---

**Thank you for contributing to RV Repair Copilot!** Your contributions help make RV repair more accessible and efficient for everyone.

For questions or concerns about contributing, please reach out to the maintainers or open a discussion on GitHub.