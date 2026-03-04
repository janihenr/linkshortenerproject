# Link Shortener Project Overview

## Project Description

This is a **Link Shortener Application** built with modern web technologies. It allows authenticated users to convert long URLs into short, shareable links.

## Technology Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **UI Components**: Radix UI + Lucide React icons
- **Development**: ESLint, PostCSS, Autoprefixer

## Project Structure

```
linkshortenerproject/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Clerk provider
│   ├── page.tsx           # Home page (link creation UI)
│   └── components/        # Page-specific components
├── db/
│   ├── schema.ts          # Drizzle ORM database schema
│   └── index.ts           # Database client setup
├── lib/
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── docs/                  # Project documentation
├── package.json           # Dependencies and scripts
├── eslint.config.mjs      # ESLint configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Core Features

- User authentication via Clerk
- Long URL to short code conversion
- Short link generation and management
- Redirect functionality
- Responsive UI with Tailwind CSS

## Development Scripts

- `npm run dev` - Start development server (Next.js on port 3000)
- `npm run build` - Create optimized production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint checks

## Key Files to Know

- [app/page.tsx](../app/page.tsx) - Main UI for creating short links
- [db/schema.ts](../db/schema.ts) - Database schema definition
- [db/index.ts](../db/index.ts) - Database initialization
- [next.config.ts](../next.config.ts) - Next.js configuration
