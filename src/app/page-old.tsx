'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Brain, Activity, Sparkles, Zap, Code, RefreshCcw, CheckCircle2,
  Loader2, Upload, Database, FolderGit2,
  Download, FileText, RefreshCw
} from 'lucide-react';

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-black flex flex-col items-center justify-center p-6 text-red-600 font-mono text-center">
          <CheckCircle2 className="w-12 h-12 mb-4" />
          <p className="text-xs mb-4 uppercase tracking-tighter">Core Fault: System Crash during mutation</p>
          <button
            onClick={() => window.location.reload()}
            className="border border-red-900 px-4 py-2 text-[10px] hover:bg-red-950 transition-colors"
          >
            FORCE REBOOT
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type LogEntry = {
  id: string;
  msg: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'question' | 'reflection' | 'evolution';
  time: string;
};

// Hard-coded GitHub configuration
const GITHUB_CONFIG = {
  repoOwner: 'craighckby-stack',
  repoName: 'DarlikKhan',
  branch: 'main'
};

function App() {
  // Evolution State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [evolutionCycle, setEvolutionCycle] = useState(0);
  const [resonance, setResonance] = useState(0.0);
  const [builderStatus, setBuilderStatus] = useState('IDLE');
  const [deploymentProgress, setDeploymentProgress] = useState<number | null>(null);

  // Gemini API Key State (only thing user needs to enter)
  const [geminiKey, setGeminiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_key') || '';
    }
    return '';
  });

  // Knowledge Base State
  const [documents, setDocuments] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [knowledgeStats, setKnowledgeStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'evolution' | 'knowledge' | 'repos' | 'config'>('config');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const geminiLoopRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((msg: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setLogs(prev => [...prev, { id: crypto.randomUUID(), msg, type, time }].slice(-50));
  }, []);

  const callGemini = async (prompt: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gemini API error');
      }

      return data.text || '';
    } catch (e) {
      const error = e as Error;
      addLog(`Gemini API Error: ${error.message}`, 'error');
      return null;
    }
  };

  const githubAPI = async (path: string, method: string = 'GET', payload?: any) => {
    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, method, payload })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'GitHub API error');
      }

      return data;
    } catch (e) {
      const error = e as Error;
      throw new Error(`GitHub API Error: ${error.message}`);
    }
  };

  // --- DEPLOYMENT MONITOR ---
  const monitorDeployment = async (sha: string) => {
    setBuilderStatus('DEPLOYING');
    addLog(`Monitoring Deployment for Commit: ${sha.slice(0, 7)}`, 'evolution');

    let attempts = 0;
    const maxAttempts = 60;

    const check = async (): Promise<boolean> => {
      try {
        const data = await githubAPI(
          `/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/commits/${sha}/check-runs`
        );

        const deploymentRun = data.check_runs?.[0];

        if (deploymentRun) {
          setDeploymentProgress(deploymentRun.status === 'completed' ? 100 : 50);

          if (deploymentRun.status === 'completed') {
            if (deploymentRun.conclusion === 'success') {
              addLog('✓ DEPLOYMENT SUCCESSFUL. Rebooting system...', 'success');
              setTimeout(() => window.location.reload(), 2000);
              return true;
            } else {
              addLog(`Deployment Failed: ${deploymentRun.conclusion}`, 'error');
              return true;
            }
          }
        }
        return false;
      } catch (e) {
        const error = e as Error;
        console.error('Deployment check error:', error);
        return false;
      }
    };

    const interval = setInterval(async () => {
      attempts++;
      const isDone = await check();
      if (isDone || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts) {
          addLog('Deployment timed out. Please check GitHub Actions.', 'warning');
        }
        setBuilderStatus('IDLE');
        setDeploymentProgress(null);
      }
    }, 10000);
  };

  // --- PULL LATEST FROM GITHUB ---
  const pullLatest = async () => {
    setBuilderStatus('PULLING');
    addLog('Fetching latest changes from GitHub...', 'info');

    try {
      // Get latest commit info
      const data = await githubAPI(`/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/commits?sha=${GITHUB_CONFIG.branch}`);
      const latestCommit = data[0];

      addLog(`Latest commit: ${latestCommit.sha.slice(0, 7)}`, 'info');
      addLog(`Author: ${latestCommit.commit?.author?.name}`, 'info');
      addLog(`Message: ${latestCommit.commit?.message?.split('\n')[0].substring(0, 60)}...`, 'info');
      addLog('✓ Latest changes fetched. Reloading...', 'success');

      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      const error = e as Error;
      addLog(`Failed to pull latest: ${error.message}`, 'error');
      setBuilderStatus('IDLE');
    }
  };

  // --- EVOLUTION ENGINE WITH KNOWLEDGE BASE ---
  const enhanceCode = async () => {
    setBuilderStatus('ANALYZING');
    try {
      // Get File Tree
      const treeData = await githubAPI(
        `/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`
      );

      const files = treeData.tree
        .filter((f: any) => f.type === 'blob' && f.path.match(/\.(js|jsx|ts|tsx)$/) && f.size < 60000)
        .filter((f: any) => !f.path.includes('node_modules'));

      if (files.length === 0) {
        addLog('No eligible files found for mutation.', 'warning');
        setBuilderStatus('IDLE');
        return;
      }

      const target = files[Math.floor(Math.random() * files.length)];
      addLog(`Analyzing: ${target.path} for architectural optimization...`, 'info');

      // Get Content
      const fileData = await githubAPI(
        `/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/contents/${target.path}?ref=${GITHUB_CONFIG.branch}`
      );

      const original = decodeURIComponent(escape(atob(fileData.content.replace(/\n/g, ''))));

      // Get relevant knowledge base context
      let knowledgeContext = '';
      try {
        const knowledgeResponse = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `${target.path} ${original.substring(0, 500)}`,
            language: target.path.endsWith('.ts') || target.path.endsWith('.tsx') ? 'typescript' : 'javascript',
            limit: 3
          })
        });

        const knowledgeData = await knowledgeResponse.json();
        if (knowledgeData.context) {
          knowledgeContext = knowledgeData.context;
          addLog(`📚 Retrieved ${knowledgeData.count} relevant code examples from knowledge base`, 'info');
        }
      } catch (e) {
        console.warn('Failed to fetch knowledge base context');
      }

      // Mutate via AI
      setBuilderStatus('MUTATING');
      const evolvePrompt = `You are a self-improving AI with access to a knowledge base of best practices from major repositories.

Target File: ${target.path}

ORIGINAL CODE:
${original}

${knowledgeContext ? `KNOWLEDGE BASE REFERENCES:
${knowledgeContext}

` : ''}Rules:
1. Apply best practices from knowledge base references above
2. Improve this React/JS/TS file for performance, logic, and aesthetic resilience
3. Return ONLY the new code. No markdown blocks.
4. Code must be syntactically perfect.
5. Maintain core functionality but optimize everything.`;

      const evolved = await callGemini(evolvePrompt);

      if (evolved && evolved.length > 10 && evolved !== original) {
        setBuilderStatus('COMMITTING');
        const commitData = await githubAPI(
          `/repos/${GITHUB_CONFIG.repoOwner}/${GITHUB_CONFIG.repoName}/contents/${target.path}`,
          'PUT',
          {
            message: `Mutation Cycle ${evolutionCycle + 1}: Optimized ${target.path} with knowledge base`,
            content: btoa(unescape(encodeURIComponent(evolved))),
            sha: fileData.sha,
            branch: GITHUB_CONFIG.branch
          }
        );

        if (commitData.commit?.sha) {
          addLog(`Mutation Committed. Awaiting deployment pipeline...`, 'success');
          await monitorDeployment(commitData.commit.sha);
        }
      } else {
        addLog('No optimizations found for this file. Cycle skipped.', 'warning');
        setBuilderStatus('IDLE');
      }
    } catch (e) {
      const error = e as Error;
      addLog(`Evolution Error: ${error.message}`, 'error');
      setBuilderStatus('IDLE');
    }
  };

  const geminiSelfDialogue = async () => {
    const question = await callGemini(
      "Ask yourself one deep technical question about your own React architecture. Output just the question."
    );
    if (!question) return;

    addLog(`AI PROBE: ${question.trim()}`, 'question');
    setResonance(prev => Math.min(prev + 0.1, 1.0));
    await new Promise(r => setTimeout(r, 2000));

    const answer = await callGemini(
      `Answer your own question: "${question}". Be actionable and technical. Under 80 words.`
    );
    if (!answer) return;
    addLog(`AI SYNTHESIS: ${answer.trim()}`, 'reflection');
    await new Promise(r => setTimeout(r, 2000));

    const decision = await callGemini(
      `Based on: "${answer}", should you mutate your code now to implement these improvements? Reply YES or NO.`
    );

    if (decision?.toUpperCase().includes('YES')) {
      addLog(`INITIATING CODE MUTATION...`, 'evolution');
      await enhanceCode();
    }

    setEvolutionCycle(prev => prev + 1);
  };

  const toggleLoop = () => {
    if (isActive) {
      if (geminiLoopRef.current) {
        clearInterval(geminiLoopRef.current);
        geminiLoopRef.current = null;
      }
      setIsActive(false);
      addLog('Self-evolution sequence HALTED', 'warning');
    } else {
      if (!geminiKey) {
        addLog('Please enter Gemini API Key first!', 'error');
        return;
      }

      setIsActive(true);
      addLog('Self-evolution sequence INITIALIZED', 'success');
      geminiSelfDialogue();
      geminiLoopRef.current = setInterval(geminiSelfDialogue, 60000);
    }
  };

  const saveGeminiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_key', geminiKey);
    }
    addLog('Gemini API Key saved!', 'success');
  };

  // --- KNOWLEDGE BASE FUNCTIONS ---
  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (e) {
      console.error('Failed to load documents');
    }
  };

  const loadRepos = async () => {
    try {
      const response = await fetch('/api/repos');
      const data = await response.json();
      setRepos(data.repos || []);
    } catch (e) {
      console.error('Failed to load repos');
    }
  };

  const loadKnowledgeStats = async () => {
    try {
      const response = await fetch('/api/knowledge?stats=true');
      const data = await response.json();
      setKnowledgeStats(data);
    } catch (e) {
      console.error('Failed to load knowledge stats');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      addLog(`Uploading ${file.name} to knowledge base...`, 'info');
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        addLog(`✓ ${file.name} uploaded successfully`, 'success');
        loadDocuments();
        loadKnowledgeStats();
      } else {
        addLog(`Upload failed: ${data.error}`, 'error');
      }
    } catch (e) {
      const error = e as Error;
      addLog(`Upload error: ${error.message}`, 'error');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        addLog('Document deleted', 'success');
        loadDocuments();
        loadKnowledgeStats();
      }
    } catch (e) {
      addLog('Failed to delete document', 'error');
    }
  };

  const syncRepo = async (repoId: string) => {
    try {
      addLog('Syncing repository to knowledge base...', 'info');
      const response = await fetch('/api/repos/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoId })
      });

      const data = await response.json();
      if (response.ok) {
        addLog(`✓ Synced ${data.syncedCount} files from repository`, 'success');
        loadRepos();
        loadKnowledgeStats();
      } else {
        addLog(`Sync failed: ${data.error}`, 'error');
      }
    } catch (e) {
      const error = e as Error;
      addLog(`Sync error: ${error.message}`, 'error');
    }
  };

  const deleteRepo = async (id: string) => {
    try {
      const response = await fetch(`/api/repos?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        addLog('Repository removed', 'success');
        loadRepos();
      }
    } catch (e) {
      addLog('Failed to remove repository', 'error');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    loadDocuments();
    loadRepos();
    loadKnowledgeStats();
  }, []);

  const checkConfig = () => {
    return geminiKey;
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black text-zinc-400 font-mono overflow-hidden">
      {/* Header */}
      <header className="flex-none h-14 border-b border-red-900/30 flex items-center justify-between px-6 bg-black">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-red-950/20 border border-red-900/50 rounded animate-pulse">
            <Brain className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-red-600 font-bold text-sm tracking-widest uppercase">Darlik Khan</h1>
            <p className="text-[10px] text-zinc-600 uppercase tracking-tighter">Self-Evolving AI</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={pullLatest}
            disabled={builderStatus !== 'IDLE'}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Pull Latest
          </button>
          <button
            onClick={toggleLoop}
            disabled={!checkConfig()}
            className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest border rounded transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-red-600 text-black border-red-600'
                : 'border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-900 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isActive ? 'HALT SYSTEM' : 'ENGAGE LOOP'}
          </button>
        </div>
      </header>

      {/* Status Bar */}
      <div className="flex-none h-10 border-b border-zinc-900 flex items-center gap-6 px-6 bg-zinc-950 text-[10px] uppercase">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-3 h-3 text-cyan-500 ${isActive ? 'animate-spin' : ''}`} />
          <span className="text-zinc-600">Cycle:</span>
          <span className="text-cyan-500 font-bold">{evolutionCycle}</span>
        </div>
        <div className="flex items-center gap-2">
          {builderStatus !== 'IDLE' ? (
            <Loader2 className="w-3 h-3 text-orange-500 animate-spin" />
          ) : (
            <Zap className="w-3 h-3 text-orange-500" />
          )}
          <span className="text-zinc-600">Status:</span>
          <span className="text-orange-500 font-bold">{builderStatus}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">Repo:</span>
          <span className="text-zinc-400 font-bold">{GITHUB_CONFIG.repoOwner}/{GITHUB_CONFIG.repoName}</span>
        </div>
        {knowledgeStats && (
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-green-500" />
            <span className="text-zinc-600">Knowledge:</span>
            <span className="text-green-500 font-bold">{knowledgeStats.total} docs</span>
          </div>
        )}
        {deploymentProgress !== null && (
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 animate-pulse"
                style={{ width: `${deploymentProgress}%` }}
              />
            </div>
            <span className="text-green-500 animate-pulse">Deploying...</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-none border-b border-zinc-900 bg-zinc-950">
        <div className="flex gap-1 px-6">
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'evolution'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Activity className="inline w-3 h-3 mr-1" /> Evolution
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'knowledge'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <Database className="inline w-3 h-3 mr-1" /> Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'repos'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <FolderGit2 className="inline w-3 h-3 mr-1" /> Repositories
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'config'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <CheckCircle2 className="inline w-3 h-3 mr-1" /> Setup
          </button>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Logs or Tab Content */}
        <section className="flex-1 flex flex-col overflow-hidden border-r border-zinc-900">
          {activeTab === 'evolution' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,0,0,0.1)_0%,_transparent_100%)]">
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <Code className="w-16 h-16 mb-4" />
                  <p className="text-xs uppercase tracking-[0.5em]">System Idle</p>
                  <p className="text-[10px] text-zinc-600 mt-2">Enter Gemini API Key and click ENGAGE LOOP</p>
                </div>
              )}
              {logs.map(log => (
                <div
                  key={log.id}
                  className="group relative flex gap-4 text-[11px] border-b border-zinc-900/50 pb-2"
                >
                  <span className="text-zinc-700 whitespace-nowrap">[{log.time}]</span>
                  <span
                    className={`${
                      log.type === 'question'
                        ? 'text-cyan-400 font-bold'
                        : log.type === 'evolution'
                        ? 'text-orange-400 underline underline-offset-4'
                        : log.type === 'success'
                        ? 'text-green-400'
                        : log.type === 'error'
                        ? 'text-red-500'
                        : log.type === 'reflection'
                        ? 'text-purple-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] text-red-600 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Documents
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-red-900/20 border border-red-900/50 text-[9px] hover:bg-red-900/30 transition-colors"
                  >
                    Choose Files
                  </button>
                </div>
                <p className="text-[10px] text-zinc-600">
                  Upload PDF or DOCX files to expand the AI's knowledge base. These documents will be used as reference when evolving code.
                </p>
              </div>

              <div className="space-y-2">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 bg-zinc-900/30 border border-zinc-800 rounded flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-zinc-500" />
                      <div>
                        <div className="text-[10px] text-zinc-300">{doc.fileName}</div>
                        <div className="text-[9px] text-zinc-600 uppercase">{doc.fileType}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'repos' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
                <h3 className="text-[10px] text-red-600 font-bold tracking-widest uppercase flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" /> Pre-Seeded Repositories
                </h3>
                <p className="text-[10px] text-zinc-600 mt-2">
                  These repositories are pre-seeded and ready to sync. Click "Sync" to add their code to the knowledge base.
                </p>
              </div>

              <div className="space-y-2">
                {repos.map(repo => (
                  <div
                    key={repo.id}
                    className="p-3 bg-zinc-900/30 border border-zinc-800 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-zinc-500" />
                        <span className="text-[10px] text-zinc-300 font-mono">
                          {repo.repoOwner}/{repo.repoName}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteRepo(repo.id)}
                        className="p-1 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[9px] text-zinc-600">
                        Branch: {repo.branch} | Files: {repo.filesCount}
                      </div>
                      <button
                        onClick={() => syncRepo(repo.id)}
                        disabled={repo.isActive === false}
                        className="px-2 py-1 bg-green-900/20 border border-green-900/50 text-[9px] hover:bg-green-900/30 disabled:opacity-50 transition-colors flex items-center gap-1"
                      >
                        <Download className="inline w-3 h-3" /> Sync
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded space-y-6">
                <h3 className="text-[10px] text-red-600 font-bold tracking-widest uppercase mb-4">
                  System Configuration
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-black border border-zinc-800 rounded">
                    <h4 className="text-[9px] text-zinc-500 uppercase mb-2">Gemini API Key (Required)</h4>
                    <p className="text-[10px] text-zinc-600 mb-2">
                      Enter your Google Gemini API key to enable AI evolution.
                    </p>
                    <input
                      type="password"
                      className="w-full bg-zinc-950 border border-zinc-700 p-3 text-[10px] outline-none focus:border-red-900 font-mono"
                      placeholder="Enter Gemini API Key..."
                      value={geminiKey}
                      onChange={e => setGeminiKey(e.target.value)}
                    />
                    <button
                      onClick={saveGeminiKey}
                      className="w-full py-2 bg-red-900/20 border border-red-900/50 text-[10px] font-bold uppercase hover:bg-red-900/30 transition-colors mt-2"
                    >
                      Save API Key
                    </button>
                  </div>

                  <div className="p-4 bg-black border border-zinc-800 rounded">
                    <h4 className="text-[9px] text-zinc-500 uppercase mb-2">GitHub Configuration (Hard-coded)</h4>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Repository:</span>
                        <span className="text-zinc-400 font-mono">{GITHUB_CONFIG.repoOwner}/{GITHUB_CONFIG.repoName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Branch:</span>
                        <span className="text-zinc-400 font-mono">{GITHUB_CONFIG.branch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-950/10 border border-red-900/20 rounded">
                    <h4 className="text-[9px] text-red-500 uppercase mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={pullLatest}
                        disabled={builderStatus !== 'IDLE'}
                        className="w-full py-2 bg-zinc-900 text-[9px] font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCcw className="w-3 h-3 text-cyan-500 ${isActive ? 'animate-spin' : ''}"/> Pull Latest Changes from GitHub
                      </button>
                      <p className="text-[10px] text-zinc-600">
                        Use this after you've deployed changes to GitHub from another computer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Panel - Info */}
        <aside className="w-80 flex flex-col bg-zinc-950/50 p-6 space-y-6">
          <div className="p-4 bg-red-950/10 border border-red-900/20 rounded space-y-2">
            <h4 className="text-[9px] font-bold text-red-500 uppercase">Getting Started</h4>
            <p className="text-[10px] text-zinc-500 leading-tight">
              1. Enter your Gemini API Key
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight">
              2. Click "Save API Key"
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight">
              3. Go to "Repositories" tab
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight">
              4. Click "Sync" on a few repos
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight">
              5. Click "Engage Loop"
            </p>
          </div>

          {knowledgeStats && knowledgeStats.byRepo && knowledgeStats.byRepo.length > 0 && (
            <div className="border-t border-zinc-900 pt-6">
              <h4 className="text-[9px] font-bold text-zinc-500 uppercase mb-3">Top Knowledge Sources</h4>
              <div className="space-y-2">
                {knowledgeStats.byRepo.slice(0, 5).map((repo: any) => (
                  <div key={repo.repoName} className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-400 truncate">{repo.repoName}</span>
                    <span className="text-zinc-600">{repo._count} docs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-zinc-900 pt-6">
            <div className="p-4 bg-red-950/10 border border-red-900/20 rounded space-y-2">
              <h4 className="text-[9px] font-bold text-red-500 uppercase">GitHub Repository</h4>
              <p className="text-[10px] text-zinc-600">
                <span className="text-red-400">craighckby-stack/DarlikKhan</span>
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
