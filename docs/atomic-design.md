# Atomic Design System - GlutenConnect

## Overview

GlutenConnect follows the Atomic Design methodology created by Brad Frost. This system creates a design hierarchy that builds from simple elements to complex page layouts.

## Design Hierarchy

### 🔬 Atoms
The basic building blocks of our interface - HTML elements that can't be broken down further.

**Examples:**
- Buttons
- Input fields
- Labels
- Icons
- Typography elements
- Form inputs

**Location:** `src/components/atoms/`

```typescript
// Example: Button Atom
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
}
```

### 🧬 Molecules
Groups of atoms bonded together to form simple, reusable interface components.

**Examples:**
- Search form (input + button)
- Navigation item (icon + label)
- Profile card header (avatar + name + status)
- Message bubble (text + timestamp + status)

**Location:** `src/components/molecules/`

```typescript
// Example: Search Form Molecule
interface SearchFormProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({ ... }) => {
  return (
    <form>
      <Input placeholder={placeholder} />
      <Button type="submit">Search</Button>
    </form>
  );
}
```

### 🦠 Organisms
Complex components composed of groups of molecules and atoms.

**Examples:**
- Header with navigation
- Profile card with actions
- Match list
- Chat conversation
- Payment form

**Location:** `src/components/organisms/`

```typescript
// Example: Profile Card Organism
interface ProfileCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  onSuperLike: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ ... }) => {
  return (
    <div>
      <ProfileHeader user={user} />
      <ProfilePhotos photos={user.photos} />
      <ProfileInfo info={user.profile} />
      <ActionButtons onLike={onLike} onPass={onPass} />
    </div>
  );
}
```

### 📄 Templates
Page layouts that provide structure and context for organisms.

**Examples:**
- Dashboard layout
- Auth layout
- Chat layout
- Profile setup flow

**Location:** `src/components/templates/`

```typescript
// Example: Dashboard Template
interface DashboardTemplateProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ ... }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header>{header}</header>
      <div className="flex">
        <aside>{sidebar}</aside>
        <main>{main}</main>
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}
```

### 📱 Pages
Specific instances of templates with real content.

**Examples:**
- Home page
- Profile page
- Messages page
- Settings page

**Location:** `src/pages/`

```typescript
// Example: Dashboard Page
export const DashboardPage: React.FC = () => {
  return (
    <DashboardTemplate
      header={<AppHeader />}
      sidebar={<NavigationSidebar />}
      main={<MatchGrid />}
      footer={<AppFooter />}
    />
  );
}
```

## Design Tokens

### Color System
```typescript
// src/styles/tokens/colors.ts
export const colors = {
  primary: {
    50: '#fdf4e7',
    100: '#fae5bf',
    500: '#f4a261', // Main brand color
    900: '#8b4513',
  },
  secondary: {
    50: '#e8f5f3',
    500: '#2a9d8f',
    900: '#1a5f56',
  },
  // ... more colors
} as const;
```

### Typography Scale
```typescript
// src/styles/tokens/typography.ts
export const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
```

### Spacing System
```typescript
// src/styles/tokens/spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
} as const;
```

## Component Guidelines

### Naming Conventions
- Use PascalCase for component names
- Use descriptive, semantic names
- Prefix with the atomic level when ambiguous

### Props Interface
- Always define TypeScript interfaces
- Use descriptive prop names
- Provide sensible defaults
- Document complex props with JSDoc

```typescript
/**
 * Profile photo component with fallback support
 */
interface ProfilePhotoProps {
  /** User's profile photo URL */
  src?: string;
  /** Alternative text for accessibility */
  alt: string;
  /** Photo size variant */
  size: 'sm' | 'md' | 'lg' | 'xl';
  /** Show online status indicator */
  showStatus?: boolean;
  /** Click handler */
  onClick?: () => void;
}
```

### Accessibility
- Always include proper ARIA attributes
- Ensure keyboard navigation works
- Provide alternative text for images
- Use semantic HTML elements

### Testing Strategy
```typescript
// Example component test
describe('Button Atom', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Storybook Integration

Each component should have corresponding Storybook stories:

```typescript
// Button.stories.tsx
export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Basic button component with multiple variants and sizes',
      },
    },
  },
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = () => (
  <Button variant="primary">Primary Button</Button>
);

export const AllVariants: ComponentStory<typeof Button> = () => (
  <div className="space-x-4">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="danger">Danger</Button>
  </div>
);
```

## Performance Considerations

### Code Splitting
- Use React.lazy() for page-level components
- Implement bundle splitting at organism level
- Preload critical components

### Memoization
```typescript
// Memoize expensive components
const ExpensiveProfileCard = React.memo(ProfileCard, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id && 
         prevProps.user.updatedAt === nextProps.user.updatedAt;
});
```

### Asset Optimization
- Use next/image for automatic optimization
- Implement lazy loading for non-critical components
- Optimize SVG icons and bundle them efficiently

## File Organization

```
src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── ...
├── molecules/
├── organisms/
├── templates/
└── pages/
```

## Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Composition over Inheritance**: Build complex components by combining simpler ones
3. **Props over State**: Keep components stateless when possible
4. **Consistent API**: Similar components should have similar prop interfaces
5. **Documentation**: Every public component should be documented
6. **Testing**: Maintain high test coverage especially for organisms and pages
7. **Performance**: Monitor bundle size and rendering performance

## Migration Strategy

When adding new components:

1. Identify the atomic level
2. Check if similar atoms/molecules exist
3. Create reusable tokens if needed
4. Write comprehensive tests
5. Add Storybook stories
6. Document usage examples
7. Update this guide if needed

This atomic design system ensures consistency, reusability, and maintainability across the GlutenConnect platform.