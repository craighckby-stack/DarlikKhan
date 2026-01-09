# GitHub and Vercel Deployment Guide

This guide will walk you through deploying your Self-Evolving AI to a production environment.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier is fine)
- ✅ GitHub Personal Access Token with `repo` and `workflow` scopes
- ✅ Google Gemini API Key

## 🐙 Step 1: Create a New GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Enter repository name (e.g., `self-evolving-ai`)
3. Make it **Private** or **Public** based on your preference
4. **Do NOT** initialize with README, .gitignore, or license (we'll use existing files)
5. Click **"Create repository"**

### Option B: Using GitHub CLI

```bash
# Install GitHub CLI if you haven't
# Mac: brew install gh
# Linux: sudo apt install gh
# Windows: winget install --id GitHub.cli

# Login
gh auth login

# Create repository
gh repo create self-evolving-ai --private
```

## 📤 Step 2: Push Code to GitHub

Initialize Git and push your code:

```bash
# Navigate to your project directory
cd /home/z/my-project

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Self-Evolving AI with Knowledge Base"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/self-evolving-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

## ⚙️ Step 3: Configure Environment Variables in Vercel

Since we can't commit the `.env` file to GitHub, we'll add the environment variables in Vercel:

### 3a. Deploy to Vercel First

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Import your `self-evolving-ai` repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (or `bun run build`)
   - **Output Directory**: `.next`
5. Click **"Deploy"**

### 3b. Add Environment Variables

1. Go to your project in Vercel: https://vercel.com/dashboard
2. Click on your `self-evolving-ai` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `GITHUB_TOKEN` | `ghp_your_token_here` | Production, Preview, Development |
| `GEMINI_API_KEY` | `your_gemini_key_here` | Production, Preview, Development |
| `DATABASE_URL` | `file:/home/z/my-project/db/custom.db` | Production, Preview, Development |

5. Click **"Save"**

### 3c. Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **"Redeploy"**

## 🔁 Step 4: Configure Auto-Reload

For the self-evolution to work with auto-reload, you need GitHub Actions (or Vercel builds) to trigger properly.

### Option A: Vercel (Recommended - Already Configured)

Vercel automatically builds on every push to GitHub. This is already set up!

### Option B: GitHub Actions

If you prefer GitHub Actions, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚀 Step 5: Activate the System

1. Open your live URL (e.g., `https://self-evolving-ai.vercel.app`)
2. Configure the system in the right sidebar:
   - **Repo Owner**: Your GitHub username
   - **Repo Name**: `self-evolving-ai`
   - **Branch**: `main`
3. Click **"Save System State"**
4. Click **"Knowledge Base"** tab
5. Sync some repositories (start with smaller ones like `openai/tiktoken`)
6. Click **"ENGAGE LOOP"** to start evolution

## 📊 Step 6: Monitor Evolution

Watch the evolution cycle:

1. **Logs Panel**: Shows real-time progress
2. **Status Bar**: Shows current cycle, builder status, deployment progress
3. **Vercel Dashboard**: Check build logs for any errors
4. **GitHub Repository**: See commits created by the AI

## 🔐 Security Best Practices

### 1. Never Commit Secrets

Ensure `.env` is in `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
```

### 2. Use Different Tokens for Production

Consider creating separate tokens:
- One for development
- One for production

This way, if development token is compromised, production remains secure.

### 3. Rotate Tokens Regularly

Update your GitHub token every 90 days:
1. Go to https://github.com/settings/tokens
2. Delete old token
3. Create new token
4. Update in Vercel environment variables

### 4. Limit Token Scope

Use the minimum required scopes:
- ✅ `repo` - Only if you need full control
- ✅ `workflow` - For GitHub Actions

## 🐛 Troubleshooting Deployment

### Build Failed in Vercel

1. Check the build logs in Vercel dashboard
2. Look for specific error messages
3. Common issues:
   - **Missing dependencies**: Run `bun install` locally to verify
   - **TypeScript errors**: Run `bun run lint`
   - **Environment variables**: Ensure all are set in Vercel

### Environment Variables Not Working

1. Double-check variable names (case-sensitive)
2. Verify values don't have extra spaces
3. Redeploy after adding variables

### GitHub Token Permissions Error

1. Ensure token has `repo` and `workflow` scopes
2. Token should be created at https://github.com/settings/tokens
3. Verify token is not expired

### Deployment Auto-Reload Not Working

1. Check that GitHub Check Runs are enabled in your repository settings
2. Verify Vercel is connected to GitHub correctly
3. Check deployment monitoring in the app logs

## 📈 Scaling Considerations

### Database (SQLite)

For small projects, SQLite is fine. For larger scale:

1. **Add PostgreSQL**: Change `DATABASE_URL` to a PostgreSQL connection string
2. **Update Prisma Schema**: Change `provider = "sqlite"` to `provider = "postgresql"`
3. **Run migrations**:
   ```bash
   bun run db:migrate
   ```

### Rate Limiting

GitHub API has rate limits:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

To handle this:
- Sync repositories in batches
- Implement retry logic with exponential backoff
- Use GitHub App instead of Personal Access Token for higher limits

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] GitHub token has correct permissions
- [ ] Gemini API key is valid
- [ ] Database schema is pushed
- [ ] Repositories are seeded (`bun run db:seed`)
- [ ] Build succeeds in Vercel
- [ ] Application loads correctly
- [ ] Can upload documents
- [ ] Can sync repositories
- [ ] Configuration saves correctly
- [ ] Evolution loop starts and stops

## 📚 Next Steps

1. **Monitor the first few evolution cycles** closely
2. **Start with a test branch** before using `main`
3. **Set up alerts** for build failures
4. **Backup your repository** regularly
5. **Document any issues** you encounter

## 🆘 Getting Help

### Common Issues

- **Build fails**: Check Vercel build logs
- **Token errors**: Verify GitHub token scopes
- **API errors**: Check Gemini API key and quota
- **Database errors**: Ensure schema is pushed

### Resources

- Vercel Docs: https://vercel.com/docs
- GitHub API Docs: https://docs.github.com/en/rest
- Gemini API Docs: https://ai.google.dev/docs
- Next.js Docs: https://nextjs.org/docs

---

**Ready to deploy?** Follow this guide and your Self-Evolving AI will be live in minutes! 🚀
