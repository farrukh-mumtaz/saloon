import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { registerCustomer, loginCustomer } from '../services/customerStorage';
import { useLocalization } from '../context/LocalizationContext';
import type { CustomerUser } from '../types/customer';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerUser) => void;
  initialMode?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const { t } = useLocalization();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [refreshment, setRefreshment] = useState('San Pellegrino & Espresso');
  const [acousticPrivacy, setAcousticPrivacy] = useState<'absolute' | 'ambient' | 'silent'>('absolute');
  const [allergyNotes, setAllergyNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter your email and password.');
        setLoading(false);
        return;
      }
      const res = loginCustomer(email, password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Failed to sign in.');
      }
    } else {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
      const res = registerCustomer({
        name,
        email,
        phone,
        password,
        refreshment,
        acousticPrivacy,
        allergyNotes,
      });
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Card Dialog */}
      <div className="relative w-full max-w-md bg-[#50b7b5]/95 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0d2222] animate-pulse" />
            <span className="font-display-luxury text-xs tracking-widest font-bold text-[#0d2222]">
              DIAMOND TRIM • {mode === 'login' ? 'GUEST SIGN IN' : 'VIP REGISTRATION'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/50 bg-white/30 text-[#0d2222] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* VIP Perk Welcome Banner */}
          {mode === 'register' && (
            <div className="p-3.5 rounded-2xl bg-white/35 backdrop-blur-md border border-white/60 flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#0d2222] text-[#50b7b5] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✦
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#0d2222] block">
                  Automatic 20% Welcome Coupon: WELCOME20
                </span>
                <span className="text-[#0d2222]/85 text-[11px] leading-tight block mt-0.5">
                  Register to unlock 100 bonus loyalty points, acoustic suite personalization, and instant booking tracking.
                </span>
              </div>
            </div>
          )}

          <div className="text-center">
            <h3 className="font-playfair-headline text-2xl font-bold text-[#0d2222]">
              {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
            </h3>
            <p className="text-xs text-[#0d2222]/80 mt-1 font-medium">
              {mode === 'login' ? t('auth.welcomeSub') : t('auth.createSub')}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-950 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                  {t('auth.fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#0d2222]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Victoria Sterling"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-sm text-[#0d2222] placeholder-[#0d2222]/50 focus:outline-none focus:border-white focus:bg-white/45 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#0d2222]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="victoria@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-sm text-[#0d2222] placeholder-[#0d2222]/50 focus:outline-none focus:border-white focus:bg-white/45 transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                  {t('auth.phone')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#0d2222]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-8891"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-sm text-[#0d2222] placeholder-[#0d2222]/50 focus:outline-none focus:border-white focus:bg-white/45 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0d2222] mb-1">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#0d2222]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-md border border-white/60 text-sm text-[#0d2222] placeholder-[#0d2222]/50 focus:outline-none focus:border-white focus:bg-white/45 transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="pt-2 border-t border-white/30 space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#0d2222] block">
                  Private Suite Comfort Preferences
                </span>
                <div>
                  <label className="block text-[10px] font-semibold text-[#0d2222] mb-1">
                    Favorite Welcome Refreshment
                  </label>
                  <select
                    value={refreshment}
                    onChange={(e) => setRefreshment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] focus:outline-none"
                  >
                    <option value="San Pellegrino & Espresso">San Pellegrino & Espresso</option>
                    <option value="Champagne & Strawberries">Champagne & Strawberries</option>
                    <option value="Earl Grey Tea & Dark Chocolate">Earl Grey Tea & Dark Chocolate</option>
                    <option value="Matcha Green Tea Latte">Matcha Green Tea Latte</option>
                    <option value="Arabic Coffee & Medjool Dates">Arabic Coffee & Medjool Dates</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#0d2222] mb-1">
                    Acoustic Privacy Mode
                  </label>
                  <select
                    value={acousticPrivacy}
                    onChange={(e) => setAcousticPrivacy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] focus:outline-none"
                  >
                    <option value="absolute">100% Absolute Acoustic Silence (No Staff Talk)</option>
                    <option value="ambient">Ambient Lounge Classical Music</option>
                    <option value="silent">Complete Digital Disconnect Mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#0d2222] mb-1">
                    Skin / Hair Sensitivities (Optional)
                  </label>
                  <input
                    type="text"
                    value={allergyNotes}
                    onChange={(e) => setAllergyNotes(e.target.value)}
                    placeholder="e.g., Sensitive scalp, fragrance allergy, vegan dyes only"
                    className="w-full px-3 py-2 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] placeholder-[#0d2222]/50 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0d2222] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#183a3a] active:scale-98 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="pt-3 text-center border-t border-white/30">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs font-bold text-[#0d2222] hover:underline cursor-pointer"
            >
              {mode === 'login' ? t('auth.needAccount') : t('auth.haveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
