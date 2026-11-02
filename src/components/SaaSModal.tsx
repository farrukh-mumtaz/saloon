import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  ArrowRight,
  Globe,
  Coins,
  Layers,
  Check,
} from 'lucide-react';
import { SAAS_PLANS, registerSalonTenant } from '../services/saasStorage';
import { useLocalization } from '../context/LocalizationContext';
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '../types/i18n';
import type { SaaSSubscriptionPlan } from '../types/saas';

interface SaaSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaaSModal: React.FC<SaaSModalProps> = ({ isOpen, onClose }) => {
  const { t, currency, language, formatPrice } = useLocalization();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SaaSSubscriptionPlan>(SAAS_PLANS[1]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // Form State
  const [salonName, setSalonName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [tenantCurrency, setTenantCurrency] = useState(currency);
  const [tenantLanguage, setTenantLanguage] = useState(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubscribe = (plan: SaaSSubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowCheckoutForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tenant = registerSalonTenant({
      salonName,
      ownerName,
      businessEmail,
      phone,
      selectedPlanId: selectedPlan.id,
      billingCycle,
      preferredCurrency: tenantCurrency,
      preferredLanguage: tenantLanguage,
      city,
      country,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessData(tenant);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#50b7b5]/95 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0d2222]" />
            <span className="font-display-luxury text-xs tracking-widest font-bold text-[#0d2222]">
              DIAMOND TRIM ATELIER OS • B2B SALON SOFTWARE-AS-A-SERVICE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/50 bg-white/30 text-[#0d2222] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {successData ? (
            /* Success Confirmation Screen */
            <div className="py-10 text-center max-w-lg mx-auto space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[#0d2222] text-[#50b7b5] mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-playfair-headline text-2xl sm:text-3xl font-bold text-[#0d2222]">
                Welcome to Atelier OS, {successData.salonName}!
              </h3>
              <p className="text-xs sm:text-sm text-[#0d2222]/85 leading-relaxed font-medium">
                Your 14-day free trial on the <strong>{selectedPlan.name}</strong> ({billingCycle} cycle) has been provisioned. We have sent the administrator activation credentials to <strong>{successData.businessEmail}</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-white/30 border border-white/50 text-left text-xs text-[#0d2222] space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="font-bold">Tenant ID:</span>
                  <span className="font-mono">{successData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Default Currency:</span>
                  <span>{successData.preferredCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Default Language:</span>
                  <span>{successData.preferredLanguage.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Trial Valid Through:</span>
                  <span>{successData.trialEndsAt}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-[#0d2222] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1a4444] transition-all cursor-pointer shadow-md"
              >
                Close &amp; Return to Atelier
              </button>
            </div>
          ) : showCheckoutForm ? (
            /* Registration Form */
            <div className="max-w-xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/30">
                <div>
                  <h4 className="font-playfair-headline text-xl font-bold text-[#0d2222]">
                    Subscribe to {selectedPlan.name}
                  </h4>
                  <p className="text-xs text-[#0d2222]/80 mt-0.5">
                    14-Day Free Trial • Cancel Anytime • No Upfront Charge
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs font-bold text-[#0d2222] hover:underline cursor-pointer"
                >
                  ← Change Plan
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Salon / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      placeholder="e.g. Royal Crown Atelier"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Owner / Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Farrukh Mumtaz"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="owner@your-salon.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Business Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (800) 482-TRIM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Dubai"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Arab Emirates"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Default Currency
                    </label>
                    <select
                      value={tenantCurrency}
                      onChange={(e) => setTenantCurrency(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    >
                      {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                      Default Language
                    </label>
                    <select
                      value={tenantLanguage}
                      onChange={(e) => setTenantLanguage(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/30 border border-white/60 text-xs text-[#0d2222] focus:outline-none focus:bg-white/45"
                    >
                      {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name} ({l.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Plan Summary Card */}
                <div className="p-4 rounded-2xl bg-white/35 border border-white/60 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-xs font-bold text-[#0d2222] block">
                      {selectedPlan.name} ({billingCycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'})
                    </span>
                    <span className="text-[11px] text-[#0d2222]/80">
                      Includes 3D model, VIP suites, CRM, and promotions engine
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-playfair-headline text-xl font-bold text-[#0d2222] block">
                      {formatPrice(billingCycle === 'annual' ? selectedPlan.priceAnnualUSD : selectedPlan.priceMonthlyUSD)}
                    </span>
                    <span className="text-[10px] text-[#0d2222]/70 font-semibold">
                      {billingCycle === 'annual' ? '/mo (billed annually)' : '/month'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#0d2222] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1a4444] active:scale-98 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Provisioning Tenant Salon...</span>
                  ) : (
                    <>
                      <span>Start 14-Day Free Trial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Pricing Table View */
            <div className="space-y-8">
              {/* Hero Banner */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-white/40 text-[#0d2222] border border-white/60">
                  ✦ SALON-AS-A-SERVICE (SaaS) PLATFORM
                </span>
                <h3 className="font-playfair-headline text-2xl sm:text-4xl font-bold text-[#0d2222]">
                  {t('saas.title')}
                </h3>
                <p className="text-xs sm:text-sm text-[#0d2222]/85 leading-relaxed font-medium">
                  {t('saas.subtitle')}
                </p>

                {/* Billing Cycle Switcher */}
                <div className="pt-2 inline-flex items-center p-1 rounded-full bg-white/30 border border-white/60 shadow-inner">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-[#0d2222] text-white shadow-sm'
                        : 'text-[#0d2222] hover:text-black'
                    }`}
                  >
                    {t('saas.monthly')}
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-[#0d2222] text-white shadow-sm'
                        : 'text-[#0d2222] hover:text-black'
                    }`}
                  >
                    <span>{t('saas.annual')}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] uppercase font-extrabold">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* 3 Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {SAAS_PLANS.map((plan) => {
                  const price = billingCycle === 'annual' ? plan.priceAnnualUSD : plan.priceMonthlyUSD;
                  return (
                    <div
                      key={plan.id}
                      className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative ${
                        plan.popular
                          ? 'bg-white/45 border-white ring-2 ring-[#0d2222] shadow-xl'
                          : 'bg-white/25 backdrop-blur-md border-white/50 hover:bg-white/35 shadow-sm'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#0d2222] text-[#50b7b5] shadow-md border border-[#50b7b5]/30">
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-playfair-headline text-xl font-bold text-[#0d2222]">
                            {plan.name}
                          </h4>
                          <p className="text-[11px] text-[#0d2222]/80 mt-1 leading-snug font-medium min-h-[32px]">
                            {plan.tagline}
                          </p>
                        </div>

                        {/* Price Display in User's Active Currency */}
                        <div className="pt-2 border-t border-white/30">
                          <div className="flex items-baseline gap-1">
                            <span className="font-playfair-headline text-3xl font-extrabold text-[#0d2222]">
                              {formatPrice(price)}
                            </span>
                            <span className="text-xs text-[#0d2222]/70 font-semibold">
                              {t('saas.perMonth')}
                            </span>
                          </div>
                          {billingCycle === 'annual' && (
                            <span className="text-[10px] text-emerald-950 font-bold block mt-0.5">
                              Billed annually ({formatPrice(price * 12)} / year)
                            </span>
                          )}
                        </div>

                        {/* Features List */}
                        <div className="pt-3 border-t border-white/30 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#0d2222]/80 block">
                            Included Capabilities
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#0d2222]/90 font-medium">
                            {plan.features.map((f, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                                <span className="leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={() => handleSubscribe(plan)}
                          className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                            plan.popular
                              ? 'bg-[#0d2222] text-white hover:bg-[#1a4444]'
                              : 'bg-white/80 text-[#0d2222] hover:bg-white hover:text-black border border-white'
                          }`}
                        >
                          <span>{t('saas.startTrial')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enterprise Feature Highlights Footer */}
              <div className="p-4 rounded-2xl bg-white/25 border border-white/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-[#0d2222] font-semibold">
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-4 h-4 text-[#0d2222]" />
                  <span>7 Global Currencies Built-in</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4 text-[#0d2222]" />
                  <span>5 Languages with RTL (Arabic &amp; Urdu)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4 text-[#0d2222]" />
                  <span>Interactive 3D Video Model Engine</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
