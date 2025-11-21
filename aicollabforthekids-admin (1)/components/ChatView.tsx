
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Content } from '@google/genai';
import { Send, Sparkles, Globe, MapPin, Share, Trash, Brain, Paperclip, Image as ImageIcon, X, Download, Upload, Activity } from './IconComponents';
import { ChatMessage, GroundingChunk } from '../types';
import ReactMarkdown from 'react-markdown';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ai_chat_history');
    return saved ? JSON.parse(saved) : [
        { role: 'model', content: "Hello! I'm your AiCollab Admin Assistant. Ask me about your data, or use Reasoning Mode for complex tasks!" }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Feature Toggles
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [useThinking, setUseThinking] = useState(false); // Gemini 3 Pro Reasoning
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatImportRef = useRef<HTMLInputElement>(null);
  
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleGetLocation = () => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleClearChat = () => {
      const defaultMsg: ChatMessage[] = [{ role: 'model', content: "Chat history cleared. How can I help you today?" }];
      setMessages(defaultMsg);
      localStorage.setItem('ai_chat_history', JSON.stringify(defaultMsg));
  };

  const handleShareChat = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
      });
  };

  const handleExportChat = () => {
      try {
          const dataStr = JSON.stringify(messages, null, 2);
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ai_collab_mission_log_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      } catch (e) {
          console.error("Export failed", e);
          alert("Failed to export chat log.");
      }
  };

  const handleImportChat = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const imported = JSON.parse(event.target?.result as string);
              if (Array.isArray(imported)) {
                  setMessages(imported);
                  alert("Mission Log Imported Successfully.");
              } else {
                  throw new Error("Invalid format");
              }
          } catch (err) {
              alert("Failed to import: Invalid file format.");
          }
      };
      reader.readAsText(file);
      if (chatImportRef.current) chatImportRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            // Store base64 without prefix for API, but we need prefix for display
            setAttachedImage(result);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMessage: ChatMessage = { 
        role: 'user', 
        content: input,
        image: attachedImage || undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imageToSend = attachedImage ? attachedImage.split(',')[1] : null;
    setAttachedImage(null);
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Select Model based on mode
        let model = 'gemini-2.5-flash';
        let config: any = {
            systemInstruction: "You are the intelligent assistant for the AiCollabFortheKids Admin Dashboard. Your goal is to help the admin (Josh) manage DAOs, Kickstarter projects, and generated content for the kids. Be precise, helpful, and proactive."
        };

        if (useThinking) {
            model = 'gemini-3-pro-preview';
            config.thinkingConfig = { thinkingBudget: 32768 };
        } else if (imageToSend) {
            model = 'gemini-3-pro-preview';
        }

        const tools: any[] = [];
        if (!useThinking) {
            if (useSearch) tools.push({ googleSearch: {} });
            if (useMaps) tools.push({ googleMaps: {} });
        }

        if (tools.length > 0) {
            config.tools = tools;
            if (useMaps && location) {
                config.toolConfig = { retrievalConfig: { latLng: location } };
            }
        }

        const history: Content[] = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }], 
        }));

        const currentParts: any[] = [];
        if (imageToSend) {
            currentParts.push({
                inlineData: {
                    mimeType: 'image/jpeg', 
                    data: imageToSend
                }
            });
        }
        if (input) {
            currentParts.push({ text: input });
        }

        const responseStream = await ai.models.generateContentStream({
            model,
            contents: [...history, { role: 'user', parts: currentParts }],
            config
        });

      let modelResponse = '';
      let groundingSources: GroundingChunk[] = [];
      setMessages(prev => [...prev, { role: 'model', content: '', groundingSources: [] }]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        
        const newSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        if (newSources.length > 0) {
            groundingSources.push(...newSources);
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.content = modelResponse;
          lastMessage.groundingSources = [...new Set(groundingSources)];
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Context usage simulation
  const messageCount = messages.length;
  const contextPercent = Math.min((messageCount / 50) * 100, 100); 

  return (
    <main className="flex-1 flex flex-col h-full bg-dark-bg relative">
      {/* Header Controls */}
      <div className="absolute top-4 right-6 z-10 flex gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-white/5 shadow-xl">
          <button 
            onClick={handleExportChat}
            className="p-2 text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-full transition-colors"
            title="Export Mission Log"
          >
              <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => chatImportRef.current?.click()}
            className="p-2 text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-full transition-colors"
            title="Import Mission Log"
          >
              <Upload className="w-4 h-4" />
          </button>
          <input type="file" ref={chatImportRef} onChange={handleImportChat} accept=".json" className="hidden" />
          
          <div className="w-px h-4 bg-white/10 my-auto"></div>

          <button 
            onClick={handleShareChat}
            className="p-2 text-slate-300 hover:text-white hover:bg-indigo-500/20 rounded-full transition-colors"
            title="Copy Link to Chat"
          >
              <Share className="w-4 h-4" />
          </button>
          <button 
            onClick={handleClearChat}
            className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            title="Clear History"
          >
              <Trash className="w-4 h-4" />
          </button>
      </div>

      {/* Context Indicator */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
         <div className={`flex flex-col gap-1`}>
             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border shadow-lg ${useThinking ? 'bg-purple-900/40 border-purple-500/50 text-purple-300' : 'bg-blue-900/40 border-blue-500/50 text-blue-300'}`}>
                 <Brain className="w-3 h-3" />
                 {useThinking ? 'Gemini 3.0 Pro (Reasoning)' : 'Gemini 2.5 Flash (Fast)'}
             </div>
             {/* Memory Meter */}
             <div className="flex items-center gap-2 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/5">
                 <Activity className="w-3 h-3 text-slate-400" />
                 <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-green-400 to-orange-400 transition-all duration-500" style={{ width: `${contextPercent}%` }}></div>
                 </div>
                 <span className="text-[10px] text-slate-400 font-mono">{messageCount} msgs</span>
             </div>
         </div>
      </div>

      {showToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full shadow-lg animate-fade-in-down">
              Link copied to clipboard!
          </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-24 pb-32">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center shadow-lg ring-2 ring-indigo-500/20">
                        <Sparkles className="w-4 h-4 text-white"/>
                    </div>
                )}
                
                <div className={`px-5 py-3.5 rounded-2xl shadow-lg relative overflow-hidden ${
                msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800/80 backdrop-blur-md border border-white/10 text-slate-200 rounded-bl-none'
                }`}>
                    {msg.image && (
                        <img src={msg.image} alt="Attached" className="max-w-full h-auto rounded-lg border border-white/10 max-h-64 object-cover mb-2" />
                    )}
                    <div className="prose prose-sm prose-invert max-w-none leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    
                    {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-xs">
                            <p className="font-semibold mb-1 text-slate-400 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Verified Sources:
                            </p>
                            <ul className="space-y-1 pl-1">
                                {msg.groundingSources.map((source, i) => {
                                    const link = source.web?.uri || source.maps?.uri;
                                    const title = source.web?.title || source.maps?.title || 'Source link';
                                    if (!link) return null;
                                    return (
                                        <li key={i}>
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white hover:underline truncate block max-w-[250px]">
                                                {title}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center shadow-lg"><Sparkles className="w-4 h-4 text-white"/></div>
             <div className="px-5 py-4 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/5 rounded-bl-none">
                <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-bg via-dark-bg to-transparent z-20">
        <div className="max-w-3xl mx-auto glass-card border border-white/10 shadow-2xl rounded-2xl p-2 bg-slate-900/90">
            {/* Tool Toggles */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5 mb-2">
                 <div className="flex items-center gap-3">
                    <label className={`cursor-pointer transition-colors ${useThinking ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`} title="Enable Deep Reasoning (Gemini 3 Pro)">
                        <input type="checkbox" checked={useThinking} onChange={() => { setUseThinking(v => !v); if(!useThinking) { setUseSearch(false); setUseMaps(false); } }} className="hidden" />
                        <Brain className="w-5 h-5" />
                    </label>
                    
                    {!useThinking && (
                        <>
                            <div className="w-px h-4 bg-white/10"></div>
                            <label className={`cursor-pointer transition-colors ${useSearch ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`} title="Enable Google Search">
                                <input type="checkbox" checked={useSearch} onChange={() => setUseSearch(v => !v)} className="hidden" />
                                <Globe className="w-5 h-5" />
                            </label>
                            <label className={`cursor-pointer transition-colors ${useMaps ? 'text-green-400' : 'text-slate-500 hover:text-slate-300'}`} title="Enable Google Maps">
                                <input type="checkbox" checked={useMaps} onChange={() => setUseMaps(v => !v)} className="hidden" />
                                <MapPin className="w-5 h-5" />
                            </label>
                        </>
                    )}
                 </div>
                 
                 {useMaps && !location && (
                    <button onClick={handleGetLocation} className="text-xs text-green-400 hover:underline">
                        Enable Location
                    </button>
                 )}
            </div>
            
            {/* Attachment Preview */}
            {attachedImage && (
                <div className="flex items-center gap-2 mb-2 bg-slate-800/50 p-2 rounded-lg w-fit mx-2 border border-white/10">
                    <div className="w-10 h-10 rounded overflow-hidden">
                        <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-slate-300">Image Attached</span>
                    <button onClick={() => setAttachedImage(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4"/></button>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    title="Attach Image"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                />

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={useThinking ? "Ask a complex reasoning question..." : "Type a message..."}
                    className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-2"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || (!input.trim() && !attachedImage)}
                    className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default ChatView;
