export type DiscountType = 'percentage' | 'fixed';

export interface CouponItem {
  id: string;
  code: string;               // e.g. "WELCOME20", "DIAMOND50"
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;      // 20 for 20% or 50 for $50 fixed USD
  minSpendUSD?: number;
  categoryRestriction?: string; // 'nails', 'hair', 'skin', etc. or 'all'
  expiryDate: string;         // YYYY-MM-DD
  maxRedemptions?: number;
  timesRedeemed: number;
  active: boolean;
  badge?: string;             // e.g. "New Member Perk", "Flash VIP Deal"
  isPublic: boolean;          // Whether shown in public promotions banner
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponItem;
  discountUSD: number;
  message: string;
}
