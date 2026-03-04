# Link Shortener Project - Agent Instructions

Welcome! This document serves as the main entry point for agent instructions for this Link Shortener project. Detailed documentation is organized into separate markdown files in the `/docs` directory.

## 🚨 Mandatory Rule (Read First)

**It is INCREDIBLY IMPORTANT to ALWAYS read the relevant files in the `/docs` directory BEFORE generating ANY code.**

- Do not write or suggest code changes until relevant documentation has been reviewed.
- Use `/docs` as the source of truth for architecture, API behavior, database patterns, and UI rules.
- If requirements are unclear, re-check `/docs` before proceeding.

## Quick Navigation

### 📋 Project Foundation
- [**01 - Project Overview**](docs/01-project-overview.md) - Project description, tech stack, and key files
- [**02 - Setup Instructions**](docs/02-setup-instructions.md) - How to set up development environment

### 🏗️ Architecture & Design
- [**03 - Architecture Overview**](docs/03-architecture.md) - High-level system design and data flow
- [**04 - Database Schema**](docs/04-database-schema.md) - Database structure and operations

### 💻 Development
- [**05 - API Endpoints**](docs/05-api-endpoints.md) - Available API routes and request/response formats
- [**06 - Development Guidelines**](docs/06-development-guidelines.md) - Code style, best practices, and patterns
- [**08 - Common Tasks**](docs/08-common-tasks.md) - How-to guides for frequent development tasks
- [**11 - UI Components**](docs/11-ui-components.md) - shadcn/ui components (REQUIRED for all UI elements)

### 🔐 Security & Auth
- [**07 - Authentication & Authorization**](docs/07-authentication.md) - Clerk setup and usage

### 🚀 Operations
- [**09 - Troubleshooting Guide**](docs/09-troubleshooting.md) - Solutions to common problems
- [**10 - Deployment Guide**](docs/10-deployment.md) - How to deploy to production

## Project Summary

**Link Shortener** is a modern web application built with:
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling and UI
- **Clerk** - User authentication
- **PostgreSQL (Neon)** - Database
- **Drizzle ORM** - Type-safe database queries

**Core Feature**: Convert long URLs into short, shareable links with click tracking.

## Before You Start

Make sure you have:
- [ ] Read [Setup Instructions](docs/02-setup-instructions.md)
- [ ] Installed all dependencies
- [ ] Set up environment variables
- [ ] Connected to the database
- [ ] Dev server running successfully

## Development Workflow

1. **Understand the Feature**: Read relevant files in `/docs` **before any code generation**
2. **Plan Your Changes**: Review architecture and guidelines
3. **Implement**: Follow code style in [Development Guidelines](docs/06-development-guidelines.md)
4. **Test**: Use [Common Tasks](docs/08-common-tasks.md) and [Troubleshooting](docs/09-troubleshooting.md)
5. **Deploy**: Follow [Deployment Guide](docs/10-deployment.md)

## Key Commands

```bash
# Development
npm run dev          # Start dev server on port 3000
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Check code quality

# Database
npx drizzle-kit push:pg     # Apply schema changes
npx drizzle-kit generate:pg # Create migration files
```

## Project Structure

```
linkshortenerproject/
├── app/
│   ├── api/         # API route handlers
│   ├── components/  # React components
│   ├── layout.tsx   # Root layout (Clerk provider)
│   └── page.tsx     # Home page
├── db/
│   ├── schema.ts    # Database schema (Drizzle ORM)
│   └── index.ts     # Database client
├── lib/
│   └── utils.ts     # Utility functions
├── docs/            # Detailed documentation
└── public/          # Static files
```

## FAQ

**Q: How do I create a new API endpoint?**
A: See [Common Tasks > Adding a New API Endpoint](docs/08-common-tasks.md#adding-a-new-api-endpoint)

**Q: How do I add to the database schema?**
A: See [Common Tasks > Creating a New Database Table](docs/08-common-tasks.md#creating-a-new-database-table)

**Q: How does authentication work?**
A: See [Authentication & Authorization](docs/07-authentication.md)

**Q: How do I deploy to production?**
A: See [Deployment Guide](docs/10-deployment.md)

**Q: What should I do if I encounter an error?**
A: Check [Troubleshooting Guide](docs/09-troubleshooting.md)

## Important Notes

### Environment Variables
- Keep `.env.local` out of version control
- Never commit secrets to git
- Use `.env.example` for template
- Production requires separate `.env.production.local`

### Database
- Always back up before major changes
- Test migrations in development first
- Use `npx drizzle-kit push:pg` to apply schema changes
- Never manually modify production database

### Authentication
- Clerk handles all authentication
- Users must sign in to create links
- Links are associated with user ID
- Test with multiple user accounts

### UI Components
- **ALWAYS use shadcn/ui components** - Never create custom UI elements
- Install components with `npx shadcn@latest add [component-name]`
- Customize using Tailwind classes and variants
- See [UI Components Guide](docs/11-ui-components.md) for details

### Security
- Validate all user inputs
- Check authorization before data access
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Keep dependencies updated

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Getting Help
1. Check [Troubleshooting Guide](docs/09-troubleshooting.md)
2. Search documentation
3. Review [Common Tasks](docs/08-common-tasks.md)
4. Check error logs and console output

## Contributing

When making changes:
1. Create a feature branch
2. Make changes following [Development Guidelines](docs/06-development-guidelines.md)
3. Test thoroughly
4. Update relevant documentation
5. Create pull request

## Version Information

- **Next.js**: 16.1.6
- **React**: 19.2.3
- **Node.js**: 18+ required
- **TypeScript**: 5.0+

---

**Last Updated**: March 4, 2026

For detailed information, please refer to the specific documentation files in the `/docs` directory.
