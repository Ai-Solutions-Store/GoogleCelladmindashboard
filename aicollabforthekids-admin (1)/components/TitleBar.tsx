import React from 'react';
import { Aperture, ShieldCheck, Heart } from './IconComponents';

const TitleBar: React.FC = () => {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[30px] bg-slate-900/80 backdrop-blur-md flex items-center px-4 select-none z-[1000] border-b border-white/10 app-region-drag justify-between"
      style={{ 
        height: 'var(--title-bar-height, 30px)',
        paddingLeft: 'var(--title-bar-x, 10px)',
        width: 'var(--title-bar-width, 100%)'
      }}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
        <Aperture className="w-3.5 h-3.5 text-indigo-400" />
        <span>Ai-Solutions-Store</span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-green-400">
            <ShieldCheck className="w-3 h-3" />
            SECURE
        </span>
      </div>

      {/* THE HEARTBEAT OF THE APP */}
      <div className="flex items-center gap-2 mr-20 md:mr-0">
          <span className="text-[10px] font-black text-pink-500 tracking-widest uppercase hidden sm:inline-block">
              Innovation with a Heartbeat
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-pink-900/30 border border-pink-500/30 rounded-full">
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white">FOR THE KIDS</span>
          </div>
      </div>

      <style>{`
        .app-region-drag {
            -webkit-app-region: drag;
        }
      `}</style>
    </div>
  );
};

export default TitleBar;