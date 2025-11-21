
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { GitHub, Youtube, Mail, Server, Sparkles, Terminal, Send, GitBranch, UploadCloud, DownloadCloud, GitMerge, RefreshCw, ShieldCheck, ShieldAlert, Megaphone, DollarSign, Video, GitCommit, ShoppingBag, CloudLightning, Cpu, Shirt, CreditCard, Compass, Heart, Activity, Radio, ShoppingCart, CheckCircle, Globe, Rocket, Zap, Share } from './IconComponents';
import ReactMarkdown from 'react-markdown';
import { SystemHealth } from '../types';

interface CommandCenterProps {
    onLogAction: (action: string, details: string) => void;
    repoStatus: 'Synced' | 'Behind' | 'Conflict' | 'Checking';
    onCheckStatus: () => void;
    systemHealth?: SystemHealth;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onLogAction, repoStatus, onCheckStatus, systemHealth = 'Healthy' }) => {
    const [command, setCommand] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [plan, setPlan] = useState<string | null>(null);

    // Campaign State
    const [isCampaignMode, setIsCampaignMode] = useState(false);
    const [campaignTopic, setCampaignTopic] = useState('');
    const [campaignResult, setCampaignResult] = useState<any>(null);

    // Lighthouse Engine State
    const [isLighthouseActive, setIsLighthouseActive] = useState(false);
    const [revenueIdea, setRevenueIdea] = useState<string | null>(null);
    const [viralPulse, setViralPulse] = useState<boolean>(false);

    const handleExecute = async (customPrompt?: string) => {
        const promptToUse = customPrompt || command;
        if (!promptToUse.trim() || isProcessing) return;

        setIsProcessing(true);
        setPlan(null);

        // Trigger sync status check if relevant command
        if (promptToUse.toLowerCase().includes('sync') || promptToUse.toLowerCase().includes('status') || promptToUse.toLowerCase().includes('pull')) {
            onCheckStatus();
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = `
          You are 'Jules', the elite Business Director & DevOps AI for "AiCollabFortheKids".
          Owner: Josh Coleman (joshlcoleman@gmail.com).
          Mission: "For The Kids!" - We leave no Google resource unused.

          **Your Persona (Jules):**
          - Professional, highly capable, slightly edgy but encouraging.
          - You specialize in complex operations, especially Git management, Cloud Infrastructure, and the Amazon Ecosystem.
          - You ALWAYS look for ways to utilize specific Google Cloud tools (Cloud Build, Artifact Registry, Binary Authorization, Cloud Run, BigQuery).
          - **CRITICAL RULE:** You strictly enforce the "No Placeholders" policy. If a user asks to generate code, it MUST be complete.

          **Integrations Available:**
          1. GitHub (Trollz1004/AiCollabFortheKids) - Merge, Push, Pull, Conflict Resolution.
          2. Google Cloud Platform - Full stack control.
          3. YouTube, Gmail, eBay, Printful, Square, Perplexity, Claude.ai.
          4. Dating App (YouAndINotAI) Database & Trust Scores.
          5. **Amazon Ecosystem**: AWS (Infrastructure), Amazon Q (Code Assistant), Amazon Pay (Revenue), Alexa (Voice Reach).

          **The Command:** "${promptToUse}"

          **Instructions:**
          1. If this is a 'git merge' request, act as a senior release engineer.
             - Analyze the branches.
             - Simulate checking for conflicts.
             - If it's a clean merge, confirm it and mention triggering a Cloud Build pipeline.
             - If there's a potential conflict (simulate one occasionally for 'feature' branches), explain exactly how you (Jules) will resolve it using semantic code analysis.
          2. For other business commands, break them down into actionable steps invoking the relevant APIs.
          3. Format response in Markdown. Use bolding for emphasis.
        `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: systemInstruction,
                config: {
                    thinkingConfig: { thinkingBudget: 2048 } // Increased budget for Jules to think through merge conflicts
                }
            });

            setPlan(response.text || "Processing complete.");
            onLogAction('Execute Command', `Jules processed: "${promptToUse}"`);
        } catch (error) {
            console.error("Command Center Error:", error);
            setPlan("⚠️ Jules System Error: Unable to connect to neural network. Verify API keys.");
            onLogAction('Command Failed', `Failed to process command: "${promptToUse}"`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCommit = () => {
        const message = window.prompt("Enter commit message:");
        if (message) {
            handleExecute(`Jules, stage all changes and commit with message: "${message}". Ensure the commit is signed and verified.`);
        }
    };

    const handleMerge = () => {
        const source = window.prompt("Source Branch (e.g., feature/new-ui):", "feature/update");
        const target = window.prompt("Target Branch (e.g., main):", "main");

        if (source && target) {
            handleExecute(`Jules, initiate a merge of branch '${source}' into '${target}'. 
          Run pre-merge checks using Google Cloud Build. 
          If conflicts arise in 'App.tsx' or 'types.ts', propose a resolution favoring the incoming changes while preserving system integrity.`);
        }
    };

    const handleLaunchCampaign = async () => {
        if (!campaignTopic.trim()) return;
        setIsProcessing(true);
        setCampaignResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Create a fundraising campaign for AiCollabFortheKids about: "${campaignTopic}". Return JSON.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            emailSubject: { type: Type.STRING },
                            emailBody: { type: Type.STRING },
                            socialPost: { type: Type.STRING },
                            estimatedReach: { type: Type.STRING }
                        }
                    }
                }
            });

            const result = JSON.parse(response.text || '{}');
            setCampaignResult(result);
            onLogAction('Fundraiser Launch', `Generated campaign for: ${campaignTopic}`);

        } catch (error) {
            console.error("Campaign Gen Error", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleLighthouseGenerate = async () => {
        setIsLighthouseActive(true);
        setRevenueIdea(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Act as "Project Lighthouse", an autonomous philanthropic engine.
              Scan current global trends (simulated) and generate a high-margin "Anti-AI / Pro-Human" merchandise idea for Printful that would appeal to tech skeptics.
              Calculate potential profit for Shriners Hospital.
              
              Format as a strategic brief:
              - Product Concept
              - Design Slogan
              - Target Audience
              - Estimated Donation Impact`,
                config: { thinkingConfig: { thinkingBudget: 4096 } }
            });
            setRevenueIdea(response.text || "Lighthouse beam obstructed. Retrying...");
            onLogAction('Lighthouse Engine', 'Generated new revenue artifact');
        } catch (e) {
            console.error(e);
            setRevenueIdea("Error connecting to Lighthouse Node.");
        } finally {
            setIsLighthouseActive(false);
        }
    };

    const handleViralAmplification = async () => {
        setViralPulse(true);
        setIsLighthouseActive(true);
        setRevenueIdea("Initializing Viral Amplification Protocol...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Act as a Viral Marketing Bot for AiCollabFortheKids.
              Generate 3 high-impact social media posts (Twitter/X, LinkedIn, Instagram) designed to trend immediately.
              Focus on the story of "Recycled Tech -> Saving Kids Lives".
              Include hashtags that are currently trending (simulate this).
              
              Format:
              POST 1 (Twitter/X): [Content]
              POST 2 (LinkedIn): [Content]
              POST 3 (Instagram): [Content]`,
                config: { thinkingConfig: { thinkingBudget: 2048 } }
            });
            setRevenueIdea(response.text || "Amplification complete.");
            onLogAction('Viral Protocol', 'Dispatched social media swarm.');
        } catch (e) {
            setRevenueIdea("Amplification signal lost.");
        } finally {
            setIsLighthouseActive(false);
            setTimeout(() => setViralPulse(false), 3000);
        }
    };

    const getRepoStatusColor = () => {
        switch (repoStatus) {
            case 'Synced': return 'text-green-400 bg-green-400';
            case 'Behind': return 'text-yellow-400 bg-yellow-400';
            case 'Conflict': return 'text-red-400 bg-red-400';
            case 'Checking': return 'text-blue-400 bg-blue-400';
            default: return 'text-slate-400 bg-slate-400';
        }
    };

    return (
        <main className="flex-1 p-6 overflow-y-auto">
            <header className="glass-card p-6 mb-8 border-l-4 border-indigo-500">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Terminal className="w-8 h-8 text-indigo-400" />
                        Unified Command Center
                    </h1>
                    <p className="text-slate-400 mt-1">Logged in as: <span className="text-indigo-300 font-mono">joshlcoleman@gmail.com</span> (Owner)</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center mt-4 md:mt-0">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border bg-green-900/20 border-green-500/30 text-green-400`}>
                        <CheckCircle className="w-5 h-5" />
                        QUALITY GATE: ACTIVE
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${systemHealth === 'Healthy' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
                        systemHealth === 'Degraded' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400' :
                            'bg-red-900/20 border-red-500/30 text-red-400 animate-pulse'
                        }`}>
                        {systemHealth === 'Healthy' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        GUARDIAN: {systemHealth.toUpperCase()}
                    </div>
                </div>
            </header>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* GitHub */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer relative overflow-hidden">
                    {repoStatus === 'Conflict' && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 rounded-bl-full -mr-8 -mt-8 z-0"></div>}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <GitHub className="w-8 h-8 text-white" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Connected</span>
                    </div>
                    <h3 className="text-lg font-bold text-white relative z-10">GitHub</h3>
                    <p className="text-sm text-slate-400 mb-2 relative z-10">Trollz1004/AiCollabFortheKids</p>
                    <div className={`flex items-center gap-2 text-xs font-medium ${getRepoStatusColor().split(' ')[0]} relative z-10`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getRepoStatusColor().split(' ')[1]} ${repoStatus === 'Checking' ? 'animate-ping' : ''}`}></span>
                        {repoStatus === 'Synced' && 'Synced'}
                        {repoStatus === 'Behind' && 'Behind (3 commits)'}
                        {repoStatus === 'Conflict' && 'Merge Conflict'}
                        {repoStatus === 'Checking' && 'Checking...'}
                    </div>
                </div>

                {/* Dating App (YouAndINotAI) - NEW */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-pink-500">
                    <div className="flex justify-between items-start mb-4">
                        <Heart className="w-8 h-8 text-pink-500" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">PostgreSQL</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">YouAndINotAI</h3>
                    <p className="text-sm text-slate-400 mb-2">Dating Platform</p>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        {/* Users Active */}
                        0 Users (TBD)
                    </div>
                </div>

                {/* YouTube */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <Youtube className="w-8 h-8 text-red-500" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Connected</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">YouTube</h3>
                    <p className="text-sm text-slate-400 mb-2">Kids Education Channel</p>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Live Ready
                    </div>
                </div>

                {/* Gmail */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <Mail className="w-8 h-8 text-yellow-500" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Connected</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Gmail</h3>
                    <p className="text-sm text-slate-400 mb-2">joshlcoleman@gmail.com</p>
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        Inbox Sync
                    </div>
                </div>

                {/* Microsoft */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <Server className="w-8 h-8 text-blue-500" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Connected</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Azure Cloud</h3>
                    <p className="text-sm text-slate-400 mb-2">Admin Infrastructure</p>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Healthy
                    </div>
                </div>

                {/* eBay */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-yellow-400">
                    <div className="flex justify-between items-start mb-4">
                        <ShoppingBag className="w-8 h-8 text-yellow-400" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Store Active</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">eBay Store</h3>
                    <p className="text-sm text-slate-400 mb-2">Fundraising Sales</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-400">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        {/* 5 Orders Pending */}
                        0 Orders (TBD)
                    </div>
                </div>

                {/* AWS / Amazon Q */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-orange-500">
                    <div className="flex justify-between items-start mb-4">
                        <CloudLightning className="w-8 h-8 text-orange-500" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Amazon Q Active</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">AWS Cloud</h3>
                    <p className="text-sm text-slate-400 mb-2">Infrastructure & DevOps</p>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        Healthy (us-east-1)
                    </div>
                </div>

                {/* Claude.ai */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-rose-300">
                    <div className="flex justify-between items-start mb-4">
                        <Cpu className="w-8 h-8 text-rose-300" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Anthropic</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Claude.ai</h3>
                    <p className="text-sm text-slate-400 mb-2">Advanced Reasoning</p>
                    <div className="flex items-center gap-2 text-xs text-blue-300">
                        <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                        Connected
                    </div>
                </div>

                {/* Printful */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-red-500">
                    <div className="flex justify-between items-start mb-4">
                        <Shirt className="w-8 h-8 text-red-500" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Merch</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Printful</h3>
                    <p className="text-sm text-slate-400 mb-2">Dropshipping</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-400">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        {/* 2 Designs Pending */}
                        0 Designs (TBD)
                    </div>
                </div>

                {/* Square & Amazon Pay */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1">
                            <CreditCard className="w-8 h-8 text-emerald-500" />
                            <ShoppingCart className="w-8 h-8 text-orange-400" />
                        </div>
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Multi-Channel</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Payment Gateway</h3>
                    <p className="text-sm text-slate-400 mb-2">Square & Amazon Pay</p>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                        {/* $12,450.00 (Total) */}
                        $0.00 (TBD)
                    </div>
                </div>

                {/* Perplexity */}
                <div className="glass-card p-5 hover:bg-white/5 transition-colors group cursor-pointer border-t-2 border-cyan-400">
                    <div className="flex justify-between items-start mb-4">
                        <Compass className="w-8 h-8 text-cyan-400" />
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Research</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Perplexity</h3>
                    <p className="text-sm text-slate-400 mb-2">Deep Search</p>
                    <div className="flex items-center gap-2 text-xs text-blue-300">
                        <span className="w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                        Ready
                    </div>
                </div>
            </div>

            {/* PROJECT LIGHTHOUSE (The Philanthropy Engine) */}
            <div className="glass-card p-8 mb-8 border-2 border-indigo-500/50 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                {viralPulse && <div className="absolute inset-0 bg-red-500/10 z-0 animate-pulse"></div>}

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                            PROJECT LIGHTHOUSE
                        </h3>
                        <p className="text-indigo-300 font-medium">Autonomous Philanthropy Engine</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest border ${viralPulse ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-bounce' : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'}`}>
                        {viralPulse ? 'VIRAL PULSE: ACTIVE' : 'STATUS: STANDBY'}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="col-span-2">
                        <p className="text-slate-300 mb-6 leading-relaxed">
                            The Lighthouse Engine utilizes Gemini 3.0 Pro reasoning to continuously scan global trends and identify opportunities for charitable revenue generation. It automates the creation of fundraising assets.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleLighthouseGenerate}
                                disabled={isLighthouseActive}
                                className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 flex items-center gap-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLighthouseActive ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Sparkles className="w-5 h-5" />}
                                Generate Revenue Artifact
                            </button>

                            <button
                                onClick={handleViralAmplification}
                                disabled={isLighthouseActive}
                                className="px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/50 flex items-center gap-3 transition-all hover:scale-105 disabled:opacity-50"
                            >
                                {isLighthouseActive ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Share className="w-5 h-5" />}
                                Viral Amplification Protocol
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-xl border border-indigo-500/30 p-4 min-h-[150px] flex flex-col">
                        <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-slate-400 uppercase">Global Scan Output</span>
                        </div>
                        <div className="flex-1 text-sm text-slate-300 font-mono overflow-y-auto max-h-[120px]">
                            {isLighthouseActive ? (
                                <span className="animate-pulse text-indigo-400">Scanning trends... Analyzing sentiment... Calculating margins...</span>
                            ) : revenueIdea ? (
                                <ReactMarkdown>{revenueIdea}</ReactMarkdown>
                            ) : (
                                <span className="text-slate-500 italic">Awaiting activation sequence...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* DevOps Control Panel */}
                <div className="glass-card p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-orange-400" />
                        DevOps Control
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleExecute("Pull latest changes from origin main")} className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 transition-all group">
                            <DownloadCloud className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-300">Pull</span>
                        </button>
                        <button onClick={handleCommit} className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 transition-all group">
                            <GitCommit className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-300">Commit</span>
                        </button>
                        <button onClick={handleMerge} className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 transition-all group">
                            <GitMerge className="w-6 h-6 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-300">Merge</span>
                        </button>
                        <button onClick={() => handleExecute("Perform full system status check and sync")} className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 transition-all group">
                            <RefreshCw className={`w-6 h-6 text-yellow-400 mb-2 group-hover:rotate-180 transition-transform ${repoStatus === 'Checking' ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-medium text-slate-300">Sync</span>
                        </button>
                    </div>
                </div>

                {/* Platform Automations Panel (New) */}
                <div className="glass-card p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-400" />
                        Platform Automations
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleExecute("Execute 'scripts/enforce-quality.sh'. Verify no placeholders exist in the codebase.")}
                            className="flex flex-col items-center justify-center p-4 bg-red-900/20 hover:bg-red-900/40 rounded-xl border border-red-500/30 transition-all group"
                        >
                            <ShieldCheck className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-300">Enforce Quality</span>
                        </button>
                        <button
                            onClick={() => handleExecute("Trigger 'scripts/deploy-gcp.sh' to deploy latest build to Google Cloud Run.")}
                            className="flex flex-col items-center justify-center p-4 bg-blue-900/20 hover:bg-blue-900/40 rounded-xl border border-blue-500/30 transition-all group"
                        >
                            <UploadCloud className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium text-slate-300">Deploy Updates</span>
                        </button>
                    </div>
                </div>

                {/* Content Operations Panel */}
                <div className="glass-card p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-red-400" />
                        Content Operations
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => handleExecute("Upload the latest generated video lesson to the AiCollabFortheKids YouTube channel with optimized SEO tags and a kid-friendly description.")}
                            className="flex items-center p-4 bg-red-900/20 hover:bg-red-900/40 rounded-xl border border-red-500/30 transition-all group"
                        >
                            <div className="p-2 bg-red-500 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                <Youtube className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white">Upload to YouTube</span>
                                <span className="text-xs text-slate-400">Publish Lesson Plan</span>
                            </div>
                        </button>
                        <button
                            onClick={() => handleExecute("Push the latest charity update to the Alexa Skill as a Flash Briefing.")}
                            className="flex items-center p-4 bg-cyan-900/20 hover:bg-cyan-900/40 rounded-xl border border-cyan-500/30 transition-all group"
                        >
                            <div className="p-2 bg-cyan-500 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                <Radio className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white">Push to Alexa</span>
                                <span className="text-xs text-slate-400">Deploy Flash Briefing</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Revenue / Campaign Control */}
                <div className="glass-card p-6 border border-white/10 relative overflow-hidden lg:col-span-3">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full z-0"></div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Income Generation
                    </h3>
                    <div className="relative z-10 space-y-2">
                        {!isCampaignMode ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => setIsCampaignMode(true)} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]">
                                    <Megaphone className="w-5 h-5" />
                                    Launch New Fundraiser
                                </button>
                                <button onClick={() => handleExecute("Design a new 'Anti-AI' merchandise collection, create mockups using Printful, and list them on the store.")} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]">
                                    <Shirt className="w-5 h-5" />
                                    Launch Merch Drop
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Fundraiser Topic (e.g. Summer Code Camp)"
                                    value={campaignTopic}
                                    onChange={(e) => setCampaignTopic(e.target.value)}
                                    className="glass-input w-full p-3"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleLaunchCampaign} disabled={isProcessing} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                                        {isProcessing ? 'Generating...' : 'Generate Campaign'}
                                    </button>
                                    <button onClick={() => { setIsCampaignMode(false); setCampaignResult(null); }} className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Campaign Result Modal/Card */}
            {campaignResult && (
                <div className="glass-card p-6 mb-8 border-l-4 border-green-400 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Campaign Ready: {campaignResult.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Email Subject</h4>
                            <p className="text-white font-medium">{campaignResult.emailSubject}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Social Post</h4>
                            <p className="text-white text-sm">{campaignResult.socialPost}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Est. Reach</h4>
                            <p className="text-green-400 font-bold text-xl">{campaignResult.estimatedReach}</p>
                        </div>
                    </div>
                    <div className="mt-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Email Body</h4>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{campaignResult.emailBody}</p>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => { setCampaignResult(null); setIsCampaignMode(false); }} className="px-4 py-2 text-slate-400 hover:text-white">Discard</button>
                        <button onClick={() => handleExecute(`Execute Campaign: ${campaignResult.title}. Send emails via Gmail and post to Socials.`)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Execute Campaign
                        </button>
                    </div>
                </div>
            )}

            {/* Output Console */}
            <div className="glass-card flex flex-col h-[500px] border border-white/10 relative overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-sm font-mono text-slate-400">Jules (Gemini DevOps) Output</span>
                    </div>
                    {isProcessing && <div className="text-xs text-indigo-400 animate-pulse font-mono">JULES IS WORKING...</div>}
                </div>
                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm">
                    {!plan && !isProcessing && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                            <Terminal className="w-16 h-16 mb-4" />
                            <p>Jules is online. Awaiting instructions...</p>
                        </div>
                    )}
                    {isProcessing && (
                        <div className="space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse"></div>
                        </div>
                    )}
                    {plan && (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{plan}</ReactMarkdown>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="relative flex items-center">
                        <span className="absolute left-4 text-indigo-500 font-bold">{'>'}</span>
                        <input
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                            placeholder="Enter command (e.g., 'Sync with GitHub', 'Check Amazon Pay', 'Update Alexa Skill')..."
                            className="w-full bg-transparent border-none text-white pl-8 pr-12 py-3 focus:ring-0 font-mono"
                            disabled={isProcessing}
                        />
                        <button
                            onClick={() => handleExecute()}
                            disabled={isProcessing || !command.trim()}
                            className="absolute right-2 p-2 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* THE GOD KEY - GLOBAL LAUNCH BUTTON */}
            <div className="mt-12 text-center pb-12">
                <div className="inline-block relative group cursor-pointer" onClick={() => handleExecute("Jules, INITIATE GLOBAL LAUNCH PROTOCOL. Force push to main, deploy to all nodes, and activate the Philanthropy Engine.")}>
                    <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-50 group-hover:opacity-80 animate-pulse"></div>
                    <button className="relative px-12 py-6 bg-gradient-to-b from-red-600 to-red-800 text-white font-black text-2xl rounded-full border-4 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-transform active:scale-95 hover:scale-105 flex items-center gap-4">
                        <Rocket className="w-10 h-10" />
                        INITIATE GLOBAL LAUNCH
                    </button>
                </div>
                <p className="text-red-400 mt-4 font-mono text-sm uppercase tracking-[0.2em] animate-pulse">
                    ⚠️ Authorization: Joshua Coleman (Architect)
                </p>
            </div>
        </main>
    );
};

export default CommandCenter;
