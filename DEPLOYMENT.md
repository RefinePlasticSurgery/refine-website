# Production Deployment Guide

## Overview
This guide covers deploying the Refine Plastic & Aesthetic Surgery Centre website to production with security best practices.

## Pre-Deployment Checklist

### 1. Code Review
- [ ] All fixes from code review are implemented
- [ ] No console.log statements in production code
- [ ] No hardcoded credentials or API keys
- [ ] All environment variables are configured
- [ ] Build passes without warnings

### 2. Security
- [ ] VITE_SUPABASE_URL is set correctly
- [ ] VITE_SUPABASE_ANON_KEY is set from secure vault
- [ ] VITE_WHATSAPP_NUMBER is configured
- [ ] VITE_SENTRY_DSN is set for error tracking
- [ ] .env.production is NOT committed to git
- [ ] Rate limiting configured in Edge Function
- [ ] CORS origins restricted to your domain

### 3. Testing
- [ ] All pages load without errors
- [ ] Contact form submission works end-to-end
- [ ] Error boundaries catch and report errors
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed
- [ ] Lighthouse audit score > 90

### 4. Performance
- [ ] Bundle size optimized
- [ ] Images optimized and lazy-loaded
- [ ] CSS tree-shaking enabled
- [ ] Code splitting implemented
- [ ] Caching headers configured

## Environment Variables

Create a `.env.production` file with these variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_NUMBER=+255793145167
VITE_SENTRY_DSN=https://your-key@sentry.io/your-project-id
DENO_ENV=production
```

**Important**: Store these in your hosting platform's environment variable settings, NOT in git.

## Building for Production

```bash
# Install dependencies
bun install

# Run linting and type checks
bun run lint

# Build the application
bun run build

# Preview the build locally
bun run preview
```

## Hosting Platform Setup

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables in project settings
3. Configure build settings:
   - Build Command: `bun run build`
   - Output Directory: `dist`
4. Deploy

### Netlify

1. Connect GitHub repository
2. Add `netlify.toml`:
```toml
[build]
  command = "bun run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[headers]
  [[headers.values]]
    key = "Content-Security-Policy"
    value = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:;"
```

3. Set environment variables in Netlify UI
4. Deploy

### Self-Hosted (VPS/Dedicated Server)

1. Install Node.js or use Docker
2. Clone repository
3. Set environment variables
4. Build: `bun run build`
5. Serve with nginx/Apache
6. Setup SSL certificate (Let's Encrypt)

Example nginx config:
```nginx
server {
    listen 443 ssl http2;
    server_name refineplasticsurgerytz.com www.refineplasticsurgerytz.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment Verification

### 1. Functionality
- [ ] Home page loads without errors
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] WhatsApp button opens WhatsApp correctly
- [ ] Emails are received by admin

### 2. Performance
- [ ] Lighthouse scores verified
- [ ] Core Web Vitals are good
- [ ] Load time < 3 seconds

### 3. Security
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] CORS headers are correct
- [ ] No console errors
- [ ] Sentry is capturing errors

### 4. Monitoring
- [ ] Sentry dashboard shows no errors
- [ ] Google Analytics (if enabled) tracking events
- [ ] Uptime monitoring active

## Rollback Plan

If issues occur in production:

1. Revert to previous deployment
2. Check Sentry for error details
3. Review deployment logs
4. Fix issues locally
5. Test thoroughly before re-deployment

## Ongoing Maintenance

### Daily
- Monitor Sentry dashboard for errors
- Check uptime monitoring alerts
- Review error logs

### Weekly
- Update dependencies: `bun update`
- Review security advisories: `bun audit`
- Check backup status

### Monthly
- Full security audit
- Performance optimization review
- User feedback analysis

### Quarterly
- Penetration testing
- Disaster recovery drill
- Access reviews

## Monitoring & Alerts

### Sentry Configuration
1. Go to sentry.io
2. Create alerts for:
   - Error rate > 1%
   - New issue types
   - User-facing errors
3. Set up notifications in Slack

### Uptime Monitoring
Use services like:
- UptimeRobot (free tier available)
- Pingdom
- Datadog

Configure alerts for:
- Site downtime
- API response time > 2s
- Certificate expiration

## Support & Contact

For deployment issues:
- Check deployment logs
- Review Sentry errors
- Contact hosting platform support
- Create GitHub issue with details

## Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [React Performance Guide](https://react.dev/learn/render-optimization)
- [Security Best Practices](./SECURITY.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: February 2, 2026
**Status**: Production Ready
