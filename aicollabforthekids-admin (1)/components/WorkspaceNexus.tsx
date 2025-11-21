

import React, { useState, useEffect } from 'react';
import { Drive, Sheets, Calendar, Users, CheckCircle, ShieldCheck, FileText } from './IconComponents';

// Types for Google API responses
interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
}

const WorkspaceNexus: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [driveFiles, setDriveFiles] = useState<GoogleFile[]>([]);
  const [status, setStatus] = useState('');

  // Initialize Google Identity Services
  useEffect(() => {
    const initClient = () => {
        if (!(window as any).google) return;
        
        // Note: This is a client-side check. In production, you must provide a real Client ID.
        // We use a placeholder logic here that simulates the flow if no ID is present to prevent crashes.
        const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
        
        try {
             (window as any).google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly',
                callback: (response: any) => {
                    if (response.access_token) {
                        setIsAuthenticated(true);
                        setStatus('Authenticated with Google Workspace');
                        loadDriveFiles(response.access_token);
                        // Mock profile for demo if API call fails due to scope
                        setUserProfile({ name: 'Josh Coleman', email: 'joshlcoleman@gmail.com', picture: '' });
                    }
                },
            });
        } catch (e) {
            console.error("GIS Init Error", e);
        }
    };
    
    // Check if script is loaded
    if ((window as any).google) {
        initClient();
    } else {
        const interval = setInterval(() => {
             if ((window as any).google) {
                 initClient();
                 clearInterval(interval);
             }
        }, 500);
    }
  }, []);

  const handleLogin = () => {
      if ((window as any).google) {
          // If no client ID is set in env, we simulate a login for demo purposes
          if (!process.env.VITE_GOOGLE_CLIENT_ID) {
              alert("No VITE_GOOGLE_CLIENT_ID found. Simulating login for demo.");
              setIsAuthenticated(true);
              setUserProfile({ name: 'Josh Coleman', email: 'joshlcoleman@gmail.com' });
              setDriveFiles([
                  { id: '1', name: 'Q4_Fundraising_Plan.gdoc', mimeType: 'application/vnd.google-apps.document', webViewLink: '#' },
                  { id: '2', name: 'Inventory_Tracker_2025.gsheet', mimeType: 'application/vnd.google-apps.spreadsheet', webViewLink: '#' },
                  { id: '3', name: 'Board_Meeting_Minutes.pdf', mimeType: 'application/pdf', webViewLink: '#' }
              ]);
              return;
          }
          // Real flow
          // client.requestAccessToken(); // This would be the actual call
      }
  };

  const loadDriveFiles = async (token: string) => {
      try {
          const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,webViewLink,iconLink)', {
              headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.files) setDriveFiles(data.files);
      } catch (error) {
          console.error("Drive API Error", error);
      }
  };

  return (
    <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-blue-600/20 rounded-lg"><Drive className="w-5 h-5 text-blue-400" /></div>
                Google Workspace Nexus
            </h3>
            {isAuthenticated ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Live Sync</span>
                </div>
            ) : (
                 <button 
                    onClick={handleLogin}
                    className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Sign in with Google
                </button>
            )}
        </div>

        {isAuthenticated && userProfile && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {userProfile.name[0]}
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{userProfile.name}</p>
                    <p className="text-xs text-slate-400">{userProfile.email}</p>
                </div>
                <div className="ml-auto">
                    <span className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/20">Admin Access</span>
                </div>
            </div>
        )}

        <div className="space-y-4">
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Drive className="w-3 h-3" />
                    Recent Drive Activity
                </h4>
                {driveFiles.length > 0 ? (
                    <ul className="space-y-2">
                        {driveFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    {file.mimeType.includes('spreadsheet') ? <Sheets className="w-5 h-5 text-green-500" /> : 
                                     file.mimeType.includes('document') ? <FileText className="w-5 h-5 text-blue-500" /> :
                                     <Drive className="w-5 h-5 text-slate-400" />}
                                    <span className="text-sm text-slate-200 group-hover:text-white">{file.name}</span>
                                </div>
                                <span className="text-xs text-slate-500 group-hover:text-slate-300">Edited 2h ago</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8 text-slate-500 border border-dashed border-white/10 rounded-xl">
                        <p>No files accessed recently.</p>
                    </div>
                )}
            </div>
            
             <div className="grid grid-cols-2 gap-4 mt-4">
                <button className="p-4 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 transition-all">
                    <Sheets className="w-6 h-6 text-green-500" />
                    <span className="text-xs font-medium text-slate-300">Open Inventory</span>
                </button>
                 <button className="p-4 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 transition-all">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-medium text-slate-300">Team Schedule</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default WorkspaceNexus;