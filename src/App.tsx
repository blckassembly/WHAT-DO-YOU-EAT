/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { HeaderNav } from './components/HeaderNav';
import { StreamSimulatorView } from './components/StreamSimulatorView';
import { DiscordStreamerView } from './components/DiscordStreamerView';
import { FoodLandingView } from './components/FoodLandingView';
import { LocationDiscoveryView } from './components/LocationDiscoveryView';
import { CampaignStudioView } from './components/CampaignStudioView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { StreamOverlayCard } from './components/StreamOverlayCard';
import { PhoneScanModal } from './components/PhoneScanModal';
import { Tv, Smartphone, MapPin, Briefcase, BarChart3, Layers } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, triggerSimulatedScan } = useApp();

  // If path is standalone overlay (e.g. for OBS browser source)
  if (window.location.pathname.startsWith('/overlay')) {
    return (
      <div className="min-h-screen bg-transparent p-6 flex items-end justify-start">
        <StreamOverlayCard previewMode={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10382E] flex flex-col text-[#FAFAFA] font-sans">
      <HeaderNav />

      <main className="flex-1 flex flex-col">
        {activeView === 'stream_demo' && <StreamSimulatorView />}
        {activeView === 'discord_deck' && <DiscordStreamerView />}
        {activeView === 'food_landing' && <FoodLandingView />}
        {activeView === 'locations' && <LocationDiscoveryView />}
        {activeView === 'studio' && <CampaignStudioView />}
        {activeView === 'analytics' && <AnalyticsDashboardView />}
      </main>

      {/* Global Simulated Phone QR Scanner Modal */}
      <PhoneScanModal />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-[#0C2B23] border-t border-white/10 px-3 py-2 flex items-center justify-around text-[10px] font-mono font-bold">
        <button
          onClick={() => setActiveView('stream_demo')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'stream_demo' ? 'text-white' : 'text-[#A3D2C4]'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Stream</span>
        </button>
        <button
          onClick={() => setActiveView('discord_deck')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'discord_deck' ? 'text-white' : 'text-[#A3D2C4]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Discord</span>
        </button>
        <button
          onClick={triggerSimulatedScan}
          className="flex flex-col items-center gap-1 text-[#E4FF1A]"
        >
          <Smartphone className="w-4 h-4" />
          <span>Scan QR</span>
        </button>
        <button
          onClick={() => setActiveView('food_landing')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'food_landing' ? 'text-white' : 'text-[#A3D2C4]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Apps</span>
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'analytics' ? 'text-white' : 'text-[#A3D2C4]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
