import React, { useState } from 'react';
import {
  Hash,
  Volume2,
  Bell,
  Pin,
  Users,
  Search,
  Inbox,
  HelpCircle,
  PlusCircle,
  Gift,
  Smile,
  Send,
  Sparkles,
  DollarSign,
  Radio,
  Tv,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const DiscordStreamerView: React.FC = () => {
  const {
    activeCampaign,
    activeProduct,
    activeSponsor,
    activeCreator,
    currentViewerCount,
    simulationSecond,
    setActiveView,
    runSimulation,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [activeChannel, setActiveChannel] = useState<'sponsorship-bot' | 'real-time-kickbacks' | 'stream-crew'>('sponsorship-bot');

  const mins = Math.floor(simulationSecond / 60);
  const secs = simulationSecond % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="flex h-[calc(100vh-73px)] bg-[#313338] text-[#DBDEE1] font-sans overflow-hidden select-none">
      {/* 1. Leftmost Server Rail */}
      <div className="w-[72px] bg-[#1E1F22] py-3 flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveView('stream_demo')}
          className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#10382E] text-white flex items-center justify-center transition-all group relative"
          title="Return to Twitch Live Stream"
        >
          <Tv className="w-5 h-5 text-[#E4FF1A]" />
          <div className="absolute left-0 w-1 h-2 bg-white rounded-r group-hover:h-5 transition-all" />
        </button>

        <div className="w-8 h-[2px] bg-[#35363C] my-1" />

        {/* Kai Cenat Server */}
        <div className="w-12 h-12 rounded-[16px] bg-[#5865F2] text-white flex items-center justify-center font-bold text-base shadow-md relative">
          KC
          <div className="absolute left-0 w-1 h-10 bg-white rounded-r" />
        </div>

        {/* Brand Partner Server (Wonder / Ralph's / Wingstop) */}
        <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#10382E] text-white flex items-center justify-center font-bold text-xs transition-all">
          FOOD
        </div>
      </div>

      {/* 2. Channel Sidebar */}
      <div className="w-60 bg-[#2B2D31] flex flex-col shrink-0">
        {/* Server Header */}
        <div className="h-12 border-b border-[#1F2023] px-4 flex items-center justify-between font-bold text-white shadow-sm">
          <span className="truncate">Kai's Mafia Stream Deck</span>
          <span className="text-xs bg-[#5865F2] text-white px-1.5 py-0.5 rounded font-mono">PARTNER</span>
        </div>

        {/* Channel Categories */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs font-semibold">
          <div>
            <div className="text-[11px] text-[#949BA4] uppercase font-bold tracking-wider px-2 mb-1">
              Live Food Activations
            </div>
            <button
              onClick={() => setActiveChannel('sponsorship-bot')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                activeChannel === 'sponsorship-bot'
                  ? 'bg-[#404249] text-white font-bold'
                  : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
              }`}
            >
              <Hash className="w-4 h-4 text-[#949BA4]" />
              <span className="truncate">sponsorship-bot</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-[#E4FF1A]" />
            </button>

            <button
              onClick={() => setActiveChannel('real-time-kickbacks')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                activeChannel === 'real-time-kickbacks'
                  ? 'bg-[#404249] text-white font-bold'
                  : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
              }`}
            >
              <DollarSign className="w-4 h-4 text-[#23A55A]" />
              <span className="truncate">realtime-kickbacks</span>
            </button>
          </div>

          <div>
            <div className="text-[11px] text-[#949BA4] uppercase font-bold tracking-wider px-2 mb-1">
              Broadcast Team
            </div>
            <button
              onClick={() => setActiveChannel('stream-crew')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                activeChannel === 'stream-crew'
                  ? 'bg-[#404249] text-white font-bold'
                  : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
              }`}
            >
              <Hash className="w-4 h-4 text-[#949BA4]" />
              <span className="truncate">moderators-chat</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-1.5 text-[#949BA4]">
              <Volume2 className="w-4 h-4" />
              <span>Voice: Live Production</span>
            </div>
          </div>
        </div>

        {/* User Footer Panel */}
        <div className="h-14 bg-[#232428] px-2 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative">
              <img
                src={activeCreator.avatarUrl}
                alt={activeCreator.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#23A55A] rounded-full border-2 border-[#232428]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white leading-tight truncate">{activeCreator.displayName}</p>
              <p className="text-[10px] text-[#949BA4] font-mono leading-tight">#0001 · Streaming</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Discord Chat Feed */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
        {/* Channel Top Header */}
        <div className="h-12 border-b border-[#1F2023] px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#80848E]" />
            <span className="font-bold text-white text-sm">sponsorship-bot</span>
            <span className="text-xs text-[#949BA4] border-l border-[#4E5058] pl-3 ml-1 hidden sm:inline">
              Automated WHAT DO YOU EAT? webhook alerts, live conversion trackers & kickbacks
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#B5BAC1]">
            <button
              onClick={() => setActiveView('stream_demo')}
              className="text-xs font-bold text-[#23A55A] bg-[#23A55A]/10 border border-[#23A55A]/30 px-3 py-1 rounded hover:bg-[#23A55A]/20 transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>View Twitch Stream</span>
            </button>
            <Bell className="w-4 h-4 cursor-pointer hover:text-white" />
            <Pin className="w-4 h-4 cursor-pointer hover:text-white" />
            <Users className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
          {/* Welcome Announcement */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#10382E] border border-white/20 flex items-center justify-center text-[#E4FF1A] font-bold text-xs shrink-0">
              BOT
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">WhatDoYouEat_Bot</span>
                <span className="bg-[#5865F2] text-white text-[10px] font-bold px-1 rounded">APP</span>
                <span className="text-xs text-[#949BA4]">Today at {timeFormatted}</span>
              </div>
              <p className="text-[#DBDEE1]">
                🚀 Live Sponsorship Activation Initialized for <strong className="text-white">@{activeCreator.twitchUsername}</strong>
              </p>

              {/* Discord Rich Embed */}
              <div className="bg-[#2B2D31] border-l-4 border-[#23A55A] rounded-r p-4 max-w-xl space-y-3 mt-2 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#23A55A] uppercase tracking-wider">
                    {activeSponsor.businessName} Activation Active
                  </span>
                  <span className="text-xs text-[#949BA4] font-mono">Target: {currentViewerCount.toLocaleString()} Viewers</span>
                </div>

                <h4 className="text-base font-bold text-white">{activeProduct.name}</h4>
                <p className="text-xs text-[#B5BAC1] leading-relaxed">
                  {activeProduct.headline}. Viewers who scan the QR code or type <code className="bg-[#1E1F22] text-[#E4FF1A] px-1 py-0.5 rounded">!food</code> will deep-link directly into their de facto app with promo code <strong className="text-white font-mono">{activeCampaign.promoCode}</strong>.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#35373C] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#949BA4] block">COMMISSION</span>
                    <span className="text-white font-bold">$2.50 / order</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#949BA4] block">EST. CART</span>
                    <span className="text-white font-bold">$28.50 USD</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#949BA4] block">STATUS</span>
                    <span className="text-[#23A55A] font-bold">STREAM LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook conversion milestone */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#23A55A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              🔔
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Conversion-Webhook</span>
                <span className="bg-[#5865F2] text-white text-[10px] font-bold px-1 rounded">BOT</span>
                <span className="text-xs text-[#949BA4]">Today at {timeFormatted}</span>
              </div>
              <p className="text-[#DBDEE1]">
                🎉 <strong className="text-[#E4FF1A]">Milestone Alert:</strong> 18,450 viewers have caught the QR code from the stream!
              </p>
              <div className="bg-[#2B2D31] border-l-4 border-[#5865F2] rounded-r p-3.5 max-w-lg space-y-1 text-xs font-mono mt-1">
                <div className="flex justify-between">
                  <span className="text-[#949BA4]">De Facto Apps Picked:</span>
                  <span className="text-white">52% Wonder / 34% Uber Eats / 14% DoorDash</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#949BA4]">Total Streamer Kickback:</span>
                  <span className="text-[#23A55A] font-bold text-sm">$46,125.00 USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streamer chat message */}
          <div className="flex items-start gap-4">
            <img
              src={activeCreator.avatarUrl}
              alt={activeCreator.displayName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#E4FF1A]">{activeCreator.displayName}</span>
                <span className="bg-[#E4FF1A] text-black text-[9px] font-bold px-1 rounded font-mono">STREAMER</span>
                <span className="text-xs text-[#949BA4]">Today at {timeFormatted}</span>
              </div>
              <p className="text-white leading-relaxed">
                Yo the food literally just touched down at the door, the voodoo fries smell crazyyy!! Chat is going nuts over the promo code in the chat right now lmao
              </p>
            </div>
          </div>
        </div>

        {/* Discord Chat Input Box */}
        <div className="p-4 bg-[#313338]">
          <div className="bg-[#383A40] rounded-lg px-4 py-2.5 flex items-center gap-3">
            <PlusCircle className="w-5 h-5 text-[#B5BAC1] cursor-pointer hover:text-white" />
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Message #sponsorship-bot (try /food, /kickbacks)..."
              className="w-full bg-transparent text-white placeholder-[#80848E] text-xs focus:outline-none"
            />
            <Gift className="w-5 h-5 text-[#B5BAC1] cursor-pointer hover:text-white" />
            <Smile className="w-5 h-5 text-[#B5BAC1] cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
