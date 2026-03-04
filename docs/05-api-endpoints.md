# API Endpoints

## Overview

This project uses Next.js App Router API routes. API endpoints are defined in the `app/api` directory.

## Endpoints

### POST /api/shorten

**Purpose**: Create a new shortened link

**Request**
```json
{
  "url": "https://example.com/very/long/url"
}
```

**Response (Success 200)**
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "https://yourdomain.com/abc123"
}
```

**Response (Error 400)**
```json
{
  "error": "Invalid or missing URL"
}
```

**Response (Error 401)**
```json
{
  "error": "Unauthorized - User must be signed in"
}
```

**Response (Error 500)**
```json
{
  "error": "Failed to create shortened link"
}
```

**Requirements**
- User must be authenticated (Clerk)
- URL must be valid and start with `http://` or `https://`
- Short code must be unique
- Maximum URL length depends on database configuration

---

### GET /api/[shortCode]

**Purpose**: Redirect to original URL or retrieve link metadata

**Parameters**
- `shortCode` - The short code to look up (from URL path)

**Response (Success - Redirect 301)**
- Redirects to original URL
- Updates click count in database

**Response (Error 404)**
```json
{
  "error": "Short code not found"
}
```

**Response (Error 410)**
```json
{
  "error": "Link has expired"
}
```

**Behavior**
- Automatically increments click counter
- Checks expiration if set
- Returns 301 permanent redirect for SEO

---

### GET /api/user/links

**Purpose**: Retrieve all shortened links created by the authenticated user

**Response (Success 200)**
```json
{
  "links": [
    {
      "id": 1,
      "shortCode": "abc123",
      "originalUrl": "https://example.com/very/long/url",
      "createdAt": "2025-03-04T10:30:00Z",
      "clickCount": 42
    }
  ]
}
```

**Response (Error 401)**
```json
{
  "error": "Unauthorized"
}
```

**Pagination**
- Optional query parameters: `page`, `limit`
- Default: 20 links per page

---

### DELETE /api/links/[id]

**Purpose**: Delete a shortened link (requires ownership)

**Parameters**
- `id` - Link ID to delete (from URL path)

**Response (Success 204)**
- No content

**Response (Error 403)**
```json
{
  "error": "Forbidden - You do not own this link"
}
```

**Response (Error 404)**
```json
{
  "error": "Link not found"
}
```

## Authentication

All endpoints (except GET redirects) require Clerk authentication:

```typescript
// In API route handler
const { userId } = auth();

if (!userId) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), { 
    status: 401 
  });
}
```

## Error Handling

Standard HTTP status codes:
- `200` - OK (successful GET/POST request)
- `201` - Created (successful resource creation)
- `204` - No Content (successful DELETE)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (short code already exists)
- `500` - Internal Server Error (server-side issue)

## Rate Limiting

Consider implementing rate limiting for:
- Link creation (prevent spam)
- Redirect clicks (DOS protection)
- User data queries

## API Documentation Location

- Routes implementation: `app/api/` directory
- Request/response types: Component interfaces
