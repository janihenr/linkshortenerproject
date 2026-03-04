# Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│              Next.js App Router                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Client Components (React)                   │  │
│  │  - Link creation form                        │  │
│  │  - User interface                            │  │
│  │  - State management                          │  │
│  └──────────────────────────────────────────────┘  │
│                       ↕                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Routes                                  │  │
│  │  - POST /api/shorten (create short link)     │  │
│  │  - GET /api/[shortCode] (redirect)           │  │
│  └──────────────────────────────────────────────┘  │
│                       ↕                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Clerk Authentication Middleware             │  │
│  └──────────────────────────────────────────────┘  │
│                       ↕                             │
├─────────────────────────────────────────────────────┤
│              Drizzle ORM Layer                      │
├─────────────────────────────────────────────────────┤
│                       ↕                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Neon PostgreSQL Database                    │  │
│  │  - Links table (url, shortCode, userId)      │  │
│  │  - Users metadata (from Clerk)               │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Component Structure

### App Layout (`app/layout.tsx`)
- Root layout component
- Wraps application with Clerk ClerkProvider
- Manages global styling and providers

### Home Page (`app/page.tsx`)
- "Use client" directive (client-side component)
- Displays authenticated UI
- Form for URL input
- Short code display
- Integrates Clerk authentication

### Database Layer (`db/`)
- `index.ts` - Database connection and client
- `schema.ts` - Drizzle ORM schema definitions
- Tables: `links` (primary data storage)

## Data Flow

### Creating a Short Link

1. User enters long URL in form (`app/page.tsx`)
2. Form submission triggers `handleCreateShortLink`
3. POST request to `/api/shorten` with original URL
4. API route validates and processes request
5. Generates unique short code
6. Stores in database via Drizzle ORM
7. Returns short code to frontend
8. UI displays created short link

### Accessing a Short Link

1. User visits `https://domain.com/[shortCode]`
2. Route handler retrieves link from database
3. Verifies short code exists
4. Returns 301 redirect to original URL
5. Browser redirects user to original destination

## Authentication Flow

1. Clerk provides authentication context
2. `useAuth()` hook retrieves user session
3. Protected routes check `isSignedIn` status
4. User metadata stored in Clerk
5. Links associated with user ID

## State Management

- **Client State**: React `useState` for form inputs and loading states
- **Server State**: Database holds persistent link data, accessed via Drizzle ORM
- **Auth State**: Clerk manages user authentication and sessions

## Error Handling Strategy

- Try-catch blocks in API routes
- Error logging to console
- User-friendly error messages in UI
- Database query error handling via Drizzle
