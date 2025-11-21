
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Image, Film, Wand, Layers, Sparkles, UploadCloud, Radio, Play, Pause } from './IconComponents';

type MediaTab = 'generate-image' | 'edit-image' | 'generate-video' | 'voice-apps';

// Audio decoder utility
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

const MediaStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaTab>('generate-image');
  
  // Image Gen State
  const [genPrompt, setGenPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Image Edit State
  const [editPrompt, setEditPrompt] = useState('');
  const [editBaseImage, setEditBaseImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video Gen State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoBaseImage, setVideoBaseImage] = useState<string | null>(null);
  const [videoStyle, setVideoStyle] = useState('Cinematic');
  const [videoLength, setVideoLength] = useState('Standard');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatus, setVideoStatus] = useState<string>('');
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [hasVeoKey, setHasVeoKey] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Voice Apps State
  const [voiceTopic, setVoiceTopic] = useState('Charity Update');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Utils ---
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // --- Actions ---

  const handleGenerateImage = async () => {
    if (!genPrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: genPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio,
        },
      });
      const base64 = response.generatedImages[0].image.imageBytes;
      setGeneratedImage(`data:image/png;base64,${base64}`);
    } catch (error) {
      console.error("Image Gen Error:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleEditImage = async () => {
    if (!editPrompt.trim() || !editBaseImage) return;
    setIsEditingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: editBaseImage,
                mimeType: 'image/png', // Assuming PNG/JPEG standard
              },
            },
            { text: editPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      
      // Extract image from response
      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        setEditedImage(`data:image/png;base64,${part.inlineData.data}`);
      } else {
        alert("No image returned from edit operation.");
      }
    } catch (error) {
      console.error("Image Edit Error:", error);
      alert("Failed to edit image.");
    } finally {
      setIsEditingImage(false);
    }
  };

  const handleVeoKeyCheck = async () => {
    if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (hasKey) {
            setHasVeoKey(true);
        } else {
            const success = await (window as any).aistudio.openSelectKey();
            if (success) setHasVeoKey(true);
        }
    } else {
        alert("AI Studio environment not detected. Cannot use Veo.");
    }
  };

  const handleEnhancePrompt = async () => {
    if (!videoPrompt.trim()) return;
    setIsEnhancing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Rewrite this video generation prompt to be highly detailed, visual, and optimized for Veo 3. Include lighting, texture, and camera movement details. Keep it concise. Original: "${videoPrompt}"`
        });
        if (response.text) setVideoPrompt(response.text);
    } catch (e) {
        console.error("Enhance failed", e);
    } finally {
        setIsEnhancing(false);
    }
  };

  const handleGenerateVideo = async () => {
      if (!hasVeoKey) {
          await handleVeoKeyCheck();
          if (!hasVeoKey) return; // Re-check if user cancelled
      }
      
      if (!videoPrompt.trim()) return;
      setIsGeneratingVideo(true);
      setVideoStatus('Initializing generation...');
      setGeneratedVideoUrl(null);

      try {
        // Create a new instance with the injected key from environment (which is updated by aistudio selector)
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let operation;
        
        // Enhance prompt with style and pacing instructions
        const finalPrompt = `${videoPrompt}. Visual Style: ${videoStyle}. Pacing: ${videoLength === 'Short' ? 'Fast-paced' : 'Standard'}.`;
        
        const videoConfig = {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: videoAspectRatio
        };

        if (videoBaseImage) {
            operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: finalPrompt,
                image: {
                    imageBytes: videoBaseImage,
                    mimeType: 'image/png'
                },
                config: videoConfig
            });
        } else {
            operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: finalPrompt,
                config: videoConfig
            });
        }

        setVideoStatus('Processing video (this may take a moment)...');

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            // Fetch the video bytes
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setGeneratedVideoUrl(url);
        } else {
            alert("Video generation completed but no URL found.");
        }

      } catch (error: any) {
          console.error("Video Gen Error:", error);
          if (error.message?.includes('Requested entity was not found')) {
               setHasVeoKey(false);
               alert("API Key invalid or not found. Please select again.");
          } else {
               alert("Failed to generate video: " + error.message);
          }
      } finally {
          setIsGeneratingVideo(false);
          setVideoStatus('');
      }
  };

  const handleGenerateVoiceScript = async () => {
      if (!voiceTopic.trim()) return;
      setIsGeneratingScript(true);
      setGeneratedScript('');
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Write a 1-minute Alexa Flash Briefing script for "AiCollabFortheKids" about: ${voiceTopic}. Start with "Here is your daily update from AiCollab". Keep it inspiring and under 100 words.`,
          });
          setGeneratedScript(response.text || '');
      } catch (error) {
          console.error("Script Gen Error:", error);
      } finally {
          setIsGeneratingScript(false);
      }
  };

  const handlePreviewVoice = async () => {
      if (!generatedScript) return;
      setIsPlayingVoice(true);
      
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-preview-tts',
              contents: { parts: [{ text: generatedScript }] },
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
              }
          });
          
          const audioBytes = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (audioBytes) {
              const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
              if (!audioContextRef.current) {
                  audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
              }
              
              const buffer = await decodeAudioData(decode(audioBytes), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              source.onended = () => setIsPlayingVoice(false);
              source.start();
          }
      } catch (error) {
          console.error("TTS Error:", error);
          setIsPlayingVoice(false);
      }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
        <header className="glass-card p-6 mb-8 border-l-4 border-pink-500">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Wand className="w-8 h-8 text-pink-400" />
                Media Studio
            </h1>
            <p className="text-slate-400 mt-1">Create and Edit content with Imagen 4, Flash Image, Veo, and Voice.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('generate-image')}
                className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors whitespace-nowrap ${activeTab === 'generate-image' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-2"><Image className="w-4 h-4" /> Generate Image</div>
            </button>
            <button 
                 onClick={() => setActiveTab('edit-image')}
                 className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors whitespace-nowrap ${activeTab === 'edit-image' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-2"><Layers className="w-4 h-4" /> Edit Image</div>
            </button>
            <button 
                 onClick={() => setActiveTab('generate-video')}
                 className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors whitespace-nowrap ${activeTab === 'generate-video' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-2"><Film className="w-4 h-4" /> Generate Video (Veo)</div>
            </button>
            <button 
                 onClick={() => setActiveTab('voice-apps')}
                 className={`px-6 py-3 font-medium text-sm rounded-t-xl transition-colors whitespace-nowrap ${activeTab === 'voice-apps' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-2"><Radio className="w-4 h-4" /> Voice Apps (Alexa)</div>
            </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Control Panel */}
            <div className="glass-card p-6 h-fit">
                {activeTab === 'generate-image' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Imagen 4.0 Generator</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
                            <textarea 
                                value={genPrompt}
                                onChange={(e) => setGenPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate..."
                                className="glass-input w-full h-32 p-3 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                            <select 
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value as any)}
                                className="glass-input w-full p-2"
                            >
                                <option value="1:1">1:1 (Square)</option>
                                <option value="16:9">16:9 (Landscape)</option>
                                <option value="9:16">9:16 (Portrait)</option>
                                <option value="4:3">4:3</option>
                                <option value="3:4">3:4</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage || !genPrompt.trim()}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isGeneratingImage ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Sparkles className="w-5 h-5" />}
                            Generate Image
                        </button>
                    </div>
                )}

                {activeTab === 'edit-image' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Flash Image Editor</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Upload Base Image</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                {editBaseImage ? (
                                    <img src={`data:image/png;base64,${editBaseImage}`} alt="Base" className="max-h-40 mx-auto rounded" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400">
                                        <UploadCloud className="w-8 h-8 mb-2" />
                                        <span>Click to upload image</span>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const base64 = await fileToBase64(file);
                                        setEditBaseImage(base64);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Edit Instruction</label>
                            <input 
                                type="text"
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder="e.g. 'Add a retro filter' or 'Remove the background'"
                                className="glass-input w-full p-3"
                            />
                        </div>
                        <button 
                            onClick={handleEditImage}
                            disabled={isEditingImage || !editPrompt.trim() || !editBaseImage}
                            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isEditingImage ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Wand className="w-5 h-5" />}
                            Edit Image
                        </button>
                    </div>
                )}

                {activeTab === 'generate-video' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Veo Video Studio</h3>
                             {!hasVeoKey && (
                                <button 
                                    onClick={handleVeoKeyCheck}
                                    className="text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded border border-yellow-400"
                                >
                                    Set API Key
                                </button>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-300">Video Prompt</label>
                                <button 
                                    onClick={handleEnhancePrompt}
                                    disabled={isEnhancing || !videoPrompt.trim()}
                                    className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 disabled:opacity-50"
                                >
                                    {isEnhancing ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-pink-400"></div> : <Sparkles className="w-3 h-3" />}
                                    Auto-Enhance
                                </button>
                            </div>
                            <textarea 
                                value={videoPrompt}
                                onChange={(e) => setVideoPrompt(e.target.value)}
                                placeholder="Describe the video scene..."
                                className="glass-input w-full h-24 p-3 resize-none focus:ring-2 focus:ring-pink-500/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Visual Style</label>
                                <select 
                                    value={videoStyle}
                                    onChange={(e) => setVideoStyle(e.target.value)}
                                    className="glass-input w-full p-2"
                                >
                                    <option value="Cinematic">Cinematic</option>
                                    <option value="Anime">Anime</option>
                                    <option value="Photorealistic">Photorealistic</option>
                                    <option value="Cyberpunk">Cyberpunk</option>
                                    <option value="Vintage">Vintage/Retro</option>
                                    <option value="3D Render">3D Render</option>
                                    <option value="Watercolor">Watercolor</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Pacing (Guide)</label>
                                <select 
                                    value={videoLength}
                                    onChange={(e) => setVideoLength(e.target.value)}
                                    className="glass-input w-full p-2"
                                >
                                    <option value="Standard">Standard</option>
                                    <option value="Short">Short / Fast</option>
                                    <option value="Slow">Slow Motion</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                            <select 
                                value={videoAspectRatio}
                                onChange={(e) => setVideoAspectRatio(e.target.value as '16:9' | '9:16')}
                                className="glass-input w-full p-2"
                            >
                                <option value="16:9">16:9 (Landscape)</option>
                                <option value="9:16">9:16 (Portrait)</option>
                            </select>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Start Image (Optional)</label>
                            <div 
                                onClick={() => videoFileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                {videoBaseImage ? (
                                    <img src={`data:image/png;base64,${videoBaseImage}`} alt="Start" className="max-h-32 mx-auto rounded" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 text-sm">
                                        <UploadCloud className="w-5 h-5 mb-1" />
                                        <span>Upload Reference</span>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={videoFileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const base64 = await fileToBase64(file);
                                        setVideoBaseImage(base64);
                                    }
                                }}
                            />
                        </div>
                        <button 
                            onClick={handleGenerateVideo}
                            disabled={isGeneratingVideo || !videoPrompt.trim()}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-purple-900/20"
                        >
                            {isGeneratingVideo ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Film className="w-5 h-5" />}
                            Generate Video
                        </button>
                        {videoStatus && <p className="text-sm text-slate-400 animate-pulse text-center">{videoStatus}</p>}
                    </div>
                )}
                
                {activeTab === 'voice-apps' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Alexa Flash Briefing Creator</h3>
                            <span className="text-xs bg-cyan-900/50 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30">Voice Ops</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Briefing Topic</label>
                            <input 
                                type="text"
                                value={voiceTopic}
                                onChange={(e) => setVoiceTopic(e.target.value)}
                                placeholder="e.g. Monthly Donation Goal Reached"
                                className="glass-input w-full p-3"
                            />
                        </div>
                        
                        <button 
                            onClick={handleGenerateVoiceScript}
                            disabled={isGeneratingScript || !voiceTopic.trim()}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isGeneratingScript ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Sparkles className="w-5 h-5" />}
                            Generate Script
                        </button>
                        
                        {generatedScript && (
                            <div className="animate-in fade-in slide-in-from-top-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Script Preview</label>
                                <textarea 
                                    value={generatedScript}
                                    onChange={(e) => setGeneratedScript(e.target.value)}
                                    className="glass-input w-full h-32 p-3 resize-none mb-4 text-sm font-mono"
                                />
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handlePreviewVoice}
                                        disabled={isPlayingVoice}
                                        className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                                    >
                                        {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        Preview Audio
                                    </button>
                                    <button 
                                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg"
                                        onClick={() => alert("Script deployed to Alexa Skill (Simulation)")}
                                    >
                                        <Radio className="w-4 h-4" />
                                        Deploy to Alexa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Preview Panel */}
            <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[400px] relative bg-black/20">
                <h3 className="absolute top-4 left-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Output Preview</h3>
                
                {activeTab === 'generate-image' && (
                    generatedImage ? (
                        <img src={generatedImage} alt="Generated" className="max-w-full max-h-[500px] rounded-lg shadow-2xl" />
                    ) : (
                        <div className="text-slate-500 flex flex-col items-center">
                            <Image className="w-12 h-12 mb-2 opacity-20" />
                            <p>Generated image will appear here</p>
                        </div>
                    )
                )}

                {activeTab === 'edit-image' && (
                    editedImage ? (
                        <img src={editedImage} alt="Edited" className="max-w-full max-h-[500px] rounded-lg shadow-2xl" />
                    ) : (
                        <div className="text-slate-500 flex flex-col items-center">
                            <Wand className="w-12 h-12 mb-2 opacity-20" />
                            <p>Edited result will appear here</p>
                        </div>
                    )
                )}

                 {activeTab === 'generate-video' && (
                    generatedVideoUrl ? (
                        <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-[500px] rounded-lg shadow-2xl border border-purple-500/30" />
                    ) : (
                        <div className="text-slate-500 flex flex-col items-center">
                            <Film className="w-12 h-12 mb-2 opacity-20" />
                            <p>Generated video will appear here</p>
                        </div>
                    )
                )}
                
                {activeTab === 'voice-apps' && (
                    <div className="flex flex-col items-center justify-center h-full w-full max-w-md">
                        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 transition-all duration-500 ${isPlayingVoice ? 'border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.3)] scale-110' : 'border-slate-700'}`}>
                            <Radio className={`w-16 h-16 transition-colors duration-500 ${isPlayingVoice ? 'text-cyan-400' : 'text-slate-700'}`} />
                        </div>
                        {isPlayingVoice && (
                            <div className="flex gap-1 h-8 items-end mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-2 bg-cyan-500 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                        )}
                        <p className="text-slate-400 text-center">
                            {isPlayingVoice ? "Broadcasting Preview..." : "Amazon Alexa Simulation Ready"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </main>
  );
};

export default MediaStudio;
