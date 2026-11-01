export type CampaignScope = 'NATIONAL' | 'GLOBAL' | 'REGIONAL' | 'LOCAL';

export type AppView = 
  | 'stream_demo' 
  | 'discord_deck'
  | 'food_landing' 
  | 'locations' 
  | 'studio' 
  | 'analytics';

export type NativeAppId = 
  | 'brand_native'
  | 'ubereats'
  | 'doordash'
  | 'grubhub';

export interface NativeAppOption {
  id: NativeAppId;
  name: string;
  tagline: string;
  badge?: string;
  schemeUrl: string;
  webUrl: string;
  estimatedDeliveryMin: number;
}

export interface Sponsor {
  id: string;
  businessName: string;
  brandTagline: string;
  logoText: string;
  description: string;
  brandAppTitle: string;
  website: string;
}

export interface FoodProduct {
  id: string;
  sponsorId: string;
  name: string;
  headline: string;
  description: string;
  basePrice: number;
  currency: string;
  calories: number;
  tags: string[];
  imageUrl?: string;
}

export interface RestaurantLocation {
  id: string;
  sponsorId: string;
  storeName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
  phone: string;
  orderingUrl: string;
  status: 'ACTIVE' | 'CLOSED';
  deliveryMinutes: number;
  supportedApps: NativeAppId[];
}

export interface CreatorAccount {
  id: string;
  displayName: string;
  twitchUsername: string;
  avatarUrl: string;
  attributionCode: string;
  followerCount: string;
  category: string;
  verified: boolean;
}

export interface Campaign {
  id: string;
  slug: string;
  sponsorId: string;
  campaignName: string;
  scope: CampaignScope;
  productId: string;
  assignedCreatorId: string;
  eligibleCountries: string[];
  eligiblePostalPrefixes?: string[];
  eligibleCities?: string[];
  disclosureText: string;
  promoCode: string;
  promoDetails: string;
  commissionRate?: number;
  status: 'ACTIVE' | 'PAUSED' | 'SCHEDULED';
  startsAt: string;
  endsAt: string;
  supportedApps: NativeAppOption[];
  impressionsCount: number;
  qrScansCount: number;
  appHandoffsCount: number;
}

export interface ReferralEvent {
  id: string;
  campaignId: string;
  creatorId: string;
  platform: 'twitch_chat' | 'twitch_qr_scan' | 'direct_link';
  targetApp: NativeAppId;
  targetAppName: string;
  eventType: 'impression' | 'qr_scan' | 'app_handoff' | 'location_search';
  locationId?: string;
  storeName?: string;
  city?: string;
  postalCode?: string;
  country: string;
  timestamp: string;
}

export interface TwitchChatMessage {
  id: string;
  username: string;
  userColor: string;
  badges: string[]; // 'sub', 'vip', 'mod', 'prime', 'bot'
  text: string;
  timestamp: string;
  isBot?: boolean;
  actionCard?: {
    title: string;
    description: string;
    promoCode: string;
    supportedApps: string[];
  };
}

export interface SimulationPhase {
  id: number;
  title: string;
  startSec: number;
  endSec: number;
  viewerCount: number;
  description: string;
}
