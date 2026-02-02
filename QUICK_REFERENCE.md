# Quick Reference Guide

## 🚀 Getting Started for Developers

### Clone & Install
```bash
git clone <YOUR_GIT_URL>
cd refine-website
bun install
cp .env.example .env.local
```

### Add Your Credentials to .env.local
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Run Locally
```bash
bun run dev          # Start dev server (http://localhost:8080)
bun run lint         # Check code quality
bun run build        # Build for production
bun run preview      # Preview production build
```

---

## 📁 Key Files

### Security & Configuration
- `.env.example` - Environment variables template
- `SECURITY.md` - Security documentation
- `src/integrations/sentry.ts` - Error tracking

### API & Data
- `supabase/functions/send-appointment-email/` - Email service
- `src/lib/validations.ts` - Form validation schemas
- `src/lib/procedures-data.ts` - Procedures content

### Main Components
- `src/App.tsx` - App setup & routing
- `src/components/Header.tsx` - Navigation
- `src/components/Contact.tsx` - Contact form
- `src/pages/` - Page components

---

## 🔐 Security Checklist

### Before Committing Code
- [ ] No console.log in production code
- [ ] No hardcoded API keys
- [ ] Types are defined (no `any`)
- [ ] Error handling is proper

### Before Deploying
- [ ] `bun run lint` passes
- [ ] `bun run build` succeeds
- [ ] Environment variables configured
- [ ] CORS origins restricted
- [ ] Sentry DSN set

---

## 🐛 Debugging

### Check Errors
```bash
# Run linting
bun run lint

# Type check
bun run build

# Preview locally
bun run preview

# Check Sentry dashboard
# https://sentry.io/your-project/
```

### Common Issues

**Build fails with missing env var**
- Add variable to `.env.production`
- Check `.env.example` for required variables
- See DEPLOYMENT.md

**Contact form not sending**
- Check Sentry dashboard for errors
- Verify Supabase credentials
- Verify Resend API key
- Check Edge Function logs

**Styling not working**
- Clear browser cache
- Rebuild: `bun run build`
- Check Tailwind config

---

## 📊 Performance

### Lighthouse Targets
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Check Locally
```bash
bun run preview
# Open browser DevTools -> Lighthouse -> Analyze page load
```

---

## 🚀 Deployment Quick Steps

### Step 1: Prepare
```bash
bun run lint    # ✓ No errors
bun run build   # ✓ Builds successfully
```

### Step 2: Deploy to Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Step 3: Configure
1. Add environment variables in Vercel dashboard
2. Set custom domain
3. Deploy

### Step 4: Verify
1. Visit site: https://yourdomain.com
2. Test contact form
3. Check Sentry dashboard
4. Verify emails send

---

## 📞 Error Messages

### "Missing required environment variables"
- Solution: Check `.env.example` and add all variables to `.env.local`

### "Origin not allowed"
- Solution: Check CORS configuration in `supabase/functions/send-appointment-email/`
- Add your domain to `ALLOWED_ORIGINS`

### "Too many requests"
- Rate limit hit: 5 requests per 60 seconds
- Wait and try again

### "Failed to send appointment request"
- Check Sentry for error details
- Verify Resend API key
- Check Supabase connectivity

---

## 🔗 Important Links

- **Supabase**: https://supabase.io/
- **Sentry**: https://sentry.io/
- **Resend**: https://resend.com/
- **Vercel**: https://vercel.com/
- **Tailwind**: https://tailwindcss.com/
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview & setup |
| `SECURITY.md` | Security best practices |
| `DEPLOYMENT.md` | Deployment instructions |
| `PRODUCTION_CHECKLIST.md` | Launch checklist |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |

---

## 🎯 Code Patterns

### Form Validation
```typescript
import { appointmentFormSchema } from '@/lib/validations';

const result = appointmentFormSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
}
```

### Error Handling
```typescript
try {
  await supabase.functions.invoke('send-appointment-email', { body: data });
} catch (error) {
  const errorDetails = getErrorDetails(error);
  toast({
    title: errorDetails.type,
    description: errorDetails.message,
    variant: "destructive",
  });
}
```

### Memoization
```typescript
const handleClick = useCallback((value: string) => {
  // ...
}, [dependency]);
```

---

## 🧪 Testing Locally

### Contact Form
1. Go to http://localhost:8080/contact
2. Fill form and submit
3. Check email (if Resend configured)
4. Check Sentry for any errors

### Error Handling
1. Open DevTools Console
2. Trigger an error (e.g., bad network)
3. Verify error boundary shows
4. Check Sentry captured it

### Performance
1. Open DevTools Lighthouse
2. Run audit
3. Verify scores > 90

---

## 🔄 Git Workflow

### Before Push
```bash
bun run lint    # ✓ No lint errors
bun run build   # ✓ No build errors
```

### Commit Message Format
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
chore: Update dependencies
```

---

## 📞 Getting Help

1. **For Code Issues**: Check code comments and documentation
2. **For Deployment**: See DEPLOYMENT.md
3. **For Security**: See SECURITY.md
4. **For Errors**: Check Sentry dashboard
5. **For Questions**: Contact team

---

## ✅ Sign-Off Checklist

Before considering the project "done":

- [ ] All code reviewed
- [ ] Security issues fixed
- [ ] Documentation complete
- [ ] Tests passing
- [ ] Lighthouse > 90
- [ ] Deployed to staging
- [ ] Staging testing complete
- [ ] Sentry configured
- [ ] Production environment ready
- [ ] Team trained on deployment

---

**Last Updated**: February 2, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
