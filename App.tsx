import React, { useState, useEffect, useMemo } from 'react';

import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import DaoTable from './components/DaoTable';
import KickstarterChart from './components/KickstarterChart';
import KickstarterTable from './components/KickstarterTable';
import AddDaoModal from './components/AddDaoModal';
import AnalysisModal from './components/AnalysisModal';
import ChatView from './components/ChatView';
import LiveChatView from './components/LiveChatView';
import { DollarSign, Users, TrendingDown, Rocket, Menu, Sparkles } from './components/IconComponents';
import { initialDaoLaunches, initialKickstarterProjects, initialStartupKpis } from './data/mockData';
import { type DaoLaunch, type KickstarterProject, type StartupKpis, type View } from './types';
import { ChartSkeleton, KickstarterListSkeleton, StatCardSkeleton, TableSkeleton } from './components/Skeletons';
import KickstarterFilters from './components/KickstarterFilters';
import { generateAnalysis, createAnalysisPrompt } from './utils/aiApi';

/**
 * Simulates fetching the number of proposals for a given DAO.
 * @param daoId The ID of the DAO.
 * @returns A promise that resolves to the number of proposals.
 */
const fetchDaoProposals = (daoId: string): Promise<number> => {
    // Simulate network delay to fetch proposals
    return new Promise(resolve => {
        const delay = 500 + Math.random() * 1500;
        setTimeout(() => {
            const proposalCount = Math.floor(Math.random() * 45) + 5; // e.g., 5 to 50 proposals
            resolve(proposalCount);
        }, delay);
    });
};

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [daoLaunches, setDaoLaunches] = useState<DaoLaunch[]>([]);
    const [kickstarterProjects, setKickstarterProjects] = useState<KickstarterProject[]>([]);
    const [startupKpis, setStartupKpis] = useState<StartupKpis | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAddDaoModalOpen, setAddDaoModalOpen] = useState(false);
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [analysisContent, setAnalysisContent] = useState<string | null>(null);
    const [analysisTitle, setAnalysisTitle] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [kickstarterNameFilter, setKickstarterNameFilter] = useState('');
    const [kickstarterGoalFilter, setKickstarterGoalFilter] = useState<number | ''>('');
    const [isSidebarOpen, setSidebarOpen] = useState(false);


    useEffect(() => {
        // Simulate initial data fetching
        setTimeout(() => {
            setDaoLaunches(initialDaoLaunches); // Set with null proposals first
            setKickstarterProjects(initialKickstarterProjects);
            setStartupKpis(initialStartupKpis);
            setLoading(false);

            // Asynchronously fetch and update proposal counts for each DAO
            initialDaoLaunches.forEach(async (dao) => {
                const proposalCount = await fetchDaoProposals(dao.id);
                setDaoLaunches(prevDaos =>
                    prevDaos.map(d =>
                        d.id === dao.id ? { ...d, proposals: proposalCount } : d
                    )
                );
            });
        }, 1500);
    }, []);
    
    const handleSetView = (newView: View) => {
        setView(newView);
        setSidebarOpen(false); // Close sidebar on navigation in mobile
    };

    const handleAddDao = (newDao: Omit<DaoLaunch, 'id'>) => {
        const newDaoWithId = { ...newDao, id: (daoLaunches.length + 1).toString() };
        setDaoLaunches(prev => [...prev, newDaoWithId]);

        // Asynchronously fetch and update the proposal count for the new DAO
        fetchDaoProposals(newDaoWithId.id).then(proposalCount => {
            setDaoLaunches(prevDaos =>
                prevDaos.map(d =>
                    d.id === newDaoWithId.id ? { ...d, proposals: proposalCount } : d
                )
            );
        });
    };

    const handleAnalyze = async (item: DaoLaunch | KickstarterProject | 'kpis') => {
        let prompt = '';
        let title = '';
        if (item === 'kpis') {
            title = 'Startup KPIs Analysis';
            prompt = createAnalysisPrompt('Startup KPIs', startupKpis);
        } else {
            title = `Analysis for ${item.name}`;
            prompt = createAnalysisPrompt('project', item);
        }

        setAnalysisTitle(title);
        setAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisContent(null);

        try {
            // Use abstracted API call that can route to backend proxy
            const response = await generateAnalysis({
                prompt,
                model: 'gemini-2.5-pro',
                thinkingBudget: 32768
            });

            if (response.error) {
                setAnalysisContent(response.error);
            } else {
                setAnalysisContent(response.text);
            }
        } catch (error) {
            console.error("Error generating analysis:", error);
            setAnalysisContent("Sorry, I couldn't generate an analysis at this time. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const filteredKickstarterProjects = useMemo(() => {
        return kickstarterProjects.filter(project => {
            const nameMatch = project.name.toLowerCase().includes(kickstarterNameFilter.toLowerCase());
            const goalMatch = kickstarterGoalFilter === '' || project.goal <= kickstarterGoalFilter;
            return nameMatch && goalMatch;
        });
    }, [kickstarterProjects, kickstarterNameFilter, kickstarterGoalFilter]);

    const kpiCards = useMemo(() => startupKpis ? [
        { title: 'Monthly Recurring Revenue', value: `$${(startupKpis.mrr / 1000).toFixed(1)}k`, Icon: DollarSign, change: '+18.2%', changeType: 'positive', theme: 'revenue' },
        { title: 'Customer Acquisition Cost', value: `$${startupKpis.cac}`, Icon: Users, change: '-5.1%', changeType: 'positive', theme: 'users' },
        { title: 'Churn Rate', value: startupKpis.churnRate, Icon: TrendingDown, change: '+0.3%', changeType: 'negative', theme: 'matches' },
        { title: 'Monthly Burn Rate', value: `$${(startupKpis.burnRate / 1000).toFixed(0)}k`, Icon: Rocket, change: '-2.0%', changeType: 'positive', theme: 'engagement' },
    ] as const : [], [startupKpis]);

    const handleClearKickstarterFilters = () => {
        setKickstarterNameFilter('');
        setKickstarterGoalFilter('');
    };
    
    const viewTitles: Record<View, string> = {
         dashboard: 'Dashboard Overview',
         dao: 'DAO Launches',
         kickstarter: 'Kickstarter Projects',
         chat: 'AI Chat',
         live: 'Live Chat',
    };

    const renderContent = () => {
        if (view === 'chat') {
            return <ChatView />;
        }
        if (view === 'live') {
            return <LiveChatView />;
        }

        return (
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                {/* Unified Header */}
                 <header className="glass-card p-4 md:p-6 mb-8 flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-100">{viewTitles[view]}</h1>
                    <button 
                        onClick={() => setSidebarOpen(true)} 
                        className="md:hidden text-slate-400 hover:text-white"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                        <span>Last updated:</span>
                        <span className="font-semibold text-slate-300">{new Date().toLocaleTimeString()}</span>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto">
                    {view === 'dashboard' && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                                ) : (
                                    kpiCards.map(kpi => <StatCard key={kpi.title} {...kpi} />)
                                )}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    {loading ? <TableSkeleton /> : <DaoTable daoLaunches={daoLaunches} onAnalyze={handleAnalyze} />}
                                </div>
                                <div>
                                    {loading ? <KickstarterListSkeleton /> : <KickstarterTable projects={kickstarterProjects} />}
                                </div>
                            </div>
                        </>
                    )}

                    {view === 'dao' && (
                        <div>
                            {loading ? <TableSkeleton /> : (
                                <DaoTable
                                    daoLaunches={daoLaunches}
                                    onAdd={() => setAddDaoModalOpen(true)}
                                    onAnalyze={handleAnalyze}
                                />
                            )}
                        </div>
                    )}

                    {view === 'kickstarter' && (
                        <>
                            {!loading && (
                                <KickstarterFilters 
                                    nameFilter={kickstarterNameFilter}
                                    onNameChange={setKickstarterNameFilter}
                                    goalFilter={kickstarterGoalFilter}
                                    onGoalChange={setKickstarterGoalFilter}
                                    onClear={handleClearKickstarterFilters}
                                />
                            )}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                <div className="lg:col-span-3">
                                    {loading ? <ChartSkeleton /> : <KickstarterChart projects={filteredKickstarterProjects} />}
                                </div>
                                <div className="lg:col-span-2">
                                    {loading ? <KickstarterListSkeleton /> : <KickstarterTable projects={filteredKickstarterProjects} onAnalyze={handleAnalyze} />}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        );
    };

    return (
        <div className="flex h-screen bg-dark-bg text-slate-200 font-sans">
            <Sidebar 
                currentView={view} 
                onSetView={handleSetView}
                isMobileOpen={isSidebarOpen}
                onMobileClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {renderContent()}
            </div>

            {isAddDaoModalOpen && (
                <AddDaoModal
                    onClose={() => setAddDaoModalOpen(false)}
                    onAdd={handleAddDao}
                />
            )}
            {isAnalysisModalOpen && (
                <AnalysisModal
                    isOpen={isAnalysisModalOpen}
                    onClose={() => setAnalysisModalOpen(false)}
                    title={analysisTitle}
                    content={analysisContent}
                    isLoading={isAnalyzing}
                />
            )}
        </div>
    );
};

export default App;