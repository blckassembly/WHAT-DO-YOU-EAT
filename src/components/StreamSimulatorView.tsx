import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Eye,
  Smartphone,
  Radio,
  ChevronDown,
  ArrowUpRight,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Sparkles,
  Gamepad2,
  MapPin,
  Clock,
  Flame,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Volume2,
  Tv,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { GenericArcadeGame } from './GenericArcadeGame';
import { QRCodeDisplay } from './QRCodeDisplay';
import { RapidStreamChat } from './RapidStreamChat';
import { SIMULATION_PHASES } from '../data/mockData';

export const StreamSimulatorView: React.FC = () => {
  const {
    activeCampaign,
    activeProduct,
    activeSponsor,
    activeCreator,
    campaigns,
    setActiveCampaignId,
    setActiveView,
    overlayVisible,
    setOverlayVisible,
    chatMessages,
    sendChatMessage,
    triggerSimulatedScan,

    // 3-Minute Autonomous Simulation Engine
    simulationActive,
    simulationPlaying,
    simulationSecond,
    simulationSpeed,
    setSimulationSpeed,
    currentPhase,
    currentViewerCount,
    runSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    seekSimulation,
  } = useApp();

  const [copiedObs, setCopiedObs] = useState(false);
  const [vuLevels, setVuLevels] = useState([45, 70, 35, 88, 62, 50]);

  // Sequence Activations over 180s timeline:
  // 1. Stream: 0s - 25s
  // 2. Chat: 25s - 50s
  // 3. Video Game: 50s - 80s
  // 4. Food Menu & Dispatch: 80s - 115s
  // 5. QR Code Overlay & App Handoff: 115s - 180s
  const showChat = simulationSecond >= 25 || (!simulationActive && overlayVisible);
  const showGame = simulationSecond >= 50 || (!simulationActive);
  const showFoodSplit = simulationSecond >= 80 || (!simulationActive && overlayVisible);
  const showBarcode = simulationSecond >= 115 || (!simulationActive && overlayVisible);

  // Active step identification
  const currentStep = useMemo(() => {
    if (simulationSecond < 25) return 1;
    if (simulationSecond < 50) return 2;
    if (simulationSecond < 80) return 3;
    if (simulationSecond < 115) return 4;
    return 5;
  }, [simulationSecond]);

  // VU Meter audio bounce
  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevels([
        Math.floor(Math.random() * 50 + 35),
        Math.floor(Math.random() * 60 + 30),
        Math.floor(Math.random() * 40 + 25),
        Math.floor(Math.random() * 70 + 25),
        Math.floor(Math.random() * 55 + 35),
        Math.floor(Math.random() * 45 + 20),
      ]);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const handleCopyObs = () => {
    const obsUrl = `${window.location.origin}/overlay/${activeCampaign.id}`;
    navigator.clipboard.writeText(obsUrl);
    setCopiedObs(true);
    setTimeout(() => setCopiedObs(false), 2000);
  };

  const mins = Math.floor(simulationSecond / 60);
  const secs = simulationSecond % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = Math.min(100, (simulationSecond / 180) * 100);

  // Computed real-time conversion counters for Stage 5
  const estimatedOrders = useMemo(() => {
    if (simulationSecond < 115) return 0;
    const progressInStage5 = (simulationSecond - 115) / 65;
    return Math.floor(progressInStage5 * 1840);
  }, [simulationSecond]);

  const estimatedSales = useMemo(() => {
    return (estimatedOrders * activeProduct.basePrice).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }, [estimatedOrders, activeProduct.basePrice]);

  const estimatedKickback = useMemo(() => {
    const rate = activeCampaign.commissionRate || 5;
    return (estimatedOrders * activeProduct.basePrice * (rate / 100)).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  }, [estimatedOrders, activeProduct.basePrice, activeCampaign.commissionRate]);

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] overflow-hidden bg-[#10382E]">
      {/* ============================================================ */}
      {/* 3-MINUTE AUTONOMOUS SIMULATION ENGINE MASTER CONTROLLER */}
      {/* ============================================================ */}
      <div className="bg-[#09221C] border-b border-white/15 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg relative z-30">
        <div className="flex items-center gap-3">
          {/* Main Run / Pause / Replay Button */}
          {!simulationPlaying ? (
            <button
              onClick={simulationActive && simulationSecond > 0 && simulationSecond < 180 ? resumeSimulation : runSimulation}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#E4FF1A] text-[#10382E] font-display font-black text-xs uppercase flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.3)] active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {simulationSecond === 180
                  ? 'Replay 3-Min Demo'
                  : simulationSecond > 0
                  ? 'Resume 3-Min Demo'
                  : 'Run 3-Minute Video Demo'}
              </span>
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="px-4 py-2 rounded-xl bg-[#E4FF1A] text-black font-display font-black text-xs uppercase flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(228,255,26,0.3)] cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Demo</span>
            </button>
          )}

          <button
            onClick={resetSimulation}
            className="p-2 rounded-xl bg-[#14463A] hover:bg-[#1A5B4C] text-[#C8E6DC] border border-white/15 transition-colors cursor-pointer"
            title="Reset Simulation to 0:00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Timecode & Active Phase Display */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-white font-bold bg-[#14463A] px-2.5 py-1 rounded-lg border border-white/15 tabular-nums">
              {timeFormatted} / 03:00
            </span>
            <span className="text-xs font-mono text-[#E4FF1A] font-bold hidden md:inline">
              Step {currentStep}/5: {SIMULATION_PHASES[currentStep - 1]?.title}
            </span>
          </div>

          {/* Compact Trust Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-400/30 text-emerald-300 font-mono text-[9px] sm:text-[10px] font-bold tracking-wider uppercase whitespace-nowrap shadow-xs">
            DEMO MODE · SIMULATED DATA · NO REAL ORDERS
          </span>
        </div>

        {/* 5-Step Sequence Jump Bar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono">
            {SIMULATION_PHASES.map((p, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;

              return (
                <button
                  key={p.id}
                  onClick={() => seekSimulation(p.startSec)}
                  className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#E4FF1A] text-black font-extrabold shadow-[0_2px_10px_rgba(228,255,26,0.3)] scale-105'
                      : isPast
                      ? 'bg-[#185545] text-white border border-white/20'
                      : 'bg-[#14463A]/70 text-[#A3D2C4] hover:text-white border border-white/10'
                  }`}
                  title={`Jump to ${p.title} (${Math.floor(p.startSec / 60)}:${String(p.startSec % 60).padStart(2, '0')})`}
                >
                  <span className="text-[10px] opacity-70">0{stepNum}.</span>
                  <span>{stepNum === 1 ? 'Stream' : stepNum === 2 ? 'Chat' : stepNum === 3 ? 'Game' : stepNum === 4 ? 'Food' : 'QR'}</span>
                </button>
              );
            })}
          </div>

          {/* Speed Multiplier */}
          <div className="flex items-center gap-1 bg-[#14463A] p-0.5 rounded-xl border border-white/15 text-[11px] font-mono">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  simulationSpeed === spd ? 'bg-white text-[#10382E]' : 'text-[#A3D2C4] hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Switch to Discord Streamer View */}
          <button
            onClick={() => setActiveView('discord_deck')}
            className="px-3 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Streamer Discord</span>
          </button>
        </div>
      </div>

      {/* Scrubbable 180s Progress Timeline Bar with Markers */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const targetSec = Math.floor((clickX / rect.width) * 180);
          seekSimulation(targetSec);
        }}
        className="w-full h-2.5 bg-[#071E18] cursor-pointer group relative overflow-hidden shrink-0 border-b border-white/10"
        title="Click anywhere to scrub across the 180-second sequence timeline"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-[#E4FF1A] to-white transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Step Marker Pins */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
          <span className="w-0.5 h-full bg-white/40" style={{ left: '0%' }} />
          <span className="w-0.5 h-full bg-white/40" style={{ left: '13.8%' }} title="25s: Chat" />
          <span className="w-0.5 h-full bg-white/40" style={{ left: '27.7%' }} title="50s: Game" />
          <span className="w-0.5 h-full bg-white/40" style={{ left: '44.4%' }} title="80s: Food" />
          <span className="w-0.5 h-full bg-white/40" style={{ left: '63.8%' }} title="115s: QR" />
        </div>
      </div>

      {/* Sequence Director HUD Status Banner */}
      <div className="bg-[#0C2B23] border-b border-white/10 px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3 shrink-0 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E4FF1A] animate-ping" />
            <span className="text-[#E4FF1A] font-bold uppercase tracking-wide text-[11px]">
              SEQUENCE ACTIVATION:
            </span>
            <span className="text-white font-bold text-[11px]">
              {currentStep === 1 && '1/5 STREAM ONLINE (Webcam Solo & Lobby Warmup)'}
              {currentStep === 2 && '2/5 CHAT ACTIVATED (Rapid Twitch Bot Feed)'}
              {currentStep === 3 && '3/5 VIDEO GAME ACTIVATED (The Wander Mega Feast Arcade)'}
              {currentStep === 4 && '4/5 FOOD MENU & DISPATCH (4-Piece Split Screen)'}
              {currentStep === 5 && '5/5 QR CODE OVERLAY & NATIVE APP SCAN (5-Piece Split)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#A3D2C4] text-[11px] hidden sm:inline">
            Active Creator: <strong>{activeCreator.displayName}</strong>
          </span>
          <span className="text-[#E4FF1A] font-bold tabular-nums">
            {currentViewerCount.toLocaleString()} Simulated Viewers
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN DYNAMIC SPLIT-SCREEN WORKSPACE */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* Main Broadcast Stage */}
        <div className="flex-1 relative bg-[#061612] flex flex-col overflow-hidden">
          {/* Top Live Status Indicator */}
          <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="bg-red-600 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider shadow-md">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>SIMULATED</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] px-2.5 py-0.5 rounded font-mono tabular-nums">
              {timeFormatted}
            </div>
            {showGame && (
              <div className="hidden sm:flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/15 text-[#E4FF1A] text-[11px] px-2 py-0.5 rounded font-mono font-bold">
                <Gamepad2 className="w-3 h-3" />
                <span>THE WANDER MEGA FEAST</span>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* STAGE RENDERING ACCORDING TO 180s SEQUENCE */}
          {/* ============================================================ */}
          <div className="w-full h-full flex flex-col min-h-0 overflow-hidden">
            {/* STEP 1: Stream Only (0s - 25s) -> Full Focus Broadcaster Webcam */}
            {simulationSecond < 25 ? (
              <div className="relative w-full h-full flex-1 min-h-0 bg-[#071E18] flex items-center justify-center overflow-hidden p-6">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1b5d4d_1px,transparent_1px),linear-gradient(to_bottom,#1b5d4d_1px,transparent_1px)] bg-[size:3rem_3rem]" />

                {/* Streamer Broadcast Webcam Studio (First-Principles Liquid Glass) */}
                <div className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden border border-white/25 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.45),0_25px_60px_rgba(0,0,0,0.8)] bg-white/[0.08] backdrop-blur-2xl p-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0C2B23] border border-white/15">
                    <img
                      src={activeCreator.avatarUrl}
                      alt={activeCreator.displayName}
                      className="w-full h-full object-cover"
                    />

                    {/* Mic Audio Waves */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs text-white font-mono">
                      <div className="flex items-end gap-1 h-3.5">
                        {vuLevels.map((lvl, i) => (
                          <span
                            key={i}
                            className="w-1 bg-[#E4FF1A] rounded-t transition-all duration-100"
                            style={{ height: `${lvl}%` }}
                          />
                        ))}
                      </div>
                      <span className="font-bold">BROADCAST MIC 01</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded-lg text-xs font-mono text-[#E4FF1A] border border-white/10">
                      1080p60 · Studio Feed
                    </div>
                  </div>

                  {/* Streamer Warmup Banner */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-[#09221C] border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E4FF1A] animate-pulse" />
                        <h2 className="text-base font-display font-black text-white">
                          {activeCreator.displayName} Live Broadcast
                        </h2>
                      </div>
                      <p className="text-xs text-[#A3D2C4] font-mono mt-0.5">
                        "Yo chat we are live! Warming up the lobby before The Wander Mega Feast arcade and dinner!"
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#A3D2C4] font-mono block">Next Activation</span>
                      <span className="text-xs font-mono font-bold text-[#E4FF1A]">Chat in {25 - simulationSecond}s</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : !showGame ? (
              /* STEP 2: Stream + Chat (25s - 50s) -> Streamer talks to rapid chat */
              <div className="relative w-full h-full flex-1 min-h-0 bg-[#071E18] flex items-center justify-center overflow-hidden p-6">
                <div className="relative z-10 w-full max-w-xl rounded-3xl overflow-hidden border border-white/25 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.45),0_25px_60px_rgba(0,0,0,0.8)] bg-white/[0.08] backdrop-blur-2xl p-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0C2B23] border border-white/15">
                    <img
                      src={activeCreator.avatarUrl}
                      alt={activeCreator.displayName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-xs text-white font-mono">
                      <div className="flex items-end gap-1 h-3.5">
                        {vuLevels.map((lvl, i) => (
                          <span
                            key={i}
                            className="w-1 bg-[#E4FF1A] rounded-t transition-all duration-100"
                            style={{ height: `${lvl}%` }}
                          />
                        ))}
                      </div>
                      <span className="font-bold">TALKING TO CHAT</span>
                    </div>
                  </div>

                  <div className="mt-3.5 p-3 rounded-2xl bg-[#09221C] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#E4FF1A] font-mono font-bold uppercase">
                        Chat Flood Active (1.8M Viewers)
                      </span>
                      <p className="text-xs font-display font-bold text-white mt-0.5">
                        "Look at chat moving fast! About to boot up The Wander Mega Feast game!"
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#A3D2C4] font-mono block">Game Boot</span>
                      <span className="text-xs font-mono font-bold text-[#E4FF1A]">in {50 - simulationSecond}s</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : !showFoodSplit ? (
              /* STEP 3: Video Game Activated (50s - 80s) -> Full Game with Streamer PiP */
              <div className="relative w-full h-full flex-1 min-h-0 bg-[#061612] overflow-hidden">
                <GenericArcadeGame
                  gameTitle="THE WANDER MEGA FEAST"
                  foodTheme={activeProduct.headline}
                  className="w-full h-full"
                />

                {/* Streamer Facecam PiP Frame (Upper Right) with Liquid Glass Bezel */}
                <div className="absolute top-4 right-4 z-20 w-52 sm:w-60 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1.5px_1px_rgba(255,255,255,0.4)] border border-white/25 bg-white/[0.08] backdrop-blur-xl">
                  <div className="relative aspect-video bg-[#0C2B23] overflow-hidden">
                    <img
                      src={activeCreator.avatarUrl}
                      alt={activeCreator.displayName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-mono border border-white/15">
                      <div className="flex items-end gap-0.5 h-3">
                        {vuLevels.slice(0, 4).map((lvl, i) => (
                          <span
                            key={i}
                            className="w-0.5 bg-[#E4FF1A] rounded-t"
                            style={{ height: `${lvl}%` }}
                          />
                        ))}
                      </div>
                      <span className="font-bold">IN THE ZONE</span>
                    </div>
                  </div>
                  <div className="p-2 flex items-center justify-between text-xs bg-[#09221C] font-mono border-t border-white/10">
                    <span className="font-bold text-white truncate text-[11px]">{activeCreator.displayName}</span>
                    <span className="text-[#E4FF1A] text-[10px]">Ranked Gameplay</span>
                  </div>
                </div>

                {/* Bottom Game Callout Banner */}
                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                  <div className="max-w-md bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.35),0_15px_35px_rgba(0,0,0,0.5)] rounded-2xl p-3.5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Gamepad2 className="w-4 h-4 text-[#E4FF1A]" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E4FF1A]">
                        Step 3/5: The Wander Mega Feast Arcade
                      </span>
                    </div>
                    <p className="text-xs font-display font-bold text-[#E6F4F0] leading-snug">
                      "Yo chat, this gameplay is intense! But I am starving... food menu reveal in {80 - simulationSecond}s!"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* STEP 4 & 5: 4-Piece / 5-Piece Split Screen */
              <div className="w-full h-full flex flex-col md:flex-row min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/15">
                {/* Left Half: The Food Experience & Delivery Dispatch */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-[#0A261F] to-[#071E18]">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 bg-[#123E33] border border-white/15 px-3 py-1 rounded-xl text-xs font-mono">
                      <Flame className="w-3.5 h-3.5 text-[#E4FF1A]" />
                      <span className="font-extrabold text-white uppercase tracking-wider">
                        WHAT I'M EATING LIVE
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#A3D2C4]">
                      {activeSponsor.businessName} Partnership
                    </span>
                  </div>

                  {/* 1. THE FOOD CARD (LIQUID GLASS WITH FIRST PRINCIPLES) */}
                  <div className="relative rounded-3xl p-5 overflow-hidden transition-all duration-300 border border-white/25 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(0,0,0,0.3),0_20px_50px_rgba(0,0,0,0.6)] bg-white/[0.08] backdrop-blur-2xl">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#E4FF1A] animate-pulse" />
                          <span className="text-xs font-mono font-black uppercase tracking-wider text-white">
                            {activeSponsor.businessName}
                          </span>
                          <span className="text-white/40">·</span>
                          <span className="text-[11px] text-[#A3D2C4] font-mono">Featured Meal</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-[#E4FF1A] text-black px-2.5 py-0.5 rounded-lg shadow-sm">
                          PROMO: {activeCampaign.promoCode}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-display font-black text-white leading-tight">
                        {activeProduct.name}
                      </h3>
                      <p className="text-xs text-[#C8E6DC] mt-1.5 leading-relaxed font-sans">
                        {activeProduct.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                        {activeProduct.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#14463A]/90 text-white border border-white/15 px-2 py-0.5 rounded-lg font-bold"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-extrabold text-sm">
                            ${activeProduct.basePrice.toFixed(2)}
                          </span>
                          <span className="text-[#86BBAE]">·</span>
                          <span className="text-[#A3D2C4]">{activeProduct.calories} Calories</span>
                        </div>
                        <span className="text-[#E4FF1A] font-bold">
                          {activeCampaign.promoDetails}
                        </span>
                      </div>

                      {/* ============================================================ */}
                      {/* STEP 5: QR CODE OVERLAY (ACTIVATES AT 115s) */}
                      {/* ============================================================ */}
                      {showBarcode ? (
                        <div
                          onClick={triggerSimulatedScan}
                          className="mt-4 p-3.5 rounded-2xl bg-white/[0.12] border-2 border-[#E4FF1A] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(228,255,26,0.25)] cursor-pointer group hover:bg-white/[0.18] transition-all"
                          title="Click to simulate scanning this QR code into your native delivery app"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="shrink-0 bg-white p-1.5 rounded-xl shadow-lg border border-white group-hover:scale-105 transition-transform">
                              <QRCodeDisplay
                                url={`${window.location.origin}/food/${activeCampaign.slug}`}
                                size={78}
                                showActions={false}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-[#E4FF1A] text-xs font-mono font-black uppercase">
                                <Smartphone className="w-3.5 h-3.5 animate-bounce" />
                                <span>CATCH BARCODE ON PHONE</span>
                              </div>
                              <p className="text-[11px] text-white font-bold leading-tight mt-0.5">
                                Auto-opens your de facto app: Uber Eats, DoorDash, or {activeSponsor.brandAppTitle}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-[#A3D2C4]">
                                <span className="bg-black/50 px-1.5 py-0.5 rounded text-white font-bold">
                                  CODE APPLIED
                                </span>
                                <span>Tap or wait for auto-scan</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 p-3 rounded-2xl bg-[#09221C]/80 border border-white/10 text-center text-xs font-mono text-[#A3D2C4] flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-[#E4FF1A] animate-spin" />
                          <span>Streamer presenting food menu... Barcode unlocks in {115 - simulationSecond}s!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. WHERE STREAMER IS ORDERING FROM (LIQUID GLASS DISPATCH) */}
                  <div className="rounded-3xl p-4 border border-white/20 bg-white/[0.05] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center justify-between text-xs mb-2 font-mono">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#E4FF1A]" />
                        <span>ORDER DISPATCH ORIGIN</span>
                      </div>
                      <span className="text-[#E4FF1A] font-bold text-[11px]">
                        ETA: 14 Mins (In-Transit)
                      </span>
                    </div>

                    <div className="bg-[#09221C] rounded-2xl p-3 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-display font-black text-white">
                            {activeSponsor.businessName} Flagship Kitchen Hub #042
                          </h4>
                          <p className="text-[11px] text-[#A3D2C4] font-mono">
                            Chelsea Culinary Center · 184 10th Ave, New York NY
                          </p>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-lg font-mono font-bold">
                          Cooked Fresh
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/10 text-[#C8E6DC]">
                        <span>Delivery via: <strong>E-Bike Courier Marco</strong></span>
                        <span className="text-white">Bag: <strong>Thermal Seal #894</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 5 Live Commerce Surge Metrics */}
                  {showBarcode && (
                    <div className="rounded-2xl p-3.5 bg-gradient-to-r from-[#123E33] to-[#0D2E25] border border-white/20 shadow-md flex items-center justify-between gap-3 text-xs font-mono animate-in fade-in">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#E4FF1A] font-bold text-[10px] uppercase">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Simulated Commerce Projection</span>
                        </div>
                        <div className="text-white font-black text-sm mt-0.5">
                          {estimatedSales} <span className="text-[10px] font-normal text-[#A3D2C4]">({estimatedOrders.toLocaleString()} simulated orders)</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#A3D2C4]">Streamer Earnings</span>
                        <div className="text-[#E4FF1A] font-display font-black text-sm">
                          +{estimatedKickback}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Half: Retro Arcade Video Game + Streamer PiP */}
                <div className="flex-1 relative bg-[#061612] flex flex-col min-h-[300px] overflow-hidden">
                  <GenericArcadeGame
                    gameTitle="THE WANDER MEGA FEAST"
                    foodTheme={activeProduct.headline}
                    className="w-full h-full flex-1"
                  />

                  {/* Streamer Facecam PiP Frame in top right */}
                  <div className="absolute top-3 right-3 z-20 w-44 sm:w-48 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.7),inset_0_1.5px_1px_rgba(255,255,255,0.4)] border border-white/25 bg-white/[0.08] backdrop-blur-xl">
                    <div className="relative aspect-video bg-[#0C2B23] overflow-hidden">
                      <img
                        src={activeCreator.avatarUrl}
                        alt={activeCreator.displayName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
                        <div className="flex items-end gap-0.5 h-2.5">
                          {vuLevels.slice(0, 4).map((lvl, i) => (
                            <span
                              key={i}
                              className="w-0.5 bg-[#E4FF1A] rounded-t"
                              style={{ height: `${lvl}%` }}
                            />
                          ))}
                        </div>
                        <span>MIC</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-[#09221C] text-[10px] font-mono flex items-center justify-between text-white border-t border-white/10">
                      <span className="font-bold truncate">{activeCreator.displayName}</span>
                      <span className="text-[#E4FF1A]">1080p60</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] font-mono text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-bold">THE WANDER MEGA FEAST ARCADE</span>
                      </div>
                      <span className="text-[#E4FF1A] font-bold">GAMEPLAY ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FAST-MOVING TWITCH CHAT (ACTIVATES AT STEP 2 / 25s) */}
        {/* ============================================================ */}
        {showChat && (
          <RapidStreamChat
            currentViewerCount={currentViewerCount}
            simulationPlaying={simulationPlaying}
            simulationSecond={simulationSecond}
            simulationSpeed={simulationSpeed}
            activeCampaign={activeCampaign}
            activeProduct={activeProduct}
            activeSponsor={activeSponsor}
            activeCreator={activeCreator}
            chatMessages={chatMessages}
            sendChatMessage={sendChatMessage}
            triggerSimulatedScan={triggerSimulatedScan}
          />
        )}
      </div>
    </div>
  );
};
