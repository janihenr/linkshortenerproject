# Authentication & Authorization

## Non-Negotiable Rules

- Clerk is the only authentication provider. Do not add or use any other auth methods.
- `/dashboard` is a protected route and must require a signed-in user.
- Signed-in users who visit `/` must be redirected to `/dashboard`.
- Sign in and sign up must always open as a Clerk modal (not a dedicated page).

## Clerk Setup

This project uses [Clerk](https://clerk.com) for authentication.

### Configuration

1. **Clerk Account**: Create account at https://dashboard.clerk.com
2. **API Keys**: Copy from Clerk dashboard
3. **Environment Variables** in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_REDIRECT_URL=/dashboard
```

### Installation

Clerk is already included in `package.json`:

```json
{
  "dependencies": {
    "@clerk/nextjs": "^7.0.0"
  }
}
```

## Authentication Flows

### 1. Sign In

Sign in must launch the Clerk modal from the UI. Avoid full-page sign-in routes.

```typescript
"use client";

import { SignInButton } from "@clerk/nextjs";

export function SignInCta() {
  return (
    <SignInButton mode="modal">
      <button>Sign in</button>
    </SignInButton>
  );
}
```

### 2. Sign Up

Sign up must launch the Clerk modal from the UI. Avoid full-page sign-up routes.

- Email verification required
- Password requirements enforced
- Redirects to app after verification

```typescript
"use client";

import { SignUpButton } from "@clerk/nextjs";

export function SignUpCta() {
  return (
    <SignUpButton mode="modal">
      <button>Create account</button>
    </SignUpButton>
  );
}
```

### 3. Session Management

Clerk automatically manages user sessions:

```typescript
import { useAuth } from "@clerk/nextjs";

export function useUserSession() {
  const { userId, isSignedIn, getToken } = useAuth();
  
  return {
    userId,           // Unique user identifier
    isSignedIn,       // Boolean session status
    getToken,         // Async function to get session token
  };
}
```

## Using Authentication in Components

### Client Components

```typescript
"use client";

import { useAuth } from "@clerk/nextjs";

export function MyComponent() {
  const { isSignedIn, userId } = useAuth();

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      Welcome! Your ID: {userId}
    </div>
  );
}
```

### Server Components

```typescript
// Server component - no 'use client'
import { auth } from "@clerk/nextjs/server";

export async function ServerComponent() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  return <div>Server-side user ID: {userId}</div>;
}
```

## Using Authentication in API Routes

### Protecting API Routes

```typescript
// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Process authenticated request
  return NextResponse.json({ userId });
}
```

### Using Session Token in API Calls

```typescript
"use client";

import { useAuth } from "@clerk/nextjs";

export function useAuthenticatedFetch() {
  const { getToken } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const token = await getToken();

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
```

## User Metadata

### Storing Custom User Data

```typescript
// In Clerk dashboard or via API
// Add custom metadata to user profiles

const user = {
  id: "user_123",
  email: "user@example.com",
  publicMetadata: {
    role: "admin",
    theme: "dark",
  },
  privateMetadata: {
    stripeId: "cus_...",
  },
};
```

### Accessing Metadata

```typescript
import { useUser } from "@clerk/nextjs";

export function useUserMetadata() {
  const { user } = useUser();

  return {
    role: user?.publicMetadata?.role,
    theme: user?.publicMetadata?.theme,
  };
}
```

## Authorization Patterns

### Basic Authorization (Protected Routes)

```typescript
// Check if user exists
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### App Router Redirects

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <div>Dashboard</div>;
}
```

```typescript
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <div>Home</div>;
}
```

### Role-Based Authorization

```typescript
async function requireRole(userId: string, requiredRole: string) {
  const user = await clerkClient.users.getUser(userId);
  const userRole = user.publicMetadata?.role;

  if (userRole !== requiredRole) {
    throw new Error("Insufficient permissions");
  }
}
```

### Resource-Based Authorization (Ownership Check)

```typescript
// Example: User can only access their own links
async function getLink(linkId: string, userId: string) {
  const link = await db
    .select()
    .from(links)
    .where(eq(links.id, linkId));

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.userId !== userId) {
    throw new Error("Forbidden - You do not own this link");
  }

  return link;
}
```

## Sign Out

### Client-Side Sign Out

```typescript
"use client";

import { SignOutButton } from "@clerk/nextjs";

export function SignOutLink() {
  return (
    <SignOutButton>
      <button>Sign Out</button>
    </SignOutButton>
  );
}
```

### Complete Sign Out Flow

```typescript
"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

## Linking External Accounts

Users can link multiple authentication methods:

```typescript
import { useUser } from "@clerk/nextjs";

export function LinkedAccounts() {
  const { user } = useUser();

  return (
    <div>
      {user?.externalAccounts?.map((account) => (
        <p key={account.id}>
          {account.provider}: {account.emailAddress}
        </p>
      ))}
    </div>
  );
}
```

## Multi-Tenant Support (Optional)

For multi-tenant applications:

```typescript
// Create organization
const org = await clerkClient.organizations.createOrganization({
  name: "My Company",
  createdBy: userId,
});

// Add user to organization
await clerkClient.organizations.createOrganizationMembership({
  organizationId: org.id,
  userId,
  role: "admin",
});
```

## Session Timeout

Configure session timeout in Clerk dashboard:

- Default: 30 minutes of inactivity
- Customizable per application needs
- Users automatically redirected to login on timeout

## Security Considerations

- ✅ Never store tokens in unencrypted format
- ✅ Always validate token on server
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on auth endpoints
- ✅ Clear sensitive data on logout
- ❌ Never expose secret keys in client code
- ❌ Don't store passwords (Clerk handles this)

## Debugging Authentication

### Common Issues

**Token Expired**
```typescript
// Clerk auto-refreshes tokens, but if manual refresh needed:
const newToken = await getToken({ template: "integration_jwt" });
```

**User Not Found in Server Component**
- Verify `auth()` is called correctly
- Check `CLERK_SECRET_KEY` is set
- Ensure middleware is configured

**Sign In/Sign Up UI Not Showing**
- Verify redirect URLs configured in Clerk dashboard
- Check routing is correct
- Clear browser cache

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference/backend-api)
