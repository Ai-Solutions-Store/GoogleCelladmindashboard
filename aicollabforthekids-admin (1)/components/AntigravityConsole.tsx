
import React, { useState, useEffect } from 'react';
import { AntigravityApplicant } from '../types';
import { Zap, CheckCircle, X, GitHub, Award, Cpu, Terminal, Activity, Layers, Globe, Server } from './IconComponents';

const AntigravityConsole: React.FC = () => {
    const [applicants, setApplicants] = useState<AntigravityApplicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeAgents, setActiveAgents] = useState(142);
    const [reasoningThreads, setReasoningThreads] = useState(8943);

    useEffect(() => {
        // 🚨 OPERATION PURGE: Fetch from API only, no mock data
        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/antigravity/applicants');
                if (response.ok) {
                    const data = await response.json();
                    setApplicants(data);
                } else {
                    setApplicants([]); // EMPTY STATE - NO MOCK DATA
                }
            } catch (e) {
                console.error('Failed to load applicants:', e);
                setApplicants([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        // Simulate live agent metrics
        const interval = setInterval(() => {
            setActiveAgents(prev => prev + Math.floor(Math.random() * 3) - 1);
            setReasoningThreads(prev => prev + Math.floor(Math.random() * 50) - 10);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleStatusChange = (id: string, newStatus: AntigravityApplicant['status']) => {
        setApplicants(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const getStatusBadge = (status: AntigravityApplicant['status']) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
            case 'rejected': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
            case 'under_review': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    return (
        <main className="flex-1 p-6 overflow-y-auto bg-[#050505] relative overflow-hidden h-full">
            {/* --- ZERO-G ATMOSPHERE --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Deep Space Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a0a1a] to-black"></div>

                {/* Floating Orbs (Gravity Wells) */}
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header: Command Deck */}
                <header className="glass-card p-8 mb-10 border-t-4 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-slate-900/40 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white flex items-center gap-4 tracking-tighter">
                            <div className="relative">
                                <Zap className="w-12 h-12 text-cyan-400 relative z-10" />
                                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 animate-pulse"></div>
                            </div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                                ANTIGRAVITY
                            </span>
                        </h1>
                        <p className="text-cyan-100/60 mt-2 text-lg font-light tracking-widest uppercase flex items-center gap-3">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
                            Agentic Development Platform
                        </p>
                    </div>

                    {/* System Vitality */}
                    <div className="flex gap-4">
                        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20 backdrop-blur-md">
                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Active Agents</p>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-cyan-300" />
                                <span className="text-2xl font-mono text-white">{activeAgents.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20 backdrop-blur-md">
                            <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">Reasoning Threads</p>
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-300" />
                                <span className="text-2xl font-mono text-white">{reasoningThreads.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Intake Pipeline Visualizer */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-400" />
                            Developer Intake Pipeline
                        </h2>
                        <div className="flex gap-2 text-xs font-mono text-slate-500">
                            <span>SYNC: AUTO</span>
                            <span className="text-green-500">ONLINE</span>
                        </div>
                    </div>

                    {/* Pipeline Nodes */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Applications Received', count: applicants.length, color: 'text-white', bg: 'bg-slate-800/50', border: 'border-white/10' },
                            { label: 'AI Analysis', count: applicants.length, color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/30' },
                            { label: 'Pending Review', count: applicants.filter(a => a.status === 'pending' || a.status === 'under_review').length, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-500/30' },
                            { label: 'Onboarded', count: applicants.filter(a => a.status === 'accepted').length, color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-500/30' }
                        ].map((stat, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${stat.border} ${stat.bg} backdrop-blur-sm flex flex-col justify-between h-24 relative overflow-hidden group`}>
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider z-10">{stat.label}</span>
                                <span className={`text-3xl font-black ${stat.color} z-10`}>{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Applicants Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                    {isLoading ? (
                        <div className="col-span-2 py-32 flex flex-col items-center justify-center">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
                            </div>
                            <p className="mt-6 text-cyan-300 font-mono tracking-widest text-sm">INITIALIZING GRAVITY WELL...</p>
                        </div>
                    ) : applicants.length === 0 ? (
                        <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center">
                            <Zap className="w-16 h-16 text-slate-700 mb-4 opacity-30" />
                            <h3 className="text-lg font-semibold text-slate-400 mb-2">No Applicants Yet</h3>
                            <p className="text-slate-500 text-sm max-w-md">
                                Applicant data will appear here when available from the backend API.
                            </p>
                        </div>
                    ) : (
                        applicants.map((app, index) => (
                            <div
                                key={app.id}
                                className="group glass-card p-0 border border-white/10 bg-slate-900/60 hover:bg-slate-800/90 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden rounded-2xl"
                                style={{
                                    animation: `float 8s ease-in-out infinite`,
                                    animationDelay: `${index * 0.8}s`
                                }}
                            >
                                {/* Floating Card Effects */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <div className="p-6 flex flex-col h-full">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden
                                                ${app.specialty === 'AI/ML' ? 'bg-gradient-to-br from-blue-600 to-cyan-500' :
                                                    app.specialty === 'Blockchain' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                                                        'bg-gradient-to-br from-purple-600 to-pink-500'
                                                }`}>
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                                {app.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{app.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono uppercase flex items-center gap-1">
                                                        <Terminal className="w-3 h-3" /> {app.specialty}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono uppercase flex items-center gap-1">
                                                        <Globe className="w-3 h-3" /> {app.email.split('@')[1]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Score Badge */}
                                        <div className="flex flex-col items-end">
                                            <div className={`flex items-center gap-1 text-sm font-bold ${app.score >= 90 ? 'text-yellow-400' : 'text-slate-400'}`}>
                                                <Award className="w-4 h-4" />
                                                <span>AI SCORE</span>
                                            </div>
                                            <div className={`text-3xl font-black ${app.score >= 90 ? 'text-white drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-slate-500'}`}>
                                                {app.score}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pitch Content */}
                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6 flex-1 relative">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-700 rounded-l-xl"></div>
                                        <p className="text-slate-300 text-sm italic leading-relaxed pl-2">"{app.pitch}"</p>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                        <a href={`https://github.com/${app.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono group/link">
                                            <GitHub className="w-4 h-4 group-hover/link:text-white transition-colors" />
                                            github.com/{app.github}
                                        </a>

                                        <div className="flex items-center gap-3">
                                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                                                {app.status.replace('_', ' ')}
                                            </div>

                                            {app.status !== 'accepted' && app.status !== 'rejected' && (
                                                <div className="flex gap-2 ml-2 pl-2 border-l border-white/10">
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'accepted')}
                                                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/20"
                                                        title="Accept into Program"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'rejected')}
                                                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/30 transition-all shadow-lg hover:shadow-rose-500/20"
                                                        title="Reject Application"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6,182,212,0.3);
                    border-radius: 3px;
                }
            `}</style>
        </main>
    );
};

export default AntigravityConsole;
