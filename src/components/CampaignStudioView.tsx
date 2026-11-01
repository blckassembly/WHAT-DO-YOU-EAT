import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Sparkles,
  Tv,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Campaign, CampaignScope, FoodProduct } from '../types';

export const CampaignStudioView: React.FC = () => {
  const { campaigns, sponsors, creators, products, addCampaign, setActiveCampaignId, setActiveView } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [selectedSponsorId, setSelectedSponsorId] = useState(sponsors[0]?.id || '');
  const [productName, setProductName] = useState('');
  const [productHeadline, setProductHeadline] = useState('');
  const [basePrice, setBasePrice] = useState('14.99');
  const [scope, setScope] = useState<CampaignScope>('NATIONAL');
  const [selectedCreatorId, setSelectedCreatorId] = useState(creators[0]?.id || '');
  const [promoCode, setPromoCode] = useState('STREAMDROP');
  const [promoDetails, setPromoDetails] = useState('$5 OFF + Free Delivery');
  const [disclosureText, setDisclosureText] = useState(
    'Sponsored food promotion. Offer automatically routes directly into your chosen mobile delivery app.'
  );

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || !productName.trim()) return;

    const sponsor = sponsors.find((s) => s.id === selectedSponsorId) || sponsors[0];

    const newProductId = 'prod_' + Date.now();
    const newProduct: FoodProduct = {
      id: newProductId,
      sponsorId: selectedSponsorId,
      name: productName,
      headline: productHeadline || 'Exclusive creator menu drop',
      description: `${productName} crafted exclusively for the ${campaignName} sponsorship drop with ${sponsor.businessName}.`,
      basePrice: parseFloat(basePrice) || 14.0,
      currency: 'USD',
      calories: 720,
      tags: ['Creator Drop', scope],
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    };

    const newCampaignId = 'camp_' + Date.now();
    const newCampaign: Campaign = {
      id: newCampaignId,
      slug: campaignName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sponsorId: selectedSponsorId,
      campaignName,
      scope,
      productId: newProductId,
      assignedCreatorId: selectedCreatorId,
      eligibleCountries: ['United States'],
      eligibleCities: ['New York', 'Los Angeles', 'Chicago', 'Austin'],
      disclosureText,
      promoCode,
      promoDetails,
      status: 'ACTIVE',
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      supportedApps: [
        {
          id: 'brand_native',
          name: sponsor.brandAppTitle,
          tagline: 'Direct Rewards + 0% markup',
          badge: 'Lowest Price',
          schemeUrl: `${sponsor.businessName.toLowerCase().replace(/\s+/g, '')}://order?promo=${promoCode}`,
          webUrl: sponsor.website,
          estimatedDeliveryMin: 20,
        },
        {
          id: 'ubereats',
          name: 'Uber Eats',
          tagline: 'Fastest doorstep delivery + Uber One perks',
          badge: 'Most Popular',
          schemeUrl: `ubereats://store/${sponsor.businessName.toLowerCase().replace(/\s+/g, '-')}?promo=${promoCode}`,
          webUrl: 'https://www.ubereats.com',
          estimatedDeliveryMin: 18,
        },
        {
          id: 'doordash',
          name: 'DoorDash',
          tagline: 'DashPass eligible + real-time courier tracking',
          schemeUrl: `doordash://store/${sponsor.businessName.toLowerCase().replace(/\s+/g, '-')}?promo=${promoCode}`,
          webUrl: 'https://www.doordash.com',
          estimatedDeliveryMin: 22,
        },
      ],
      impressionsCount: 0,
      qrScansCount: 0,
      appHandoffsCount: 0,
    };

    addCampaign(newCampaign, newProduct);
    setIsCreating(false);
    setActiveCampaignId(newCampaignId);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#10382E] text-white p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#E4FF1A] font-mono mb-1 uppercase font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAMPAIGN ARCHITECTURE STUDIO</span>
          </div>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">
            Sponsorship & App Routing Config
          </h1>
          <p className="text-xs text-[#C8E6DC] font-mono mt-1">
            Configure restaurant promotions, assign creators, and connect de facto mobile app deep links.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#E4FF1A] text-[#10382E] font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'Create New Campaign'}</span>
        </button>
      </div>

      {/* Creation Wizard */}
      {isCreating && (
        <form
          onSubmit={handleCreateCampaign}
          className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-display font-extrabold text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E4FF1A]" />
              <span>Configure Creator Drop</span>
            </h3>
            <span className="text-xs text-[#86BBAE] font-mono">Service 01: Campaign Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div>
              <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Campaign Name</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Ralph's Coffee: Morning Routine Stream"
                className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Restaurant Sponsor</label>
              <select
                value={selectedSponsorId}
                onChange={(e) => setSelectedSponsorId(e.target.value)}
                className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-display font-bold"
              >
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.businessName} ({s.brandAppTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Featured Product</label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Ralph's Espresso & Valrhona Brownie"
                className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Headline</label>
                <input
                  type="text"
                  value={productHeadline}
                  onChange={(e) => setProductHeadline(e.target.value)}
                  placeholder="e.g. Organic dark roast with fresh bakery brownie"
                  className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Assigned Streamer</label>
              <select
                value={selectedCreatorId}
                onChange={(e) => setSelectedCreatorId(e.target.value)}
                className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
              >
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName} (@{c.twitchUsername})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-[#E4FF1A] font-bold focus:outline-none focus:border-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#C8E6DC] mb-1.5 uppercase font-bold">Promo Details</label>
              <input
                type="text"
                value={promoDetails}
                onChange={(e) => setPromoDetails(e.target.value)}
                placeholder="e.g. Free Valrhona Brownie with any large espresso"
                className="w-full bg-[#123E33] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-mono font-bold bg-[#14463A] hover:bg-[#1A5B4C] text-[#C8E6DC] rounded-xl transition-colors border border-white/15"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-display font-black bg-white hover:bg-[#E4FF1A] text-[#10382E] rounded-xl uppercase transition-colors"
            >
              Publish Campaign
            </button>
          </div>
        </form>
      )}

      {/* Campaigns List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3D2C4]">
          Active Brand Sponsorships ({campaigns.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const sponsor = sponsors.find((s) => s.id === camp.sponsorId);
            const creator = creators.find((c) => c.id === camp.assignedCreatorId);
            const product = products.find((p) => p.id === camp.productId);

            return (
              <div
                key={camp.id}
                className="bg-[#0C2B23] border border-white/15 rounded-3xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#10382E] font-extrabold uppercase">
                      {camp.scope}
                    </span>
                    <span className="text-xs text-white font-mono font-bold">
                      CODE: {camp.promoCode}
                    </span>
                  </div>

                  <h4 className="text-xl font-display font-black text-white leading-tight uppercase">
                    {camp.campaignName}
                  </h4>

                  <p className="text-xs text-[#C8E6DC] font-mono">
                    {sponsor?.businessName} · {product?.name}
                  </p>

                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#86BBAE]">
                      <span>Streamer:</span>
                      <span className="text-white font-bold">{creator?.displayName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#86BBAE]">
                      <span>Native App:</span>
                      <span className="text-[#E4FF1A]">{sponsor?.brandAppTitle}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#86BBAE]">
                      <span>Delivery Partners:</span>
                      <span className="text-white">Uber Eats, DoorDash</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveCampaignId(camp.id);
                      setActiveView('stream_demo');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#E4FF1A] text-[#10382E] text-xs font-display font-black uppercase flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Launch on Stream</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
