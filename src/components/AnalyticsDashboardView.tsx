import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Smartphone,
  Eye,
  DollarSign,
  ArrowUpRight,
  Tv,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const AnalyticsDashboardView: React.FC = () => {
  const { campaigns, activeCampaign, setActiveCampaignId, referrals, creators, activeCreator, activeSponsor } = useApp();

  const [dashboardRole, setDashboardRole] = useState<'streamer' | 'sponsor'>('streamer');

  const campaignReferrals = useMemo(() => {
    return referrals.filter((r) => r.campaignId === activeCampaign.id);
  }, [referrals, activeCampaign.id]);

  const funnel = useMemo(() => {
    const impressions = activeCampaign.impressionsCount;
    const qrScans = activeCampaign.qrScansCount + campaignReferrals.filter((r) => r.eventType === 'qr_scan').length;
    const appHandoffs = activeCampaign.appHandoffsCount + campaignReferrals.filter((r) => r.eventType === 'app_handoff').length;
    const scanRate = impressions > 0 ? ((qrScans / impressions) * 100).toFixed(1) : '0.0';
    const handoffRate = qrScans > 0 ? ((appHandoffs / qrScans) * 100).toFixed(1) : '0.0';
    const estimatedPayout = (appHandoffs * 2.5).toFixed(2);

    return {
      impressions,
      qrScans,
      appHandoffs,
      scanRate,
      handoffRate,
      estimatedPayout,
    };
  }, [activeCampaign, campaignReferrals]);

  const appBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      'Uber Eats': 6820,
      [activeSponsor.brandAppTitle]: 4920,
      'DoorDash': 2450,
      'Grubhub': 700,
    };

    campaignReferrals.forEach((r) => {
      if (r.targetAppName) {
        counts[r.targetAppName] = (counts[r.targetAppName] || 0) + 1;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [campaignReferrals, activeSponsor.brandAppTitle]);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#10382E] text-white p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 font-sans">
      {/* Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E4FF1A] uppercase font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>COMMERCE ATTRIBUTION INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">
            {dashboardRole === 'streamer' ? 'Streamer Performance Deck' : 'Sponsor Brand KPI Intelligence'}
          </h1>
          <p className="text-xs text-[#C8E6DC] font-mono mt-1">
            {dashboardRole === 'streamer'
              ? `Real-time QR scan conversions and payout attribution for @${activeCreator.twitchUsername}`
              : `Campaign performance, native app routing breakdown, and store-level attribution for ${activeSponsor.businessName}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual-Perspective Role Toggle */}
          <div className="bg-[#0C2B23] border border-white/15 p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setDashboardRole('streamer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-black uppercase transition-all flex items-center gap-1.5 ${
                dashboardRole === 'streamer'
                  ? 'bg-white text-[#10382E] shadow-sm'
                  : 'text-[#A3D2C4] hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Streamer View</span>
            </button>
            <button
              onClick={() => setDashboardRole('sponsor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-black uppercase transition-all flex items-center gap-1.5 ${
                dashboardRole === 'sponsor'
                  ? 'bg-white text-[#10382E] shadow-sm'
                  : 'text-[#A3D2C4] hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Sponsor Brand View</span>
            </button>
          </div>

          {/* Campaign Selector */}
          <select
            value={activeCampaign.id}
            onChange={(e) => setActiveCampaignId(e.target.value)}
            className="bg-[#0C2B23] border border-white/20 text-white text-xs rounded-xl px-3 py-2 font-display font-bold focus:outline-none focus:border-white"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.campaignName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#A3D2C4]">
            <span>Twitch Impressions</span>
            <Eye className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-display font-black text-white mt-3 tabular-nums">
            {funnel.impressions.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#86BBAE] font-mono mt-1">Live broadcast & chat drop</p>
        </div>

        <div className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#A3D2C4]">
            <span>Viewer QR Scans Caught</span>
            <Smartphone className="w-4 h-4 text-[#E4FF1A]" />
          </div>
          <p className="text-3xl font-display font-black text-[#E4FF1A] mt-3 tabular-nums">
            {funnel.qrScans.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#A3D2C4] font-mono mt-1">
            <span className="text-white font-bold">{funnel.scanRate}%</span>
            <span>viewer scan-through rate</span>
          </div>
        </div>

        <div className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#A3D2C4]">
            <span>De Facto App Handoffs</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-display font-black text-white mt-3 tabular-nums">
            {funnel.appHandoffs.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#A3D2C4] font-mono mt-1">
            <span className="text-white font-bold">{funnel.handoffRate}%</span>
            <span>scan-to-app conversion</span>
          </div>
        </div>

        <div className="bg-white text-[#10382E] rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[#10382E]/70">
            <span>{dashboardRole === 'streamer' ? 'Streamer Earnings Est.' : 'Campaign Attributed GMV'}</span>
            <DollarSign className="w-4 h-4 text-[#10382E]" />
          </div>
          <p className="text-3xl font-display font-black text-[#10382E] mt-3 tabular-nums">
            ${dashboardRole === 'streamer' ? funnel.estimatedPayout : (funnel.appHandoffs * 28.5).toLocaleString()}
          </p>
          <p className="text-[11px] font-mono text-[#10382E]/70 mt-1">
            {dashboardRole === 'streamer' ? '$2.50 commission per handoff' : 'Avg cart size $28.50'}
          </p>
        </div>
      </div>

      {/* Breakdown Section: App Routing Distribution & Live Stream Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: De Facto App Routing Breakdown */}
        <div className="lg:col-span-6 bg-[#0C2B23] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#E4FF1A] block mb-1">
              Distribution Engine
            </span>
            <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">
              Viewer De Facto App Preference
            </h3>
            <p className="text-xs text-[#C8E6DC] font-mono mt-1">
              Which native application viewers launched upon scanning the on-stream QR code:
            </p>
          </div>

          <div className="space-y-4">
            {appBreakdown.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="text-[#A3D2C4] tabular-nums">
                    {item.count.toLocaleString()} orders ({item.percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#09221C] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#14463A] border border-white/10 text-xs text-[#C8E6DC] font-mono leading-relaxed">
            <strong className="text-white">Core Insight: </strong>
            Rather than forcing viewers through web browser checkout, deep-linking into their pre-installed apps eliminates 80%+ of checkout drop-off.
          </div>
        </div>

        {/* Right: Live Scan Events */}
        <div className="lg:col-span-6 bg-[#0C2B23] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#E4FF1A] block mb-1">
              Real-Time Feed
            </span>
            <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">
              Verified Scan & Handoff Activity
            </h3>
            <p className="text-xs text-[#C8E6DC] font-mono mt-1">
              Live stream audience conversions recorded across mobile devices:
            </p>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {campaignReferrals.map((ref) => (
              <div
                key={ref.id}
                className="bg-[#14463A] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{ref.targetAppName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-[#10382E] font-extrabold uppercase">
                      {ref.eventType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A3D2C4]">
                    {ref.storeName || `${activeSponsor.businessName} Store Network`}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[#E4FF1A] font-bold">
                    {ref.city ? `${ref.city}, US` : 'United States'}
                  </span>
                  <p className="text-[10px] text-[#86BBAE] mt-0.5">
                    {new Date(ref.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
