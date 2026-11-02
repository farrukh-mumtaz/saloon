import React, { useState, useEffect } from 'react';
import {
  Gem,
  Menu,
  X,
  ArrowRight,
  Globe,
  Ticket,
  User,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '../types/i18n';
import type { CustomerUser } from '../types/customer';

interface HeaderProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenPromotions: () => void;
  onOpenSaaS: () => void;
  currentUser: CustomerUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onNavigate,
  onOpenAdmin,
  onOpenAuth,
  onOpenAccount,
  onOpenPromotions,
  onOpenSaaS,
  currentUser,
}) => {
  const { currency, language, setCurrency, setLanguage, t } = useLocalization();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.services'), id: 'services' },
    { label: t('nav.whyUs'), id: 'why-us' },
    { label: t('nav.gallery'), id: 'gallery' },
    { label: t('nav.reviews'), id: 'testimonials' },
    { label: t('nav.faq'), id: 'faq' },
    { label: t('nav.contact'), id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const activeCurrencyConfig = SUPPORTED_CURRENCIES[currency];
  const activeLanguageConfig = SUPPORTED_LANGUAGES[language];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#50b7b5]/92 backdrop-blur-md py-2.5 sm:py-3 border-b border-white/30 shadow-[0_4px_20px_rgba(14,40,40,0.08)]'
            : 'bg-[#50b7b5]/75 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-2 lg:gap-3">
          {/* Brand Identity */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer shrink-0"
            aria-label="Diamond Trim Atelier"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#53b8b6]/70 bg-gradient-to-br from-[#d9f5f4] to-[#b8ebe9] flex items-center justify-center text-[#1c6664] group-hover:border-[#287a78] shadow-2xs transition-colors shrink-0">
              <Gem className="w-3.5 h-3.5 text-[#1c6664] transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display-luxury text-xs sm:text-base tracking-[0.16em] sm:tracking-[0.22em] font-semibold text-[#102727] block leading-none whitespace-nowrap">
                DIAMOND TRIM
              </span>
              <span className="text-[7.5px] sm:text-[9px] tracking-[0.22em] sm:tracking-[0.3em] uppercase text-[#236b69] font-sans block mt-1 leading-none whitespace-nowrap font-medium">
                Beauty &amp; Spa Atelier
              </span>
            </div>
          </button>

          {/* Desktop Minimalist Nav */}
          <nav className="hidden xl:flex items-center justify-center gap-4 2xl:gap-6 mx-auto shrink-0">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="whitespace-nowrap shrink-0 text-xs uppercase tracking-[0.14em] text-[#1c3b3a] hover:text-[#165a58] transition-colors cursor-pointer relative py-1 font-semibold group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#53b8b6] to-[#247a78] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </button>
            ))}

            {/* B2B SaaS Link */}
            <button
              onClick={onOpenSaaS}
              className="whitespace-nowrap shrink-0 text-xs uppercase tracking-[0.14em] text-[#102727] font-bold hover:text-[#165a58] transition-colors cursor-pointer flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/35 border border-white/50 shadow-2xs"
            >
              <Building2 className="w-3 h-3 text-[#165a58]" />
              <span>{t('nav.forSalons')}</span>
            </button>
          </nav>

          {/* Controls: Currency, Language, Offers, Auth & Book */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyOpen(!currencyOpen);
                  setLangOpen(false);
                }}
                className="h-8 px-2.5 rounded-full text-[11px] font-bold border border-white/50 bg-white/30 hover:bg-white/50 text-[#102727] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Change Currency"
              >
                <span>{activeCurrencyConfig.flag}</span>
                <span>{activeCurrencyConfig.code}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#50b7b5]/30 shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#0d2222]/60 border-b border-gray-100">
                    Select Currency
                  </div>
                  {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#50b7b5]/15 transition-colors cursor-pointer ${
                        currency === c.code ? 'font-bold text-[#165a58] bg-[#50b7b5]/10' : 'text-[#0d2222]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </span>
                      <span className="text-[11px] opacity-75">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangOpen(!langOpen);
                  setCurrencyOpen(false);
                }}
                className="h-8 px-2.5 rounded-full text-[11px] font-bold border border-white/50 bg-white/30 hover:bg-white/50 text-[#102727] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Change Language"
              >
                <Globe className="w-3 h-3" />
                <span>{activeLanguageConfig.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#50b7b5]/30 shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#0d2222]/60 border-b border-gray-100">
                    Select Language
                  </div>
                  {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#50b7b5]/15 transition-colors cursor-pointer ${
                        language === l.code ? 'font-bold text-[#165a58] bg-[#50b7b5]/10' : 'text-[#0d2222]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </span>
                      <span className="text-[10px] uppercase opacity-60">{l.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offers & Coupons Trigger */}
            <button
              onClick={onOpenPromotions}
              className="h-8 px-2.5 rounded-full text-[11px] uppercase tracking-wider font-bold border border-white/50 bg-white/30 hover:bg-white/50 text-[#102727] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              title="View Offers & Coupons"
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-800" />
              <span className="hidden xl:inline">{t('nav.promotions')}</span>
              <span className="xl:hidden">Offers</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            </button>

            {/* Customer Account or Sign In */}
            {currentUser ? (
              <button
                onClick={onOpenAccount}
                className="h-9 px-3 rounded-full text-xs font-bold bg-white/40 border border-white/60 text-[#0d2222] hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Open VIP Guest Account"
              >
                <div className="w-5 h-5 rounded-full bg-[#0d2222] text-[#50b7b5] flex items-center justify-center text-[10px]">
                  ✦
                </div>
                <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#0d2222] text-[#50b7b5] font-bold">
                  {currentUser.vipTier === 'Diamond VIP' ? 'VIP' : currentUser.vipTier}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-9 px-3.5 rounded-full text-xs uppercase tracking-wider font-bold border border-white/50 bg-white/25 hover:bg-white/40 text-[#102727] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.signIn')}</span>
              </button>
            )}

            {/* Admin Portal */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="h-9 px-3 rounded-full text-xs uppercase tracking-wider font-bold border border-[#53b8b6]/60 hover:border-[#247a78] text-[#165a58] hover:bg-[#d8f4f3] transition-colors cursor-pointer inline-flex items-center justify-center shrink-0 shadow-2xs"
                title="Atelier Admin Portal"
              >
                <span>Admin</span>
              </button>
            )}

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              className="h-9 px-4 xl:px-5 rounded-full text-xs uppercase tracking-wider font-bold bg-[#102727] text-white hover:bg-[#1f6361] active:scale-98 transition-all duration-300 cursor-pointer shadow-md inline-flex items-center justify-center shrink-0 whitespace-nowrap border border-[#53b8b6]/30"
            >
              <span>{t('nav.book')}</span>
            </button>
          </div>

          {/* Mobile Header Compact Actions */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Currency selector on mobile */}
            <button
              onClick={() => {
                const codes = Object.keys(SUPPORTED_CURRENCIES) as (keyof typeof SUPPORTED_CURRENCIES)[];
                const nextIdx = (codes.indexOf(currency) + 1) % codes.length;
                setCurrency(codes[nextIdx]);
              }}
              className="h-7 px-2 rounded-full text-[10px] font-bold border border-white/50 bg-white/30 text-[#102727]"
              title="Tap to switch currency"
            >
              {activeCurrencyConfig.symbol}
            </button>

            {/* Language switch on mobile */}
            <button
              onClick={() => {
                const langs = Object.keys(SUPPORTED_LANGUAGES) as (keyof typeof SUPPORTED_LANGUAGES)[];
                const nextIdx = (langs.indexOf(language) + 1) % langs.length;
                setLanguage(langs[nextIdx]);
              }}
              className="h-7 px-2 rounded-full text-[10px] font-bold border border-white/50 bg-white/30 text-[#102727]"
              title="Tap to switch language"
            >
              {activeLanguageConfig.code.toUpperCase()}
            </button>

            {currentUser ? (
              <button
                onClick={onOpenAccount}
                className="h-7 px-2.5 rounded-full text-[10px] font-bold bg-white/40 text-[#0d2222] border border-white/60 flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d2222]" />
                <span className="max-w-[65px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="h-7 px-2.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-white/30 text-[#102727] border border-white/50"
              >
                Sign In
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="h-7 px-3 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#102727] text-white shadow-sm"
            >
              Book
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 rounded-full border border-transparent hover:border-[#d2edeb] inline-flex items-center justify-center text-[#102727] cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#50b7b5]/95 backdrop-blur-2xl border-l border-white/50 p-6 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.35)] z-50 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-[#53b8b6] bg-white flex items-center justify-center text-[#165a58]">
                    <Gem className="w-3.5 h-3.5 text-[#165a58]" />
                  </div>
                  <span className="font-display-luxury text-sm tracking-widest font-bold text-[#102727]">
                    DIAMOND TRIM
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-7 h-7 rounded-full border border-white/50 bg-white/30 flex items-center justify-center text-[#102727]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Account Quick Card in Mobile Drawer */}
              {currentUser ? (
                <div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="p-3.5 rounded-2xl bg-white/35 border border-white/60 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white shadow-xs"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0d2222] block">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-[#0d2222]/80 font-semibold">
                        {currentUser.vipTier} • {currentUser.loyaltyPoints} pts
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0d2222]">View →</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/35 border border-white/60 text-xs font-bold text-[#0d2222] flex items-center justify-center gap-2 shadow-2xs"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Create Account (Get 20% Off)</span>
                </button>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 pt-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className="text-left py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider text-[#1c3b3a] hover:bg-white/30 font-bold transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPromotions();
                  }}
                  className="text-left py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider text-[#1c3b3a] hover:bg-white/30 font-bold transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Offers &amp; Coupons</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                    New
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSaaS();
                  }}
                  className="text-left py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider text-[#102727] hover:bg-white/30 font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#165a58]" />
                  <span>For Salons (SaaS Platform)</span>
                </button>
              </nav>

              {/* Currency & Language Selection on Mobile */}
              <div className="pt-3 border-t border-white/30 space-y-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#0d2222]/70 block mb-1">
                    Select Currency
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border ${
                          currency === c.code
                            ? 'bg-[#0d2222] text-white border-[#0d2222]'
                            : 'bg-white/30 text-[#0d2222] border-white/40'
                        }`}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#0d2222]/70 block mb-1">
                    Select Language
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border ${
                          language === l.code
                            ? 'bg-[#0d2222] text-white border-[#0d2222]'
                            : 'bg-white/30 text-[#0d2222] border-white/40'
                        }`}
                      >
                        {l.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Footer Drawer Actions */}
            <div className="pt-4 border-t border-white/30 space-y-2">
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold border border-[#53b8b6]/60 text-[#165a58] bg-[#e0f6f5] flex items-center justify-center gap-1.5"
                >
                  <span>Atelier Admin Portal</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-xl text-xs uppercase tracking-wider font-bold bg-[#102727] text-white flex items-center justify-center gap-2 shadow-md"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
