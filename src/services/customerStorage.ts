import type {
  CustomerUser,
  CustomerJourneyStage,
  VIPTier,
} from '../types/customer';
import { parsePriceUSD } from './localization';

const STORAGE_KEY_CUSTOMERS = 'diamond_trim_customers_v1';
const STORAGE_KEY_CURRENT_USER = 'diamond_trim_current_user_v1';

export const DEFAULT_CUSTOMERS: CustomerUser[] = [
  {
    id: 'cust-1',
    name: 'Victoria Sterling',
    email: 'victoria.sterling@example.com',
    phone: '+1 (555) 234-8891',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    memberSince: '2025-08-14',
    lastVisitDate: '2026-10-18',
    vipTier: 'Diamond VIP',
    loyaltyPoints: 1250,
    totalVisits: 8,
    totalSpentUSD: 1180,
    journeyStage: 'vip',
    preferredSpecialistId: 'spec-1',
    preferredSpecialistName: 'Elena Rostova',
    preferences: {
      refreshment: 'San Pellegrino with Lemon & Iced Espresso',
      acousticPrivacy: 'absolute',
      allergyNotes: 'Sensitive to acetone fumes. Prefers botanical cuticle oils.',
      lightingPreference: 'dim',
    },
    claimedCoupons: ['VIPPRIVILEGE', 'WELCOME20'],
    redeemedCoupons: [
      {
        couponCode: 'WELCOME20',
        bookingRef: 'DT-894102',
        discountUSD: 24,
        redeemedAt: '2025-08-14',
      },
      {
        couponCode: 'SPA15',
        bookingRef: 'DT-912044',
        discountUSD: 30,
        redeemedAt: '2026-06-12',
      },
    ],
    adminNotes: 'Executive client. Prefers Acoustic VIP Pod 1 reserved in advance. Highly appreciative of discrete checkout.',
    tags: ['Diamond VIP', 'High LTV', 'Acoustic Pod Priority', 'Champagne'],
  },
  {
    id: 'cust-2',
    name: 'Camilla Vance',
    email: 'camilla.v@luxury-media.co',
    phone: '+1 (555) 671-3329',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    memberSince: '2026-03-22',
    lastVisitDate: '2026-10-04',
    vipTier: 'Gold',
    loyaltyPoints: 580,
    totalVisits: 4,
    totalSpentUSD: 540,
    journeyStage: 'returning',
    preferredSpecialistId: 'spec-2',
    preferredSpecialistName: 'Antoine Moreau',
    preferences: {
      refreshment: 'Earl Grey Tea & Dark Chocolate',
      acousticPrivacy: 'ambient',
      allergyNotes: 'No harsh sulfates or ammonia for balayage coloring.',
      lightingPreference: 'natural',
    },
    claimedCoupons: ['HAIRGLOSS30'],
    redeemedCoupons: [
      {
        couponCode: 'HAIRGLOSS30',
        bookingRef: 'DT-782199',
        discountUSD: 30,
        redeemedAt: '2026-10-04',
      },
    ],
    adminNotes: 'Fashion editor. Loves French balayage dimension. Books every 6-8 weeks.',
    tags: ['Balayage Fan', 'Editorial', 'Gold Tier'],
  },
  {
    id: 'cust-3',
    name: 'Sophia Al-Mansoor',
    email: 'sophia.almansoor@emiratestech.ae',
    phone: '+971 50 892 4110',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop',
    memberSince: '2026-09-01',
    lastVisitDate: '2026-09-15',
    vipTier: 'Silver',
    loyaltyPoints: 210,
    totalVisits: 1,
    totalSpentUSD: 210,
    journeyStage: 'first-visit',
    preferredSpecialistId: 'spec-6',
    preferredSpecialistName: 'Chloe Vane',
    preferences: {
      refreshment: 'Arabic Coffee & Medjool Dates',
      acousticPrivacy: 'absolute',
      allergyNotes: 'None reported.',
      lightingPreference: 'soft-candlelight',
    },
    claimedCoupons: ['WELCOME20', 'DIAMOND50'],
    redeemedCoupons: [
      {
        couponCode: 'WELCOME20',
        bookingRef: 'DT-554101',
        discountUSD: 42,
        redeemedAt: '2026-09-15',
      },
    ],
    adminNotes: 'Travels between Dubai and London. Requested booking confirmation via WhatsApp.',
    tags: ['First Visit Complete', 'International Client', 'WhatsApp Contact'],
  },
  {
    id: 'cust-4',
    name: 'Amina Tariq',
    email: 'amina.tariq@globalventures.com',
    phone: '+1 (555) 902-7612',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
    memberSince: '2026-10-25',
    lastVisitDate: undefined,
    vipTier: 'Silver',
    loyaltyPoints: 50,
    totalVisits: 0,
    totalSpentUSD: 0,
    journeyStage: 'lead',
    preferences: {
      refreshment: 'Matcha Green Tea Latte',
      acousticPrivacy: 'absolute',
      allergyNotes: 'None',
      lightingPreference: 'dim',
    },
    claimedCoupons: ['WELCOME20'],
    redeemedCoupons: [],
    adminNotes: 'New digital lead registered online. Sent welcome VIP invitation voucher.',
    tags: ['New Lead', 'Welcome Voucher Sent'],
  },
  {
    id: 'cust-5',
    name: 'Helena Lindqvist',
    email: 'helena.lind@nordicdesign.se',
    phone: '+1 (555) 431-9018',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=250&auto=format&fit=crop',
    memberSince: '2025-11-10',
    lastVisitDate: '2026-07-02',
    vipTier: 'Gold',
    loyaltyPoints: 460,
    totalVisits: 3,
    totalSpentUSD: 420,
    journeyStage: 'at-risk',
    preferredSpecialistId: 'spec-7',
    preferredSpecialistName: 'Irina Belova',
    preferences: {
      refreshment: 'Sparkling Water',
      acousticPrivacy: 'ambient',
      allergyNotes: 'None',
      lightingPreference: 'natural',
    },
    claimedCoupons: ['DIAMOND50'],
    redeemedCoupons: [],
    adminNotes: 'Has not visited in 120 days. High probability of reactivation with Diamond Trim private pod incentive.',
    tags: ['At Risk', 'Reactivation Target', 'Podology Client'],
  },
];

// Helper to notify storage changes
export const notifyCustomerStorageChange = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('diamond_trim_customer_change'));
};

// Retrieve all stored customers
export const getStoredCustomers = (): CustomerUser[] => {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
      return DEFAULT_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CUSTOMERS;
  } catch (err) {
    console.error('Error reading customers from localStorage', err);
    return DEFAULT_CUSTOMERS;
  }
};

// Save customer list
export const saveStoredCustomers = (customers: CustomerUser[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  notifyCustomerStorageChange();
};

// Currently logged-in customer session
export const getCurrentUser = (): CustomerUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading current user session', err);
    return null;
  }
};

export const setCurrentUser = (user: CustomerUser | null): void => {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  }
  notifyCustomerStorageChange();
};

// Calculate VIP Tier based on visits & spending
export const calculateVIPTier = (totalVisits: number, totalSpentUSD: number): VIPTier => {
  if (totalVisits >= 6 || totalSpentUSD >= 800) return 'Diamond VIP';
  if (totalVisits >= 2 || totalSpentUSD >= 300) return 'Gold';
  return 'Silver';
};

// Calculate Journey Stage
export const calculateJourneyStage = (
  totalVisits: number,
  totalSpentUSD: number,
  lastVisitDate?: string
): CustomerJourneyStage => {
  if (totalVisits === 0) return 'lead';

  if (lastVisitDate) {
    const diffDays = Math.floor(
      (new Date().getTime() - new Date(lastVisitDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 60) return 'at-risk';
  }

  if (totalVisits >= 5 || totalSpentUSD >= 600) return 'vip';
  if (totalVisits >= 2) return 'returning';
  return 'first-visit';
};

// Customer Registration
export const registerCustomer = (data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  refreshment?: string;
  acousticPrivacy?: 'absolute' | 'ambient' | 'silent';
  allergyNotes?: string;
}): { success: boolean; user?: CustomerUser; error?: string } => {
  const currentList = getStoredCustomers();
  const existing = currentList.find(
    (c) => c.email.toLowerCase() === data.email.trim().toLowerCase()
  );

  if (existing) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const nowStr = new Date().toISOString().split('T')[0];
  const newCustomer: CustomerUser = {
    id: 'cust-' + Date.now(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    password: data.password || 'password123',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop`,
    memberSince: nowStr,
    vipTier: 'Silver',
    loyaltyPoints: 100, // Instant 100 points signup bonus
    totalVisits: 0,
    totalSpentUSD: 0,
    journeyStage: 'lead',
    preferences: {
      refreshment: data.refreshment || 'San Pellegrino & Espresso',
      acousticPrivacy: data.acousticPrivacy || 'absolute',
      allergyNotes: data.allergyNotes || '',
      lightingPreference: 'dim',
    },
    claimedCoupons: ['WELCOME20'], // Auto-granted 20% welcome bonus
    redeemedCoupons: [],
    adminNotes: 'Self-registered guest account via Diamond Trim website.',
    tags: ['Registered Guest', 'Welcome Bonus Applied'],
  };

  const updatedList = [newCustomer, ...currentList];
  saveStoredCustomers(updatedList);
  setCurrentUser(newCustomer);
  return { success: true, user: newCustomer };
};

// Customer Login
export const loginCustomer = (
  email: string,
  pass?: string
): { success: boolean; user?: CustomerUser; error?: string } => {
  const currentList = getStoredCustomers();
  const user = currentList.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    return { success: false, error: 'No guest profile found with this email. Please register.' };
  }

  // If password provided and user has password, check match (loose check for demo)
  if (pass && user.password && user.password !== pass) {
    return { success: false, error: 'Incorrect password. Please verify and try again.' };
  }

  setCurrentUser(user);
  return { success: true, user };
};

// Logout Customer
export const logoutCustomer = (): void => {
  setCurrentUser(null);
};

// Update Customer Profile
export const updateCustomerProfile = (
  customerId: string,
  updates: Partial<CustomerUser>
): CustomerUser | null => {
  const currentList = getStoredCustomers();
  let updatedUser: CustomerUser | null = null;

  const nextList = currentList.map((c) => {
    if (c.id === customerId) {
      const merged = { ...c, ...updates };
      // Recalculate tier & journey if visits or spent changed
      merged.vipTier = calculateVIPTier(merged.totalVisits, merged.totalSpentUSD);
      merged.journeyStage = calculateJourneyStage(
        merged.totalVisits,
        merged.totalSpentUSD,
        merged.lastVisitDate
      );
      updatedUser = merged;
      return merged;
    }
    return c;
  });

  if (updatedUser) {
    saveStoredCustomers(nextList);
    const currentSession = getCurrentUser();
    if (currentSession && currentSession.id === customerId) {
      setCurrentUser(updatedUser);
    }
  }

  return updatedUser;
};

// Record a completed appointment in the customer journey
export const recordCustomerBooking = (
  emailOrPhone: string,
  bookingDetails: {
    priceRaw: string;
    date: string;
    serviceName: string;
    specialistName?: string;
  }
): void => {
  const currentList = getStoredCustomers();
  const normEmail = emailOrPhone.trim().toLowerCase();

  const customer = currentList.find(
    (c) =>
      c.email.toLowerCase() === normEmail ||
      c.phone.replace(/[^0-9]/g, '') === emailOrPhone.replace(/[^0-9]/g, '')
  );

  if (!customer) return;

  const priceUSD = parsePriceUSD(bookingDetails.priceRaw);
  const earnedPoints = Math.round(priceUSD * 10);

  updateCustomerProfile(customer.id, {
    totalVisits: customer.totalVisits + 1,
    totalSpentUSD: customer.totalSpentUSD + priceUSD,
    loyaltyPoints: customer.loyaltyPoints + earnedPoints,
    lastVisitDate: bookingDetails.date,
    preferredSpecialistName: bookingDetails.specialistName || customer.preferredSpecialistName,
  });
};

// Record coupon redemption on customer
export const recordCustomerCouponRedemption = (
  customerId: string,
  couponCode: string,
  bookingRef: string,
  discountUSD: number
): void => {
  const currentList = getStoredCustomers();
  const customer = currentList.find((c) => c.id === customerId);
  if (!customer) return;

  const newRedemption = {
    couponCode,
    bookingRef,
    discountUSD,
    redeemedAt: new Date().toISOString().split('T')[0],
  };

  const updatedRedeemed = [...(customer.redeemedCoupons || []), newRedemption];
  updateCustomerProfile(customerId, {
    redeemedCoupons: updatedRedeemed,
  });
};
