import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Compass, Globe, ArrowLeft, ArrowRight, RotateCcw, Plus, X, Search, Sparkles, Layout } from './IconComponents';
import ReactMarkdown from 'react-markdown';

interface Tab {
  id: string;
  title: string;
  url: string;
  content?: string; // Stores synthesized content for AI mode
  history: string[];
  historyIndex: number;
  mode: 'ai' | 'live';
}

interface AssistantMessage {
    role: 'user' | 'model';
    content: string;
}

const CometBrowser: React.FC = () => {
  // --- Browser State ---
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: '', history: [''], historyIndex: 0, mode: 'ai' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [addressBarInput, setAddressBarInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Assistant State ---
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
      { role: 'model', content: "Hi! I'm your Comet Assistant. I can help you research topics, summarize findings, and find data for the kids." }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
      setAddressBarInput(activeTab.url);
  }, [activeTabId, activeTab.url]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  // --- Browser Actions ---

  const createTab = () => {
    const newId = Date.now().toString();
    const newTab: Tab = { id: newId, title: 'New Tab', url: '', history: [''], historyIndex: 0, mode: 'ai' };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
        // Reset if closing last tab
        setTabs([{ id: Date.now().toString(), title: 'New Tab', url: '', history: [''], historyIndex: 0, mode: 'ai' }]);
        return;
    }
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTab = (id: string, updates: Partial<Tab>) => {
      setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleNavigate = async (urlOrQuery: string) => {
      if (!urlOrQuery.trim()) return;
      
      setIsLoading(true);
      let targetUrl = urlOrQuery;
      let isSearch = !urlOrQuery.includes('.') || urlOrQuery.includes(' ');
      
      // Update URL in state immediately for responsiveness
      updateTab(activeTabId, { url: targetUrl, title: isSearch ? `Search: ${targetUrl}` : targetUrl });

      if (activeTab.mode === 'ai' || isSearch) {
          // AI Browsing Mode (Research)
          try {
              const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
              const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: `Research and summarize the following topic or URL content. 
                  Format it as a clean, readable web page with a title, summary, key points, and related links.
                  Query: "${targetUrl}"`,
                  config: {
                      tools: [{ googleSearch: {} }]
                  }
              });
              
              const content = response.text || "No content found.";
              updateTab(activeTabId, { content, mode: 'ai', title: isSearch ? targetUrl : 'Web Page' });
              
              // Contextual Assistant Update
              setAssistantMessages(prev => [...prev, { 
                  role: 'model', 
                  content: `I've loaded research on "${targetUrl}". Let me know if you need specific data extracted.` 
              }]);

          } catch (error) {
              console.error("Browser Error", error);
              updateTab(activeTabId, { content: "## Error Loading Page\nUnable to connect to Comet Intelligence Network." });
          }
      } else {
          // Live Mode (Iframe - risky but requested)
           if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
           updateTab(activeTabId, { url: targetUrl, mode: 'live' });
      }
      setIsLoading(false);
  };

  const handleAssistantSend = async () => {
      if (!assistantInput.trim()) return;
      
      const input = assistantInput;
      setAssistantInput('');
      setAssistantMessages(prev => [...prev, { role: 'user', content: input }]);
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          // Include current browser context
          const context = activeTab.mode === 'ai' ? `Current Page Content:\n${activeTab.content?.substring(0, 2000)}...` : `User is browsing: ${activeTab.url}`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `System: You are the Comet Assistant, a helpful research companion embedded in a browser.
              Context: ${context}
              User: ${input}`
          });
          
          setAssistantMessages(prev => [...prev, { role: 'model', content: response.text || "I'm thinking..." }]);
      } catch (error) {
          setAssistantMessages(prev => [...prev, { role: 'model', content: "Connection error." }]);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
        {/* Browser Chrome (Top Bar) */}
        <div className="h-12 bg-slate-800 border-b border-white/10 flex items-center px-2 gap-2 select-none">
            {/* Window Controls / Branding */}
            <div className="flex items-center gap-2 mr-4">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-xs font-bold text-slate-400 ml-2">Comet</span>
            </div>

            {/* Tabs */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`
                            group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[200px] cursor-pointer transition-colors border-t border-x
                            ${activeTabId === tab.id 
                                ? 'bg-slate-900 text-white border-white/10 border-b-slate-900' 
                                : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'}
                        `}
                    >
                        {tab.mode === 'ai' ? <Sparkles className="w-3 h-3 text-blue-400" /> : <Globe className="w-3 h-3 text-green-400" />}
                        <span className="truncate flex-1">{tab.title}</span>
                        <button 
                            onClick={(e) => closeTab(tab.id, e)}
                            className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded p-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                <button onClick={createTab} className="p-1.5 hover:bg-white/5 rounded-md text-slate-400">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Navigation Bar */}
        <div className="h-12 bg-slate-900 border-b border-white/10 flex items-center px-4 gap-3">
            <div className="flex gap-1">
                <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><ArrowLeft className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><ArrowRight className="w-4 h-4" /></button>
                <button onClick={() => handleNavigate(activeTab.url)} className="p-1.5 hover:bg-white/5 rounded text-slate-400"><RotateCcw className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {activeTab.mode === 'ai' ? <Sparkles className="w-4 h-4 text-blue-400" /> : <Globe className="w-4 h-4 text-green-400" />}
                </div>
                <input 
                    type="text" 
                    value={addressBarInput}
                    onChange={(e) => setAddressBarInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigate(addressBarInput)}
                    className="w-full bg-slate-800 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                    placeholder="Search or enter website..."
                />
            </div>

            <div className="flex gap-2">
                 <button 
                    onClick={() => updateTab(activeTabId, { mode: activeTab.mode === 'ai' ? 'live' : 'ai' })}
                    className={`px-3 py-1.5 rounded text-xs font-medium border ${activeTab.mode === 'ai' ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-white/10'}`}
                 >
                     {activeTab.mode === 'ai' ? 'AI Reader' : 'Live Web'}
                 </button>
                 <button 
                    onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                    className={`p-1.5 rounded transition-colors ${isAssistantOpen ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    title="Toggle Assistant"
                 >
                     <Layout className="w-5 h-5" />
                 </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
            {/* Browser View */}
            <div className={`flex-1 bg-slate-950 overflow-y-auto relative ${isAssistantOpen ? 'mr-[350px]' : ''} transition-all duration-300`}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-10 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            <p className="text-slate-400 text-sm animate-pulse">Comet is browsing...</p>
                        </div>
                    </div>
                )}
                
                {activeTab.mode === 'ai' ? (
                    <div className="max-w-4xl mx-auto p-8 min-h-full">
                        {activeTab.content ? (
                             <div className="prose prose-invert prose-lg max-w-none">
                                <ReactMarkdown>{activeTab.content}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-600">
                                <Compass className="w-24 h-24 mb-6 opacity-10" />
                                <h2 className="text-2xl font-bold text-slate-500 mb-2">Comet Research Station</h2>
                                <p>Enter a topic to generate a comprehensive research report.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <iframe 
                        src={activeTab.url} 
                        className="w-full h-full border-none bg-white"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        title="Web View"
                        onError={() => alert("Unable to load this site in embedded mode.")}
                    />
                )}
            </div>

            {/* Assistant Sidebar */}
            <div className={`absolute top-0 right-0 bottom-0 w-[350px] bg-slate-900 border-l border-white/10 flex flex-col transition-transform duration-300 ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-white/10 bg-slate-800/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Comet Assistant
                    </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {assistantMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-slate-800/30">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={assistantInput}
                            onChange={(e) => setAssistantInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAssistantSend()}
                            placeholder="Ask about this page..."
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50"
                        />
                        <button 
                            onClick={handleAssistantSend}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CometBrowser;