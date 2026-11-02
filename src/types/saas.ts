export interface SaaSSubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyUSD: number;
  priceAnnualUSD: number; // monthly rate when billed annually
  popular?: boolean;
  badge?: string;
  features: string[];
  maxSpecialists: number | 'Unlimited';
  maxSuites: number | 'Unlimited';
  customDomain: boolean;
  multiLanguage: boolean;
  multiCurrency: boolean;
  crmAndJourney: boolean;
  couponsEngine: boolean;
  dedicatedSupport: boolean;
}

export interface SalonTenantRegistration {
  id: string;
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
  status: 'active-trial' | 'subscribed' | 'pending';
  trialEndsAt: string;
  createdAt: string;
}
