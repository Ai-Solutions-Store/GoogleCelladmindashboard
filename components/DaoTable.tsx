import React from 'react';
import { type DaoLaunch } from '../types';
import { Plus, Sparkles } from './IconComponents';

interface DaoTableProps {
  daoLaunches: DaoLaunch[];
  onAdd?: () => void;
  onAnalyze: (dao: DaoLaunch) => void;
}

const DaoTable: React.FC<DaoTableProps> = ({ daoLaunches, onAdd, onAnalyze }) => {
  return (
    <div className="glass-card">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-slate-100">DAO Launches</h3>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-white/5">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Token</th>
              <th scope="col" className="px-6 py-3">Treasury</th>
              <th scope="col" className="px-6 py-3">Launch Date</th>
              <th scope="col" className="px-6 py-3 text-center">Proposals</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Analyze</span></th>
            </tr>
          </thead>
          <tbody>
            {daoLaunches.map((dao) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaoTable;