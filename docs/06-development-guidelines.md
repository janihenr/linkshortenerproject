# Development Guidelines

## Code Style & Standards

### TypeScript

- Use strict mode (`"strict": true` in tsconfig.json)
- Always type function parameters and return values
- Use interfaces for component props
- Avoid `any` type - use `unknown` with type guards if necessary

```typescript
// ✅ Good
interface CreateLinkParams {
  url: string;
  userId: string;
}

function createShortLink(params: CreateLinkParams): Promise<Link> {
  // Implementation
}

// ❌ Avoid
function createShortLink(params: any): any {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Prefix client-side components with `"use client"`
- Use TypeScript interfaces for props
- Extract complex logic into custom hooks

```typescript
// React 19 with TypeScript
interface LinkFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading?: boolean;
}

export function LinkForm({ onSubmit, isLoading = false }: LinkFormProps) {
  const [url, setUrl] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

### File Naming

- Components: PascalCase (`LinkForm.tsx`)
- Utilities: camelCase (`utils.ts`)
- Hooks: camelCase with `use` prefix (`useLinks.ts`)
- API routes: lowercase with brackets for dynamic routes (`[id].ts`)

## Styling

### Tailwind CSS

- Use Tailwind utility classes for styling
- Leverage responsive prefixes (`md:`, `lg:`, `sm:`)
- Use `clsx` for conditional classes

```typescript
import { clsx } from "clsx";

export function Button({ 
  isLoading, 
  disabled 
}: { 
  isLoading: boolean; 
  disabled?: boolean;
}) {
  return (
    <button 
      className={clsx(
        "px-4 py-2 rounded bg-blue-500 text-white",
        {
          "opacity-50 cursor-not-allowed": isLoading || disabled,
          "hover:bg-blue-600": !isLoading && !disabled,
        }
      )}
    >
      {isLoading ? "Loading..." : "Submit"}
    </button>
  );
}
```

### shadcn/ui Components

- Prefer shadcn/ui components over custom HTML
- Combine with Tailwind for customization
- Check Radix UI documentation for accessibility

## Project Organization

### Directory Structure Rules

```
app/
├── api/              # API route handlers
├── components/       # Page-specific components
├── layout.tsx        # Root layout
└── page.tsx          # Root page

lib/
├── utils.ts          # Shared utilities
└── [feature]/        # Feature-specific utilities

docs/                 # Documentation files
db/                   # Database schema and client
```

### Import Organization

1. External packages
2. Relative parent imports (`../../`)
3. Relative sibling imports (`./`)
4. Type imports

```typescript
// ✅ Correct ordering
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { db } from "../../db";
import { createLink } from "./helpers";
import type { Link } from "../../types";
```

## Database Operations

### Drizzle ORM Best Practices

- Always use parameterized queries (Drizzle handles this)
- Use typed selects for better IDE support
- Handle errors gracefully

```typescript
// ✅ Good - type-safe with error handling
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getLinkByShortCode(shortCode: string) {
  try {
    const result = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, shortCode))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to retrieve link");
  }
}
```

## API Route Handlers

### Structure

```typescript
// app/api/shorten/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Type the request body
interface ShortenRequest {
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { url }: ShortenRequest = await req.json();
    
    // Validate input
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    // Process request
    const shortCode = generateShortCode();
    const link = await createLink(url, shortCode, userId);

    return NextResponse.json(
      {
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/shorten:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Error Handling

### Global Error Handling

- Wrap async operations in try-catch
- Log errors for debugging
- Return user-friendly error messages
- Use appropriate HTTP status codes

### Error Boundaries

Consider implementing error boundaries for critical UI sections:

```typescript
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}
```

## Testing Recommendations

### Unit Tests
- Test utility functions
- Test custom hooks
- Use Jest with React Testing Library

### Integration Tests
- Test API endpoints
- Verify database operations
- Test authentication flows

### Manual Testing
1. Create shortened links
2. Verify redirects work
3. Test authentication flows
4. Check error scenarios
5. Test on multiple browsers

```bash
npm run lint  # Check code quality
```

## Performance Considerations

- Use `next/image` for image optimization
- Implement pagination for large datasets
- Cache database queries when appropriate
- Monitor Core Web Vitals in production
- Use ISR (Incremental Static Regeneration) for static pages

## Security Best Practices

- Validate all user inputs
- Use environment variables for secrets
- Implement rate limiting
- Sanitize database outputs
- Use HTTPS in production
- Implement CSRF protection
- Check authorization before data access

## Debugging Tips

### Browser DevTools
- Use React DevTools extension
- Check Network tab for API calls
- Monitor Console for errors

### VS Code Debugging
- Install Debugger for Firefox/Chrome
- Set breakpoints in source code
- Step through code execution

### Logging
```typescript
// Development console logging
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}
```

## Commit Message Guidelines

Follow conventional commits:

```
feat: Add ability to create short links
fix: Resolve redirect bug in shortened URLs
docs: Update API documentation
style: Format code with Prettier
refactor: Extract link creation logic
test: Add tests for URL validation
```

## Deployment Checklist

- [ ] All tests passing
- [ ] No linting errors (`npm run lint`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build succeeds (`npm run build`)
- [ ] Error logging configured
- [ ] Performance optimized
- [ ] Security review completed
