# Common Development Tasks

## Adding a New API Endpoint

### 1. Create the Route Handler

Create file: `app/api/[feature]/route.ts`

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Your logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 2. Test the Endpoint

```bash
# Using curl
curl http://localhost:3000/api/example

# Or use REST Client extension in VS Code
```

### 3. Call from Client Component

```typescript
"use client";

import { useEffect, useState } from "react";

export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/example")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

## Creating a New Database Table

### 1. Define Schema

Edit [db/schema.ts](../db/schema.ts):

```typescript
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const myTable = pgTable("my_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2. Push Schema to Database

```bash
npx drizzle-kit push:pg
```

### 3. Use in Database Operations

```typescript
import { db } from "@/db";
import { myTable } from "@/db/schema";

// Insert
await db.insert(myTable).values({ name: "Example" });

// Query
const results = await db.select().from(myTable);

// Update
await db.update(myTable).set({ name: "Updated" });

// Delete
await db.delete(myTable).where(eq(myTable.id, 1));
```

## Adding a New React Component

### 1. Create Component File

Create: `app/components/MyComponent.tsx`

```typescript
import React from "react";

interface MyComponentProps {
  title: string;
  onSubmit?: (value: string) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text"
        className="px-4 py-2 border rounded"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}
```

### 2. Use in Page or Parent Component

```typescript
import { MyComponent } from "@/app/components/MyComponent";

export default function Page() {
  return (
    <div>
      <MyComponent
        title="My Form"
        onSubmit={(value) => console.log(value)}
      />
    </div>
  );
}
```

## Implementing a Custom Hook

### 1. Create Hook File

Create: `lib/hooks/useMyHook.ts`

```typescript
import { useState, useCallback } from "react";

export function useMyHook() {
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setState(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, error, fetchData };
}
```

### 2. Use in Component

```typescript
"use client";

import { useMyHook } from "@/lib/hooks/useMyHook";

export function SearchComponent() {
  const { state, loading, error, fetchData } = useMyHook();

  return (
    <div>
      <button onClick={() => fetchData("test")}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <p>Result: {state}</p>
    </div>
  );
}
```

## Adding Styling with Tailwind

### Component Styling

```typescript
export function StyledComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome
        </h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Click me
        </button>
      </div>
    </div>
  );
}
```

### Responsive Design

```typescript
export function ResponsiveComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Items automatically adjust layout */}
    </div>
  );
}
```

## Debugging in Development

### Console Logging

```typescript
// In client components
console.log("Debug info:", data);

// In API routes
console.error("API Error:", error);
```

### React DevTools

1. Install React DevTools browser extension
2. Open DevTools (F12)
3. Go to "Components" tab
4. Inspect component tree
5. View props and state

### Database Query Logging

Enable Drizzle logging:

```typescript
// db/index.ts
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle({
  // ... config
  logger: true, // Enable query logging
});
```

## Environment Variables

### Adding New Variables

1. Add to `.env.local`:
```env
MY_NEW_VAR=value
NEXT_PUBLIC_CLIENT_VAR=public_value
```

2. Access in code:
```typescript
// Server-side (API routes, server components)
const secret = process.env.MY_NEW_VAR;

// Client-side (prefix with NEXT_PUBLIC_)
const clientVar = process.env.NEXT_PUBLIC_CLIENT_VAR;
```

### Required Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`

## Testing Locally

### Manual Testing

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Test features:
   - Create short link
   - Verify redirect works
   - Check database entries

### Testing API Endpoints

Using VS Code REST Client extension:

Create `test.http`:
```http
### Test create short link
POST http://localhost:3000/api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}

### Test redirect
GET http://localhost:3000/api/abc123
```

## Building for Production

### Build Locally

```bash
npm run build
npm run start
```

### Pre-deployment Checklist

- [ ] Run linter: `npm run lint`
- [ ] No TypeScript errors
- [ ] Build succeeds: `npm run build`
- [ ] Test all features locally
- [ ] Check environment variables are set
- [ ] Database migrations applied
- [ ] Error logging configured

## Performance Optimization

### Code Splitting

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(
  () => import("./HeavyComponent"),
  { loading: () => <p>Loading...</p> }
);
```

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority
/>
```

### Database Query Optimization

```typescript
// Use select() to fetch only needed columns
const result = await db
  .select({ id: links.id, code: links.shortCode })
  .from(links)
  .limit(10);
```

## Rollback Changes

### Git Rollback

```bash
# Undo uncommitted changes
git checkout -- .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Database Rollback

```bash
# Check migration history
npx drizzle-kit introspect:pg

# Create migration files
npx drizzle-kit generate:pg
```
