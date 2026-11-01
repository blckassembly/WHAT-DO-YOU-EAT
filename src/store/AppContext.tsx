import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import {
  AppView,
  Campaign,
  CreatorAccount,
  FoodProduct,
  ReferralEvent,
  RestaurantLocation,
  SimulationPhase,
  Sponsor,
  TwitchChatMessage,
} from '../types';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_CREATORS,
  INITIAL_LOCATIONS,
  INITIAL_PRODUCTS,
  INITIAL_REFERRALS,
  INITIAL_SPONSORS,
  SIMULATION_PHASES,
} from '../data/mockData';

interface AppContextType {
  campaigns: Campaign[];
  products: FoodProduct[];
  sponsors: Sponsor[];
  creators: CreatorAccount[];
  locations: RestaurantLocation[];
  activeCampaignId: string;
  setActiveCampaignId: (id: string) => void;
  activeCampaign: Campaign;
  activeProduct: FoodProduct;
  activeSponsor: Sponsor;
  activeCreator: CreatorAccount;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  overlayVisible: boolean;
  setOverlayVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
  chatMessages: TwitchChatMessage[];
  sendChatMessage: (text: string, username?: string) => void;
  referrals: ReferralEvent[];
  logReferralEvent: (event: Omit<ReferralEvent, 'id' | 'timestamp'>) => void;
  selectedLocation: RestaurantLocation | null;
  setSelectedLocation: (loc: RestaurantLocation | null) => void;
  addCampaign: (campaign: Campaign, product: FoodProduct) => void;
  simulatedPhoneScanOpen: boolean;
  setSimulatedPhoneScanOpen: (open: boolean) => void;
  triggerSimulatedScan: () => void;

  // 3-Minute Autonomous Simulation Engine
  simulationActive: boolean;
  simulationPlaying: boolean;
  simulationSecond: number;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  currentPhase: SimulationPhase;
  currentViewerCount: number;
  runSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  seekSimulation: (second: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [products] = useState<FoodProduct[]>(INITIAL_PRODUCTS);
  const [sponsors] = useState<Sponsor[]>(INITIAL_SPONSORS);
  const [creators] = useState<CreatorAccount[]>(INITIAL_CREATORS);
  const [locations] = useState<RestaurantLocation[]>(INITIAL_LOCATIONS);
  
  // Default to Wonder multi-restaurant campaign or Wingstop Voodoo Fries
  const [activeCampaignId, setActiveCampaignId] = useState<string>('camp_wonder');
  const [activeView, setActiveView] = useState<AppView>('stream_demo');
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false); // Starts hidden until ramp
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(null);
  const [referrals, setReferrals] = useState<ReferralEvent[]>(INITIAL_REFERRALS);
  const [simulatedPhoneScanOpen, setSimulatedPhoneScanOpen] = useState<boolean>(false);

  // 3-Minute Simulation State (180 seconds total)
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [simulationPlaying, setSimulationPlaying] = useState<boolean>(false);
  const [simulationSecond, setSimulationSecond] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Active entities
  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];
  }, [campaigns, activeCampaignId]);

  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === activeCampaign.productId) || products[0];
  }, [products, activeCampaign]);

  const activeSponsor = useMemo(() => {
    return sponsors.find((s) => s.id === activeCampaign.sponsorId) || sponsors[0];
  }, [sponsors, activeCampaign]);

  const activeCreator = useMemo(() => {
    return creators.find((c) => c.id === activeCampaign.assignedCreatorId) || creators[0];
  }, [creators, activeCampaign]);

  // Current simulation phase calculation
  const currentPhase = useMemo(() => {
    const sec = simulationSecond;
    return (
      SIMULATION_PHASES.find((p) => sec >= p.startSec && sec < p.endSec) ||
      SIMULATION_PHASES[SIMULATION_PHASES.length - 1]
    );
  }, [simulationSecond]);

  // Dynamic viewer ramp during 3 minutes
  const currentViewerCount = useMemo(() => {
    if (!simulationActive && simulationSecond === 0) return 42850;
    const sec = Math.min(simulationSecond, 180);
    if (sec <= 25) {
      // 0 - 25s: Stream solo warmup (85,000 ramp to 1.2M)
      return Math.floor(85000 + (sec / 25) * (1200000 - 85000));
    } else if (sec <= 50) {
      // 25 - 50s: Chat influx (1.2M ramp to 1.85M)
      return Math.floor(1200000 + ((sec - 25) / 25) * (1850000 - 1200000));
    } else if (sec <= 80) {
      // 50 - 80s: Video game hype (1.85M ramp to 2.35M)
      return Math.floor(1850000 + ((sec - 50) / 30) * (2350000 - 1850000));
    } else if (sec <= 115) {
      // 80 - 115s: Food menu reveal (2.35M to 2.68M)
      return Math.floor(2350000 + ((sec - 80) / 35) * (2680000 - 2350000));
    } else {
      // 115 - 180s: QR code scan & conversions (2.68M to 2.98M)
      return Math.floor(2680000 + ((sec - 115) / 65) * (2980000 - 2680000));
    }
  }, [simulationActive, simulationSecond]);

  // Chat message engine
  const [chatMessages, setChatMessages] = useState<TwitchChatMessage[]>([
    {
      id: 'msg_0',
      username: 'TwitchMod_NYC',
      userColor: '#E4FF1A',
      badges: ['mod'],
      text: 'BROADCAST INITIALIZED: Kai Cenat live in the studio! Audio check 1-2.',
      timestamp: '00:00',
    },
  ]);

  const logReferralEvent = (event: Omit<ReferralEvent, 'id' | 'timestamp'>) => {
    const newRef: ReferralEvent = {
      ...event,
      id: 'ref_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    setReferrals((prev) => [newRef, ...prev]);

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== event.campaignId) return c;
        if (event.eventType === 'impression') return { ...c, impressionsCount: c.impressionsCount + 1 };
        if (event.eventType === 'qr_scan') return { ...c, qrScansCount: c.qrScansCount + 1 };
        if (event.eventType === 'app_handoff') return { ...c, appHandoffsCount: c.appHandoffsCount + 1 };
        return c;
      })
    );
  };

  const triggerSimulatedScan = () => {
    logReferralEvent({
      campaignId: activeCampaign.id,
      creatorId: activeCreator.id,
      platform: 'twitch_qr_scan',
      targetApp: 'ubereats',
      targetAppName: 'Uber Eats',
      eventType: 'qr_scan',
      country: 'United States',
    });
    setSimulatedPhoneScanOpen(true);
  };

  // 3-Minute Autonomous Loop
  useEffect(() => {
    if (!simulationPlaying) return;

    const interval = setInterval(() => {
      setSimulationSecond((prev) => {
        if (prev >= 180) {
          setSimulationPlaying(false);
          return 180;
        }
        return prev + 1;
      });
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [simulationPlaying, simulationSpeed]);

  // Orchestrate Events along the 180-second timeline (Stream -> Chat -> Video Game -> Food Menu -> QR Code)
  const lastSecondRef = useRef<number>(-1);
  useEffect(() => {
    if (!simulationActive) return;
    const sec = simulationSecond;
    if (sec === lastSecondRef.current) return;
    lastSecondRef.current = sec;

    // Helper to post chat
    const postChat = (username: string, text: string, badges: string[] = ['sub'], isBot = false, actionCard?: any) => {
      const mins = Math.floor(sec / 60);
      const remainingSecs = sec % 60;
      const timeStr = `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'auto_' + sec + '_' + Math.random(),
          username,
          userColor: isBot ? '#E4FF1A' : '#FFFFFF',
          badges,
          text,
          timestamp: timeStr,
          isBot,
          actionCard,
        },
      ]);
    };

    // Stage 1 (0 - 25s): Stream Online (webcam focus, mic warm up)
    if (sec === 2) postChat('KaiFan_99', 'HE IS LIVE LETS GOOOO', ['sub']);
    if (sec === 8) postChat('StreamWatcher', 'W STREAM W STREAM W KAI', ['vip']);
    if (sec === 15) postChat('RankedKing', 'BRO ALREADY 1.2 MILLION PEOPLE IN HERE??', ['sub', 'prime']);

    // Stage 2 (25 - 50s): Chat Activation & Fast bot inflow
    if (sec === 25) postChat('Nightbot', '⚡ TWITCH CHAT ACTIVATED: Fast mode enabled for 1.8M viewers!', ['mod', 'bot'], true);
    if (sec === 32) postChat('AustinGamer', 'YOOOO HE CLEAN ON THAT TALK', ['sub']);
    if (sec === 42) postChat('PixelBro', 'Kai looks hungry af right now lol', ['vip']);

    // Stage 3 (50 - 80s): Video Game Activation (The Wander Mega Feast retro arcade boots up)
    if (sec === 50) postChat('Nightbot', '🕹️ VIDEO GAME LAUNCHED: THE WANDER MEGA FEAST ARCADE!', ['mod', 'bot'], true);
    if (sec === 58) postChat('LaserAce', 'BRO THAT SHIP DODGE WAS NASTY', ['sub']);
    if (sec === 68) postChat('ChatLeader', 'HE IS STARVING LMAOO ORDER SOMETHING KAI', ['sub']);

    // Stage 4 (80 - 115s): Food Menu & Dispatch Split
    if (sec === 80) {
      postChat('WhatDoYouEat_Bot', `🍔 FOOD MENU ACTIVATED: Kai is ordering live from ${activeSponsor.businessName}!`, ['mod', 'bot'], true);
    }
    if (sec === 92) {
      postChat(
        'WhatDoYouEat_Bot',
        `🍕 What Kai Is Eating: ${activeProduct.name} · Code ${activeCampaign.promoCode} incoming on screen!`,
        ['mod', 'bot'],
        true,
        {
          title: activeProduct.name,
          description: `Auto-routes into your de facto app with code ${activeCampaign.promoCode}.`,
          promoCode: activeCampaign.promoCode,
          supportedApps: activeCampaign.supportedApps.map((a) => a.name),
        }
      );
      logReferralEvent({
        campaignId: activeCampaign.id,
        creatorId: activeCreator.id,
        platform: 'twitch_chat',
        targetApp: 'ubereats',
        targetAppName: 'Uber Eats',
        eventType: 'impression',
        country: 'United States',
      });
    }
    if (sec === 105) postChat('SarahGaming', '!food', ['sub']);

    // Stage 5 (115 - 180s): QR Code Overlay & Native App Handoff
    if (sec === 115) {
      setOverlayVisible(true);
      postChat('Nightbot', `📱 QR CODE OVERLAY ACTIVE: Scan the on-screen code with your camera!`, ['mod', 'bot'], true);
    }
    if (sec === 124) {
      // Autonomous phone camera scan demonstration
      setSimulatedPhoneScanOpen(true);
      logReferralEvent({
        campaignId: activeCampaign.id,
        creatorId: activeCreator.id,
        platform: 'twitch_qr_scan',
        targetApp: 'ubereats',
        targetAppName: 'Uber Eats',
        eventType: 'qr_scan',
        country: 'United States',
      });
    }
    if (sec === 138) {
      // Simulate automatic app handoff
      logReferralEvent({
        campaignId: activeCampaign.id,
        creatorId: activeCreator.id,
        platform: 'twitch_qr_scan',
        targetApp: 'brand_native',
        targetAppName: activeSponsor.brandAppTitle,
        eventType: 'app_handoff',
        storeName: `${activeSponsor.businessName} Flagship Network`,
        city: 'New York',
        country: 'United States',
      });
    }
    if (sec === 148) {
      setSimulatedPhoneScanOpen(false);
    }
    if (sec === 155) {
      postChat('TexasRanch', 'JUST SCANNED THE QR CODE AND ORDERED VOODOO FRIES ON UBER EATS!!', ['vip']);
      postChat('Nightbot', '🚨 OVER 18,000 VIEWERS HAVE ORDERED THIS MEAL LIVE ON STREAM!', ['mod', 'bot'], true);
    }
    if (sec === 168) {
      postChat('BrooklynBites', 'Bro eating Di Fara pizza and Voodoo loaded fries together is insane W', ['sub']);
    }
  }, [simulationSecond, simulationActive, activeCampaign, activeProduct, activeSponsor, activeCreator]);

  const runSimulation = () => {
    setSimulationActive(true);
    setSimulationPlaying(true);
    setSimulationSecond(0);
    setOverlayVisible(false); // Starts hidden per prompt
    setSimulatedPhoneScanOpen(false);
    setActiveView('stream_demo');
  };

  const pauseSimulation = () => {
    setSimulationPlaying(false);
  };

  const resumeSimulation = () => {
    setSimulationPlaying(true);
  };

  const resetSimulation = () => {
    setSimulationPlaying(false);
    setSimulationActive(false);
    setSimulationSecond(0);
    setOverlayVisible(false);
    setSimulatedPhoneScanOpen(false);
  };

  const seekSimulation = (sec: number) => {
    setSimulationSecond(sec);
    if (sec < 115) {
      setOverlayVisible(false);
      setSimulatedPhoneScanOpen(false);
    } else if (sec >= 115 && sec < 148) {
      setOverlayVisible(true);
      setSimulatedPhoneScanOpen(sec >= 124);
    } else {
      setOverlayVisible(true);
      setSimulatedPhoneScanOpen(false);
    }
  };

  const sendChatMessage = (text: string, username = 'TwitchViewer') => {
    if (!text.trim()) return;

    const userMessage: TwitchChatMessage = {
      id: 'msg_' + Date.now(),
      username,
      userColor: '#E4FF1A',
      badges: ['sub'],
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const cleanLower = text.trim().toLowerCase();
    if (cleanLower === '!food' || cleanLower === '!wonder' || cleanLower === '!wings' || cleanLower === '!meal') {
      setTimeout(() => {
        const botReply: TwitchChatMessage = {
          id: 'bot_' + Date.now(),
          username: 'WhatDoYouEat_Bot',
          userColor: '#E4FF1A',
          badges: ['mod', 'bot'],
          text: `🍔 ${activeCreator.displayName} is partnering with ${activeSponsor.businessName}! Scan the QR on stream or tap below to launch directly in your phone's native food app:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
          actionCard: {
            title: activeProduct.name,
            description: `${activeCampaign.promoDetails}. Auto-routes to your preferred food app with code ${activeCampaign.promoCode}.`,
            promoCode: activeCampaign.promoCode,
            supportedApps: activeCampaign.supportedApps.map((a) => a.name),
          },
        };
        setChatMessages((prev) => [...prev, botReply]);
        logReferralEvent({
          campaignId: activeCampaign.id,
          creatorId: activeCreator.id,
          platform: 'twitch_chat',
          targetApp: 'ubereats',
          targetAppName: 'Uber Eats',
          eventType: 'impression',
          country: 'United States',
        });
      }, 350);
    }
  };

  const addCampaign = (campaign: Campaign, product: FoodProduct) => {
    setCampaigns((prev) => [campaign, ...prev]);
    setActiveCampaignId(campaign.id);
  };

  return (
    <AppContext.Provider
      value={{
        campaigns,
        products,
        sponsors,
        creators,
        locations,
        activeCampaignId,
        setActiveCampaignId,
        activeCampaign,
        activeProduct,
        activeSponsor,
        activeCreator,
        activeView,
        setActiveView,
        overlayVisible,
        setOverlayVisible,
        chatMessages,
        sendChatMessage,
        referrals,
        logReferralEvent,
        selectedLocation,
        setSelectedLocation,
        addCampaign,
        simulatedPhoneScanOpen,
        setSimulatedPhoneScanOpen,
        triggerSimulatedScan,

        // 3-Minute Simulation
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
