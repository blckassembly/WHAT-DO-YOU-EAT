import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Phone,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { NativeAppId, RestaurantLocation } from '../types';

export const LocationDiscoveryView: React.FC = () => {
  const {
    activeCampaign,
    activeProduct,
    activeSponsor,
    activeCreator,
    locations,
    setActiveView,
    logReferralEvent,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('New York');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isLocating, setIsLocating] = useState(false);
  const [handoffStore, setHandoffStore] = useState<{ store: RestaurantLocation; appName: string } | null>(null);

  const sponsorLocations = useMemo(() => {
    return locations.filter((loc) => loc.sponsorId === activeCampaign.sponsorId);
  }, [locations, activeCampaign.sponsorId]);

  const { matchedLocations, isOutsideFootprint, availabilityMessage } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (selectedCountry !== 'United States') {
      return {
        matchedLocations: [],
        isOutsideFootprint: true,
        availabilityMessage: `This ${activeSponsor.businessName} campaign is currently configured for the United States delivery network.`,
      };
    }

    const results = sponsorLocations.filter((loc) => {
      if (!query) return true;
      return (
        loc.city.toLowerCase().includes(query) ||
        loc.state.toLowerCase().includes(query) ||
        loc.postalCode.includes(query) ||
        loc.storeName.toLowerCase().includes(query)
      );
    });

    return {
      matchedLocations: results,
      isOutsideFootprint: results.length === 0 && query !== '',
      availabilityMessage:
        results.length === 0
          ? `We couldn't find a participating ${activeSponsor.businessName} location within range of "${searchQuery}".`
          : '',
    };
  }, [sponsorLocations, searchQuery, selectedCountry, activeSponsor.businessName]);

  const handleSimulateGeolocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setSearchQuery('New York');
      logReferralEvent({
        campaignId: activeCampaign.id,
        creatorId: activeCreator.id,
        platform: 'direct_link',
        targetApp: 'ubereats',
        targetAppName: 'Uber Eats',
        eventType: 'location_search',
        city: 'New York',
        country: 'United States',
      });
    }, 400);
  };

  const handleAppLaunch = (store: RestaurantLocation, appId: NativeAppId, appName: string) => {
    logReferralEvent({
      campaignId: activeCampaign.id,
      creatorId: activeCreator.id,
      platform: 'direct_link',
      targetApp: appId,
      targetAppName: appName,
      eventType: 'app_handoff',
      locationId: store.id,
      storeName: store.storeName,
      city: store.city,
      country: store.country,
    });

    setHandoffStore({ store, appName });
    setTimeout(() => {
      window.open(store.orderingUrl, '_blank');
      setHandoffStore(null);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#10382E] text-white flex flex-col font-sans">
      {/* Top Header */}
      <div className="bg-[#0C2B23] border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('food_landing')}
            className="p-2 rounded-xl bg-[#14463A] hover:bg-white hover:text-[#10382E] text-white transition-colors border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-display font-extrabold uppercase text-white tracking-tight flex items-center gap-2">
              <span>{activeSponsor.businessName} Store Network</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#10382E]">
                {activeCampaign.scope}
              </span>
            </h2>
            <p className="text-xs text-[#C8E6DC] font-mono mt-0.5">
              Promotion: {activeProduct.name} · Code: <strong className="text-white">{activeCampaign.promoCode}</strong>
            </p>
          </div>
        </div>

        {/* Quick Test Cities */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#86BBAE] font-mono hidden md:inline">Quick Test:</span>
          {['New York', 'Chicago', 'Austin', 'Dallas'].map((city) => (
            <button
              key={city}
              onClick={() => setSearchQuery(city)}
              className={`text-xs px-3 py-1 rounded-xl transition-colors font-mono font-bold ${
                searchQuery === city
                  ? 'bg-white text-[#10382E]'
                  : 'bg-[#14463A] text-[#C8E6DC] hover:text-white border border-white/15'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-[#0C2B23] border border-white/15 p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#86BBAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by City, ZIP code (10021, 10010, 78704)..."
              className="w-full bg-[#123E33] border border-white/15 text-white placeholder-[#86BBAE] text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white font-mono"
            />
          </div>

          <button
            onClick={handleSimulateGeolocation}
            disabled={isLocating}
            className="w-full md:w-auto px-5 py-2.5 bg-white hover:bg-[#E4FF1A] text-[#10382E] text-xs font-display font-extrabold uppercase rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : 'Use My GPS'}</span>
          </button>
        </div>

        {/* Outside Footprint Alert */}
        {isOutsideFootprint && (
          <div className="bg-[#0C2B23] border-2 border-amber-400/40 rounded-3xl p-6 flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-display font-black text-white uppercase">
                Location Outside Participating Service Radius
              </h3>
              <p className="text-xs text-[#C8E6DC] mt-1 leading-relaxed">
                {availabilityMessage}
              </p>
              <p className="text-[11px] text-[#86BBAE] font-mono mt-2">
                Under platform integrity rules, we do not divert viewers to unrelated restaurant competitors.
              </p>
            </div>
          </div>
        )}

        {/* Store Results */}
        {!isOutsideFootprint && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3D2C4]">
                {matchedLocations.length} Participating {activeSponsor.businessName} Location
                {matchedLocations.length === 1 ? '' : 's'}
              </span>
              <span className="text-xs font-mono text-[#E4FF1A]">Ready For Delivery & Pickup</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchedLocations.map((store) => (
                <div
                  key={store.id}
                  className="bg-[#0C2B23] border border-white/15 hover:border-white rounded-3xl p-6 flex flex-col justify-between transition-all shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-display font-black text-white leading-snug">
                        {store.storeName}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#10382E] font-extrabold uppercase shrink-0">
                        OPEN
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-[#C8E6DC]">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#86BBAE] shrink-0" />
                        <span>{store.address}, {store.city} {store.postalCode}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#E4FF1A] shrink-0" />
                        <span>~{store.deliveryMinutes} mins prep & courier</span>
                      </p>
                      <p className="flex items-center gap-2 font-mono text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-[#86BBAE] shrink-0" />
                        <span>{store.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Native App Fast Launchers */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-[#86BBAE] uppercase block font-semibold">
                      Launch In De Facto App:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAppLaunch(store, 'brand_native', activeSponsor.brandAppTitle)}
                        className="p-2 rounded-xl bg-[#14463A] hover:bg-white text-white hover:text-[#10382E] border border-white/15 text-xs font-mono font-bold transition-all text-center"
                      >
                        {activeSponsor.brandAppTitle}
                      </button>
                      <button
                        onClick={() => handleAppLaunch(store, 'ubereats', 'Uber Eats')}
                        className="p-2 rounded-xl bg-[#14463A] hover:bg-white text-white hover:text-[#10382E] border border-white/15 text-xs font-mono font-bold transition-all text-center"
                      >
                        Uber Eats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Handoff Toast */}
        {handoffStore && (
          <div className="p-4 bg-white text-[#10382E] rounded-2xl text-center font-display font-black text-sm uppercase">
            Launching {handoffStore.appName} for {handoffStore.store.storeName}...
          </div>
        )}
      </div>
    </div>
  );
};
