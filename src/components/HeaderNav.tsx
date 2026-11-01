import React from 'react';
import { useApp } from '../store/AppContext';
import { Smartphone, Play, Pause, Layers } from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { activeView, setActiveView, runSimulation, pauseSimulation, resumeSimulation, simulationPlaying, simulationActive, simulationSecond } = useApp();

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-white/10 bg-[#0C2B23] sticky top-0 z-40 select-none">
      {/* Zone 1: Single text element wordmark in bold display face */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveView('stream_demo');
        }}
        className="text-lg font-display font-black tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity uppercase"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#E4FF1A]" />
        <span>WHAT DO YOU EAT?</span>
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-bold text-[#C8E6DC]">
        <button
          onClick={() => setActiveView('stream_demo')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            activeView === 'stream_demo'
              ? 'text-white border-b-2 border-white'
              : 'hover:text-white'
          }`}
        >
          Twitch Stream
        </button>

        <button
          onClick={() => setActiveView('discord_deck')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            activeView === 'discord_deck'
              ? 'text-white border-b-2 border-white'
              : 'hover:text-white'
          }`}
        >
          Streamer Discord
        </button>

        <button
          onClick={() => setActiveView('food_landing')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            activeView === 'food_landing'
              ? 'text-white border-b-2 border-white'
              : 'hover:text-white'
          }`}
        >
          Native App Hub
        </button>

        <button
          onClick={() => setActiveView('locations')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            activeView === 'locations'
              ? 'text-white border-b-2 border-white'
              : 'hover:text-white'
          }`}
        >
          Store Footprint
        </button>

        <button
          onClick={() => setActiveView('studio')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            activeView === 'studio'
              ? 'text-white border-b-2 border-white'
              : 'hover:text-white'
          }`}
        >
          Campaign Studio
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            activeView === 'analytics'
              ? 'text-white border-b-2 border-white'
              : 'hover:text-white'
          }`}
        >
          Attribution Analytics
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {!simulationPlaying ? (
          <button
            onClick={simulationActive && simulationSecond > 0 && simulationSecond < 180 ? resumeSimulation : runSimulation}
            className="px-4 py-2 text-xs font-display font-black text-[#10382E] bg-white hover:bg-[#E4FF1A] rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 uppercase shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run 3-Min Demo</span>
          </button>
        ) : (
          <button
            onClick={pauseSimulation}
            className="px-4 py-2 text-xs font-display font-black text-black bg-[#E4FF1A] rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2 uppercase shadow-sm active:scale-95"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause Demo</span>
          </button>
        )}
      </div>
    </header>
  );
};
