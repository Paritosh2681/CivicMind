# GitHub Deployment Guide for CivicMind

## Prerequisites
- Git installed on your machine
- GitHub account
- Node.js 18+ installed

## Setup Instructions

### Step 1: Initialize Git Repository (if not already done)
```bash
cd "d:\Paritosh Codes and Projects\CivicMind"
git init
git add .
git commit -m "Initial commit: CivicMind AI Election Assistant"
```

### Step 2: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository named `CivicMind` (or your preferred name)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 3: Add Remote and Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/CivicMind.git
git branch -M main
git push -u origin main
```

### Step 4: Environment Variables Setup
Your production environment variables are **NOT** included in this repository for security.

You must set them up in your deployment platform:

#### For Vercel (Recommended):
1. Go to [Vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Set Environment Variables in Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `TAVILY_API_KEY`
4. Deploy

#### For Other Platforms (AWS, Azure, Railway, etc.):
- Copy values from your local `.env.local` file
- Add them to your platform's environment variable settings
- Reference the `.env.example` file for required variables

### Step 5: Local Development Setup
When cloning the repository on another machine:

```bash
git clone https://github.com/YOUR_USERNAME/CivicMind.git
cd CivicMind
npm install
cp .env.example .env.local
# Edit .env.local with your actual API keys
npm run dev
```

## Important Security Notes
✅ `.env.local` is in `.gitignore` - never committed to Git
✅ `.env.example` shows required variables without sensitive values
✅ Never share or commit `.env.local`, `.env`, or any file with actual API keys

## API Keys Setup
Before deploying, ensure you have:
1. **Supabase Project** - Get URL and Anon Key from project settings
2. **Google Gemini API** - Get key from Google AI Studio
3. **Tavily Search API** - Get key from Tavily dashboard

## Troubleshooting
- **Build fails on deployment**: Ensure all environment variables are set
- **Authentication not working**: Verify Supabase Google OAuth provider is enabled
- **API errors**: Check that API keys are valid and have required permissions

## Post-Deployment
After deployment, test:
1. Landing page loads at `/`
2. Google OAuth login works at `/auth`
3. Chat functionality works at `/chat` (after login)
4. About page accessible at `/about`

## Features Included
✅ AI-powered election education chatbot
✅ Real-time web search augmentation (Tavily)
✅ Google Gemini 1.5 Flash for responses
✅ Supabase authentication & database
✅ Chat history persistence
✅ Indian flag tricolor design
✅ Responsive mobile-friendly UI
