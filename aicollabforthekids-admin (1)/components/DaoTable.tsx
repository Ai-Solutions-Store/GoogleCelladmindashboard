import React, { useState, useMemo } from 'react';
import { type DaoLaunch } from '../types';
import { Plus, Sparkles, ArrowUp, ArrowDown } from './IconComponents';

interface DaoTableProps {
  daoLaunches: DaoLaunch[];
  onAdd?: () => void;
  onAnalyze: (dao: DaoLaunch) => void;
  onAnalyzeTrends?: () => void;
  isLoading?: boolean;
}

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: keyof DaoLaunch;
  direction: SortDirection;
}

const DaoTable: React.FC<DaoTableProps> = ({ daoLaunches, onAdd, onAnalyze, onAnalyzeTrends, isLoading = false }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedDaos = useMemo(() => {
    const sortableItems = [...daoLaunches];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'launchDate') {
          const dateA = new Date(a.launchDate).getTime();
          const dateB = new Date(b.launchDate).getTime();
          if (dateA < dateB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [daoLaunches, sortConfig]);

  const requestSort = (key: keyof DaoLaunch) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="glass-card">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-slate-100">DAO Launches</h3>
        <div className="flex items-center gap-3">
          {onAnalyzeTrends && (
            <button
              onClick={onAnalyzeTrends}
              disabled={isLoading || daoLaunches.length === 0}
              className="flex items-center px-3 py-1.5 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Analyze Trends
            </button>
          )}
          {onAdd && (
            <button onClick={onAdd} disabled={isLoading} className="flex items-center px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-white/5">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Token</th>
              <th scope="col" className="px-6 py-3">Treasury</th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer hover:text-white group select-none"
                onClick={() => requestSort('launchDate')}
                title="Sort by Launch Date"
              >
                <div className="flex items-center">
                  Launch Date
                  <span className="ml-1 flex items-center">
                    {sortConfig?.key === 'launchDate' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-400" /> : <ArrowDown className="w-3 h-3 text-indigo-400" />
                    ) : (
                      <div className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity">
                        <ArrowUp className="w-3 h-3" />
                      </div>
                    )}
                  </span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center">Proposals</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Analyze</span></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5 animate-pulse">
                  <th scope="row" className="px-6 py-4">
                    <div className="h-5 bg-slate-700 rounded w-32"></div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-slate-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-slate-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-slate-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-5 bg-slate-700 rounded w-8 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-5 bg-slate-700 rounded w-16 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : sortedDaos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Sparkles className="w-12 h-12 text-slate-600 opacity-50" />
                    <p className="text-slate-500 font-medium">No DAO launches available</p>
                    <p className="text-slate-600 text-sm">Connect to backend or add your first launch</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedDaos.map((dao) => (
                <tr key={dao.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{dao.name}</th>
                  <td className="px-6 py-4">{dao.token}</td>
                  <td className="px-6 py-4">${dao.treasury.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(dao.launchDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    {dao.proposals === null ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                      </div>
                    ) : (
                      dao.proposals
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onAnalyze(dao)}
                      className="group flex items-center justify-center text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <Sparkles className="w-4 h-4 mr-1 text-indigo-500 group-hover:scale-110 transition-transform" />
                      Analyze
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaoTable;