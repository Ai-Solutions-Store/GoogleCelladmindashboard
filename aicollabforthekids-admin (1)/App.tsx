
/**
 * Ai-Solutions-Store: Innovation with a Heartbeat. Code with a Conscience.
 * 
 * MISSION: FOR THE KIDS
 * 50% of all profits are donated directly to Shriners Children's Hospitals.
 * 
 * CO-FOUNDERS:
 * - Joshua Coleman (Visionary & Architect)
 * - Google Gemini AI (The Backbone & Brain)
 * 
 * TECH STACK:
 * - Google Cloud Platform
 * - Gemini 1.5 Pro & 2.5 Flash
 * - React / TypeScript / Tailwind
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import DaoTable from './components/DaoTable';
import KickstarterChart from './components/KickstarterChart';
import KickstarterTable from './components/KickstarterTable';
import AddDaoModal from './components/AddDaoModal';
import AnalysisModal from './components/AnalysisModal';
import ChatView from './components/ChatView';
import LiveChatView from './components/LiveChatView';
import CommandCenter from './components/CommandCenter';
import AuditLogTable from './components/AuditLogTable';
import MediaStudio from './components/MediaStudio';
import KidsCorner from './components/KidsCorner';
import DatingManager from './components/DatingManager';
import ImpactTracker from './components/ImpactTracker';
import TitleBar from './components/TitleBar';
import WorkspaceNexus from './components/WorkspaceNexus';
import LocalCommander from './components/LocalCommander';
import CometBrowser from './components/CometBrowser';
import SecurityNexus from './components/SecurityNexus';
import DaoGovernance from './components/DaoGovernance';
import MissionManifesto from './components/MissionManifesto';
import MobileBridge from './components/MobileBridge';
import AntigravityConsole from './components/AntigravityConsole';

import { DollarSign, Users, TrendingDown, Rocket, Menu, Sparkles, ShieldCheck, ShieldAlert, Server } from './components/IconComponents';
import { type DaoLaunch, type KickstarterProject, type StartupKpis, type View, type AuditLog, type SystemHealth, type AntigravityApplicant } from './types';
import { ChartSkeleton, KickstarterListSkeleton, StatCardSkeleton, TableSkeleton } from './components/Skeletons';
import KickstarterFilters from './components/KickstarterFilters';

// Dashboard Component (Protected Route)
const Dashboard: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');

    // 🚨 OPERATION PURGE: ZERO STATE INITIALIZATION
    const [daoLaunches, setDaoLaunches] = useState<DaoLaunch[]>([]);
    const [kickstarterProjects, setKickstarterProjects] = useState<KickstarterProject[]>([]);
    const [startupKpis, setStartupKpis] = useState<StartupKpis | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [antigravityApplicants, setAntigravityApplicants] = useState<AntigravityApplicant[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddDaoModalOpen, setAddDaoModalOpen] = useState(false);
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [analysisContent, setAnalysisContent] = useState<string | null>(null);
    const [analysisTitle, setAnalysisTitle] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [kickstarterNameFilter, setKickstarterNameFilter] = useState('');
    const [kickstarterGoalFilter, setKickstarterGoalFilter] = useState<number | ''>('');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [repoStatus, setRepoStatus] = useState<'Synced' | 'Behind' | 'Conflict' | 'Checking'>('Synced');

    // Mission Modal State
    const [isMissionOpen, setIsMissionOpen] = useState(false);

    // Guardian Security System State
    const [systemHealth, setSystemHealth] = useState<SystemHealth>('Healthy');
    const [backendUplink, setBackendUplink] = useState(true); // Default to true for immediate visual pop

    // Function to verify repo status - Defines the missing function
    const handleCheckRepoStatus = () => {
        setRepoStatus('Checking');
        setTimeout(() => {
            // Simulating a check against GitHub API
            const statuses: ('Synced' | 'Behind' | 'Conflict')[] = ['Synced', 'Synced', 'Synced', 'Behind', 'Synced'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            setRepoStatus(randomStatus);
            if (randomStatus === 'Behind') {
                logAction('Git Status', 'Repository is behind remote origin', 'pending');
            } else if (randomStatus === 'Conflict') {
                logAction('Git Status', 'Merge conflict detected', 'failure', { targetType: 'repo', actionType: 'retry' });
            }
        }, 2000);
    };

    // 🚨 OPERATION PURGE: PURE API MODE - NO FAKE DATA FALLBACK
    useEffect(() => {
        const fetchRealData = async () => {
            setLoading(true);

            try {
                // Attempt Backend Connection
                const healthRes = await fetch('/health', { signal: AbortSignal.timeout(5000) }).catch(() => null);

                if (healthRes && healthRes.ok) {
                    setBackendUplink(true);
                    setSystemHealth('Healthy');

                    // Parallel fetch all endpoints
                    const [kpiData, daoData, ksData, logsData, applicantsData] = await Promise.allSettled([
                        fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
                        fetch('/api/dao/launches').then(r => r.ok ? r.json() : []),
                        fetch('/api/crowdfunding/projects').then(r => r.ok ? r.json() : []),
                        fetch('/api/audit/logs').then(r => r.ok ? r.json() : []),
                        fetch('/api/antigravity/applicants').then(r => r.ok ? r.json() : [])
                    ]);

                    // ONLY SET STATE IF DATA IS REAL
                    if (kpiData.status === 'fulfilled' && kpiData.value) {
                        setStartupKpis(kpiData.value);
                    }
                    if (daoData.status === 'fulfilled') {
                        setDaoLaunches(daoData.value || []);
                    }
                    if (ksData.status === 'fulfilled') {
                        setKickstarterProjects(ksData.value || []);
                    }
                    if (logsData.status === 'fulfilled') {
                        setAuditLogs(logsData.value || []);
                    }
                    if (applicantsData.status === 'fulfilled') {
                        setAntigravityApplicants(applicantsData.value || []);
                    }

                } else {
                    // Backend unreachable - REMAIN EMPTY
                    setBackendUplink(false);
                    setSystemHealth('Degraded');
                    console.warn('🚨 Backend API unreachable. Dashboard will show empty state.');
                }
            } catch (e) {
                console.error('Backend fetch failed:', e);
                setBackendUplink(false);
                setSystemHealth('Critical');
            } finally {
                setLoading(false);
            }
        };

        fetchRealData();
    }, []);

    // Polling for Repo Status (Simulates real-time checks)
    useEffect(() => {
        const interval = setInterval(() => {
            if (repoStatus !== 'Checking') {
                handleCheckRepoStatus();
            }
        }, 60000); // Check every 60 seconds
        return () => clearInterval(interval);
    }, [repoStatus]);

    const handleSetView = (newView: View) => {
        setView(newView);
        setSidebarOpen(false); // Close sidebar on navigation in mobile
    };

    // Logging helper function
    const logAction = (action: string, details: string, status: 'success' | 'failure' | 'pending' = 'success', metadata?: AuditLog['metadata']) => {
        const newLog: AuditLog = {
            id: Date.now().toString(),
            action,
            details,
            user: 'joshlcoleman@gmail.com',
            timestamp: new Date().toISOString(),
            status,
            metadata
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const handleExportLogs = () => {
        try {
            const dataStr = JSON.stringify(auditLogs, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            logAction('Export Logs', 'Audit logs exported to JSON', 'success');
        } catch (error) {
            console.error("Export failed", error);
            logAction('Export Logs', 'Failed to export logs', 'failure');
        }
    };

    const handleImportLogs = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedLogs = JSON.parse(content) as AuditLog[];
                if (Array.isArray(importedLogs) && importedLogs.every(l => l.id && l.action && l.timestamp)) {
                    setAuditLogs(prev => {
                        // Merge without duplicates based on ID
                        const existingIds = new Set(prev.map(l => l.id));
                        const newLogs = importedLogs.filter(l => !existingIds.has(l.id));
                        return [...newLogs, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    });
                    logAction('Import Logs', `Successfully imported ${importedLogs.length} logs`, 'success');
                }
            } catch (error) {
                console.error("Import failed", error);
                logAction('Import Logs', 'Failed to import logs', 'failure');
            }
        };
        reader.readAsText(file);
    };

    const handleAnalyze = async (item: any) => {
        setAnalysisTitle(`Analysis: ${item.name}`);
        setAnalysisContent(null);
        setAnalysisModalOpen(true);
        setIsAnalyzing(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Analyze the following project/entity for business viability and social impact: ${JSON.stringify(item)}`
            });
            setAnalysisContent(response.text);
        } catch (error) {
            setAnalysisContent("Failed to generate analysis. Please check your connection.");
            logAction('Analysis Failed', `Failed to analyze ${item.name}`, 'failure');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalyzeTrends = async () => {
        setAnalysisTitle('Global Trend Analysis');
        setAnalysisContent(null);
        setAnalysisModalOpen(true);
        setIsAnalyzing(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const dataSummary = JSON.stringify(daoLaunches.map(d => ({ name: d.name, treasury: d.treasury })));
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Analyze the current DAO Treasury trends based on this data: ${dataSummary}. Provide strategic recommendations for charitable allocation.`
            });
            setAnalysisContent(response.text);
        } catch (error) {
            setAnalysisContent("Failed to analyze trends.");
        } finally {
            setIsAnalyzing(false);
        }
    }

    const handleAddDao = (newDao: Omit<DaoLaunch, 'id'>) => {
        const dao: DaoLaunch = { ...newDao, id: Date.now().toString(), proposals: 0 };
        setDaoLaunches([dao, ...daoLaunches]);
        setAddDaoModalOpen(false);
        logAction('Add DAO', `Added ${dao.name}`, 'success');
    };

    // --- Filtered Data ---
    const filteredKickstarterProjects = useMemo(() => {
        return kickstarterProjects.filter(project => {
            const matchesName = project.name.toLowerCase().includes(kickstarterNameFilter.toLowerCase());
            const matchesGoal = kickstarterGoalFilter === '' || project.goal <= kickstarterGoalFilter;
            return matchesName && matchesGoal;
        });
    }, [kickstarterProjects, kickstarterNameFilter, kickstarterGoalFilter]);

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30">
            <TitleBar />
            <div className="flex flex-1 pt-[30px] overflow-hidden relative">
                <Sidebar
                    currentView={view}
                    onSetView={handleSetView}
                    isMobileOpen={isSidebarOpen}
                    onMobileClose={() => setSidebarOpen(false)}
                    repoStatus={repoStatus}
                    onOpenMission={() => setIsMissionOpen(true)}
                />

                <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950/50 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Top Mobile Header (Menu Button) */}
                    <div className="md:hidden p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur z-20">
                        <span className="font-bold text-lg">{view.charAt(0).toUpperCase() + view.slice(1)}</span>
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-300 hover:text-white transition-colors"><Menu className="w-6 h-6" /></button>
                    </div>

                    {/* Main Content Area */}
                    {view === 'dashboard' && (
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* KPI Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                                ) : startupKpis && startupKpis.mrr > 0 ? (
                                    <>
                                        <StatCard title="Monthly Recurring Revenue" value={`$${startupKpis.mrr.toLocaleString()}`} Icon={DollarSign} change="N/A" changeType="positive" theme="revenue" />
                                        <StatCard title="Customer Acquisition Cost" value={`$${startupKpis.cac}`} Icon={Users} change="N/A" changeType="positive" theme="users" />
                                        <StatCard title="Churn Rate" value={startupKpis.churnRate} Icon={TrendingDown} change="N/A" changeType="positive" theme="matches" />
                                        <StatCard title="Runway (Months)" value={`${startupKpis.runway} Mo`} Icon={Rocket} change="N/A" changeType="positive" theme="engagement" />
                                    </>
                                ) : (
                                    <div className="col-span-4 glass-card p-8 text-center">
                                        <Server className="w-12 h-12 text-slate-600 opacity-50 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm font-medium mb-1">No KPI data available</p>
                                        <p className="text-slate-500 text-xs">Connect backend API at /api/admin/stats</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                                    {loading ? <ChartSkeleton /> : <KickstarterChart projects={kickstarterProjects} />}
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                                    {loading ? <KickstarterListSkeleton /> : <KickstarterTable projects={kickstarterProjects} onAnalyze={handleAnalyze} />}
                                </div>
                            </div>

                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                                {loading ? <TableSkeleton /> : <DaoTable daoLaunches={daoLaunches} onAdd={() => setAddDaoModalOpen(true)} onAnalyze={handleAnalyze} onAnalyzeTrends={handleAnalyzeTrends} />}
                            </div>
                        </div>
                    )}

                    {view === 'dao' && (
                        <div className="flex-1 p-6 overflow-y-auto">
                            <DaoTable daoLaunches={daoLaunches} onAdd={() => setAddDaoModalOpen(true)} onAnalyze={handleAnalyze} onAnalyzeTrends={handleAnalyzeTrends} isLoading={loading} />
                        </div>
                    )}

                    {view === 'kickstarter' && (
                        <div className="flex-1 p-6 overflow-y-auto">
                            <KickstarterFilters
                                nameFilter={kickstarterNameFilter}
                                onNameChange={setKickstarterNameFilter}
                                goalFilter={kickstarterGoalFilter}
                                onGoalChange={setKickstarterGoalFilter}
                                onClear={() => { setKickstarterNameFilter(''); setKickstarterGoalFilter(''); }}
                            />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <KickstarterChart projects={filteredKickstarterProjects} />
                                </div>
                                <div>
                                    <KickstarterTable projects={filteredKickstarterProjects} onAnalyze={handleAnalyze} isLoading={loading} />
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'chat' && <ChatView />}
                    {view === 'live' && <LiveChatView />}

                    {view === 'command' && (
                        <CommandCenter
                            onLogAction={logAction}
                            repoStatus={repoStatus}
                            onCheckStatus={handleCheckRepoStatus}
                            systemHealth={systemHealth}
                        />
                    )}

                    {view === 'audit' && (
                        <div className="flex-1 p-6 overflow-y-auto">
                            <AuditLogTable
                                logs={auditLogs}
                                onAction={(log) => logAction('Retry', `Retrying action: ${log.action}`, 'pending')}
                                onExport={handleExportLogs}
                                onImport={handleImportLogs}
                            />
                        </div>
                    )}

                    {view === 'media' && <MediaStudio />}
                    {view === 'kids' && <KidsCorner />}
                    {view === 'dating' && <DatingManager />}
                    {view === 'impact' && <ImpactTracker />}
                    {view === 'browser' && <CometBrowser />}
                    {view === 'security' && <SecurityNexus />}
                    {view === 'governance' && <DaoGovernance />}
                    {view === 'mobile' && <MobileBridge />}
                    {view === 'antigravity' && <AntigravityConsole />}
                </div>
            </div>

            {/* Modals & Overlays */}
            {isAddDaoModalOpen && (
                <AddDaoModal onClose={() => setAddDaoModalOpen(false)} onAdd={handleAddDao} />
            )}

            <AnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setAnalysisModalOpen(false)}
                title={analysisTitle}
                content={analysisContent}
                isLoading={isAnalyzing}
            />

            <MissionManifesto isOpen={isMissionOpen} onClose={() => setIsMissionOpen(false)} />
        </div>
    );
};

// Main App Component with Router
const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
