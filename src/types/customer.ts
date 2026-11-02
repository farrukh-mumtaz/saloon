export type VIPTier = 'Silver' | 'Gold' | 'Diamond VIP';

export type CustomerJourneyStage =
  | 'lead'         // Signed up, no completed visit yet
  | 'first-visit'   // 1 visit completed
  | 'returning'     // 2-4 visits
  | 'vip'           // 5+ visits or $500+ spend
  | 'at-risk';      // Inactive > 60 days

export interface CustomerPreferences {
  refreshment?: string;      // e.g., 'Sparkling Water & Espresso', 'Champagne', 'Matcha'
  acousticPrivacy?: 'absolute' | 'ambient' | 'silent';
  allergyNotes?: string;
  lightingPreference?: 'dim' | 'natural' | 'soft-candlelight';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatar?: string;
  memberSince: string;       // ISO date or YYYY-MM-DD
  lastVisitDate?: string;
  vipTier: VIPTier;
  loyaltyPoints: number;     // 10 pts per $1 spent
  totalVisits: number;
  totalSpentUSD: number;     // Normalized in USD for multi-currency conversion
  journeyStage: CustomerJourneyStage;
  preferredSpecialistId?: string;
  preferredSpecialistName?: string;
  preferences: CustomerPreferences;
  claimedCoupons: string[];   // Coupon codes
  redeemedCoupons: {
    couponCode: string;
    bookingRef: string;
    discountUSD: number;
    redeemedAt: string;
  }[];
  adminNotes?: string;
  tags: string[];            // e.g., ['Bridal', 'High-Spender', 'Weekend-Only']
}
