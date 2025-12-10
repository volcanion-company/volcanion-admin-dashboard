# Contributing to Volcanion Admin Dashboard

First off, thank you for considering contributing to Volcanion Admin Dashboard! It's people like you that make this project such a great tool.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Reporting Bugs](#reporting-bugs)
8. [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@volcanion.com.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/volcanion-admin-dashboard.git
   cd volcanion-admin-dashboard
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/volcanion-company/volcanion-admin-dashboard.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Development Process

### Branching Strategy

We use Git Flow branching model:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use functional components with hooks

```typescript
// ✅ Good
interface UserProps {
  name: string;
  email: string;
}

export default function User({ name, email }: UserProps) {
  return <div>{name}</div>;
}

// ❌ Bad
export default function User(props: any) {
  return <div>{props.name}</div>;
}
```

### React Components

- Use functional components
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Component structure
export default function MyComponent({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState();
  const dispatch = useDispatch();
  
  // 2. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3. Event handlers
  const handleClick = () => {
    // ...
  };
  
  // 4. Render
  return (
    <div>...</div>
  );
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `page.tsx` (Next.js App Router convention)
- Types: `index.ts` in `types/` folder

### Folder Structure

```
src/
├── app/              # Next.js pages
├── components/       # React components
│   ├── common/      # Reusable components
│   ├── auth/        # Auth-specific components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
├── lib/             # Core libraries
├── store/           # Redux store
│   ├── api/        # RTK Query APIs
│   └── slices/     # Redux slices
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Code Style

We use ESLint and Prettier for code formatting.

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type check
npm run type-check
```

### State Management

- Use Redux Toolkit for global state
- Use RTK Query for API calls
- Keep local state when possible
- Don't duplicate API data in Redux slices

```typescript
// ✅ Good - Use RTK Query
const { data, isLoading } = useGetRolesQuery();

// ❌ Bad - Don't duplicate in slice
const roles = useSelector(state => state.roles.data);
```

### API Integration

- All API endpoints in RTK Query
- Use TypeScript types for requests/responses
- Handle errors properly
- Show loading states

```typescript
// Define API endpoint
export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
    }),
  }),
});
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add remember me functionality

fix(datatable): resolve pagination issue on mobile

docs(readme): update installation instructions

refactor(api): simplify error handling logic

chore(deps): upgrade dependencies
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues in footer (e.g., "Fixes #123")

## Pull Request Process

### Before Creating PR

1. ✅ Code follows style guidelines
2. ✅ All tests pass
3. ✅ No TypeScript errors
4. ✅ No console.log statements
5. ✅ Updated documentation if needed
6. ✅ Added/updated tests if needed

### Creating Pull Request

1. **Update your branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature
   git rebase develop
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature
   ```

3. **Create PR on GitHub**
   - Use descriptive title
   - Reference related issues
   - Describe changes made
   - Add screenshots if UI changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Review Process

- At least one approval required
- All CI checks must pass
- No merge conflicts
- Up-to-date with base branch

## Reporting Bugs

### Before Submitting

- Check existing issues
- Use latest version
- Reproduce in clean environment

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[Add if applicable]

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- App version: [e.g., 1.0.0]

## Additional Context
Any other information
```

## Suggesting Enhancements

### Enhancement Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Mockups, examples, etc.
```

## Development Workflow

### Daily Development

```bash
# 1. Start day - update develop
git checkout develop
git pull upstream develop

# 2. Create/switch to feature branch
git checkout -b feature/my-feature

# 3. Make changes
# ... code ...

# 4. Commit frequently
git add .
git commit -m "feat: add feature part 1"

# 5. Keep branch updated
git fetch upstream
git rebase upstream/develop

# 6. Push to your fork
git push origin feature/my-feature

# 7. Create PR when ready
```

### Testing

```bash
# Run type check
npm run type-check

# Run linting
npm run lint

# Build project
npm run build
```

## Questions?

- 📧 Email: support@volcanion.com
- 💬 Discord: [Join our server]
- 📖 Docs: [Read the docs]

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

Thank you for contributing! 🎉

---

**Last Updated**: December 2025
