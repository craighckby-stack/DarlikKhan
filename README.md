buggy as 

https://darlikkhan.space.z.ai

# 🤖 Self-Evolving AI with Knowledge Base

A production-ready Next.js application featuring an AI that autonomously improves its own code using a knowledge base populated from uploaded documents and external GitHub repositories (Google, DeepSeek, OpenAI, your repos, Z.ai repos).

## ✨ Features

- 🧠 **Self-Reflection Engine**: AI asks itself deep technical questions and makes informed decisions
- 🌳 **Knowledge Base System**: Learn from uploaded PDFs/DOCX and external repositories
- 🔄 **Auto-Evolution**: Mutates code, commits to GitHub, and auto-reloads after deployment
- 🔒 **Production Security**: Server-side API routes, no exposed tokens
- 📊 **16 Pre-Seeded Repositories**: Google, DeepSeek, OpenAI, Hugging Face, your repos, Z.ai repos

## 🚀 Quick Start

### 1. Configure Environment Variables

Edit `.env`:

```env
GITHUB_TOKEN=ghp_your_token_here
GEMINI_API_KEY=your_gemini_key_here
```

### 2. Initialize Database

```bash
bun run db:push
bun run db:seed
```

### 3. Run Development Server

```bash
bun run dev
```

Visit `http://localhost:3000`

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and usage guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - GitHub and Vercel deployment guide

## 🌳 Pre-Seeded Repositories

The system comes with 16 pre-configured repositories to learn from:

### Google
- `google/gemma-llm`
- `google/jax`
- `google/mediapipe`
- `tensorflow/tensorflow`

### DeepSeek
- `deepseek-ai/DeepSeek-V2`
- `deepseek-ai/DeepSeek-V3`
- `deepseek-ai/DeepSeek-Coder`
- `deepseek-ai/Janus`

### Your Repositories (Full Circle!)
- `craighckby-stack/ai-scaffold-`
- `craighckby-stack/evolution-engine`

### Z.ai
- `z/zai-web-dev-sdk`
- `z/zai-core`

### Others
- `openai/tiktoken`
- `huggingface/transformers`
- `facebookresearch/pytorch`
- `anthropics/anthropic-sdk-python`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Database**: Prisma (SQLite)
- **AI**: Google Gemini 2.0
- **API**: GitHub REST API
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Lucide icons)

## 📂 Project Structure

```
my-project/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Pre-seeded repositories
│   └── seed.ts            # TypeScript version
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── github/    # GitHub proxy API
│   │   │   ├── gemini/    # Gemini API
│   │   │   ├── documents/ # Document upload/management
│   │   │   ├── repos/     # Repository management
│   │   │   ├── repos/sync/ # Repository sync
│   │   │   └── knowledge/ # Knowledge base search
│   │   └── page.tsx      # Main application
│   └── lib/
│       ├── db.ts          # Prisma client
│       └── utils.ts      # Utilities
├── db/                   # SQLite database
├── .env                  # Environment variables
├── package.json
└── README.md
```

## 🔄 How It Works

```
AI Self-Reflection
    ↓
Technical Question Generated
    ↓
AI Answers Its Own Question
    ↓
Search Knowledge Base for Relevant Code
    ↓
Decision: Mutate Code? (YES/NO)
    ↓
[If YES] Select Random File
    ↓
AI Generates Optimized Code (using knowledge base)
    ↓
Commit to GitHub
    ↓
CI/CD Build (Vercel)
    ↓
Monitor Deployment
    ↓
Auto-Reload on Success
```

## 🎯 Usage

### 1. Evolution Tab
- Watch real-time evolution logs
- Start/stop the evolution loop
- Monitor deployment progress

### 2. Knowledge Base Tab
- Upload PDF/DOCX documents
- View uploaded documents
- Delete unwanted documents

### 3. Repositories Tab
- View pre-seeded repositories
- Sync repositories to knowledge base
- Add custom repositories
- Remove repositories

### Configuration Sidebar
- Set your GitHub repository details
- Save configuration
- View top knowledge sources

## ⚠️ Important Notes

- **The AI modifies its own code** - it can introduce bugs
- **Keep backups** - use GitHub's revert feature
- **Monitor closely** - especially in the beginning
- **Start on a test branch** - don't evolve `main` immediately
- **Rate limits** - GitHub API has limits, sync repos in batches

## 🔧 Customization

- **Evolution frequency**: Edit `setInterval` in `src/app/page.tsx`
- **AI model**: Edit model in `src/app/api/gemini/route.ts`
- **Pre-seeded repos**: Edit `prisma/seed.js`
- **File size limits**: Edit `src/app/api/repos/sync/route.ts`

## 📊 Knowledge Base Statistics

- **Total Documents**: Shown in status bar
- **Top Sources**: Displayed in right sidebar
- **By Language**: Available via `/api/knowledge?stats=true`
- **By Repository**: Available via `/api/knowledge?stats=true`

## 🆘 Troubleshooting

### GitHub Token Issues
- Ensure token has `repo` and `workflow` scopes
- Verify token is not expired
- Check environment variables

### Gemini API Issues
- Verify API key is valid
- Check quota limits
- Ensure model is enabled

### Deployment Issues
- Check Vercel build logs
- Verify environment variables
- Ensure GitHub Actions are working

### Database Issues
- Run `bun run db:push` to sync schema
- Run `bun run db:seed` to add repositories
- Check SQLite database file permissions

## 📄 License

Use responsibly. This is an experimental system designed for research and learning.

## 🤝 Contributing

This is a personal project, but feel free to fork and experiment!

## 📞 Support

For detailed setup and deployment instructions, see:
- [SETUP.md](./SETUP.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Built with ❤️ using Next.js, Google Gemini, and GitHub API**
