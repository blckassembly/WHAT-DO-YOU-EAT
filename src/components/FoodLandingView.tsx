import React, { useState } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  QrCode,
  Clock,
  ArrowRight,
  ShieldCheck,
  Store,
  Tag,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { NativeAppOption } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

export const FoodLandingView: React.FC = () => {
  const {
    activeCampaign,
    activeProduct,
    activeSponsor,
    activeCreator,
    setActiveView,
    logReferralEvent,
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [handoffApp, setHandoffApp] = useState<NativeAppOption | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCampaign.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLaunchNativeApp = (app: NativeAppOption) => {
    logReferralEvent({
      campaignId: activeCampaign.id,
      creatorId: activeCreator.id,
      platform: 'direct_link',
      targetApp: app.id,
      targetAppName: app.name,
      eventType: 'app_handoff',
      country: 'United States',
    });

    setHandoffApp(app);
    setTimeout(() => {
      window.open(app.webUrl, '_blank');
      setHandoffApp(null);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#10382E] text-white flex flex-col font-sans">
      {/* Top Breadcrumb & Attribution Strip */}
      <div className="bg-[#0C2B23] border-b border-white/10 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={activeCreator.avatarUrl}
            alt={activeCreator.displayName}
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-display font-extrabold uppercase tracking-wider text-white">
                {activeCreator.displayName}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-[#E4FF1A] font-mono font-bold">Twitch Creator Drop</span>
            </div>
            <div className="text-[11px] text-[#A3D2C4] font-mono mt-0.5">
              Partnering with <strong className="text-white">{activeSponsor.businessName}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#14463A] border border-white/20 px-3 py-1 rounded-xl text-xs font-mono">
            <Tag className="w-3.5 h-3.5 text-[#E4FF1A]" />
            <span>CODE: <strong className="text-white">{activeCampaign.promoCode}</strong></span>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-[#14463A] hover:bg-[#1A5B4C] text-white rounded-xl border border-white/20 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Show QR Code</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Food / Beverage Presentation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white text-[#10382E] uppercase">
                {activeSponsor.businessName}
              </span>
              <span className="text-xs font-mono text-[#E4FF1A] font-bold">
                {activeCampaign.scope} ACTIVATION
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase leading-none">
              {activeProduct.name}
            </h1>

            <p className="text-base text-[#C8E6DC] leading-relaxed font-sans">
              {activeProduct.description}
            </p>

            {/* Product Image Asset (including user's Ralph's Coffee image when active) */}
            {activeProduct.imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 my-4 bg-[#09221C] flex items-center justify-center p-4">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
            )}

            {/* Nutritional & Price Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#14463A] border border-white/15 p-3.5 rounded-2xl">
                <span className="text-[10px] text-[#A3D2C4] uppercase font-mono block">Energy</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {activeProduct.calories} kcal
                </span>
              </div>
              <div className="bg-[#14463A] border border-white/15 p-3.5 rounded-2xl">
                <span className="text-[10px] text-[#A3D2C4] uppercase font-mono block">Base Price</span>
                <span className="text-lg font-mono font-bold text-[#E4FF1A] tabular-nums">
                  ${activeProduct.basePrice.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="bg-white text-[#10382E] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-[#10382E]/70 block">
                  Exclusive Streamer Offer
                </span>
                <span className="text-xl font-display font-black tracking-tight">
                  {activeCampaign.promoCode}
                </span>
                <p className="text-xs text-[#10382E]/80 font-medium mt-0.5">{activeCampaign.promoDetails}</p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-xl bg-[#10382E] hover:bg-[#185545] text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#E4FF1A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'COPIED' : 'COPY CODE'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: De Facto Native App Handoff Router */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-[#E4FF1A] block mb-1">
                Zero Friction Handoff
              </span>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                Open In Your De Facto Food App
              </h2>
              <p className="text-xs text-[#C8E6DC] mt-1 leading-relaxed">
                Choose the app already installed on your device. Promo code{' '}
                <strong className="text-white font-mono">{activeCampaign.promoCode}</strong> and local store delivery will auto-populate:
              </p>
            </div>

            {/* List of Supported De Facto Apps */}
            <div className="space-y-3">
              {activeCampaign.supportedApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleLaunchNativeApp(app)}
                  className="w-full bg-[#14463A] hover:bg-[#1A5B4C] border-2 border-white/15 hover:border-white rounded-2xl p-4 text-left transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-display font-black text-white group-hover:text-[#E4FF1A] transition-colors">
                        {app.name}
                      </span>
                      {app.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#10382E] font-extrabold uppercase">
                          {app.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#C8E6DC] leading-snug">{app.tagline}</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#86BBAE] pt-1">
                      <Clock className="w-3 h-3 text-[#E4FF1A]" />
                      <span>Est. Delivery ~{app.estimatedDeliveryMin} mins</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#0E362C] border border-white/15 group-hover:bg-white flex items-center justify-center text-white group-hover:text-[#10382E] transition-colors shrink-0 ml-4">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback / Notification */}
            {handoffApp && (
              <div className="p-3 bg-[#E4FF1A] text-black rounded-2xl text-center font-display font-black text-xs uppercase animate-pulse">
                Routing directly to {handoffApp.name}... Code applied!
              </div>
            )}

            {/* Secondary Option: Store Directory */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#C8E6DC] font-mono">Prefer to pick up in person?</span>
              <button
                onClick={() => setActiveView('locations')}
                className="text-xs font-mono font-bold text-white hover:text-[#E4FF1A] flex items-center gap-1 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Browse Store Footprint</span>
              </button>
            </div>
          </div>

          {/* Legal Footprint Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#0C2B23] border border-white/10 text-[11px] text-[#86BBAE] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#A3D2C4] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">Creator Sponsorship Disclosure: </strong>
              {activeCampaign.disclosureText}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Desktop Viewers wanting to scan with Phone */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0C2B23] border-2 border-white rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <h3 className="text-lg font-display font-extrabold text-white uppercase">
              Scan With Phone Camera
            </h3>
            <p className="text-xs text-[#C8E6DC] mt-1 mb-4 font-mono">
              Points directly to your preferred food app (Uber Eats, DoorDash, {activeSponsor.brandAppTitle})
            </p>
            <QRCodeDisplay
              url={window.location.href}
              size={180}
              label={activeProduct.name}
              sublabel={`Code: ${activeCampaign.promoCode}`}
            />
            <button
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full py-2.5 text-xs font-mono font-bold bg-[#14463A] hover:bg-white hover:text-[#10382E] text-white rounded-xl transition-colors border border-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
