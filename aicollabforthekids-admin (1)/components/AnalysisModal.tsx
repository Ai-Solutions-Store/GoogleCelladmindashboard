import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles } from './IconComponents';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | null;
  isLoading: boolean;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, title, content, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-modal-content w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
            {title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="text-slate-400">Generating AI analysis...</p>
            </div>
          )}
          {content && (
             <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;