import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  Smartphone,
  Zap,
  Flame,
  ArrowDown,
  Sparkles,
  Gauge,
  Sliders,
  Check,
} from 'lucide-react';
import { Campaign, CreatorAccount, FoodProduct, Sponsor, TwitchChatMessage } from '../types';

interface RapidStreamChatProps {
  currentViewerCount: number;
  simulationPlaying: boolean;
  simulationSecond: number;
  simulationSpeed: number;
  activeCampaign: Campaign;
  activeProduct: FoodProduct;
  activeSponsor: Sponsor;
  activeCreator: CreatorAccount;
  chatMessages: TwitchChatMessage[];
  sendChatMessage: (text: string) => void;
  triggerSimulatedScan: () => void;
}

interface RapidMessage {
  id: string;
  username: string;
  userColor: string;
  badge?: 'mod' | 'vip' | 'sub' | 'prime' | 'bot';
  text: string;
  emote?: string;
  timestamp: string;
  isBot?: boolean;
  actionCard?: any;
}

interface FloatingParticle {
  id: string;
  emoji: string;
  left: number;
  delay: number;
}

// Extensive contextual chat pools based on what is happening on stream
const CHAT_USERNAMES = [
  { u: 'PixelKing_99', c: '#E4FF1A' },
  { u: 'RetroGamer42', c: '#38BDF8' },
  { u: 'WonderFan_NYC', c: '#4ADE80' },
  { u: 'SlickRick_TV', c: '#F472B6' },
  { u: 'VoodooFriesLover', c: '#FBBF24' },
  { u: 'AustinBites', c: '#A78BFA' },
  { u: 'BrooklynDave', c: '#34D399' },
  { u: 'TwitchPrimeSub', c: '#60A5FA' },
  { u: 'HypeBeast90', c: '#FB7185' },
  { u: 'CajunSpice_21', c: '#FACC15' },
  { u: 'JerseyGamer', c: '#38BDF8' },
  { u: 'FoodieChad', c: '#FFFFFF' },
  { u: 'MunchieHunter', c: '#4ADE80' },
  { u: 'TurboLaser', c: '#FBBF24' },
  { u: 'BigBiteBros', c: '#E4FF1A' },
  { u: 'SnackQueen', c: '#34D399' },
  { u: 'SpeedyCourier', c: '#60A5FA' },
  { u: 'GothamEats', c: '#E879F9' },
  { u: 'NeonSniper', c: '#2DD4BF' },
  { u: 'CheesyCrust', c: '#FB923C' },
  { u: 'SauceBoss_NY', c: '#F87171' },
  { u: 'ValkyrieStan', c: '#C084FC' },
  { u: 'StreamLurker', c: '#94A3B8' },
  { u: 'ApexChampion', c: '#FDE047' },
  { u: 'CrunchMaster', c: '#4ADE80' },
];

const EMOTES = ['🔥', '🍕', '🍟', '🍔', '🍗', '⚡', '👑', '💯', '✨'];

export const RapidStreamChat: React.FC<RapidStreamChatProps> = ({
  currentViewerCount,
  simulationPlaying,
  simulationSecond,
  simulationSpeed,
  activeCampaign,
  activeProduct,
  activeSponsor,
  activeCreator,
  chatMessages,
  sendChatMessage,
  triggerSimulatedScan,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<RapidMessage[]>([]);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [velocityRate, setVelocityRate] = useState<'normal' | 'hyper' | 'ludicrous'>('hyper');
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [calculatedMsgsPerSec, setCalculatedMsgsPerSec] = useState(12);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const messageCounterRef = useRef(0);

  // Initialize with initial messages
  useEffect(() => {
    const initial: RapidMessage[] = [
      {
        id: 'init_1',
        username: 'Nightbot',
        userColor: '#E4FF1A',
        badge: 'bot',
        text: '🔥 WELCOME EVERYONE! Slow mode disabled for high-velocity chat.',
        timestamp: '00:00',
        isBot: true,
      },
      {
        id: 'init_2',
        username: 'TwitchMod_NYC',
        userColor: '#38BDF8',
        badge: 'mod',
        text: 'Kai Cenat live in the studio! Keep it hype in the chat.',
        timestamp: '00:01',
      },
    ];
    setMessages(initial);
  }, []);

  // Sync external chatMessages from AppContext
  useEffect(() => {
    if (chatMessages.length === 0) return;
    const latest = chatMessages[chatMessages.length - 1];
    setMessages((prev) => {
      // Avoid duplicate
      if (prev.some((m) => m.id === latest.id)) return prev;
      return [
        ...prev,
        {
          id: latest.id,
          username: latest.username,
          userColor: latest.userColor,
          badge: (latest.badges[0] as any) || 'sub',
          text: latest.text,
          timestamp: latest.timestamp,
          isBot: latest.isBot,
          actionCard: latest.actionCard,
        },
      ];
    });
  }, [chatMessages]);

  // Generate contextual high-velocity bot messages
  const generateContextualMessage = useCallback(() => {
    const user = CHAT_USERNAMES[Math.floor(Math.random() * CHAT_USERNAMES.length)];
    const sec = simulationSecond;
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    messageCounterRef.current++;

    let textPool: string[] = [];
    let badge: RapidMessage['badge'] = 'sub';
    const rand = Math.random();
    if (rand < 0.08) badge = 'mod';
    else if (rand < 0.22) badge = 'vip';
    else if (rand < 0.35) badge = 'prime';

    if (sec < 25) {
      // Stage 1: Solo Streamer Warmup
      textPool = [
        'W STREAM W KAI',
        'HE IS LIVE LETS GOOO',
        'first',
        'poggers in the chat',
        'W KAI CENAT',
        'audio sounds crisp today',
        'already 1.2M in the room?!',
        'notification squad where u at',
        'W streamer',
        'W warmup talk',
      ];
    } else if (sec < 50) {
      // Stage 2: Chat Activation & Hype
      textPool = [
        'chat is zooming fast lol',
        'W CHAT SPEED',
        'look at chat moving',
        'KEKW',
        'bro looking locked in',
        'are we playing ranked today?',
        'W chatters',
        'over 1.8M viewers now',
        'drop the game kai!',
        'pog pog pog',
        'LMAOOOO THAT COMMENT',
      ];
    } else if (sec < 80) {
      // Stage 3: Video Game Activation
      textPool = [
        'THE WANDER MEGA FEAST GAME IS CLEAN',
        'laser aim is actually cracked bro',
        'dodge that meteor!!',
        'bro collected the pizza slice lmaooo',
        'arcade graphics look so retro W',
        'that combo was crazy',
        'kai hungry af though look at him',
        'order food kai!!',
        'my stomach is growling watching this',
        'Wander arcade minigame is GOATed',
      ];
    } else if (sec < 115) {
      // Stage 4: Food Menu Revealed
      textPool = [
        `WAIT ${activeSponsor.businessName.toUpperCase()} MULTI-RESTAURANT DELIVERY??`,
        'Di Fara Pizza AND Wingstop Voodoo Fries in 1 bag?!',
        'bro is eating like royalty tonight',
        'that pepperoni looks so crispy omg',
        '!food',
        '!menu',
        'WHERE DO I ORDER THIS??',
        'Chelsea Hub delivering in 14 mins is fast',
        'voodoo loaded fries top 1 comfort food',
        `sponsored by ${activeSponsor.businessName} W`,
        'drop the promo code kai!!',
        'my mouth is watering chat',
      ];
    } else {
      // Stage 5: QR Code Overlay Active
      textPool = [
        'SCANNING THE QR CODE FROM MY PHONE RN',
        'just scanned it straight to Uber Eats!!',
        `used code ${activeCampaign.promoCode} and got discount!`,
        'food ordered arriving in 18 mins',
        'QR code opened DoorDash automatically wow',
        'W FOOD DROP W KAI',
        'di fara slice on the way to brooklyn',
        'this overlay format is genius',
        'bro $10 off is clutch thank u sponsor',
        'SCAN THE SCREEN CHAT',
        'ordered the exact same mega feast',
        'driver marco on his way lmao',
      ];
    }

    const text = textPool[Math.floor(Math.random() * textPool.length)];
    const emote = Math.random() < 0.4 ? EMOTES[Math.floor(Math.random() * EMOTES.length)] : undefined;

    return {
      id: `rapid_${Date.now()}_${messageCounterRef.current}`,
      username: user.u,
      userColor: user.c,
      badge,
      text: emote ? `${text} ${emote}` : text,
      timestamp: timeStr,
    };
  }, [simulationSecond, activeSponsor, activeCampaign]);

  // Initial burst when chat first kicks in at 25s
  const hasBurstedRef = useRef(false);
  useEffect(() => {
    if (simulationSecond < 25) {
      hasBurstedRef.current = false;
    } else if (simulationSecond >= 25 && !hasBurstedRef.current && simulationPlaying) {
      hasBurstedRef.current = true;
      const initialBurst = [
        generateContextualMessage(),
        generateContextualMessage(),
        generateContextualMessage(),
      ];
      setMessages((prev) => [...prev.slice(-90), ...initialBurst]);
    }
  }, [simulationSecond, simulationPlaying, generateContextualMessage]);

  // High-Velocity rapid-fire interval
  useEffect(() => {
    if (!simulationPlaying || simulationSecond < 25) return;

    // Calculate speed interval based on velocity setting & simulationSpeed
    const baseIntervalMs = velocityRate === 'ludicrous' ? 90 : velocityRate === 'hyper' ? 170 : 360;
    const actualInterval = Math.max(50, baseIntervalMs / simulationSpeed);

    // Compute display velocity
    setCalculatedMsgsPerSec(Math.round((1000 / actualInterval) * (1 + (simulationSecond > 115 ? 0.4 : 0))));

    const timer = setInterval(() => {
      const newMsg = generateContextualMessage();

      setMessages((prev) => {
        // Keep a rolling buffer of 90 messages for max performance and silky smoothness
        const updated = [...prev.slice(-90), newMsg];
        return updated;
      });

      // Spawn occasional floating reaction emote
      if (Math.random() < 0.25) {
        const newParticle: FloatingParticle = {
          id: 'p_' + Math.random(),
          emoji: EMOTES[Math.floor(Math.random() * EMOTES.length)],
          left: Math.random() * 80 + 10,
          delay: Math.random() * 0.2,
        };
        setFloatingParticles((prev) => [...prev.slice(-12), newParticle]);
      }

      if (isAutoScrollPaused) {
        setUnreadCount((c) => c + 1);
      }
    }, actualInterval);

    return () => clearInterval(timer);
  }, [simulationPlaying, simulationSecond, simulationSpeed, velocityRate, isAutoScrollPaused, generateContextualMessage]);

  // Smooth, high-performance auto-scrolling
  useEffect(() => {
    if (isAutoScrollPaused) return;

    const el = chatContainerRef.current;
    if (!el) return;

    // Smooth continuous glide to bottom
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isAutoScrollPaused]);

  // Handle user manual scroll interaction
  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;

    if (!isAtBottom && !isAutoScrollPaused) {
      setIsAutoScrollPaused(true);
    } else if (isAtBottom && isAutoScrollPaused) {
      setIsAutoScrollPaused(false);
      setUnreadCount(0);
    }
    lastScrollTopRef.current = scrollTop;
  };

  const resumeAutoScroll = () => {
    setIsAutoScrollPaused(false);
    setUnreadCount(0);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendChatMessage(inputMessage);
    setInputMessage('');
    resumeAutoScroll();
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 bg-[#0C2B23] border-t lg:border-t-0 lg:border-l border-white/15 flex flex-col shrink-0 animate-in slide-in-from-right duration-300 relative overflow-hidden select-none">
      {/* Liquid Glass Specular Top Highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Floating Reaction Micro-Emotes Animation Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatingParticles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-14 text-lg animate-float-fade"
            style={{
              left: `${p.left}%`,
              animationDuration: '2.4s',
              animationTimingFunction: 'ease-out',
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 1. CHAT HEADER WITH REAL-TIME VELOCITY METER (FIRST PRINCIPLES) */}
      {/* ============================================================ */}
      <div className="p-3 border-b border-white/10 bg-gradient-to-r from-[#0A261F] via-[#0D3228] to-[#0A261F] flex items-center justify-between shrink-0 shadow-sm relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-[#E4FF1A]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-display font-black uppercase tracking-wider text-white">
                Live Stream Chat
              </h3>
              <span className="text-[9px] bg-red-600/90 text-white font-mono px-1 rounded font-bold uppercase">
                Fast
              </span>
            </div>
            {/* Real-Time Velocity Speedometer */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#A3D2C4] font-mono">
              <Zap className="w-3 h-3 text-[#E4FF1A] animate-pulse" />
              <span className="text-white font-bold tabular-nums">
                ~{calculatedMsgsPerSec} msgs/sec
              </span>
              <span>·</span>
              <span className="text-[#C8E6DC] truncate">{currentViewerCount.toLocaleString()} chatting</span>
            </div>
          </div>
        </div>

        {/* Velocity Rate Selector Pills */}
        <div className="flex items-center gap-1 bg-[#14463A] p-0.5 rounded-lg border border-white/15 text-[10px] font-mono">
          <button
            onClick={() => setVelocityRate('normal')}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              velocityRate === 'normal' ? 'bg-white text-[#10382E] font-bold' : 'text-[#A3D2C4] hover:text-white'
            }`}
            title="Standard Flow"
          >
            1x
          </button>
          <button
            onClick={() => setVelocityRate('hyper')}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              velocityRate === 'hyper' ? 'bg-[#E4FF1A] text-black font-extrabold' : 'text-[#A3D2C4] hover:text-white'
            }`}
            title="High Velocity Flow"
          >
            Hyper
          </button>
          <button
            onClick={() => setVelocityRate('ludicrous')}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              velocityRate === 'ludicrous' ? 'bg-red-500 text-white font-black animate-pulse' : 'text-[#A3D2C4] hover:text-white'
            }`}
            title="Maximum Torrent Speed"
          >
            Turbo
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. QUICK CHAT PRESET PILLS / ACTION COMMANDS */}
      {/* ============================================================ */}
      <div className="px-3 py-1.5 bg-[#0E332A] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs font-mono shrink-0 scrollbar-none z-10">
        <span className="text-[10px] text-[#86BBAE] uppercase font-bold shrink-0">Hype:</span>
        <button
          onClick={() => sendChatMessage('!food')}
          className="px-2 py-0.5 rounded-lg bg-white text-[#10382E] font-display font-black hover:bg-[#E4FF1A] transition-colors shrink-0 text-[11px] shadow-sm active:scale-95 cursor-pointer"
        >
          !food
        </button>
        <button
          onClick={() => sendChatMessage('W STREAM')}
          className="px-2 py-0.5 rounded-lg bg-[#164D3F] text-white border border-white/15 hover:bg-[#1C614F] transition-colors shrink-0 text-[11px] font-bold active:scale-95 cursor-pointer"
        >
          W STREAM
        </button>
        <button
          onClick={() => sendChatMessage('🔥 THE WANDER FEAST IS CRACKED')}
          className="px-2 py-0.5 rounded-lg bg-[#164D3F] text-[#C8E6DC] border border-white/15 hover:bg-[#1C614F] transition-colors shrink-0 text-[11px] truncate max-w-[140px] active:scale-95 cursor-pointer"
        >
          🔥 Wonder Feast
        </button>
        <button
          onClick={() => sendChatMessage(`Scanned QR code and ordered on Uber Eats!!`)}
          className="px-2 py-0.5 rounded-lg bg-[#164D3F] text-[#E4FF1A] border border-white/15 hover:bg-[#1C614F] transition-colors shrink-0 text-[11px] font-bold active:scale-95 cursor-pointer truncate max-w-[120px]"
        >
          📱 Scanned Code
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. RAPID-FIRE AUTO-SCROLLING MESSAGE STREAM */}
      {/* ============================================================ */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-3 overflow-y-auto space-y-2 font-sans text-xs scroll-smooth relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`leading-snug transition-all duration-150 animate-in fade-in slide-in-from-bottom-1 ${
              msg.isBot
                ? 'bg-[#123E33] border border-white/15 p-2.5 rounded-2xl shadow-sm'
                : 'hover:bg-white/[0.03] p-0.5 rounded'
            }`}
          >
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#86BBAE] font-mono tabular-nums">{msg.timestamp}</span>

              {/* Twitch Badges */}
              {msg.badge === 'mod' && (
                <span className="bg-white text-[#10382E] text-[9px] font-mono font-black px-1 rounded shadow-xs">
                  MOD
                </span>
              )}
              {msg.badge === 'vip' && (
                <span className="bg-[#E4FF1A] text-black text-[9px] font-mono font-black px-1 rounded shadow-xs">
                  VIP
                </span>
              )}
              {msg.badge === 'sub' && (
                <span className="bg-[#1D5E4E] text-white text-[9px] font-mono font-bold px-1 rounded border border-white/10">
                  SUB
                </span>
              )}
              {msg.badge === 'prime' && (
                <span className="bg-[#60A5FA] text-black text-[9px] font-mono font-black px-1 rounded">
                  PRIME
                </span>
              )}
              {msg.badge === 'bot' && (
                <span className="bg-black text-[#E4FF1A] text-[9px] font-mono border border-[#E4FF1A]/40 px-1 rounded font-bold">
                  BOT
                </span>
              )}

              {/* Username */}
              <span className="font-extrabold text-white text-[11px]" style={{ color: msg.userColor }}>
                {msg.username}:
              </span>

              {/* Message text */}
              <span className="text-[#E6F4F0] font-sans break-words">{msg.text}</span>
            </div>

            {/* Interactive Bot Card for Sponsorship Drops */}
            {msg.actionCard && (
              <div className="mt-2 pt-2 border-t border-white/10 bg-[#09221C] p-2.5 rounded-xl border border-white/15 shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-display font-extrabold text-white truncate">
                    {msg.actionCard.title}
                  </span>
                  <span className="text-[10px] bg-white text-[#10382E] font-mono font-bold px-1.5 py-0.5 rounded">
                    {msg.actionCard.promoCode}
                  </span>
                </div>
                <p className="text-[11px] text-[#C8E6DC] mt-1 leading-snug">
                  {msg.actionCard.description}
                </p>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={triggerSimulatedScan}
                    className="flex-1 bg-white hover:bg-[#E4FF1A] text-[#10382E] font-display font-black text-xs py-1.5 px-3 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Launch Food App</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 4. AUTO-SCROLL PAUSED NOTIFICATION PILL */}
      {/* ============================================================ */}
      {isAutoScrollPaused && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            onClick={resumeAutoScroll}
            className="bg-[#14463A]/95 hover:bg-white text-white hover:text-[#10382E] backdrop-blur-md border border-white/25 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#E4FF1A]" />
            <span>
              {unreadCount > 0 ? `+${unreadCount} new messages · Resume auto-scroll` : 'Resume auto-scroll'}
            </span>
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. LIQUID GLASS CHAT INPUT BAR */}
      {/* ============================================================ */}
      <form onSubmit={handleSendMessage} className="p-2.5 border-t border-white/10 bg-[#0A261F] relative z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send a high-speed message or !food..."
            className="w-full bg-[#123E33] border border-white/15 text-white placeholder-[#86BBAE] text-xs rounded-xl pl-3 pr-9 py-2 focus:outline-none focus:border-white font-mono transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 text-white hover:text-[#E4FF1A] p-1 transition-colors cursor-pointer"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#86BBAE] mt-1 font-mono px-1">
          <span>Type <strong>!food</strong> for sponsorship drop</span>
          <span className="text-[#E4FF1A]">Emote mode: OFF</span>
        </div>
      </form>
    </div>
  );
};
