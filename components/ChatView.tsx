import React, { useState, useRef, useEffect } from 'react';
// FIX: Remove GenerateContentStreamResult as it is not an exported member of '@google/genai'.
import { GoogleGenAI, Content } from '@google/genai';
import { Send, Sparkles, Globe, MapPin } from './IconComponents';
import { ChatMessage, GroundingChunk } from '../types';
import ReactMarkdown from 'react-markdown';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your AI assistant. Ask me about your data, or enable Search/Maps to ask about anything else!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const tools: any[] = [];
        if (useSearch) tools.push({ googleSearch: {} });
        if (useMaps) tools.push({ googleMaps: {} });

        const history: Content[] = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
        }));

        const responseStream = await ai.models.generateContentStream({
            model,
            contents: [...history, { role: 'user', parts: [{ text: input }] }],
            config: {
                ...(tools.length > 0 && { tools }),
                ...(useMaps && location && { 
                    toolConfig: { 
                        retrievalConfig: { latLng: location } 
                    } 
                })
            }
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
          lastMessage.groundingSources = [...new Set(groundingSources)]; // Deduplicate sources
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

  return (
    <main className="flex-1 flex flex-col h-full bg-dark-bg">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index}>
            <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white"/></div>}
                <div className={`max-w-xl px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-slate-700/80 text-slate-200'
                }`}>
                <div className="prose prose-slate dark:prose-invert prose-p:my-0 prose-headings:my-0 max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                </div>
            </div>
            {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="flex justify-start mt-2 ml-11">
                    <div className="max-w-xl text-xs text-slate-400">
                        <h4 className="font-semibold mb-1">Sources:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {msg.groundingSources.map((source, i) => (
                                <li key={i}>
                                    <a href={source.web?.uri || source.maps?.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                        {source.web?.title || source.maps?.title || 'Source link'}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white"/></div>
             <div className="max-w-xl px-4 py-3 rounded-2xl bg-slate-700/80 text-slate-200">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-dark-bg/0">
        <div className="max-w-3xl mx-auto p-4 glass-card">
            <div className="flex items-center justify-center gap-4 mb-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input type="checkbox" checked={useSearch} onChange={() => setUseSearch(v => !v)} className="toggle-checkbox" />
                    <Globe className={`w-5 h-5 transition-colors ${useSearch ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>Search</span>
                </label>
                 <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input type="checkbox" checked={useMaps} onChange={() => setUseMaps(v => !v)} className="toggle-checkbox" />
                    <MapPin className={`w-5 h-5 transition-colors ${useMaps ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>Maps</span>
                </label>
                 {useMaps && (
                    <button onClick={handleGetLocation} className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs ${location ? 'bg-green-900/50 text-green-300' : 'bg-slate-700/50'}`}>
                        <MapPin className="w-4 h-4" />
                        {location ? 'Location Set' : 'Get Location'}
                    </button>
                 )}
            </div>
            {locationError && <p className="text-center text-xs text-red-400 mb-2">{locationError}</p>}
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your data..."
                    className="w-full pl-4 pr-12 py-3 glass-input"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
                Powered by <Sparkles className="inline w-3 h-3 text-indigo-400" /> Gemini API
            </p>
        </div>
      </div>
      <style>{`
        .toggle-checkbox {
            -webkit-appearance: none;
            appearance: none;
            background-color: #fff;
            margin: 0;
            width: 0;
            height: 0;
        }
      `}</style>
    </main>
  );
};

export default ChatView;