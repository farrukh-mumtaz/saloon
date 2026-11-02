import type { CouponItem, CouponValidationResult } from '../types/coupon';

const STORAGE_KEY_COUPONS = 'diamond_trim_coupons_v1';

export const DEFAULT_COUPONS: CouponItem[] = [
  {
    id: 'coup-1',
    code: 'WELCOME20',
    title: 'New VIP Guest Welcome Gift',
    description: 'Enjoy 20% off your entire first private suite treatment upon guest registration.',
    discountType: 'percentage',
    discountValue: 20,
    minSpendUSD: 40,
    categoryRestriction: 'all',
    expiryDate: '2027-12-31',
    timesRedeemed: 42,
    maxRedemptions: 1000,
    active: true,
    badge: 'Welcome Perk',
    isPublic: true,
  },
  {
    id: 'coup-2',
    code: 'DIAMOND50',
    title: '$50 Off Private Suite Immersion',
    description: 'Save $50 on any haute couture treatment package above $150.',
    discountType: 'fixed',
    discountValue: 50,
    minSpendUSD: 150,
    categoryRestriction: 'all',
    expiryDate: '2027-06-30',
    timesRedeemed: 28,
    maxRedemptions: 200,
    active: true,
    badge: 'Luxury Immersion',
    isPublic: true,
  },
  {
    id: 'coup-3',
    code: 'SPA15',
    title: '15% Off Regenerative Spa & Body',
    description: 'Instant 15% reduction on European podology therapies and restorative head spa treatments.',
    discountType: 'percentage',
    discountValue: 15,
    minSpendUSD: 50,
    categoryRestriction: 'all',
    expiryDate: '2027-08-31',
    timesRedeemed: 19,
    maxRedemptions: 150,
    active: true,
    badge: 'Wellness Perk',
    isPublic: true,
  },
  {
    id: 'coup-4',
    code: 'VIPPRIVILEGE',
    title: '25% Gold & Diamond VIP Exclusive',
    description: 'Privileged 25% savings for loyal clientele on bespoke styling & aesthetic sculpting.',
    discountType: 'percentage',
    discountValue: 25,
    minSpendUSD: 80,
    categoryRestriction: 'all',
    expiryDate: '2027-12-31',
    timesRedeemed: 14,
    active: true,
    badge: 'VIP Only',
    isPublic: false,
  },
  {
    id: 'coup-5',
    code: 'HAIRGLOSS30',
    title: '$30 Off Parisian Balayage & Filler',
    description: 'Save $30 on organic French Balayage and Nashi Argan botox hair fillers.',
    discountType: 'fixed',
    discountValue: 30,
    minSpendUSD: 100,
    categoryRestriction: 'hair',
    expiryDate: '2027-09-30',
    timesRedeemed: 31,
    active: true,
    badge: 'Hair Exclusive',
    isPublic: true,
  },
];

export const notifyCouponChange = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('diamond_trim_coupon_change'));
};

export const getStoredCoupons = (): CouponItem[] => {
  if (typeof window === 'undefined') return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
  } catch (err) {
    console.error('Error reading coupons', err);
    return DEFAULT_COUPONS;
  }
};

export const saveStoredCoupons = (coupons: CouponItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
  notifyCouponChange();
};

export const validateCoupon = (
  code: string,
  subtotalUSD: number,
  serviceCategory?: string
): CouponValidationResult => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountUSD: 0, message: 'Please enter a coupon code.' };
  }

  const coupons = getStoredCoupons();
  const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, discountUSD: 0, message: 'Coupon code not found.' };
  }

  if (!coupon.active) {
    return { valid: false, discountUSD: 0, message: 'This coupon is no longer active.' };
  }

  // Check expiration date
  const nowStr = new Date().toISOString().split('T')[0];
  if (coupon.expiryDate < nowStr) {
    return { valid: false, discountUSD: 0, message: 'This coupon has expired.' };
  }

  // Check min spend
  if (coupon.minSpendUSD && subtotalUSD < coupon.minSpendUSD) {
    return {
      valid: false,
      discountUSD: 0,
      message: `Minimum spend of $${coupon.minSpendUSD} required for this coupon.`,
    };
  }

  // Check category restriction
  if (
    coupon.categoryRestriction &&
    coupon.categoryRestriction !== 'all' &&
    serviceCategory &&
    coupon.categoryRestriction.toLowerCase() !== serviceCategory.toLowerCase()
  ) {
    return {
      valid: false,
      discountUSD: 0,
      message: `This coupon is exclusively valid for ${coupon.categoryRestriction} treatments.`,
    };
  }

  // Check max redemptions
  if (coupon.maxRedemptions && coupon.timesRedeemed >= coupon.maxRedemptions) {
    return { valid: false, discountUSD: 0, message: 'This promotion has reached its maximum redemptions limit.' };
  }

  // Calculate discount
  let calculatedDiscount = 0;
  if (coupon.discountType === 'percentage') {
    calculatedDiscount = (subtotalUSD * coupon.discountValue) / 100;
  } else {
    calculatedDiscount = Math.min(coupon.discountValue, subtotalUSD);
  }

  return {
    valid: true,
    coupon,
    discountUSD: Math.round(calculatedDiscount * 100) / 100,
    message: `Coupon applied: ${coupon.title}`,
  };
};

export const redeemCouponUsage = (code: string): boolean => {
  const cleanCode = code.trim().toUpperCase();
  const coupons = getStoredCoupons();
  let found = false;

  const updated = coupons.map((c) => {
    if (c.code.toUpperCase() === cleanCode) {
      found = true;
      return {
        ...c,
        timesRedeemed: c.timesRedeemed + 1,
      };
    }
    return c;
  });

  if (found) {
    saveStoredCoupons(updated);
  }
  return found;
};

export const createNewCoupon = (data: Omit<CouponItem, 'id' | 'timesRedeemed'>): CouponItem => {
  const current = getStoredCoupons();
  const newCoupon: CouponItem = {
    ...data,
    id: 'coup-' + Date.now(),
    code: data.code.trim().toUpperCase(),
    timesRedeemed: 0,
  };
  saveStoredCoupons([newCoupon, ...current]);
  return newCoupon;
};

export const updateStoredCoupon = (id: string, updates: Partial<CouponItem>): boolean => {
  const current = getStoredCoupons();
  let updated = false;
  const nextList = current.map((c) => {
    if (c.id === id) {
      updated = true;
      return { ...c, ...updates };
    }
    return c;
  });
  if (updated) {
    saveStoredCoupons(nextList);
  }
  return updated;
};

export const deleteStoredCoupon = (id: string): boolean => {
  const current = getStoredCoupons();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length !== current.length) {
    saveStoredCoupons(filtered);
    return true;
  }
  return false;
};
