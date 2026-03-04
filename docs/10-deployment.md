# Deployment Guide

## Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All code is committed to git
- [ ] No linting errors: `npm run lint`
- [ ] TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] All tests pass (if applicable)
- [ ] Environment variables documented
- [ ] Database migrations applied and verified
- [ ] Database has backups enabled
- [ ] Error monitoring configured
- [ ] Security review completed

## Environment Variables for Production

Create `.env.production.local` or set in deployment platform:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_REDIRECT_URL=/

# Database
DATABASE_URL=postgresql://user:password@host:5432/production_db

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

**Important**: Use `_live_` Clerk keys, not test keys for production!

## Deployment Platforms

### Vercel (Recommended for Next.js)

#### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and branch

#### 2. Configure Project

1. **Project Name**: Enter project name
2. **Framework Preset**: Next.js (auto-detected)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Install Command**: `npm install` (default)

#### 3. Set Environment Variables

1. Go to **Settings > Environment Variables**
2. Add all production environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - etc.

#### 4. Deploy

Click **Deploy**. Vercel automatically:
- Installs dependencies
- Runs build process
- Deploys to CDN
- Provides deployed URL

#### 5. Domain Configuration

1. Go to **Settings > Domains**
2. Add your custom domain or use Vercel subdomain
3. Update Clerk redirect URLs to match deployment URL

#### 6. Continuous Deployment

After initial deployment:
- Push to main branch automatically triggers deployment
- Preview deployments for pull requests
- Automatic rollback on errors

---

### Other Platforms

#### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Set redirects for SPA (if needed)

#### AWS EC2

1. SSH into instance
2. Clone repository
3. Install Node.js and dependencies
4. Set environment variables
5. Run `npm run build`
6. Start with process manager (PM2):
```bash
npm install -g pm2
pm2 start "npm start" --name "link-shortener"
pm2 save
pm2 startup
```
7. Configure reverse proxy (Nginx)
8. Set up SSL with Let's Encrypt

#### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t link-shortener .
docker run -p 3000:3000 --env-file .env.production link-shortener
```

---

## Database for Production

### Neon PostgreSQL Setup

1. **Create Production Database**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Select region closest to users
   - Copy connection string to `DATABASE_URL`

2. **Enable Backups**
   - Neon automatically backs up hourly
   - Retention: 7 days free, longer with paid plan

3. **Run Migrations**
```bash
npx drizzle-kit push:pg
```

4. **Verify Connection**
```bash
npm run build
npm run start
# Test create link functionality
```

### Alternative Database Options

- **Railway**: Simple PostgreSQL hosting
- **Supabase**: PostgreSQL with authentication
- **AWS RDS**: Managed PostgreSQL service
- **DigitalOcean**: Managed databases

---

## SSL/TLS Certificate

### Auto with Vercel

Vercel automatically provisions SSL certificates for:
- Vercel domain: `yourname.vercel.app`
- Custom domains added in Vercel dashboard

### Self-Hosted with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Renew automatically (cron job)
0 0 * * * certbot renew --quiet
```

---

## Monitoring and Logging

### Error Tracking

Setup error monitoring service:

```typescript
// app/layout.tsx
import { Sentry } from "@sentry/nextjs"; // Or similar service

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Performance Monitoring

Monitor metrics:
- Page load time
- Database query time
- API response time
- Error rate
- Uptime

### Log Aggregation

Collect and analyze logs:
- Application logs
- Database query logs
- API request/response logs
- Error logs

---

## Database Backups

### Manual Backup (Neon)

1. Go to Neon dashboard
2. Navigate to project
3. Backups section
4. Download backup if needed

### Automated Backups

- Neon: 7-day retention (free), 12 months (paid)
- Enable point-in-time recovery in settings

### Restore from Backup

1. Create new branch from backup point
2. Verify data integrity
3. Promote branch to main if needed

---

## Scaling Considerations

### Horizontal Scaling

As traffic grows:

1. **CDN**: Vercel automatically uses CDN
2. **Database Connection Pooling**:
```env
DATABASE_URL=postgresql://...?sslmode=require
```
3. **Caching**: Implement Redis caching
4. **Rate Limiting**: Protect API endpoints

### Vertical Scaling

- Upgrade database plan
- Increase server resources
- Optimize images and assets

---

## Health Checks

Create health check endpoint:

```typescript
// app/api/health/route.ts
import { db } from "@/db";
import { links } from "@/db/schema";

export async function GET() {
  try {
    // Test database connection
    await db.select().from(links).limit(1);

    return Response.json({
      status: "healthy",
      timestamp: new Date(),
    });
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
```

Configure health checks in deployment platform.

---

## Rollback Procedure

### If Deployment Fails

**On Vercel**:
1. Go to Deployments
2. Find last successful deployment
3. Click three dots
4. Select "Promote to Production"

**With Git**:
```bash
git revert <commit-hash>
git push origin main
```

---

## Post-Deployment Verification

After deploying to production:

1. **Test Core Features**
   - Create short link
   - Verify redirect works
   - Test user authentication
   
2. **Check Errors**
   - Monitor error logs
   - Verify no 500 errors
   - Check database connectivity

3. **Performance**
   - Measure page load time
   - Check API response times
   - Monitor database performance

4. **Security**
   - Verify HTTPS working
   - Check Clerk authentication functional
   - Verify environment variables not exposed

5. **Analytics**
   - Setup tracking (if desired)
   - Monitor user activity
   - Track link creation rate

---

## Maintenance

### Regular Tasks

**Daily**:
- Monitor error rates
- Check application logs

**Weekly**:
- Review performance metrics
- Check database size
- Verify backups running

**Monthly**:
- Security patches
- Dependency updates
- Cost analysis

**Quarterly**:
- Full system audit
- Performance optimization review
- Capacity planning

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update major versions (requires review)
npm install package@latest
```

### Security Updates

```bash
# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Incident Response

### Process When Issues Occur

1. **Alert**: Monitoring detects issue
2. **Assess**: Check severity and impact
3. **Communicate**: Notify team/users if necessary
4. **Remediate**: Implement fix or rollback
5. **Review**: Post-incident analysis

### Common Production Issues

**Database Connection Lost**:
- Check database status
- Verify environment variables
- Restart application

**Memory Leak**:
- Check application logs
- Identify problematic code
- Deploy fix or rollback

**API Rate Limited**:
- Implement caching
- Add rate limiting protection
- Upgrade database

---

## Cost Optimization

### Monitor Costs

- **Vercel**: Usage-based pricing
- **Neon Database**: Pay-as-you-go
- **Other services**: Review billing regularly

### Reduce Costs

1. **Optimize database queries**
2. **Cache frequently accessed data**
3. **Use CDN for static assets**
4. **Right-size compute resources**
5. **Archive old data periodically**
