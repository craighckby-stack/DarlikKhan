import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PREDEFINED_REPOS = [
  // Google Repositories
  {
    repoOwner: 'google',
    repoName: 'gemma-llm',
    branch: 'main',
    tags: 'llm,ai,google',
    description: 'Google Gemma LLM implementation'
  },
  {
    repoOwner: 'google',
    repoName: 'jax',
    branch: 'main',
    tags: 'ml,framework,google',
    description: 'JAX numerical computing library'
  },
  {
    repoOwner: 'tensorflow',
    repoName: 'tensorflow',
    branch: 'master',
    tags: 'ml,framework,google',
    description: 'TensorFlow machine learning framework'
  },
  {
    repoOwner: 'google',
    repoName: 'mediapipe',
    branch: 'master',
    tags: 'ml,cv,google',
    description: 'MediaPipe ML solutions'
  },

  // DeepSeek Repositories
  {
    repoOwner: 'deepseek-ai',
    repoName: 'DeepSeek-V2',
    branch: 'main',
    tags: 'llm,ai,deepseek',
    description: 'DeepSeek V2 LLM'
  },
  {
    repoOwner: 'deepseek-ai',
    repoName: 'DeepSeek-V3',
    branch: 'main',
    tags: 'llm,ai,deepseek',
    description: 'DeepSeek V3 LLM'
  },
  {
    repoOwner: 'deepseek-ai',
    repoName: 'DeepSeek-Coder',
    branch: 'main',
    tags: 'llm,coder,deepseek',
    description: 'DeepSeek Coder for code generation'
  },
  {
    repoOwner: 'deepseek-ai',
    repoName: 'Janus',
    branch: 'main',
    tags: 'multimodal,ai,deepseek',
    description: 'Janus multimodal AI'
  },

  // User's Own Repositories (Full Circle!)
  {
    repoOwner: 'craighckby-stack',
    repoName: 'ai-scaffold-',
    branch: 'main',
    tags: 'personal,ai,scaffold',
    description: 'Personal AI scaffold project'
  },
  {
    repoOwner: 'craighckby-stack',
    repoName: 'evolution-engine',
    branch: 'main',
    tags: 'personal,evolution,ai',
    description: 'Personal evolution engine (example)'
  },

  // Z.ai Repositories
  {
    repoOwner: 'z',
    repoName: 'zai-web-dev-sdk',
    branch: 'main',
    tags: 'zai,sdk,web',
    description: 'Z.ai Web Development SDK'
  },
  {
    repoOwner: 'z',
    repoName: 'zai-core',
    branch: 'main',
    tags: 'zai,core,ai',
    description: 'Z.ai Core System (example)'
  },

  // Additional High-Quality Repos
  {
    repoOwner: 'openai',
    repoName: 'tiktoken',
    branch: 'main',
    tags: 'tokenization,openai',
    description: 'OpenAI tokenizer library'
  },
  {
    repoOwner: 'huggingface',
    repoName: 'transformers',
    branch: 'main',
    tags: 'ml,nlp,huggingface',
    description: 'Hugging Face Transformers'
  },
  {
    repoOwner: 'facebookresearch',
    repoName: 'pytorch',
    branch: 'main',
    tags: 'ml,framework,facebook',
    description: 'PyTorch deep learning framework'
  },
  {
    repoOwner: 'anthropics',
    repoName: 'anthropic-sdk-python',
    branch: 'main',
    tags: 'llm,ai,anthropic',
    description: 'Anthropic SDK'
  },
];

async function main() {
  console.log('🌱 Seeding external repositories...');

  for (const repo of PREDEFINED_REPOS) {
    try {
      // Check if repo already exists
      const existing = await prisma.externalRepo.findFirst({
        where: {
          repoOwner: repo.repoOwner,
          repoName: repo.repoName
        }
      });

      if (existing) {
        console.log(`✓ Already exists: ${repo.repoOwner}/${repo.repoName}`);
        continue;
      }

      // Create new external repo
      await prisma.externalRepo.create({
        data: {
          repoOwner: repo.repoOwner,
          repoName: repo.repoName,
          branch: repo.branch,
          isActive: true,
          filesCount: 0
        }
      });

      console.log(`✓ Added: ${repo.repoOwner}/${repo.repoName}`);
    } catch (error) {
      console.error(`✗ Failed to add ${repo.repoOwner}/${repo.repoName}:`, error);
    }
  }

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
