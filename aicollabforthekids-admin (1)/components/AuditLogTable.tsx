
import React, { useRef } from 'react';
import { type AuditLog } from '../types';
import { ShieldCheck, ClipboardList, Lock, RefreshCw, Download, Upload, FileJson } from './IconComponents';

interface AuditLogTableProps {
  logs: AuditLog[];
  onAction?: (log: AuditLog) => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onAction, onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImport) {
        onImport(e.target.files[0]);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-card">
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                System Audit Logs
            </h3>
            <div className="text-xs text-slate-400">
                Tracking all administrative actions
            </div>
        </div>
        <div className="flex items-center gap-3">
            {onImport && (
                <>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept=".json" 
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-white/10"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        Import
                    </button>
                </>
            )}
            {onExport && (
                <button 
                    onClick={onExport}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg"
                >
                    <Download className="w-3.5 h-3.5" />
                    Export Logs
                </button>
            )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-white/5">
            <tr>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Action</th>
              <th scope="col" className="px-6 py-3">Details</th>
              <th scope="col" className="px-6 py-3 text-right">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center opacity-50">
                            <FileJson className="w-12 h-12 mb-3 text-slate-600" />
                            <p>No audit logs available.</p>
                            <p className="text-xs mt-1">Actions performed will appear here.</p>
                        </div>
                    </td>
                </tr>
            ) : (
                logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                        {log.user}
                    </td>
                    <td className="px-6 py-4">
                        <span className="font-semibold text-white">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={log.details}>
                        {log.details}
                    </td>
                    <td className="px-6 py-4 text-right">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'success' ? 'bg-green-900/50 text-green-400 border border-green-500/20' :
                            log.status === 'failure' ? 'bg-red-900/50 text-red-400 border border-red-500/20' :
                            'bg-yellow-900/50 text-yellow-400 border border-yellow-500/20'
                         }`}>
                            {log.status === 'success' && <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>}
                            {log.status.toUpperCase()}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        {log.metadata?.actionType === 'security' && onAction && (
                            <button 
                                onClick={() => onAction(log)}
                                className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                                title="Lock Account"
                            >
                                <Lock className="w-4 h-4" />
                            </button>
                        )}
                        {log.metadata?.actionType === 'retry' && onAction && (
                            <button 
                                onClick={() => onAction(log)}
                                className="p-2 bg-indigo-500/10 text-indigo-400 rounded hover:bg-indigo-500/20 transition-colors"
                                title="Retry Operation"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        )}
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

export default AuditLogTable;
