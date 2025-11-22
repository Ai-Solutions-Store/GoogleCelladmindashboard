
import React, { useState, useEffect } from 'react';
import { Globe, Heart, Activity, Users, DollarSign, TrendingDown, HeartHandshake, Sparkles } from './IconComponents';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ImpactTracker: React.FC = () => {
  // RULE OF ZERO: Initialize to actual zero, no fakes.
  const [totalDonations, setTotalDonations] = useState(0.00);
  const [livesImpacted, setLivesImpacted] = useState(0);
  const [recentDonations, setRecentDonations] = useState<{user: string, amount: number, location: string, time: string}[]>([]);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [strategyPanel, setStrategyPanel] = useState(false);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Fetch Real Data (Placeholder for backend connection)
  useEffect(() => {
      const fetchImpactData = async () => {
          try {
              // const response = await fetch('/api/impact/stats');
              // const data = await response.json();
              // setTotalDonations(data.total);
              // setLivesImpacted(data.lives);
              // setRecentDonations(data.recent);
          } catch (error) {
              console.log("Waiting for live data connection...");
          }
      };
      fetchImpactData();
  }, []);

  const generateInsight = async () => {
      setIsLoadingInsight(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          // Contextual awareness for AI: "Donation data is currently 0" is a valid state to analyze (needs launch strategy)
          const prompt = totalDonations === 0 
            ? "The charity platform has just launched and currently has $0 donations. Suggest 3 aggressive launch strategies to get the first donor today."
            : `Analyze the following donation trend: Total $${totalDonations}, Lives Impacted ${livesImpacted}. Suggest 3 ways to increase global reach.`;

          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
          });
          setAiInsight(response.text);
      } catch (e) {
          console.error(e);
          setAiInsight("Unable to generate insight at this moment.");
      } finally {
          setIsLoadingInsight(false);
      }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
        <header className="glass-card p-6 mb-8 border-l-4 border-pink-500 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Globe className="w-8 h-8 text-pink-400" />
                    Global Impact Tracker
                </h1>
                <p className="text-slate-400 mt-1">Real-time visualization of charitable reach</p>
            </div>
            <div className="flex items-center gap-4">
                        <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total Raised</p>
                    <p className="text-3xl font-bold text-green-400">${totalDonations.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                        <button
                            onClick={() => setStrategyPanel(s => !s)}
                            className="ml-6 text-xs px-3 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white shadow-inner"
                        >{strategyPanel ? 'Hide Strategy' : 'Show Strategy'}</button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Visualization */}
            <div className="lg:col-span-2 glass-card p-6 min-h-[400px] relative overflow-hidden flex items-center justify-center bg-blue-950/30">
                <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-slate-500">
                        <path d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150" stroke="none" />
                    </svg>
                </div>
                <div className="relative z-10 text-center">
                    <div className="inline-block p-4 rounded-full bg-pink-500/20 backdrop-blur-md mb-4 border border-pink-500/30">
                        <HeartHandshake className="w-16 h-16 text-pink-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Shriners Hospitals Network</h2>
                    <p className="text-slate-300 max-w-md mx-auto">
                        Awaiting donation data to visualize impact.
                    </p>
                </div>
            </div>

            {/* Stats & Feed */}
            <div className="space-y-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Lives Impacted
                    </h3>
                    <div className="text-4xl font-black text-white mb-2">{livesImpacted.toLocaleString()}</div>
                    <p className="text-sm text-slate-400">Children receiving care.</p>
                </div>

                <div className="glass-card p-6 flex-1">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        Live Donation Feed
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {recentDonations.length === 0 ? (
                             <div className="text-center py-8 text-slate-500">
                                 <p>No transactions yet.</p>
                             </div>
                        ) : (
                            recentDonations.map((donation, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div>
                                        <p className="font-bold text-white text-sm">{donation.user}</p>
                                        <p className="text-xs text-slate-400">{donation.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-400">+${donation.amount}</p>
                                        <p className="text-[10px] text-slate-500">{donation.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                                <div className="glass-card p-6 border border-purple-500/30">
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-purple-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> AI Optimization
                        </h3>
                        <button onClick={generateInsight} disabled={isLoadingInsight} className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-white">
                            {isLoadingInsight ? 'Analyzing...' : 'Analyze'}
                        </button>
                     </div>
                     {aiInsight ? (
                         <div className="prose prose-invert prose-sm max-w-none">
                             <ReactMarkdown>{aiInsight}</ReactMarkdown>
                         </div>
                     ) : (
                         <p className="text-xs text-slate-500 italic">Generate Launch Strategy</p>
                     )}
                </div>

                                {strategyPanel && (
                                    <div className="glass-card p-6 border border-pink-500/30">
                                        <h3 className="text-lg font-bold text-pink-300 mb-4">Holiday 2025 Strategic Activation</h3>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            <li>
                                                <span className="font-semibold text-white">1. Tribute Gift Shop:</span> Hyper-personalized outcomes (Burn Kit, Teddy Bear, Wound Care Pack). <span className="text-pink-400">"Stop giving stuff. Give survival."</span>
                                            </li>
                                            <li>
                                                <span className="font-semibold text-white">2. Flash-Match Sprint:</span> Surprise 4-hour window with triple matching & live countdown.
                                            </li>
                                            <li>
                                                <span className="font-semibold text-white">3. Tiny Heroes Clips:</span> 3 x 15s resilient recovery moments (#TinyHeroes #GiantHearts).
                                            </li>
                                        </ul>
                                        <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                                            <div className="p-3 rounded bg-white/5">
                                                <p className="text-xs uppercase text-slate-400">Launch KPI</p>
                                                <p className="text-lg font-bold text-white">First Donor &lt;24h</p>
                                            </div>
                                            <div className="p-3 rounded bg-white/5">
                                                <p className="text-xs uppercase text-slate-400">Match Peak</p>
                                                <p className="text-lg font-bold text-white">3x Baseline</p>
                                            </div>
                                            <div className="p-3 rounded bg-white/5">
                                                <p className="text-xs uppercase text-slate-400">Tribute Conv</p>
                                                <p className="text-lg font-bold text-white">&gt;12%</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
            </div>
        </div>
    </main>
  );
};

export default ImpactTracker;
