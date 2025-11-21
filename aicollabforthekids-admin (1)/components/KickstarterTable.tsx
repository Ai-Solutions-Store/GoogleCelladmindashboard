import React from 'react';
import { type KickstarterProject } from '../types';
import { Sparkles } from './IconComponents';

interface KickstarterTableProps {
  projects: KickstarterProject[];
  onAnalyze?: (project: KickstarterProject) => void;
  isLoading?: boolean;
}

const KickstarterTable: React.FC<KickstarterTableProps> = ({ projects, onAnalyze, isLoading = false }) => {
  return (
    <div className="glass-card h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-slate-100">Kickstarter Projects</h3>
      </div>
      <div className="p-4 overflow-y-auto">
        <ul className="space-y-4">
          {isLoading ? (
              // Skeleton Loader
              Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="animate-pulse">
                      <div className="flex justify-between items-center mb-2">
                          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                          <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 mb-2"></div>
                      <div className="flex justify-between items-center">
                           <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                           <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                      </div>
                  </li>
              ))
          ) : projects.length === 0 ? (
              <div className="text-center text-slate-500 py-8 italic">No active projects.</div>
          ) : (
              projects.map((project) => {
                const progress = Math.min((project.pledged / project.goal) * 100, 100);
                return (
                  <li key={project.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-medium text-slate-200">{project.name}</span>
                      <span className="text-slate-400 font-semibold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-lime-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1 text-slate-400">
                        <span>Pledged: ${project.pledged.toLocaleString()}</span>
                        {onAnalyze && (
                             <button
                                onClick={() => onAnalyze(project)}
                                className="group flex items-center justify-center text-indigo-400 hover:text-indigo-300 font-medium"
                                >
                                <Sparkles className="w-3 h-3 mr-1 text-indigo-500 group-hover:scale-110 transition-transform" />
                                Analyze
                            </button>
                        )}
                    </div>
                  </li>
                );
              })
          )}
        </ul>
      </div>
    </div>
  );
};

export default KickstarterTable;