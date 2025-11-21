

import React, { useState } from 'react';
import { Users, Vote, PieChart, CheckCircle, ArrowRight, ShieldCheck, Target } from './IconComponents';
import { GovernanceProposal, TreasuryAsset } from '../types';

const DaoGovernance: React.FC = () => {
  // Mock Data
  const [proposals, setProposals] = useState<GovernanceProposal[]>([
      { id: '1', title: 'Fund New MRI Wing', description: 'Allocate Q4 surplus to Shriners Boston MRI Upgrade.', votesFor: 12500, votesAgainst: 450, status: 'active', endDate: '2 days' },
      { id: '2', title: 'Expand Operations to Asia', description: 'Increase operational budget for new outreach.', votesFor: 8000, votesAgainst: 9200, status: 'active', endDate: '5 days' },
      { id: '3', title: 'Q3 Donation Disbursement', description: 'Release funds to verified wallet.', votesFor: 25000, votesAgainst: 0, status: 'passed', endDate: 'Closed' }
  ]);

  const [treasury, setTreasury] = useState<TreasuryAsset[]>([
      { asset: 'ETH', amount: 45.2, valueUsd: 85000, allocation: 'Charity (50%)' },
      { asset: 'USDC', amount: 50000, valueUsd: 50000, allocation: 'Operations (50%)' },
  ]);

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
        <header className="glass-card p-6 mb-8 border-l-4 border-purple-500 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-400" />
                    For The Kids DAO
                </h1>
                <p className="text-slate-400 mt-1">Decentralized Philanthropy. Immutable Impact.</p>
            </div>
            <div className="text-right">
                 <div className="flex items-center gap-2 justify-end text-green-400 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Smart Contract Active</span>
                 </div>
                 <p className="text-xs text-slate-500">Contract: 0xAiCollab...88</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* The Split Visualizer */}
            <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <PieChart className="w-32 h-32 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6">The Immutable Split (50/50)</h3>
                
                <div className="flex items-center justify-center gap-8">
                    {/* Charity Side */}
                    <div className="flex-1 bg-green-900/20 border border-green-500/30 rounded-2xl p-6 text-center relative">
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                             AUTOMATED
                         </div>
                         <Target className="w-10 h-10 text-green-400 mx-auto mb-3" />
                         <h4 className="text-2xl font-black text-white mb-1">50%</h4>
                         <p className="text-sm text-green-300 font-medium">Shriners Hospitals</p>
                         <p className="text-xs text-slate-400 mt-2">Direct Wallet Transfer</p>
                    </div>

                    <div className="text-slate-600">
                        <ArrowRight className="w-8 h-8" />
                    </div>

                    {/* Ops Side */}
                    <div className="flex-1 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 text-center">
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                             <Users className="w-6 h-6 text-blue-400" />
                         </div>
                         <h4 className="text-2xl font-black text-white mb-1">50%</h4>
                         <p className="text-sm text-blue-300 font-medium">Operations & Growth</p>
                         <p className="text-xs text-slate-400 mt-2">Reinvested in Platform</p>
                    </div>
                </div>
            </div>

            {/* My Voting Power */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4">Your Governance Power</h3>
                <div className="bg-purple-900/30 rounded-xl p-6 text-center border border-purple-500/30 mb-4">
                    <p className="text-sm text-purple-300 uppercase tracking-wider mb-1">Impact Tokens</p>
                    <p className="text-4xl font-black text-white">1,250</p>
                </div>
                <p className="text-xs text-slate-400 text-center">
                    You have <span className="text-white font-bold">Top 5%</span> voting weight. 
                    Use your tokens to direct funds to specific hospital needs.
                </p>
            </div>
        </div>

        {/* Active Proposals */}
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Vote className="w-6 h-6 text-yellow-400" />
            Active Governance Proposals
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
            {proposals.map(prop => (
                <div key={prop.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                prop.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                            }`}>
                                {prop.status}
                            </span>
                            <span className="text-xs text-slate-500">Ends in: {prop.endDate}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{prop.title}</h4>
                        <p className="text-sm text-slate-400">{prop.description}</p>
                    </div>
                    
                    <div className="w-full md:w-1/3">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-400 font-bold">Yes ({((prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100).toFixed(1)}%)</span>
                            <span className="text-red-400 font-bold">No</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                            <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100}%` }}
                            ></div>
                        </div>
                        <div className="mt-4 flex gap-2">
                             <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors">
                                 Vote Yes
                             </button>
                             <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-colors">
                                 Vote No
                             </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </main>
  );
};

export default DaoGovernance;