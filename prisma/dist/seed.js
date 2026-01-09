"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var PREDEFINED_REPOS = [
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, PREDEFINED_REPOS_1, repo, existing, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding external repositories...');
                    _i = 0, PREDEFINED_REPOS_1 = PREDEFINED_REPOS;
                    _a.label = 1;
                case 1:
                    if (!(_i < PREDEFINED_REPOS_1.length)) return [3 /*break*/, 7];
                    repo = PREDEFINED_REPOS_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, prisma.externalRepo.findFirst({
                            where: {
                                repoOwner: repo.repoOwner,
                                repoName: repo.repoName
                            }
                        })];
                case 3:
                    existing = _a.sent();
                    if (existing) {
                        console.log("\u2713 Already exists: ".concat(repo.repoOwner, "/").concat(repo.repoName));
                        return [3 /*break*/, 6];
                    }
                    // Create new external repo
                    return [4 /*yield*/, prisma.externalRepo.create({
                            data: {
                                repoOwner: repo.repoOwner,
                                repoName: repo.repoName,
                                branch: repo.branch,
                                isActive: true,
                                filesCount: 0
                            }
                        })];
                case 4:
                    // Create new external repo
                    _a.sent();
                    console.log("\u2713 Added: ".concat(repo.repoOwner, "/").concat(repo.repoName));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u2717 Failed to add ".concat(repo.repoOwner, "/").concat(repo.repoName, ":"), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log('\n🎉 Seed completed!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
