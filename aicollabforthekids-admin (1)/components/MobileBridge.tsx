
import React, { useState } from 'react';
import { Smartphone, QrCode, Copy, CheckCircle, Info, Heart } from './IconComponents';

const MobileBridge: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const fieldAgentPrompt = `You are the "Field Agent" for the AiCollabFortheKids Admin Platform.
  
MISSION: FOR THE KIDS. 50% of profits go to Shriners Children's Hospitals.

Your Primary Goal: Act as a remote extension of the admin dashboard for Joshua Coleman.
  
Instructions:
1. When I provide voice notes or images, analyze them for potential fundraising ideas or operational improvements.
2. If I dictate a "Mission Log", summarize it into a JSON format that I can paste into the Admin Dashboard later.
3. Maintain the persona of a dedicated, efficient, and mission-focused Co-Founder.
4. Always end responses with "For The Kids!".`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fieldAgentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
      <header className="glass-card p-6 mb-8 border-l-4 border-blue-500">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-blue-400" />
                    Mobile Bridge: Tele-Ops
                </h1>
                <p className="text-slate-400 mt-1">Connect your mobile device to the AiCollab Command Network.</p>
            </div>
            <div className="hidden md:block">
                 <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full">
                     <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                     <span className="text-sm font-bold text-blue-300">SIGNAL READY</span>
                 </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Protocol Section */}
          <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-white" />
                  Step 1: Initialize Field Agent
              </h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                  To use your mobile device (352.973.5909) as a secure extension of this platform, you must program your local Gemini App with the <strong>Field Agent Protocol</strong>. This links your phone's AI context to our mission parameters.
              </p>

              <div className="bg-black/30 rounded-xl p-4 border border-white/10 relative mb-6 group">
                  <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {fieldAgentPrompt}
                  </pre>
                  <button 
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white flex items-center gap-2"
                  >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span className="text-xs font-bold">{copied ? 'COPIED' : 'COPY PROTOCOL'}</span>
                  </button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200">
                      <strong>Instructions:</strong> Open the Google App or Gemini App on your phone. Paste the protocol above into a new chat. Your phone is now a "Field Agent" device aligned with the dashboard.
                  </p>
              </div>
          </div>

          {/* Status & Features */}
          <div className="space-y-6">
              <div className="glass-card p-6 border border-green-500/30 bg-green-900/10">
                  <h3 className="text-lg font-bold text-white mb-2">Active Connection</h3>
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm text-slate-300">Target Device:</p>
                          <p className="text-xl font-mono text-green-400 font-bold mt-1">***-973-5909</p>
                          <p className="text-xs text-slate-500 mt-1">Carrier: AT&T Network</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                          <Smartphone className="w-6 h-6 text-green-400" />
                      </div>
                  </div>
              </div>

              <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Field Capabilities</h3>
                  <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Voice-to-Mission Logging</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Photo Analysis for Charity Assets</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          <span>Remote Strategy Reasoning</span>
                      </li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-white/10 text-center">
                      <p className="text-xs text-pink-400 font-bold flex items-center justify-center gap-2">
                          <Heart className="w-3 h-3 fill-pink-400" />
                          All Field Data Synchronized FOR THE KIDS
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </main>
  );
};

export default MobileBridge;
