import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Mic, Sparkles } from './IconComponents';
import { encode, decode, decodeAudioData } from '../utils/audio';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
interface TranscriptEntry {
    speaker: 'You' | 'Gemini';
    text: string;
}

const LiveChatView: React.FC = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentOutput, setCurrentOutput] = useState('');

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const cleanup = () => {
        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        streamRef.current?.getTracks().forEach(track => track.stop());
        setConnectionState('disconnected');
    };
    
    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => session.close());
            }
            cleanup();
        };
    }, []);

    const startConversation = async () => {
        setConnectionState('connecting');
        setTranscript([]);
        setCurrentInput('');
        setCurrentOutput('');
        setErrorMessage(null); // Reset error on new attempt

        try {
            // Pre-flight checks for microphone availability and permissions for better UX
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support the required audio APIs.");
            }

            if (navigator.permissions) {
                const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                if (permissionStatus.state === 'denied') {
                    throw new Error('Microphone access is denied. Please enable it in your browser settings.');
                }
            }
            
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasMicrophone = devices.some(device => device.kind === 'audioinput');
            if (!hasMicrophone) {
                throw new Error("No microphone found. Please connect a microphone and try again.");
            }
            
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInput(prev => prev + message.serverContent!.inputTranscription.text);
                        }
                        if (message.serverContent?.outputTranscription) {
                            setCurrentOutput(prev => prev + message.serverContent!.outputTranscription.text);
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscript(prev => [...prev, 
                                { speaker: 'You', text: currentInput + (message.serverContent?.inputTranscription?.text ?? '') },
                                { speaker: 'Gemini', text: currentOutput + (message.serverContent?.outputTranscription?.text ?? '') }
                            ]);
                            setCurrentInput('');
                            setCurrentOutput('');
                        }

                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (audioData) {
                            const outputContext = outputAudioContextRef.current!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioData), outputContext, 24000, 1);
                            const source = outputContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputContext.destination);
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }

                         if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => s.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setConnectionState('error');
                        setErrorMessage('The connection to the AI service was lost.');
                        cleanup();
                    },
                    onclose: () => {
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (error: any) {
            console.error("Failed to start conversation:", error);
            setConnectionState('error');

            if (error.name === 'NotFoundError' || error.message.includes('not found')) {
                setErrorMessage('No microphone found. Please ensure one is connected and not in use by another application.');
            } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError' || error.message.includes('denied')) {
                setErrorMessage('Microphone permission denied. Please allow access in your browser settings.');
            } else {
                setErrorMessage(error.message || 'An unknown error occurred.');
            }

            // Cleanup any partially created resources
            streamRef.current?.getTracks().forEach(track => track.stop());
            inputAudioContextRef.current?.close();
            outputAudioContextRef.current?.close();
        }
    };
    
    const endConversation = () => {
        if(sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        cleanup();
    };

    const getStatusInfo = () => {
        switch (connectionState) {
            case 'disconnected': return { text: 'Ready to connect', color: 'text-slate-400', dot: 'bg-slate-400' };
            case 'connecting': return { text: 'Connecting...', color: 'text-yellow-400', dot: 'bg-yellow-400 animate-pulse' };
            case 'connected': return { text: 'Connected and listening...', color: 'text-green-400', dot: 'bg-green-400 animate-pulse' };
            case 'error': return { text: 'Connection error', color: 'text-red-400', dot: 'bg-red-400' };
        }
    };
    const { text, color, dot } = getStatusInfo();

    return (
        <main className="flex-1 flex flex-col h-full bg-dark-bg">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {transcript.map((entry, index) => (
                    <div key={index} className={`flex items-start gap-3 ${entry.speaker === 'You' ? 'justify-end' : 'justify-start'}`}>
                       {entry.speaker === 'Gemini' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white"/></div>}
                        <div className={`max-w-xl px-4 py-3 rounded-2xl ${ entry.speaker === 'You' ? 'bg-indigo-500 text-white' : 'bg-slate-700/80 text-slate-200'}`}>
                           <p className="font-bold text-sm mb-1">{entry.speaker}</p>
                           <p>{entry.text}</p>
                        </div>
                    </div>
                ))}
                {currentInput && <p className="text-slate-400 text-right italic">You: {currentInput}...</p>}
                {currentOutput && <p className="text-slate-400 italic">Gemini: {currentOutput}...</p>}
            </div>

            <div className="p-4 bg-dark-bg/0">
                <div className="max-w-3xl mx-auto text-center glass-card p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${dot}`}></div>
                        <p className={`font-medium ${color}`}>{text}</p>
                    </div>

                    {connectionState === 'error' && errorMessage && (
                        <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
                    )}

                    {connectionState !== 'connected' && connectionState !== 'connecting' ? (
                        <button onClick={startConversation} className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors shadow-lg text-lg flex items-center gap-3 mx-auto">
                            <Mic className="w-6 h-6" />
                            Start Conversation
                        </button>
                    ) : (
                         <button onClick={endConversation} className="px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors shadow-lg text-lg flex items-center gap-3 mx-auto">
                            <Mic className="w-6 h-6" />
                            End Conversation
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default LiveChatView;