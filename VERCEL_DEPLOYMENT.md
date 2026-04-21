# Vercel Deployment Guide for CivicMind

## ✅ Your Project is Ready for Vercel!

CivicMind is fully configured for deployment on Vercel. Follow these steps to deploy your application in minutes.

---

## Step 1: Sign Up on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

---

## Step 2: Import Your GitHub Repository

1. After signing in, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Paste your repository URL: `https://github.com/YOUR_USERNAME/CivicMind`
4. Click **"Import"**

---

## Step 3: Configure Environment Variables

1. You'll see a form with the title **"Configure Project"**
2. Scroll to **"Environment Variables"** section
3. Add these 4 variables:

### Variables to Add:

**1. NEXT_PUBLIC_SUPABASE_URL** (Public)
```
Value: https://your-project.supabase.co
```
Get this from your Supabase project settings → API

**2. NEXT_PUBLIC_SUPABASE_ANON_KEY** (Public)
```
Value: eyJhbGc....... (your Supabase anon key)
```
Get this from Supabase → Settings → API Keys → `anon` key

**3. GEMINI_API_KEY** (Secret)
```
Value: AIzaSy....... (your Google Gemini API key)
```
Get this from [ai.google.dev](https://ai.google.dev/tutorials/setup)

**4. TAVILY_API_KEY** (Secret)
```
Value: tvly-.......  (your Tavily API key)
```
Get this from [tavily.com](https://tavily.com)

---

## Step 4: Deploy!

1. Click **"Deploy"** button
2. Wait for Vercel to build and deploy (usually 2-5 minutes)
3. ✨ Your app will be live at `https://civicmind-YOUR_USERNAME.vercel.app`

---

## After Deployment

### Test Your Live Site:
1. Visit your Vercel URL
2. Click "Login" → "Continue with Google"
3. Sign in with your Google account
4. Try asking a question in the chat
5. Verify everything works!

### Update Custom Domain (Optional):
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration steps

---

## Automatic Deployments

**Every time you push to GitHub:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will **automatically rebuild and deploy** your changes! 🚀

---

## Troubleshooting

### Build Fails
- Check if all 4 environment variables are set
- Look at build logs in Vercel dashboard (Settings → Deployments)
- Common error: Missing API keys

### Authentication Not Working
- Verify Supabase Google OAuth provider is enabled
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Chat API Returns 500 Error
- Verify `GEMINI_API_KEY` and `TAVILY_API_KEY` are set
- Check that keys are valid and active

### Build Timeout
- Vercel timeout is 60 seconds
- This should be enough for Next.js build
- If timeout occurs, check for heavy dependencies

---

## Monitor Your Deployment

### View Logs:
1. Go to Vercel dashboard
2. Select your project
3. Click **"Deployments"**
4. Click the latest deployment to see logs

### Check Analytics:
1. Click **"Analytics"** tab
2. View request counts, performance, etc.

### Rollback:
1. If new deployment breaks something
2. Go to Deployments
3. Click three dots on previous working deployment
4. Select "Promote to Production"

---

## Environment Variables Reference

All variables are already defined in `vercel.json` for your reference.

**Public Variables** (visible in browser):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Secret Variables** (server-only):
- `GEMINI_API_KEY`
- `TAVILY_API_KEY`

---

## What Gets Deployed

✅ All source code (app/, components/, lib/)
✅ Configuration files
✅ Static assets (public/)
✅ Node modules (installed during build)

❌ `.env.local` (not included - security!)
❌ `.next/` (rebuilt on each deploy)
❌ `node_modules/` (installed fresh)

---

## Performance Tips

1. **Images** - Already optimized with Next.js Image component
2. **Caching** - Vercel handles cache headers automatically
3. **Database** - Supabase handles scalability
4. **API Rate Limits** - Tavily has rate limits; add caching if needed

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs

---

**Your CivicMind application is production-ready! Deploy with confidence.** 🎉
