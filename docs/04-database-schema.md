# Database Schema

## Overview

The database uses PostgreSQL with Drizzle ORM for type-safe database operations.

## Tables

### links

Main table storing all shortened links.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | integer | PRIMARY KEY, SERIAL | Unique identifier |
| `originalUrl` | varchar | NOT NULL | Full original URL |
| `shortCode` | varchar | UNIQUE, NOT NULL | Generated short code |
| `userId` | varchar | NOT NULL | Clerk user ID (links to user) |
| `createdAt` | timestamp | DEFAULT NOW() | Creation timestamp |
| `expiresAt` | timestamp | NULLABLE | Optional expiration date |
| `clickCount` | integer | DEFAULT 0 | Track number of accesses |

## Schema Definition Location

- **File**: [db/schema.ts](../db/schema.ts)
- **Database Client**: [db/index.ts](../db/index.ts)

## Database Operations

### Create (POST)

```typescript
// Example: Insert new shortened link
const newLink = await db.insert(links).values({
  originalUrl: "https://example.com/very/long/url",
  shortCode: "abc123",
  userId: "user_123",
});
```

### Read (GET)

```typescript
// Example: Retrieve link by short code
const link = await db
  .select()
  .from(links)
  .where(eq(links.shortCode, "abc123"));
```

### Update

```typescript
// Example: Increment click count
await db
  .update(links)
  .set({ clickCount: sql`${links.clickCount} + 1` })
  .where(eq(links.shortCode, "abc123"));
```

### Delete

```typescript
// Example: Remove link by ID
await db
  .delete(links)
  .where(eq(links.id, 1));
```

## Indexes

Recommended indexes for performance:

- `shortCode` - UNIQUE (required for lookups)
- `userId` - For user-specific queries
- `createdAt` - For sorting recent links
- `expiresAt` - For cleanup queries

## Database Seeding

To seed test data during development:

```bash
# Manual seeding via database client
# Create test links with known short codes
```

## Migrations

Run Drizzle migrations:

```bash
# Push schema changes
npx drizzle-kit push:pg

# Generate migration files
npx drizzle-kit generate:pg

# View migration status
npx drizzle-kit introspect:pg
```

## Backup & Maintenance

- **Backup**: Use Neon's built-in backup features
- **Monitoring**: Check Neon dashboard for usage
- **Cleanup**: Periodically remove expired links
- **Optimization**: Monitor index usage and query performance

## Environment Variables

- `DATABASE_URL` - Full PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Set in `.env.local`
