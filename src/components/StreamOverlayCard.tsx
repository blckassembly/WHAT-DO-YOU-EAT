import React from 'react';
import { Smartphone, ArrowUpRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { QRCodeDisplay } from './QRCodeDisplay';

export const StreamOverlayCard: React.FC<{ previewMode?: boolean }> = ({ previewMode = false }) => {
  const { activeCampaign, activeProduct, activeSponsor, overlayVisible, triggerSimulatedScan } = useApp();

  if (!overlayVisible && !previewMode) {
    return null;
  }

  const landingUrl = `${window.location.origin}/food/${activeCampaign.slug}`;

  return (
    <div
      onClick={triggerSimulatedScan}
      className={`cursor-pointer group transition-all duration-300 ${
        overlayVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      title="Click to simulate catching this QR code on a mobile phone"
    >
      <div className="relative bg-[#0C2B23] border-2 border-white/20 hover:border-white text-white rounded-2xl p-4 shadow-2xl max-w-sm w-full overflow-hidden transition-all">
        {/* Top Kicker Row */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E4FF1A]" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-white">
              {activeSponsor.businessName}
            </span>
            <span className="text-[#86BBAE]">·</span>
            <span className="text-[10px] text-[#C8E6DC] font-mono">Stream Drop</span>
          </div>

          <span className="text-[10px] font-mono font-bold bg-white text-[#10382E] px-2 py-0.5 rounded">
            CODE: {activeCampaign.promoCode}
          </span>
        </div>

        {/* Content Body: Large QR + Food Info */}
        <div className="flex items-center gap-3.5">
          {/* High-Contrast Crisp QR */}
          <div className="shrink-0 bg-white p-1 rounded-xl shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
            <QRCodeDisplay url={landingUrl} size={78} showActions={false} />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-display font-extrabold text-white leading-tight truncate">
              {activeProduct.name}
            </h4>
            <p className="text-[11px] text-[#C8E6DC] mt-1 line-clamp-2 leading-relaxed">
              {activeProduct.headline}
            </p>

            <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#E4FF1A] font-bold flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                <span>Tap to Scan</span>
              </span>
              <span className="text-[#A3D2C4] group-hover:text-white flex items-center gap-0.5 transition-colors">
                <span>Direct App</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Legal Sponsorship Disclosure */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-[#86BBAE] font-mono">
          <span className="truncate max-w-[220px]">{activeCampaign.disclosureText}</span>
          <span className="shrink-0 text-[#C8E6DC]">WHAT DO YOU EAT?</span>
        </div>
      </div>
    </div>
  );
};
