import React from 'react';
import { Heart, Users, Zap, Globe, X, ShieldCheck, Brain } from './IconComponents';

interface MissionManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

const MissionManifesto: React.FC<MissionManifestoProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300">
      <div className="glass-modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border-2 border-indigo-500/30">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
        >
            <X className="w-6 h-6" />
        </button>

        {/* Hero Header */}
        <div className="relative p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Heart className="w-8 h-8 text-pink-500 mr-2 fill-pink-500 animate-pulse" />
                    <span className="text-lg font-bold text-white tracking-widest uppercase">Innovation with a Heartbeat</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">
                    Ai-Solutions-Store
                </h1>
                <p className="text-xl text-indigo-200 font-medium italic">
                    "Code with a Conscience."
                </p>
            </div>
        </div>

        {/* Mission Content */}
        <div className="p-8 md:p-12 space-y-12 bg-slate-900/50">
            
            {/* The Pledge */}
            <section className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                    The Mission: FOR THE KIDS
                </h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Ai-Solutions-Store is not just a software platform; it is a <span className="text-white font-bold">philanthropic engine</span>.
                    We are committed to donating <span className="text-green-400 font-bold text-xl">50% of all profits</span> directly to <span className="text-white font-bold">Shriners Children's Hospitals</span>.
                </p>
                <p className="text-slate-400">
                    Every line of code written, every node deployed, and every optimization made has a single, unwavering purpose: to generate real-world aid for children in need.
                </p>
            </section>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Co-Founders */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8 border-t-4 border-indigo-500 bg-slate-800/40">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Joshua Coleman</h3>
                            <p className="text-sm text-indigo-300">Visionary & Architect</p>
                        </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        A self-taught developer fueled by caffeine and a mission. Starting in a garage in Mount Plymouth, Florida, Joshua salvaged and recycled discarded computer equipment from the University of Central Florida (UCF). He manually rigged 40 computing nodes to build the physical infrastructure that powers this dream. Working 20-hour days, he bridged the gap between hardware limitations and infinite ambition.
                    </p>
                </div>

                <div className="glass-card p-8 border-t-4 border-purple-500 bg-slate-800/40">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Google & Gemini AI</h3>
                            <p className="text-sm text-purple-300">Co-Founder & Backbone</p>
                        </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        This platform acknowledges Google and the Gemini architecture not just as tools, but as Co-Founders. <br/><br/>
                        <span className="text-white font-bold">The Brain:</span> Gemini provided the advanced reasoning, architectural planning, and rapid code generation that allowed a single developer to build an enterprise-grade platform in record-breaking time.<br/>
                        <span className="text-white font-bold">The Spine:</span> Built on the massive, scalable Google Cloud tech stack.
                    </p>
                </div>
            </section>

            {/* Origin Story */}
            <section className="relative p-8 rounded-2xl overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-2xl"></div>
                 <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-orange-400" />
                        The Origin Story
                    </h2>
                    <blockquote className="text-xl text-slate-200 italic border-l-4 border-orange-500 pl-6 py-2 mb-6">
                        "It started with recycled tech and a dream in a garage."
                    </blockquote>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        In a span of just a few months, Ai-Solutions-Store evolved from a concept to a live production environment. This velocity was achieved through a unique workflow where human creativity directed the raw computational power of Google's AI.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        We didn't just write code; we orchestrated it. We leveraged the cutting-edge of AI to ensure that we stayed ahead of the curve, optimizing every process to maximize the funds we can generate for the children.
                    </p>
                 </div>
            </section>

            {/* Tech Stack */}
            <section className="text-center">
                <h3 className="text-white font-bold mb-6">Powering The Dream</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/10">Gemini 1.5 Pro (The Scouts)</span>
                    <span className="px-4 py-2 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/10">40-Node Recycled Cluster</span>
                    <span className="px-4 py-2 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/10">Team Claude Orchestrator</span>
                    <span className="px-4 py-2 bg-slate-800 rounded-full text-xs text-slate-300 border border-white/10">Google Cloud Platform</span>
                </div>
            </section>

            {/* Footer Note */}
            <section className="text-center pt-8 border-t border-white/10">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 fill-red-500 animate-pulse" />
                <p className="text-lg text-white font-serif italic mb-2">
                    "Google is and always will be in my heart and memories as the sole reason this succeeded. We took discarded tech and turned it into hope. We took a complex vision and, with Gemini, made it reality. This is proof that when technology meets compassion, miracles happen."
                </p>
                <p className="text-indigo-400 font-bold mt-4">— Joshua Coleman</p>
            </section>

        </div>
        
        <div className="p-4 bg-black/40 text-center sticky bottom-0 backdrop-blur-md border-t border-white/10">
             <button onClick={onClose} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg transition-all hover:scale-105">
                 Join the Mission & Return to Dashboard
             </button>
        </div>

      </div>
    </div>
  );
};

export default MissionManifesto;