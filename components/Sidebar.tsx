import React from 'react';
import { LayoutDashboard, Rocket, Target, MessageSquare, GitHub, Aperture, Mic, X } from './IconComponents';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  onSetView: (view: View) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, isMobileOpen, onMobileClose }) => {
  const navItems: { view: View; label: string; icon: React.ElementType }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'dao', label: 'DAO Launches', icon: Rocket },
    { view: 'kickstarter', label: 'Kickstarter', icon: Target },
    { view: 'chat', label: 'AI Chat', icon: MessageSquare },
    { view: 'live', label: 'Live Chat', icon: Mic },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-800/80 backdrop-blur-2xl flex-shrink-0 border-r border-white/10 flex flex-col transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center">
            <Aperture className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold ml-2 text-slate-100 logo-gradient">YouAndI-AI</h1>
          </div>
          <button onClick={onMobileClose} className="md:hidden text-slate-400" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul>
            {navItems.map(item => (
              <li key={item.view}>
                <button
                  onClick={() => onSetView(item.view)}
                  className={`flex items-center w-full px-4 py-3 my-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentView === item.view
                      ? 'bg-indigo-500/80 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <a 
              href="https://github.com/YouAndI-AI/YouAndI-AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors duration-200"
          >
            <GitHub className="w-5 h-5 mr-3" />
            View on GitHub
          </a>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;