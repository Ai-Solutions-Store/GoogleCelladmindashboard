
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { BookOpen, Palette, Headphones, Smile, Sparkles, ShieldCheck, Heart, CheckCircle, ShieldAlert, Play, Pause, Mic, Download, Printer, FileText, FileAudio, FileImage } from './IconComponents';
import ReactMarkdown from 'react-markdown';

// --- Utility Functions ---

// Base64 decode
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Audio decoding
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Helper to create WAV header for PCM data so it can be downloaded/played outside browser
function createWavHeader(length: number, sampleRate: number, numChannels: number, bitsPerSample: number): Uint8Array {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + length, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sampleRate * blockAlign)
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, numChannels * (bitsPerSample / 8), true);
    // bits per sample
    view.setUint16(34, bitsPerSample, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, length, true);

    return new Uint8Array(header);
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

// Type definition for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

// Visualizer Component
const AudioVisualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
    return (
        <div className="flex items-center gap-1 h-8">
            {[...Array(8)].map((_, i) => (
                <div 
                    key={i}
                    className={`w-1.5 bg-orange-400 rounded-full transition-all duration-150 ${isPlaying ? 'animate-pulse' : 'h-1 opacity-50'}`}
                    style={{ 
                        height: isPlaying ? `${Math.random() * 100}%` : '4px',
                        animationDelay: `${i * 0.1}s` 
                    }}
                />
            ))}
        </div>
    );
};

const KidsCorner: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [ageGroup, setAgeGroup] = useState('elementary');
    const [story, setStory] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [rawAudioData, setRawAudioData] = useState<Uint8Array | null>(null); // Store raw bytes for download
    const [status, setStatus] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isListening, setIsListening] = useState(false);
    
    // Safety Check State
    const [safetyScore, setSafetyScore] = useState<{score: number, reason: string} | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Voice Input Handler
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Your browser does not support voice input. Please use Chrome or Edge.');
            return;
        }

        const SpeechRecognition = (window as unknown as IWindow).SpeechRecognition || (window as unknown as IWindow).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setTopic(prev => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.start();
    };

    const handleCreate = async () => {
        if (!topic.trim()) return;
        
        setStatus('✨ Generating curriculum content...');
        setStory(null);
        setImageUrl(null);
        setAudioBuffer(null);
        setRawAudioData(null);
        setSafetyScore(null);
        setIsPlaying(false);
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
        }
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // 1. Generate Story (Gemini 3 Pro)
            const storyPrompt = `Write a short, educational, and heartwarming story for a ${ageGroup} school child about: "${topic}". Keep it under 150 words. Make it engaging and fun!`;
            
            const storyResponse = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: storyPrompt,
                config: { thinkingConfig: { thinkingBudget: 2048 } } 
            });
            const storyText = storyResponse.text || "Once upon a time...";
            setStory(storyText);

            // 2. Safety & Educational Check (Guardian AI)
            setStatus('🛡️ Running Safety & Educational Quality Audit...');
            const safetyResponse = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Analyze the following story for a ${ageGroup} child based on safety and educational quality. 
                It must be safe, appropriate, and have clear educational value. 
                Give a combined score (1-100) and a specific reason for the score.
                
                Story: "${storyText}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.INTEGER },
                            reason: { type: Type.STRING }
                        }
                    }
                }
            });
            
            const safetyData = JSON.parse(safetyResponse.text || '{"score": 0, "reason": "Error parsing safety check"}');
            setSafetyScore(safetyData);

            // BLOCK if score is below 90
            if (safetyData.score < 90) {
                setStatus('⚠️ Content flagged by Safety Audit. Production halted.');
                return; // STOP GENERATION
            }

            // 3. Generate Illustration (Imagen 4)
            setStatus('🎨 Generating assets...');
            const imagePrompt = `A friendly, colorful, high-quality children's book illustration about: ${topic}. Soft lighting, cartoon style, suitable for kids. Aspect ratio 16:9.`;
            
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: { numberOfImages: 1, aspectRatio: '16:9' }
            });
            
            if (imageResponse.generatedImages?.[0]?.image?.imageBytes) {
                setImageUrl(`data:image/png;base64,${imageResponse.generatedImages[0].image.imageBytes}`);
            }

            // 4. Generate Audio (Gemini 2.5 TTS)
            setStatus('🎙️ Synthesizing narration...');
            const speechResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-tts',
                contents: { parts: [{ text: storyText }] },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } } 
                }
            });

            const audioBytes = speechResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            
            if (audioBytes) {
                const rawBytes = decode(audioBytes);
                setRawAudioData(rawBytes); // Save raw bytes for download logic
                
                // Use consistent audio context (create only once or resume)
                if (!audioContextRef.current) {
                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                    audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
                }

                // Decode for playback
                // Note: Gemini TTS often returns 24kHz
                const buffer = await decodeAudioData(rawBytes, audioContextRef.current, 24000, 1);
                setAudioBuffer(buffer);
            }

            setStatus('');

        } catch (error) {
            console.error("Kids Corner Error:", error);
            setStatus('❌ Production Error. Please retry.');
        }
    };

    const toggleAudio = () => {
        if (isPlaying) {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
                audioSourceRef.current = null;
            }
            setIsPlaying(false);
        } else {
            if (audioContextRef.current && audioBuffer) {
                 if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.onended = () => {
                    setIsPlaying(false);
                    audioSourceRef.current = null;
                };
                source.start();
                audioSourceRef.current = source;
                setIsPlaying(true);
            }
        }
    };

    // --- Export & Download Functions ---

    const downloadText = () => {
        if (!story) return;
        const element = document.createElement("a");
        const file = new Blob([story], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "story.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const downloadImage = () => {
        if (!imageUrl) return;
        const element = document.createElement("a");
        element.href = imageUrl;
        element.download = "illustration.png";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const downloadAudio = () => {
        if (!rawAudioData) return;
        
        // Create WAV header + PCM data
        const header = createWavHeader(rawAudioData.length, 24000, 1, 16); // 24kHz, 1 channel, 16-bit
        const wavBytes = new Uint8Array(header.length + rawAudioData.length);
        wavBytes.set(header, 0);
        wavBytes.set(rawAudioData, header.length);

        const blob = new Blob([wavBytes], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const element = document.createElement("a");
        element.href = url;
        element.download = "narration.wav";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    };

    const handlePrintStorybook = () => {
        if (!story || !imageUrl) return;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Storybook - AiCollabFortheKids</title>
                    <style>
                        body { font-family: 'Georgia', serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a202c; }
                        h1 { text-align: center; color: #2c5282; font-size: 32px; margin-bottom: 20px; }
                        .image-container { text-align: center; margin-bottom: 30px; }
                        img { max-width: 100%; height: auto; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .story-text { font-size: 20px; line-height: 1.8; text-align: justify; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 10px; }
                        @media print {
                            body { padding: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${topic || 'A Wonderful Story'}</h1>
                    <div class="image-container">
                        <img src="${imageUrl}" alt="Illustration" />
                    </div>
                    <div class="story-text">
                        ${story.replace(/\n/g, '<br/>')}
                    </div>
                    <div class="footer">
                        Generated by AiCollabFortheKids for ${ageGroup} • Educational Certified
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 min-h-full">
            <header className="glass-card p-6 mb-8 border-l-4 border-orange-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-orange-400" />
                            Edu-Gen Studio
                        </h1>
                        <p className="text-slate-400 mt-1">Automated Content Production for AiCollabFortheKids Charity</p>
                    </div>
                    <div className="hidden md:block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm text-orange-400">
                        #FortheKids Production
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="glass-card p-6 lg:col-span-1 h-fit border-t-4 border-t-orange-500">
                    <h3 className="text-lg font-bold text-white mb-4">Content Parameters</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Educational Topic</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Why is the sky blue? or Kindness"
                                    className="glass-input w-full p-3 pr-12"
                                />
                                <button 
                                    onClick={handleVoiceInput}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                    title="Dictate Topic"
                                >
                                    <Mic className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
                            <select 
                                value={ageGroup}
                                onChange={(e) => setAgeGroup(e.target.value)}
                                className="glass-input w-full p-3"
                            >
                                <option value="toddler">Toddler (3-5)</option>
                                <option value="elementary">Elementary (6-10)</option>
                                <option value="teen">Teen (11-16)</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleCreate}
                            disabled={!!status}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Sparkles className="w-5 h-5" />}
                            Generate Content
                        </button>
                        {status && <p className="text-center text-orange-300 text-sm animate-pulse">{status}</p>}
                    </div>
                </div>

                {/* Output Display */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Safety Banner */}
                    {safetyScore && (
                        <div className={`p-6 rounded-2xl border-2 flex flex-col gap-3 transition-all duration-500 ${safetyScore.score >= 90 ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-red-900/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}>
                            <div className="flex items-center gap-4">
                                {safetyScore.score >= 90 ? 
                                    <div className="p-3 bg-green-500 rounded-full"><ShieldCheck className="w-8 h-8 text-white" /></div> : 
                                    <div className="p-3 bg-red-500 rounded-full"><ShieldAlert className="w-8 h-8 text-white" /></div>
                                }
                                <div>
                                    <h4 className={`text-xl font-black uppercase tracking-wider ${safetyScore.score >= 90 ? 'text-green-400' : 'text-red-400'}`}>
                                        {safetyScore.score >= 90 ? 'Content Certified Safe' : 'Content Rejected'}
                                    </h4>
                                    <p className="text-white font-medium opacity-90 text-lg">Safety Score: {safetyScore.score}/100</p>
                                </div>
                            </div>
                            <div className="pl-20">
                                <p className={`text-sm p-3 rounded-lg border ${safetyScore.score >= 90 ? 'bg-green-950 border-green-800 text-green-200' : 'bg-red-950 border-red-800 text-red-200'}`}>
                                    <span className="font-bold">Reason:</span> {safetyScore.reason}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions Bar (Exports) */}
                    {story && safetyScore && safetyScore.score >= 90 && (
                        <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Download className="w-4 h-4" />
                                <span>Export Options:</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={downloadText} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 flex items-center gap-2 text-xs transition-colors" title="Download Text">
                                    <FileText className="w-4 h-4" /> Text
                                </button>
                                {imageUrl && (
                                    <button onClick={downloadImage} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 flex items-center gap-2 text-xs transition-colors" title="Download Image">
                                        <FileImage className="w-4 h-4" /> Image
                                    </button>
                                )}
                                {rawAudioData && (
                                    <button onClick={downloadAudio} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 flex items-center gap-2 text-xs transition-colors" title="Download Audio">
                                        <FileAudio className="w-4 h-4" /> Audio
                                    </button>
                                )}
                                <div className="h-8 w-px bg-white/10 mx-2"></div>
                                <button onClick={handlePrintStorybook} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-bold flex items-center gap-2 text-xs shadow-lg transition-colors">
                                    <Printer className="w-4 h-4" /> Print Storybook
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image */}
                    {imageUrl ? (
                        <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in duration-500">
                            <img src={imageUrl} alt="Story Illustration" className="w-full rounded-xl" />
                        </div>
                    ) : (
                        <div className="glass-card p-12 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 min-h-[300px]">
                            <Palette className="w-16 h-16 mb-4 opacity-20" />
                            <p>Illustration will appear here</p>
                        </div>
                    )}

                    {/* Story Text */}
                    {story ? (
                        <div className="glass-card p-8 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500"></div>
                            <h2 className="text-3xl font-serif text-white mb-6 text-center drop-shadow-sm">{topic}</h2>
                            <div className="prose prose-invert prose-lg max-w-none font-serif leading-relaxed text-slate-200">
                                <ReactMarkdown>{story}</ReactMarkdown>
                            </div>
                            
                            {/* Audio Player UI */}
                            {audioBuffer && (
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 border border-white/5">
                                        <button 
                                            onClick={toggleAudio}
                                            className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 ${isPlaying ? 'bg-red-500 text-white' : 'bg-white text-orange-600'}`}
                                        >
                                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                                        </button>
                                        
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">AI Narration</span>
                                                {isPlaying && <span className="text-xs text-green-400 animate-pulse">Playing...</span>}
                                            </div>
                                            <div className="h-8 bg-slate-800 rounded flex items-center px-3 gap-1 overflow-hidden">
                                                <AudioVisualizer isPlaying={isPlaying} />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={downloadAudio} 
                                            className="p-2 text-slate-400 hover:text-white transition-colors"
                                            title="Download Audio"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="glass-card p-12 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 min-h-[200px]">
                            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                            <p>Story content will be generated here</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default KidsCorner;
