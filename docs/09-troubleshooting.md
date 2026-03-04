# Troubleshooting Guide

## Common Issues and Solutions

### Development Server Issues

#### Port 3000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:

**Windows PowerShell**:
```powershell
# Find and kill process on port 3000
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($process) {
  Stop-Process -Id $process.OwningProcess -Force
}

# Start dev server
npm run dev
```

**macOS/Linux**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Start dev server
npm run dev
```

**Alternative**: Change port
```bash
npm run dev -- -p 3001
```

---

#### Module Not Found Errors

**Error**: `Module not found: Can't resolve '@/...'`

**Solutions**:
1. Check `tsconfig.json` has correct path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. Restart dev server after adding import paths
3. Clear `.next` cache: `rm -r .next`

---

#### TypeScript Compilation Errors

**Error**: `Type 'X' is not assignable to type 'Y'`

**Solutions**:
1. Check variable types match expected interface
2. Ensure imports are correct
3. Hover over variable in VS Code for type hints
4. Use `as` type assertion only as last resort

```typescript
// ✅ Better: Fix underlying type
const data: MyType = processData();

// ❌ Avoid: Using 'as' bandaid
const data = processData() as MyType;
```

---

### Database Connection Issues

#### Database Connection Failed

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432` or similar

**Solutions**:

1. **Verify DATABASE_URL**
```bash
# Check .env.local exists and has DATABASE_URL
cat .env.local | grep DATABASE_URL
```

2. **Verify Neon Database is Active**
   - Go to neon.tech dashboard
   - Check project status (should be green)
   - Verify IP whitelist (allow all or your IP)

3. **Test Connection String**
```typescript
// app/api/health/route.ts
import { db } from "@/db";

export async function GET() {
  try {
    await db.select().from(links).limit(1);
    return Response.json({ status: "connected" });
  } catch (error) {
    return Response.json({ status: "failed", error }, { status: 500 });
  }
}
```

Then visit `http://localhost:3000/api/health`

4. **Check Network Access**
```bash
# macOS/Linux - test connection
psql $DATABASE_URL -c "SELECT 1"

# Windows - might need psql installed
```

---

#### Drizzle Migration Failures

**Error**: `PgError: relation "links" does not exist`

**Solutions**:

1. **Push schema to database**
```bash
npx drizzle-kit push:pg
```

2. **Verify schema file exists**
```bash
# Check db/schema.ts is not empty
cat db/schema.ts
```

3. **Check migration history**
```bash
npx drizzle-kit introspect:pg
```

---

### Authentication Issues

#### Clerk API Keys Not Found

**Error**: `ClerkRuntimeError: The Clerk publishable key was not passed`

**Solutions**:

1. **Verify environment variables**
```env
# .env.local should contain:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

2. **Restart dev server** after adding variables
```bash
# Kill and restart
npm run dev
```

3. **Check Clerk Dashboard**
   - Go to https://dashboard.clerk.com
   - Navigate to API keys section
   - Copy correct publishable and secret keys
   - Verify they're not revoked

---

#### Clerk Sign-In Not Loading

**Error**: `404 - Not Found` on `/sign-in` page

**Solutions**:

1. **Install Clerk pages** (if not using default redirects):
```bash
npx @clerk/nextjs prebuilt-pages
```

2. **Update environment variables**
```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_REDIRECT_URL=/
```

3. **Verify Clerk middleware** in root layout
```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

#### User Not Authenticated in API Route

**Error**: `userId is undefined` in API route

**Solutions**:

1. **Use correct import for server-side auth**
```typescript
// ✅ Correct for API routes
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  console.log(userId); // Should have value
}
```

```typescript
// ❌ Wrong for API routes
import { useAuth } from "@clerk/nextjs"; // This is for client components
```

2. **Ensure user is actually logged in**
   - Check browser has valid Clerk session
   - Try signing out and back in

---

### API and Fetch Issues

#### CORS Errors

**Error**: `Access to XMLHttpRequest at 'http://localhost:3000/api/...' from origin blocked by CORS policy`

**Solutions**:

1. **Local development** - usually not an issue
2. **For API calls**, use relative routes:
```typescript
// ✅ Correct - same domain
fetch("/api/shorten", { method: "POST" })

// ❌ Avoid - different origins
fetch("http://localhost:3001/api/shorten")
```

---

#### 401 Unauthorized on API Calls

**Error**: `{ error: "Unauthorized" }` with status 401

**Solutions**:

1. **Verify user is signed in**
```typescript
const { userId } = await auth();
console.log("User ID:", userId); // Should not be undefined
```

2. **Check Clerk session** in browser
   - Open DevTools
   - Application > Cookies
   - Look for `__session` cookie

3. **Ensure authentication middleware** is active
```typescript
// API route must await auth()
const { userId } = await auth();
```

---

#### 404 Not Found on Short Links

**Error**: `{ error: "Short code not found" }` when accessing `/api/[shortCode]`

**Solutions**:

1. **Verify short code exists in database**
```typescript
// Create a debug endpoint
export async function GET() {
  const allLinks = await db.select().from(links);
  return Response.json(allLinks);
}
```

2. **Check short code format** matches what's stored
3. **Verify it's being created** - check database directly via Neon console

---

### Build and Deployment Issues

#### Build Failing with TypeScript Errors

**Error**: Build fails with type errors during `npm run build`

**Solutions**:

1. **Run type check locally**
```bash
npx tsc --noEmit
```

2. **Fix all TypeScript errors**
3. **Check `tsconfig.json`** is correct
4. **Clear build cache** and retry
```bash
rm -r .next
npm run build
```

---

#### Build Succeeds Locally but Fails in Production

**Error**: Errors appear on deployed version but not locally

**Solutions**:

1. **Check environment variables** are set in production
   - Redeploy with correct vars
2. **Verify database** is accessible from production
3. **Check logs** in production platform (Vercel, etc.)
4. **Test production build locally**
```bash
npm run build
npm run start
```

---

### Performance Issues

#### Slow Page Load

**Solutions**:

1. **Check database queries**
   - Add `console.log` to see query count
   - Reduce queries per page
   - Use pagination

2. **Optimize images**
```typescript
import Image from "next/image";

<Image
  src="..."
  alt="..."
  priority // for above-the-fold
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

3. **Implement pagination**
```typescript
// Fetch limited results
const links = await db
  .select()
  .from(links)
  .limit(20)
  .offset((page - 1) * 20);
```

---

#### High Memory Usage

**Solutions**:

1. **Check for memory leaks** in client code
2. **Optimize DOM** - remove unnecessary elements
3. **Lazy load components**
```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(
  () => import("./HeavyComponent"),
  { loading: () => <div>Loading...</div> }
);
```

---

### Styling Issues

#### Tailwind Classes Not Applied

**Error**: Styles not showing on elements with Tailwind classes

**Solutions**:

1. **Verify Tailwind config includes files**
```javascript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
};
```

2. **Restart dev server**
3. **Check class names are valid** Tailwind classes
```typescript
// ✅ Valid
className="px-4 py-2 bg-blue-500"

// ❌ Invalid
className="padding-4-2 background-blue"
```

4. **Clear Tailwind cache**
```bash
rm -rf node_modules/.tailwind-cache
npm run dev
```

---

### Git and Version Control

#### Accidental File Deletion

**Recovery**:

```bash
# Restore deleted file from git
git restore <filepath>

# Or for staged changes
git reset <filepath>
```

---

#### Too Many Uncommitted Changes

**Clean up**:

```bash
# See what will be discarded
git status

# Discard all uncommitted changes
git reset --hard HEAD

# Or stash for later
git stash
```

---

### Getting Help

1. **Check logs**
   - Browser console (F12)
   - Terminal output
   - VS Code Problems panel (Ctrl+Shift+M)

2. **Search documentation**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Clerk Docs](https://clerk.com/docs)
   - [Drizzle Docs](https://orm.drizzle.team)

3. **Enable debug logging**
```typescript
// Enable Drizzle query logging
logger: true in db config

// Enable verbose CLI output
npm run dev -- --debug
```

4. **Clear cache and node_modules**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

5. **Ask for help**
   - Share error message and steps to reproduce
   - Include relevant files and environment info
