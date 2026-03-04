# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Clerk account for authentication
- Neon PostgreSQL database account

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`.

### 2. Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database

# Optional: Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_REDIRECT_URL=/
```

### 3. Database Setup with Drizzle

Initialize the database schema:

```bash
npx drizzle-kit push:pg
```

This creates tables based on the schema defined in `db/schema.ts`.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Verification Checklist

- [ ] Dependencies installed successfully (`npm install`)
- [ ] Environment variables configured in `.env.local`
- [ ] Database connected and tables created
- [ ] Dev server running without errors
- [ ] Can access `http://localhost:3000`
- [ ] Clerk authentication loads correctly
- [ ] No TypeScript errors in the console

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows PowerShell:
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct in `.env.local`
- Ensure Neon database is active and accessible
- Check network connectivity

### Clerk Authentication Not Loading
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
- Ensure `CLERK_SECRET_KEY` is set
- Check Clerk dashboard for API keys

## Development Workflow

1. Run `npm run dev` to start the development server
2. Make changes to TypeScript/React files
3. Changes hot-reload automatically
4. Use `npm run lint` to check for code quality issues
5. Test in the browser
