import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { NativeAppOption } from '../types';

export const PhoneScanModal: React.FC = () => {
  const {
    activeCampaign,
    activeProduct,
    activeSponsor,
    activeCreator,
    simulatedPhoneScanOpen,
    setSimulatedPhoneScanOpen,
    logReferralEvent,
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [handoffSuccessApp, setHandoffSuccessApp] = useState<NativeAppOption | null>(null);

  if (!simulatedPhoneScanOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCampaign.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLaunchApp = (app: NativeAppOption) => {
    logReferralEvent({
      campaignId: activeCampaign.id,
      creatorId: activeCreator.id,
      platform: 'twitch_qr_scan',
      targetApp: app.id,
      targetAppName: app.name,
      eventType: 'app_handoff',
      country: 'United States',
    });

    setHandoffSuccessApp(app);

    setTimeout(() => {
      setHandoffSuccessApp(null);
      setSimulatedPhoneScanOpen(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[380px] bg-[#071E18] border-2 border-white/20 rounded-[42px] p-4 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Phone Dynamic Island / Speaker */}
        <div className="mx-auto w-24 h-4 bg-black rounded-full mb-3 shrink-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10382E] mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#10382E]" />
        </div>

        {/* Close Phone Simulation */}
        <button
          onClick={() => {
            setHandoffSuccessApp(null);
            setSimulatedPhoneScanOpen(false);
          }}
          className="absolute top-5 right-5 w-7 h-7 rounded-full bg-[#0D2E25] text-white hover:bg-white hover:text-[#10382E] flex items-center justify-center transition-colors z-20"
          title="Exit Phone Scan"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Simulated Camera Scan HUD Header */}
        <div className="bg-[#0D2E25] border border-white/10 rounded-2xl p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E4FF1A] animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#E4FF1A]">
              QR Scan Verified
            </span>
          </div>
          <span className="text-[10px] text-[#A3D2C4] font-mono">Streamer Cam Drop</span>
        </div>

        {/* Scrollable Phone Screen Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Streamer attribution kicker */}
          <div className="flex items-center gap-2 pb-1">
            <img
              src={activeCreator.avatarUrl}
              alt={activeCreator.displayName}
              className="w-6 h-6 rounded-full border border-white object-cover"
            />
            <p className="text-[11px] font-bold text-white">
              {activeCreator.displayName} <span className="text-[#A3D2C4] font-normal">is live on Twitch enjoying:</span>
            </p>
          </div>

          {/* Product Headline Card */}
          <div className="bg-[#0E362C] border border-white/15 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#A3D2C4] uppercase font-bold">
              {activeSponsor.businessName}
            </span>
            <h2 className="text-xl font-display font-extrabold text-white leading-tight">
              {activeProduct.name}
            </h2>
            <p className="text-xs text-[#C8E6DC] leading-relaxed">
              {activeProduct.headline}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-white/10">
              <span className="text-[#A3D2C4]">Menu Price:</span>
              <span className="text-[#E4FF1A] font-bold text-sm">
                ${activeProduct.basePrice.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Auto-Applied Promo Banner */}
          <div className="bg-[#14463A] border border-white/20 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#A3D2C4] block font-semibold">
                Auto-Applied Promo
              </span>
              <span className="text-xs font-extrabold text-white font-mono tracking-wider">
                {activeCampaign.promoCode}
              </span>
              <p className="text-[10px] text-[#E4FF1A] mt-0.5">{activeCampaign.promoDetails}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1.5 rounded-lg bg-[#071E18] hover:bg-white hover:text-[#10382E] text-xs font-mono font-bold text-white border border-white/20 flex items-center gap-1 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#E4FF1A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>

          {/* Deep Link Native App Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-display font-black uppercase tracking-wider text-white">
                Choose Your De Facto Food App
              </h3>
              <span className="text-[10px] font-mono text-[#A3D2C4]">Tap to Launch</span>
            </div>

            <div className="space-y-2.5">
              {activeCampaign.supportedApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleLaunchApp(app)}
                  className="w-full bg-[#0E362C] hover:bg-[#164D3F] border border-white/15 hover:border-white rounded-2xl p-3.5 text-left transition-all group flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-display font-extrabold text-white group-hover:text-[#E4FF1A] transition-colors">
                        {app.name}
                      </span>
                      {app.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white text-[#10382E] font-bold uppercase">
                          {app.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#C8E6DC] leading-snug">{app.tagline}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#86BBAE] pt-0.5">
                      <Clock className="w-3 h-3 text-[#E4FF1A]" />
                      <span>~{app.estimatedDeliveryMin} mins delivery</span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#071E18] group-hover:bg-white border border-white/15 flex items-center justify-center text-white group-hover:text-[#10382E] transition-colors shrink-0 ml-3">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Handoff Success Toast */}
          {handoffSuccessApp && (
            <div className="p-3 bg-white text-[#10382E] rounded-2xl text-center space-y-1 animate-in zoom-in-95">
              <p className="text-xs font-extrabold font-display">
                OPENING {handoffSuccessApp.name.toUpperCase()}...
              </p>
              <p className="text-[10px] text-zinc-700 font-mono">
                Code {activeCampaign.promoCode} applied · Creator attributed ✓
              </p>
            </div>
          )}

          {/* Legal Footprint Notice */}
          <div className="pt-2 text-[9px] text-[#86BBAE] leading-tight text-center">
            {activeCampaign.disclosureText}
          </div>
        </div>
      </div>
    </div>
  );
};
