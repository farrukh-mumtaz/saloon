import React, { useState, useEffect } from 'react';
import {
  X,
  Gem,
  Calendar,
  Ticket,
  Copy,
  Check,
  LogOut,
  Coffee,
  VolumeX,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import type { CustomerUser } from '../types/customer';
import {
  getCurrentUser,
  logoutCustomer,
  updateCustomerProfile,
} from '../services/customerStorage';
import { getStoredAppointments } from '../services/adminStorage';
import { getStoredCoupons } from '../services/couponStorage';
import { useLocalization } from '../context/LocalizationContext';
import type { AppointmentItem } from '../types/admin';
import type { CouponItem } from '../types/coupon';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onLogout: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onLogout,
}) => {
  const { t, formatPrice } = useLocalization();
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<'bookings' | 'coupons' | 'preferences'>('bookings');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [userAppointments, setUserAppointments] = useState<AppointmentItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);

  // Preferences form state
  const [refreshment, setRefreshment] = useState('');
  const [privacy, setPrivacy] = useState<'absolute' | 'ambient' | 'silent'>('absolute');
  const [allergy, setAllergy] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setRefreshment(user.preferences?.refreshment || 'San Pellegrino & Espresso');
        setPrivacy(user.preferences?.acousticPrivacy || 'absolute');
        setAllergy(user.preferences?.allergyNotes || '');

        // Fetch their appointments
        const all = getStoredAppointments();
        const normEmail = user.email.toLowerCase();
        const filtered = all.filter(
          (a) =>
            (a.clientEmail && a.clientEmail.toLowerCase() === normEmail) ||
            a.clientPhone.replace(/[^0-9]/g, '') === user.phone.replace(/[^0-9]/g, '')
        );
        setUserAppointments(filtered);
      }
      setCoupons(getStoredCoupons());
    }
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = updateCustomerProfile(currentUser.id, {
      preferences: {
        ...currentUser.preferences,
        refreshment,
        acousticPrivacy: privacy,
        allergyNotes: allergy,
      },
    });
    if (updated) {
      setCurrentUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleSignOut = () => {
    logoutCustomer();
    onLogout();
    onClose();
  };

  // Tier badge styling
  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    'Diamond VIP': { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-400/50' },
    Gold: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-400/50' },
    Silver: { bg: 'bg-slate-900/80', text: 'text-slate-200', border: 'border-slate-300/50' },
  };
  const activeTierStyle = tierColors[currentUser.vipTier] || tierColors.Silver;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#50b7b5]/95 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-[#0d2222]" />
            <span className="font-display-luxury text-xs tracking-widest font-bold text-[#0d2222]">
              {t('account.myDashboard')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="px-2.5 py-1 rounded-lg border border-white/40 bg-white/20 hover:bg-white/40 text-[11px] font-bold text-[#0d2222] flex items-center gap-1 cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>{t('auth.logout')}</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-white/50 bg-white/30 text-[#0d2222] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guest Profile Hero Card */}
        <div className="p-5 sm:p-6 border-b border-white/30 bg-gradient-to-r from-white/25 to-white/10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-playfair-headline text-lg sm:text-xl font-bold text-[#0d2222]">
                    {currentUser.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border shadow-xs ${activeTierStyle.bg} ${activeTierStyle.text} ${activeTierStyle.border}`}>
                    ✦ {currentUser.vipTier}
                  </span>
                </div>
                <p className="text-xs text-[#0d2222]/80 mt-0.5 font-medium">
                  {currentUser.email} • {currentUser.phone}
                </p>
                <p className="text-[10px] text-[#0d2222]/70 mt-0.5 font-semibold">
                  VIP Guest since {currentUser.memberSince}
                </p>
              </div>
            </div>

            {/* Quick Book CTA */}
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#0d2222] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1a4444] transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Metric Stats Strip */}
          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-white/30">
            <div className="p-2.5 rounded-xl bg-white/30 border border-white/50 text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#0d2222]/75 block">
                {t('account.loyaltyPoints')}
              </span>
              <span className="font-playfair-headline text-lg font-bold text-[#0d2222] block mt-0.5">
                {currentUser.loyaltyPoints.toLocaleString()} pts
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/30 border border-white/50 text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#0d2222]/75 block">
                {t('account.totalVisits')}
              </span>
              <span className="font-playfair-headline text-lg font-bold text-[#0d2222] block mt-0.5">
                {currentUser.totalVisits} Visits
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/30 border border-white/50 text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#0d2222]/75 block">
                {t('account.totalSpent')}
              </span>
              <span className="font-playfair-headline text-lg font-bold text-[#0d2222] block mt-0.5">
                {formatPrice(currentUser.totalSpentUSD)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/30 px-6 bg-white/20 shrink-0 gap-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 text-xs uppercase tracking-wider font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'bookings'
                ? 'border-[#0d2222] text-[#0d2222]'
                : 'border-transparent text-[#0d2222]/60 hover:text-[#0d2222]'
            }`}
          >
            {t('account.myBookings')} ({userAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 text-xs uppercase tracking-wider font-bold border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'coupons'
                ? 'border-[#0d2222] text-[#0d2222]'
                : 'border-transparent text-[#0d2222]/60 hover:text-[#0d2222]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{t('account.myCoupons')}</span>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 text-xs uppercase tracking-wider font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'preferences'
                ? 'border-[#0d2222] text-[#0d2222]'
                : 'border-transparent text-[#0d2222]/60 hover:text-[#0d2222]'
            }`}
          >
            {t('account.preferences')}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {userAppointments.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-white/25 border border-white/40 p-6 space-y-3">
                  <Calendar className="w-10 h-10 text-[#0d2222]/50 mx-auto" />
                  <p className="text-xs text-[#0d2222] font-semibold max-w-sm mx-auto">
                    {t('account.noBookings')}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0d2222] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#183a3a] cursor-pointer"
                  >
                    Reserve Private Pod
                  </button>
                </div>
              ) : (
                userAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#0d2222] text-[#50b7b5] font-bold">
                          {app.refCode}
                        </span>
                        <span className="text-xs uppercase tracking-wider font-bold text-[#0d2222]">
                          {app.serviceName}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#0d2222]/80 font-medium pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {app.date} at {app.time}
                        </span>
                        <span>•</span>
                        <span>{app.suiteName}</span>
                        <span>•</span>
                        <span>Master: {app.specialistName}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/20">
                      <span className="font-playfair-headline text-base font-bold text-[#0d2222]">
                        {app.price}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-950 border border-emerald-500/40'
                            : app.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-950 border border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-950 border border-amber-500/40'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: MY COUPONS & PROMOTIONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-xs text-[#0d2222]">
                <span className="font-bold block">✨ Active Exclusive Guest Vouchers</span>
                <span>Copy any code below or enter it during checkout to redeem instant discounts on your booking.</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {coupons.map((c) => {
                  const isCopied = copiedCode === c.code;
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-white/35 backdrop-blur-md border border-white/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0d2222] text-white tracking-widest">
                            {c.code}
                          </span>
                          {c.badge && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-500/40">
                              {c.badge}
                            </span>
                          )}
                          <span className="text-xs font-bold text-[#0d2222]">
                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0d2222]">{c.title}</h4>
                        <p className="text-xs text-[#0d2222]/80 leading-relaxed font-medium">
                          {c.description}
                        </p>
                        <p className="text-[10px] text-[#0d2222]/60 font-semibold pt-1">
                          Valid until {c.expiryDate} {c.minSpendUSD ? `• Min spend $${c.minSpendUSD}` : ''}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleCopy(c.code)}
                          className="px-3.5 py-2 rounded-xl bg-white border border-white/60 hover:bg-[#0d2222] hover:text-white text-xs font-bold text-[#0d2222] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs w-full justify-center"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t('common.copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t('common.copyCode')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ATELIER PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-4 max-w-lg">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Your VIP atelier comfort preferences have been updated!</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#0d2222] mb-1.5 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>{t('account.refreshmentPref')}</span>
                </label>
                <input
                  type="text"
                  value={refreshment}
                  onChange={(e) => setRefreshment(e.target.value)}
                  placeholder="e.g. San Pellegrino with Lime & Double Espresso"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-xs sm:text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#0d2222] mb-1.5 flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{t('account.privacyPref')}</span>
                </label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-xs sm:text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40"
                >
                  <option value="absolute">100% Absolute Acoustic Silence (No Staff Talk)</option>
                  <option value="ambient">Ambient Lounge Classical Music</option>
                  <option value="silent">Complete Digital Disconnect Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#0d2222] mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('account.allergyPref')}</span>
                </label>
                <textarea
                  rows={3}
                  value={allergy}
                  onChange={(e) => setAllergy(e.target.value)}
                  placeholder="Allergies to nail bonding agents, fragrance sensitivities, preference for organic botanicals..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-xs sm:text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0d2222] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#183a3a] transition-all cursor-pointer shadow-md"
              >
                {t('common.save')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
