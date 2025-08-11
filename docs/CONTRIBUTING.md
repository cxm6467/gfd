# Contributing to GF'd

Thank you for your interest in contributing to GF'd! This guide will help you get started with contributing to our gluten-free dating platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- Docker and Docker Compose
- Git
- Basic knowledge of React, TypeScript, and GraphQL

### Development Setup
1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/gfd-dating-app.git
   cd gfd-dating-app
   ```
3. **Set up environment**
   ```bash
   cp .env.local .env
   docker-compose up -d
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Set up git hooks**
   ```bash
   npm run prepare
   ```
6. **Start development**
   ```bash
   npm run dev
   ```

## 📋 Development Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/user-verification`)
- **bugfix/**: Bug fixes (`bugfix/login-error`)
- **hotfix/**: Critical production fixes

### Commit Convention
We strictly enforce [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
type(scope): description

feat(auth): add two-factor authentication
fix(ui): resolve mobile navigation issue
docs(api): update GraphQL schema documentation
test(components): add ProfileCard test suite
perf(matching): optimize compatibility algorithm
refactor(auth): simplify token validation logic
```

**Types:**
- `feat`: A new feature for the user
- `fix`: A bug fix for the user
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Scope (optional):**
- `auth`: Authentication and authorization
- `ui`: User interface components
- `api`: Backend API changes
- `db`: Database schema or queries
- `config`: Configuration changes
- `deps`: Dependency updates

**Breaking Changes:**
For breaking changes, add `!` after the type/scope:
```
feat(api)!: change user authentication flow
```

**Examples:**
```
feat(auth): add OAuth2 Google integration
fix(ui): resolve mobile navigation overflow
docs(readme): update installation instructions
style(components): format code with prettier
refactor(matching): extract compatibility scoring logic
perf(api): add database query caching
test(auth): add unit tests for login flow
build(deps): upgrade React to v18.3.1
ci(github): add automated security scanning
chore(config): update ESLint rules
```

## 🏗️ Architecture Guidelines

### Atomic Design Structure
Follow our atomic design principles:

```
src/components/
├── atoms/          # Basic UI elements (Button, Input)
├── molecules/      # Simple combinations (SearchForm)
├── organisms/      # Complex components (Header, ProfileCard)
├── templates/      # Page layouts (AppLayout)
└── pages/          # Complete pages (HomePage)
```

### File Organization
- **One component per file**
- **Co-locate tests** with components
- **Use index.ts** for clean imports
- **Group related files** in folders

```
components/atoms/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

### TypeScript Guidelines
- **Use strict TypeScript** configuration
- **Define interfaces** for all props
- **Use proper typing** for GraphQL operations
- **Avoid `any` type** unless absolutely necessary

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

## 🎨 Design System

### Theme Usage
Always use theme tokens instead of hardcoded values:

```typescript
// ✅ Good
const { theme } = useTheme();
<div className={theme.colors.primary}>

// ❌ Bad
<div className="bg-blue-600">
```

### Color Palette
- **Primary**: Blue tones for main actions
- **Secondary**: Grey tones for secondary elements
- **Background**: White and light greys
- **Text**: Dark greys for readability
- **Accent**: Subtle colors for highlights

### Responsive Design
- **Mobile-first** approach
- **Use Tailwind breakpoints**: `sm:`, `md:`, `lg:`, `xl:`
- **Test on multiple devices**
- **Ensure touch-friendly** interactions

## 🧪 Testing Requirements

### Test Coverage
- **Unit tests**: 90% coverage minimum
- **Integration tests**: Critical user flows
- **E2E tests**: Key user journeys
- **Accessibility tests**: WCAG compliance

### Testing Guidelines
```typescript
describe('Component Name', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🔒 Security Guidelines

### Data Protection
- **Never log sensitive data**
- **Use encryption** for PII
- **Validate all inputs**
- **Sanitize user content**

### Authentication
- **Use secure tokens**
- **Implement proper session management**
- **Add rate limiting**
- **Validate permissions**

### Code Security
```typescript
// ✅ Good - Input validation
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ❌ Bad - No validation
const processEmail = (email: any) => {
  // Direct usage without validation
};
```

## 📝 Documentation Standards

### Code Documentation
- **JSDoc comments** for complex functions
- **README files** for major features
- **API documentation** for GraphQL schemas
- **Architecture decisions** in ADR format

### Component Documentation
```typescript
/**
 * ProfileCard displays user profile information with actions
 * 
 * @param user - User profile data
 * @param onLike - Callback when user likes profile
 * @param onPass - Callback when user passes on profile
 */
interface ProfileCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
}
```

## 🚀 Pull Request Process

### Before Submitting
1. **Run all tests** and ensure they pass
2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Follow code style** guidelines
5. **Rebase on latest** main branch
6. **Follow conventional commits** format
7. **Ensure pre-commit hooks** pass

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All pre-push checks pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Commit messages follow conventional format
- [ ] Pre-commit hooks pass
```

### Review Process
1. **Automated checks** must pass
2. **Two approvals** required
3. **Security review** for sensitive changes
4. **Performance review** for optimization changes
5. **Conventional commit** format enforced
6. **Pre-push hooks** must pass

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions considered

**Additional context**
Any other context or screenshots
```

## 🎯 Areas for Contribution

### High Priority
- **Accessibility improvements**
- **Performance optimizations**
- **Security enhancements**
- **Test coverage increases**

### Medium Priority
- **UI/UX improvements**
- **Documentation updates**
- **Code refactoring**
- **Feature enhancements**

### Good First Issues
- **Component styling fixes**
- **Documentation improvements**
- **Simple bug fixes**
- **Test additions**

## 🔧 Development Workflow

### Git Hooks
We use Husky to enforce quality standards:

- **Pre-commit**: Runs lint-staged to format and lint staged files
- **Commit-msg**: Validates commit messages against conventional commits format
- **Pre-push**: Runs full linting, type checking, and test suite

### Quality Gates
All commits must pass:
- ✅ **ESLint** with no errors
- ✅ **Prettier** formatting
- ✅ **TypeScript** type checking
- ✅ **Conventional commit** message format
- ✅ **Test suite** with no failures

### Bypassing Hooks (Emergency Only)
```bash
# Skip pre-commit (not recommended)
git commit --no-verify -m "fix: emergency hotfix"

# Skip pre-push (not recommended)
git push --no-verify
```

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: security@gfd.com for security issues

### Code Review Guidelines
- **Be constructive** and respectful
- **Explain the "why"** behind suggestions
- **Focus on code quality** and maintainability
- **Consider performance** and security implications

## 🏆 Recognition

Contributors will be recognized in:
- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributor** graphs
- **Special mentions** in project updates

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### Our Standards
- **Be respectful** and inclusive
- **Focus on constructive** feedback
- **Help others learn** and grow
- **Maintain professional** communication

Thank you for contributing to GF'd! Together, we're building a safer, more inclusive dating platform for the gluten-free community. 💙