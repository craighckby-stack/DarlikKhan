# Darlik Khan - Self-Evolving AI
## 🎯 What Was Done

### 1. Hard-coded GitHub Configuration ✅
- **Repository**: `craighckby-stack/DarlikKhan`
- **Branch**: `main`
- **Token**: Your GitHub token is now in `.env` (no need to enter it!)

### 2. Simplified UI ✅
- **Removed**: GitHub configuration inputs (repo owner, repo name, branch)
- **Added**: "Setup" tab with system configuration
- **Added**: "Pull Latest" button in header to sync with remote

### 3. Only Required Input ✅
- **Gemini API Key**: Just enter your Google Gemini API key and save it
- That's all you need to start!

### 4. Pre-seeded Repositories ✅
All 16 repositories are already seeded in the database:
- Google (gemma-llm, jax, mediapipe, tensorflow)
- DeepSeek (DeepSeek-V2, DeepSeek-V3, DeepSeek-Coder, Janus)
- Your Repos (ai-scaffold-, evolution-engine)
- Z.ai (zai-web-dev-sdk, zai-core)
- Others (openai/tiktoken, huggingface/transformers, facebookresearch/pytorch, anthropic/anthropic-sdk-python)

---

## 🚀 Quick Start Guide

### Step 1: Enter Gemini API Key
1. Click "Setup" tab (rightmost)
2. Enter your Google Gemini API key
3. Click "Save API Key"
4. Your key is saved for future visits

### Step 2: Sync Repositories (Optional but Recommended)
1. Click "Repositories" tab
2. Click "Sync" button next to any repository
3. Wait for files to be added to knowledge base
4. Repeat for multiple repos

### Step 3: Start Evolution
1. Click "Engage Loop" button in header
2. Watch the AI:
   - Ask itself technical questions
   - Use knowledge base for context
   - Mutate code and commit to GitHub
   - Monitor deployment
   - Auto-reload on success

---

## 🔧 Features

### Evolution Tab
- Real-time logs of AI self-reflection
- Watch cycle counter
- See current status (Idle, Analyzing, Mutating, Committing, Deploying)
- Color-coded messages for easy reading

### Knowledge Base Tab
- Upload PDF/DOCX files
- View and delete uploaded documents
- Documents are used as reference when evolving code

### Repositories Tab
- See all 16 pre-seeded repositories
- Sync repositories to fetch their code
- Add or remove custom repositories

### Setup Tab
- View hard-coded GitHub configuration
- Enter and save Gemini API key
- Pull latest changes from remote

---

## 💡 Important Notes

### Pull Latest Button
If you deploy changes to GitHub from another computer, use the **"Pull Latest"** button to:
- Fetch latest commit from GitHub
- Reload the application with updated code
- This ensures you're always working with the latest version

### GitHub Token
Your token is already configured in `.env`:
- No need to enter it manually
- GitHub API operations are handled securely
- Token is never exposed to the browser

---

## 📚 Documentation

- `SETUP.md` - Complete setup and configuration guide
- `DEPLOYMENT.md` - GitHub and Vercel deployment instructions

---

**Ready to evolve!** Just enter your Gemini API Key and click "Engage Loop"!
