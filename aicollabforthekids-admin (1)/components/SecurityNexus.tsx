

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle, FileText, AlertTriangle, Server } from './IconComponents';
import { ComplianceCheck } from '../types';

const SecurityNexus: React.FC = () => {
  // Mock Compliance Data
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([
    { id: '1', name: 'Google Ad Grant Eligibility', category: 'legal', status: 'pass', details: 'SSL active, Mission statement found.', lastChecked: '10 mins ago' },
    { id: '2', name: 'Stripe Non-Profit Verification', category: 'financial', status: 'pass', details: 'EIN Verified (33-4655313).', lastChecked: '1 hour ago' },
    { id: '3', name: '501(c)(3) IRS Database Sync', category: 'legal', status: 'pass', details: 'Entity active in IRS EO Select Check.', lastChecked: '1 day ago' },
    { id: '4', name: 'GDPR/CCPA Data Privacy', category: 'legal', status: 'warning', details: 'Cookie consent banner needs update.', lastChecked: '2 hours ago' },
    { id: '5', name: 'Donation Wallet Audit', category: 'financial', status: 'pass', details: 'Public key matches Shriners registered address.', lastChecked: 'Live' },
  ]);

  const [apiKeys, setApiKeys] = useState([
      { service: 'Gemini AI', status: 'active', masked: 'AIza...FWG4' },
      { service: 'Square', status: 'active', masked: 'EAAAl...W9YC1' },
      { service: 'Azure Face', status: 'active', masked: '****************' },
  ]);

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'pass': return 'text-green-400';
          case 'active': return 'text-green-400';
          case 'fail': return 'text-red-400';
          case 'warning': return 'text-yellow-400';
          default: return 'text-slate-400';
      }
  };

  const getStatusIcon = (status: string) => {
      switch (status) {
          case 'pass': return <CheckCircle className="w-5 h-5 text-green-400" />;
          case 'active': return <CheckCircle className="w-5 h-5 text-green-400" />;
          case 'fail': return <ShieldAlert className="w-5 h-5 text-red-400" />;
          case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
          default: return <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>;
      }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-slate-950">
      <header className="glass-card p-6 mb-8 border-l-4 border-green-500 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-green-400" />
                Security Nexus (ComplianceGuard™)
            </h1>
            <p className="text-slate-400 mt-1">The "Iron Dome" of Non-Profit Compliance & Zero-Trust Architecture</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Compliance Score</p>
                <p className="text-3xl font-bold text-green-400">98/100</p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Compliance Monitor */}
          <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  Regulatory Compliance (Google/Stripe)
              </h3>
              <div className="space-y-4">
                  {complianceChecks.map(check => (
                      <div key={check.id} className="flex items-start justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex gap-4">
                              {getStatusIcon(check.status)}
                              <div>
                                  <h4 className="font-bold text-slate-200">{check.name}</h4>
                                  <p className="text-sm text-slate-400">{check.details}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                  check.status === 'pass' ? 'bg-green-900/30 text-green-400' : 
                                  check.status === 'warning' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'
                              }`}>
                                  {check.status}
                              </span>
                              <p className="text-[10px] text-slate-500 mt-1">{check.lastChecked}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* API Vault */}
          <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-yellow-400" />
                  Zero-Trust API Vault
              </h3>
              <div className="space-y-4">
                  {apiKeys.map((key, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                              <Server className="w-5 h-5 text-slate-500" />
                              <span className="font-medium text-slate-200">{key.service}</span>
                          </div>
                          <div className="flex items-center gap-4">
                              <code className="bg-black/30 px-3 py-1 rounded text-xs font-mono text-slate-400">
                                  {key.masked}
                              </code>
                              <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  ACTIVE
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-8 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <h4 className="font-bold text-blue-300 mb-2 text-sm">Donation Routing Protocol</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      All outgoing transactions are cryptographically signed. 
                      <span className="text-white font-bold"> 50% of net revenue</span> is hard-coded to route to the verified Shriners Children's Hospital wallet address: 
                      <code className="block mt-2 bg-black/30 p-2 rounded text-green-400 font-mono">0xShrinersVerifiedWalletAddress...7A</code>
                  </p>
              </div>
          </div>
      </div>
    </main>
  );
};

export default SecurityNexus;