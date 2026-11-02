import type { SaaSSubscriptionPlan, SalonTenantRegistration } from '../types/saas';

const STORAGE_KEY_SAAS_TENANTS = 'diamond_trim_saas_tenants_v1';
const STORAGE_KEY_CURRENT_TENANT = 'diamond_trim_current_tenant_v1';

export const SAAS_PLANS: SaaSSubscriptionPlan[] = [
  {
    id: 'plan-boutique',
    name: 'Boutique Atelier',
    tagline: 'Ideal for independent salons, nail bars, and boutique aesthetics studios.',
    priceMonthlyUSD: 79,
    priceAnnualUSD: 63,
    badge: 'Essential',
    features: [
      'Interactive 3D / Video Model Hero Experience',
      'Up to 5 Master Specialists & Schedules',
      'Up to 4 Acoustic VIP Pods & Private Suites',
      'Automated Online Booking & Client SMS',
      'Multi-Currency Conversion (USD, EUR, GBP, AED, SAR, PKR, CAD)',
      'Custom Salon Branding & Logo',
      'Standard Email & Community Support',
    ],
    maxSpecialists: 5,
    maxSuites: 4,
    customDomain: false,
    multiLanguage: true,
    multiCurrency: true,
    crmAndJourney: false,
    couponsEngine: true,
    dedicatedSupport: false,
  },
  {
    id: 'plan-luxury-pro',
    name: 'Luxury Studio Pro',
    tagline: 'The complete digital operating system for premier beauty & grooming salons.',
    priceMonthlyUSD: 149,
    priceAnnualUSD: 119,
    popular: true,
    badge: 'Most Popular',
    features: [
      'All Boutique Atelier Features',
      'Unlimited Master Specialists & Chair Schedules',
      'Unlimited Private Treatment Suites & Autoclave Cycles',
      'Automated Customer Journey CRM & VIP LTV Tracking',
      'Advanced Promotions & Custom Coupon Engine',
      'Multilingual Global Localization (EN, AR, FR, ES, UR with RTL)',
      'Custom Domain Connection (e.g. yoursalon.com)',
      'Priority 24/7 Concierge Support',
    ],
    maxSpecialists: 'Unlimited',
    maxSuites: 'Unlimited',
    customDomain: true,
    multiLanguage: true,
    multiCurrency: true,
    crmAndJourney: true,
    couponsEngine: true,
    dedicatedSupport: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Prestige',
    tagline: 'Built for high-volume multi-location franchises, hotel spas, and resort salons.',
    priceMonthlyUSD: 299,
    priceAnnualUSD: 239,
    badge: 'Flagship',
    features: [
      'All Luxury Studio Pro Features',
      'Multi-Location Centralized Headquarters Dashboard',
      'White-Label iOS & Android Mobile Apps',
      'Hardware IoT Integration (Autoclave & Acoustic Pod Lighting)',
      'Custom API & Webhooks for POS / ERP (Square, Stripe, Clover)',
      'Custom Translation Locale Injection',
      'Dedicated Account Director & Onboarding Specialist',
      '99.99% Uptime SLA & Custom Contract',
    ],
    maxSpecialists: 'Unlimited',
    maxSuites: 'Unlimited',
    customDomain: true,
    multiLanguage: true,
    multiCurrency: true,
    crmAndJourney: true,
    couponsEngine: true,
    dedicatedSupport: true,
  },
];

export const DEFAULT_DEMO_TENANTS: SalonTenantRegistration[] = [
  {
    id: 'tenant-1',
    salonName: 'Diamond Trim Flagship Atelier',
    ownerName: 'Farrukh Mumtaz',
    businessEmail: 'concierge@diamondtrim.com',
    phone: '+1 (800) 482-8746',
    selectedPlanId: 'plan-luxury-pro',
    billingCycle: 'monthly',
    preferredCurrency: 'USD',
    preferredLanguage: 'en',
    city: 'Downtown Promenade',
    country: 'United States',
    status: 'subscribed',
    trialEndsAt: '2027-12-31',
    createdAt: '2026-01-10',
  },
  {
    id: 'tenant-2',
    salonName: 'L’Étoile Paris Beauty Lounge',
    ownerName: 'Camille Laurent',
    businessEmail: 'contact@letoile-paris.fr',
    phone: '+33 1 42 68 55 00',
    selectedPlanId: 'plan-luxury-pro',
    billingCycle: 'annual',
    preferredCurrency: 'EUR',
    preferredLanguage: 'fr',
    city: 'Paris',
    country: 'France',
    status: 'subscribed',
    trialEndsAt: '2027-04-15',
    createdAt: '2026-04-15',
  },
  {
    id: 'tenant-3',
    salonName: 'Al-Reem Royal Spa & Atelier',
    ownerName: 'Rashid Al-Nuaimi',
    businessEmail: 'management@alreem-spa.ae',
    phone: '+971 4 399 2211',
    selectedPlanId: 'plan-enterprise',
    billingCycle: 'monthly',
    preferredCurrency: 'AED',
    preferredLanguage: 'ar',
    city: 'Dubai',
    country: 'United Arab Emirates',
    status: 'active-trial',
    trialEndsAt: '2026-11-15',
    createdAt: '2026-11-01',
  },
];

export const getStoredTenants = (): SalonTenantRegistration[] => {
  if (typeof window === 'undefined') return DEFAULT_DEMO_TENANTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAAS_TENANTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SAAS_TENANTS, JSON.stringify(DEFAULT_DEMO_TENANTS));
      return DEFAULT_DEMO_TENANTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DEMO_TENANTS;
  } catch (err) {
    console.error('Error reading SaaS tenants', err);
    return DEFAULT_DEMO_TENANTS;
  }
};

export const saveStoredTenants = (tenants: SalonTenantRegistration[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SAAS_TENANTS, JSON.stringify(tenants));
};

export const registerSalonTenant = (data: {
  salonName: string;
  ownerName: string;
  businessEmail: string;
  phone: string;
  selectedPlanId: string;
  billingCycle: 'monthly' | 'annual';
  preferredCurrency: string;
  preferredLanguage: string;
  city: string;
  country: string;
}): SalonTenantRegistration => {
  const current = getStoredTenants();
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);

  const newTenant: SalonTenantRegistration = {
    ...data,
    id: 'tenant-' + Date.now(),
    status: 'active-trial',
    trialEndsAt: trialEnd.toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
  };

  const updated = [newTenant, ...current];
  saveStoredTenants(updated);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CURRENT_TENANT, JSON.stringify(newTenant));
  }
  return newTenant;
};

export const getCurrentTenant = (): SalonTenantRegistration | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY_CURRENT_TENANT);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
