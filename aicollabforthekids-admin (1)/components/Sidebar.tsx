
import React from 'react';
import { LayoutDashboard, Rocket, Target, MessageSquare, GitHub, Aperture, Mic, X, Terminal, ClipboardList, Image, Smile, BookOpen, Heart, Globe, Compass, ShieldCheck, Users, Info, Smartphone, Zap } from './IconComponents';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  onSetView: (view: View) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  repoStatus?: 'Synced' | 'Behind' | 'Conflict' | 'Checking';
  onOpenMission?: () => void; // New prop to open Mission Modal
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, isMobileOpen, onMobileClose, repoStatus = 'Synced', onOpenMission }) => {
  
  const menuGroups = [
    {
      title: "Governance",
      items: [
        { view: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { view: 'command', label: 'Command Center', icon: Terminal },
        { view: 'governance', label: 'DAO Governance', icon: Users },
        { view: 'audit', label: 'Audit Logs', icon: ClipboardList },
        { view: 'security', label: 'Security Nexus', icon: ShieldCheck },
        { view: 'impact', label: 'Global Impact', icon: Globe },
      ]
    },
    {
      title: "Ventures",
      items: [
         { view: 'dating', label: 'Dating Platform', icon: Heart },
         { view: 'dao', label: 'DAO Launches', icon: Rocket },
         { view: 'kickstarter', label: 'Kickstarter', icon: Target },
         { view: 'antigravity', label: 'Antigravity Program', icon: Zap },
      ]
    },
    {
      title: "Creative Suite",
      items: [
        { view: 'media', label: 'Media Studio', icon: Image },
        { view: 'kids', label: 'Edu-Gen Studio', icon: BookOpen }, 
      ]
    },
    {
      title: "Intelligence",
      items: [
        { view: 'browser', label: 'Comet Browser', icon: Compass },
        { view: 'chat', label: 'AI Chat', icon: MessageSquare },
        { view: 'live', label: 'Live Console', icon: Mic },
        { view: 'mobile', label: 'Mobile Bridge', icon: Smartphone },
      ]
    }
  ];

  const getStatusColor = () => {
      switch (repoStatus) {
          case 'Synced': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
          case 'Behind': return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
          case 'Conflict': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
          case 'Checking': return 'bg-blue-500 animate-pulse';
          default: return 'bg-slate-500';
      }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl flex-shrink-0 border-r border-white/10 flex flex-col transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center justify-between px-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 mr-3">
                <Aperture className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-slate-100 logo-gradient leading-none">Ai-Solutions</h1>
                <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Store Admin</span>
            </div>
          </div>
          <button onClick={onMobileClose} className="md:hidden text-slate-400 hover:text-white transition-colors" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          {/* Mission Button - Prominent */}
          <div className="mb-6">
             <button
                onClick={onOpenMission}
                className="group flex items-center w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-pink-900/50 to-purple-900/50 border border-pink-500/30 text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-[1.02]"
             >
                <Heart className="w-5 h-5 mr-3 text-pink-500 fill-pink-500 animate-pulse" />
                <span>Our Mission</span>
             </button>
          </div>

          {menuGroups.map((group) => (
            <div key={group.title} className="mb-8">
              <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map(item => {
                  const isActive = currentView === item.view;
                  return (
                    <li key={item.view}>
                      <button
                        onClick={() => onSetView(item.view as View)}
                        className={`group flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                        }`}
                      >
                        {/* Active Glow Overlay */}
                        {isActive && (
                            <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none"></div>
                        )}
                        
                        <item.icon 
                            className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                                isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'
                            }`} 
                        />
                        <span className="relative z-10">{item.label}</span>

                        {/* Active Indicator Dot */}
                        {isActive && (
                            <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10 bg-black/20">
          <a 
              href="https://github.com/Trollz1004/AiCollabFortheKids" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200 group border border-transparent hover:border-white/5"
          >
            <GitHub className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
            <div className="flex flex-col flex-1">
                <span className="font-bold">System Status</span>
                <span className="text-[10px] opacity-70">Repo: {repoStatus}</span>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor()}`}></span>
          </a>
        </div>
      </aside>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
