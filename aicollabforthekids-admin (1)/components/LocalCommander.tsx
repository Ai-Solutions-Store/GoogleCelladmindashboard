
import React, { useState } from 'react';
import { Folder, FileText, Save, UploadCloud, X } from './IconComponents';

interface FileHandleWithContent {
  handle: FileSystemFileHandle;
  content: string;
  name: string;
}

const LocalCommander: React.FC = () => {
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [files, setFiles] = useState<FileSystemHandle[]>([]);
  const [activeFile, setActiveFile] = useState<FileHandleWithContent | null>(null);
  const [status, setStatus] = useState('');

  const handleOpenDirectory = async () => {
    try {
      const handle = await (window as any).showDirectoryPicker();
      setDirHandle(handle);
      setStatus(`Opened: ${handle.name}`);
      
      const entries = [];
      for await (const entry of handle.values()) {
        entries.push(entry);
      }
      setFiles(entries.sort((a, b) => a.kind === 'directory' ? -1 : 1));
    } catch (error) {
      console.error('Error opening directory:', error);
      setStatus('Failed to open directory or cancelled.');
    }
  };

  const handleOpenFile = async (fileHandle: FileSystemFileHandle) => {
    try {
      const file = await fileHandle.getFile();
      const content = await file.text();
      setActiveFile({ handle: fileHandle, content, name: fileHandle.name });
      setStatus(`Editing: ${fileHandle.name}`);
    } catch (error) {
      console.error('Error reading file:', error);
      setStatus('Error reading file.');
    }
  };

  const handleSaveFile = async () => {
    if (!activeFile) return;
    try {
      const writable = await (activeFile.handle as any).createWritable();
      await writable.write(activeFile.content);
      await writable.close();
      setStatus(`Saved: ${activeFile.name}`);
    } catch (error) {
      console.error('Error saving file:', error);
      setStatus('Error saving file.');
    }
  };

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Folder className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-white">Local Commander</h3>
        </div>
        <button 
          onClick={handleOpenDirectory}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium text-white transition-colors border border-white/10"
        >
          {dirHandle ? 'Switch Folder' : 'Open Local Folder'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File List */}
        <div className="w-64 border-r border-white/10 overflow-y-auto bg-slate-900/30 p-2">
          {!dirHandle ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm text-center px-4">
              <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
              <p>Select a local folder to manage assets securely.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {files.map((handle) => (
                <li key={handle.name}>
                  <button
                    onClick={() => handle.kind === 'file' ? handleOpenFile(handle as FileSystemFileHandle) : null}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 text-sm transition-colors ${
                        activeFile?.name === handle.name ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {handle.kind === 'directory' ? (
                        <Folder className="w-4 h-4 text-yellow-500/80" />
                    ) : (
                        <FileText className="w-4 h-4 text-blue-400/80" />
                    )}
                    <span className="truncate">{handle.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50">
          {activeFile ? (
            <>
               <div className="p-2 border-b border-white/5 flex justify-between items-center bg-slate-800/30">
                   <span className="text-xs font-mono text-slate-400">{activeFile.name}</span>
                   <div className="flex gap-2">
                       <button onClick={handleSaveFile} className="p-1.5 hover:bg-green-500/20 text-green-400 rounded transition-colors" title="Save">
                           <Save className="w-4 h-4" />
                       </button>
                       <button onClick={() => setActiveFile(null)} className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors" title="Close">
                           <X className="w-4 h-4" />
                       </button>
                   </div>
               </div>
               <textarea 
                 value={activeFile.content}
                 onChange={(e) => setActiveFile({...activeFile, content: e.target.value})}
                 className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-slate-300 focus:outline-none resize-none"
               />
            </>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm">
                <p>Select a file to edit</p>
             </div>
          )}
        </div>
      </div>
      {status && (
          <div className="p-2 bg-black/20 text-xs text-slate-400 px-4 font-mono border-t border-white/5">
              {status}
          </div>
      )}
    </div>
  );
};

export default LocalCommander;
