# Self-Evolving AI with Knowledge Base

A production-ready Next.js application featuring an AI that autonomously improves its own code using a knowledge base populated from:
- **Uploaded documents** (PDF, DOCX)
- **External repositories** (pre-seeded with Google, DeepSeek, OpenAI, Hugging Face, your repos, Z.ai repos)

## 🚀 Features

### 1. Self-Evolution Engine
- AI asks itself deep technical questions
- Makes informed decisions about code improvements
- Mutates its own codebase via GitHub API
- Auto-reloads after successful deployment

### 2. Knowledge Base System
- **Document Upload**: Drag & drop PDFs and DOCX files
- **Repository Sync**: Fetch code from external GitHub repositories
- **Smart Search**: Retrieve relevant context for AI decision-making
- **Pre-defined Repos**: Google, DeepSeek, OpenAI, Hugging Face, your repos, Z.ai

### 3. Production Security
- Server-side API routes (tokens never exposed to browser)
- Environment variables for sensitive credentials
- Proper error handling and logging

## 📋 Prerequisites

### 1. GitHub Repository
- Your code must be hosted on GitHub
- Connected to a CI/CD platform (Vercel recommended)
- Repository must have GitHub Check Runs enabled

### 2. GitHub Personal Access Token
Create at https://github.com/settings/tokens

**Required scopes:**
- ✅ `repo` - Full control of private repositories
- ✅ `workflow` - Update GitHub Actions workflows

### 3. Google Gemini API Key
Get a key at: https://ai.google.dev/

## 🛠️ Setup Instructions

### Step 1: Configure Environment Variables

Create or edit `.env` file in the project root:

```env
# Database (already configured)
DATABASE_URL=file:/home/z/my-project/db/custom.db

# GitHub Personal Access Token
# Create at: https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_actual_token_here

# Gemini API Key
# Get from: https://ai.google.dev/
GEMINI_API_KEY=your_actual_gemini_key_here
```

### Step 2: Initialize Database

```bash
# Push schema to database
bun run db:push

# Seed with pre-defined repositories
bun run db:seed
```

This adds the following repositories to your knowledge base:
- `google/gemma-llm` - Google's Gemma LLM
- `google/jax` - JAX numerical computing
- `tensorflow/tensorflow` - TensorFlow framework
- `google/mediapipe` - MediaPipe ML solutions
- `deepseek-ai/DeepSeek-V2`, `DeepSeek-V3`, `DeepSeek-Coder`, `Janus`
- `craighckby-stack/ai-scaffold-`, `craighckby-stack/evolution-engine` (your repos!)
- `z/zai-web-dev-sdk`, `z/zai-core` (Z.ai repos)
- `openai/tiktoken`
- `huggingface/transformers`
- `facebookresearch/pytorch`
- `anthropics/anthropic-sdk-python`

### Step 3: Run Development Server

```bash
bun run dev
```

Visit `http://localhost:3000`

### Step 4: Configure the System

1. In the right sidebar, enter:
   - **Repo Owner**: Your GitHub username
   - **Repo Name**: The repository name (where this code is hosted)
   - **Branch**: `main` (or your default branch)

2. Click **"Save System State"**

3. Click **"ENGAGE LOOP"** to start self-evolution

## 🌳 Knowledge Base Usage

### Upload Documents

1. Click the **"Knowledge Base"** tab
2. Click **"Choose Files"** and select PDF/DOCX files
3. Files are stored in the database and used as reference

### Sync Repositories

1. Click the **"Repositories"** tab
2. You'll see 16 pre-seeded repositories
3. Click **"Sync"** next to any repository to:
   - Fetch its file tree from GitHub
   - Download up to 50 relevant code files
   - Add them to the knowledge base

### Add Custom Repositories

1. Click **"Add Repo"**
2. Enter the repository owner and name
3. Click OK to add to the list
4. Click **"Sync"** to fetch the code

## 🔄 How It Works

```
1. AI Self-Reflection
   ↓
2. Technical Question Generated
   ↓
3. AI Answers Its Own Question
   ↓
4. Decision: Mutate Code? (YES/NO)
   ↓
5. [If YES] Select Random Code File
   ↓
6. AI Searches Knowledge Base for Relevant Context
   ↓
7. AI Generates Optimized Code (using knowledge base examples)
   ↓
8. Commit to GitHub
   ↓
9. GitHub Actions/Vercel Builds
   ↓
10. Monitor Deployment Status
   ↓
11. On Success: Auto-Reload with New Code
```

## 📊 Evolution Cycle Timeline

Each cycle takes approximately **1-3 minutes**:

- **Question Phase**: ~2 seconds
- **Answer Phase**: ~2 seconds
- **Decision Phase**: ~2 seconds
- **Code Selection**: <1 second
- **Knowledge Base Search**: ~1-2 seconds
- **AI Mutation**: ~5-10 seconds
- **GitHub Commit**: ~2 seconds
- **Deployment**: 30-120 seconds (depends on CI/CD pipeline)

## ⚠️ Important Warnings

### Risk of Breaking Changes

Since the AI modifies **its own code**, it may occasionally introduce bugs:
- **Syntax Errors**: Will cause the build to fail
- **Logic Errors**: May cause runtime errors
- **Broken UI**: May crash the interface

### Recovery Steps

1. **If the build fails:**
   - Check your GitHub Actions/Vercel logs
   - Identify the problematic commit
   - Revert the commit in GitHub

2. **If the page crashes:**
   - Go to GitHub directly
   - Revert the last commit
   - Wait for redeploy

### Safety Recommendations

1. **Monitor logs closely** - especially in the beginning
2. **Keep backups** - or use GitHub's revert feature
3. **Start on a test branch** - don't evolve `main` immediately
4. **Set up alerts** - get notified on build failures

## 🔧 Customization

### Adjust Evolution Frequency

Edit the interval in `src/app/page.tsx`:

```typescript
// Default: 60 seconds (1 minute)
geminiLoopRef.current = setInterval(geminiSelfDialogue, 60000);
```

### Change AI Model

Edit the model in `src/app/api/gemini/route.ts`:

```typescript
// Available options:
// - gemini-2.0-flash-exp (current, recommended)
// - gemini-1.5-pro
// - gemini-1.5-flash
const model = "gemini-2.0-flash-exp";
```

### Filter Which Repos Are Synced

Edit `prisma/seed.js` to add/remove repositories.

### Adjust File Size Limits

Edit the sync logic in `src/app/api/repos/sync/route.ts`:

```typescript
// Current: 100KB max per file
f.size < 100000

// Current: 50 files max per sync
const maxFiles = 50;
```

## 📈 Monitoring

### Local Development

```bash
bun run dev
```

Watch the console logs in your browser's DevTools.

### Production

The application displays logs in real-time in the main panel:
- 🟢 **Green**: Success
- 🔴 **Red**: Error
- 🔵 **Cyan**: AI questions
- 🟠 **Orange**: Evolution events
- 🟣 **Purple**: AI reflections
- 🟡 **Yellow**: Warnings

### Knowledge Base Statistics

The status bar shows the total number of documents in your knowledge base, and the right panel displays top knowledge sources.

## 🚫 Limitations

1. **Cannot create new files** - only modifies existing ones
2. **File size limit** - 100KB per file (configurable)
3. **Dependencies** - won't install new packages
4. **Complex migrations** - won't refactor entire architecture
5. **GitHub API rate limits** - may need to sync repos in batches

## 🆘 Troubleshooting

### "GitHub token not configured"
- Add `GITHUB_TOKEN` to your `.env` file
- Restart the development server

### "Gemini API key not configured"
- Add `GEMINI_API_KEY` to your `.env` file
- Restart the development server

### "No eligible files found for mutation"
- Check that your repository has .js, .jsx, .ts, or .tsx files
- Ensure files are smaller than 60KB (or increase the limit)

### "Deployment timed out"
- Your CI/CD pipeline is taking longer than 10 minutes
- Check GitHub Actions/Vercel logs for bottlenecks
- Increase the `maxAttempts` in `monitorDeployment()`

### "Repository sync failed"
- Check that the repository exists and is public
- Ensure your GitHub token has `repo` scope
- Verify the branch name is correct

### localStorage errors
- Fixed in the latest version - page should load correctly now

## 📄 Pre-Configured Repositories

The system comes pre-seeded with these learning sources:

### Google
- **gemma-llm** - Google Gemma LLM implementation
- **jax** - JAX numerical computing library
- **mediapipe** - MediaPipe ML solutions

### TensorFlow
- **tensorflow** - TensorFlow machine learning framework

### DeepSeek
- **DeepSeek-V2** - DeepSeek V2 LLM
- **DeepSeek-V3** - DeepSeek V3 LLM
- **DeepSeek-Coder** - DeepSeek Coder for code generation
- **Janus** - Janus multimodal AI

### Your Repositories
- **ai-scaffold-** - Your personal AI scaffold project
- **evolution-engine** - Your personal evolution engine (example)

### Z.ai
- **zai-web-dev-sdk** - Z.ai Web Development SDK
- **zai-core** - Z.ai Core System (example)

### Other Major Projects
- **openai/tiktoken** - OpenAI tokenizer library
- **huggingface/transformers** - Hugging Face Transformers
- **facebookresearch/pytorch** - PyTorch deep learning framework
- **anthropics/anthropic-sdk-python** - Anthropic SDK

## 🎯 Next Steps

1. **Deploy to Vercel** - See DEPLOYMENT.md
2. **Sync repositories** - Expand the knowledge base
3. **Upload your docs** - Add PDFs/DOCX with your requirements
4. **Start evolution** - Watch the AI learn and improve!

## 📄 License

Use responsibly. This is an experimental system designed for research and learning.

---

**Built with:**
- Next.js 15 (App Router)
- TypeScript 5
- Google Gemini 2.0
- GitHub API
- Prisma (SQLite)
- Tailwind CSS
- shadcn/ui (Lucide icons)
