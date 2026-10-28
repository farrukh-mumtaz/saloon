import React, { useState, useEffect } from 'react';
import { Gem, Menu, X, ArrowRight } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface HeaderProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, onNavigate, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'Why Diamond Trim', id: 'why-us' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Reviews', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#50b7b5]/90 backdrop-blur-md py-3 sm:py-3.5 border-b border-white/30 shadow-[0_4px_20px_rgba(14,40,40,0.08)]'
            : 'bg-[#50b7b5]/70 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-3 lg:gap-4">
          {/* Minimalist Brand Identity */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer shrink-0"
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
          <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-7 2xl:gap-9 mx-auto shrink-0">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="whitespace-nowrap shrink-0 text-xs xl:text-sm uppercase tracking-[0.14em] xl:tracking-[0.18em] text-[#1c3b3a] hover:text-[#165a58] transition-colors cursor-pointer relative py-1 font-semibold group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#53b8b6] to-[#247a78] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-3.5 shrink-0">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="h-10 px-4 xl:px-5 rounded-full text-xs uppercase tracking-[0.16em] font-bold border border-[#53b8b6]/60 hover:border-[#247a78] text-[#165a58] hover:bg-[#d8f4f3] transition-colors cursor-pointer inline-flex items-center justify-center shrink-0 whitespace-nowrap shadow-xs"
                title="Atelier Admin Portal"
              >
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="h-10 px-5 xl:px-7 rounded-full text-xs uppercase tracking-[0.16em] font-bold bg-[#102727] text-white hover:bg-[#1f6361] active:scale-98 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:shadow-teal-900/20 inline-flex items-center justify-center shrink-0 whitespace-nowrap border border-[#53b8b6]/30"
            >
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Actions */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex h-8 px-2.5 sm:px-3 rounded-full text-[10px] uppercase tracking-wider font-semibold border border-[#53b8b6]/60 text-[#165a58] items-center justify-center shrink-0 active:scale-95 transition-all bg-[#e0f6f5]"
              >
                <span>Admin</span>
              </button>
            )}
            <button
              onClick={onOpenBooking}
              className="h-8 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs uppercase tracking-wider font-semibold bg-[#102727] text-white inline-flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-sm"
            >
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 rounded-full border border-transparent hover:border-[#d2edeb] inline-flex items-center justify-center text-[#102727] hover:opacity-80 transition-all cursor-pointer shrink-0"
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
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#50b7b5]/92 backdrop-blur-2xl border-l border-white/50 p-6 sm:p-8 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.35)] z-50 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#d2edeb]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full border border-[#53b8b6] bg-[#e0f6f5] flex items-center justify-center text-[#165a58]">
                    <Gem className="w-3.5 h-3.5 text-[#165a58]" />
                  </div>
                  <div>
                    <span className="font-display-luxury tracking-widest text-xs font-semibold text-[#102727] block leading-none">
                      DIAMOND TRIM
                    </span>
                    <span className="text-[8px] tracking-[0.25em] uppercase text-[#236b69] font-sans block mt-1 leading-none">
                      Beauty &amp; Spa Atelier
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-[#d2edeb] flex items-center justify-center text-[#236b69] hover:text-[#102727] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className="text-left py-2.5 px-3 rounded-lg text-xs uppercase tracking-[0.2em] text-[#1c3b3a] hover:text-[#102727] hover:bg-[#dff3f2] font-semibold transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#d2edeb] space-y-3">
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full h-10 rounded-full text-xs uppercase tracking-[0.18em] font-semibold border border-[#53b8b6] hover:border-[#102727] text-[#165a58] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Staff &amp; Admin Portal</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full h-11 rounded-full text-xs uppercase tracking-[0.18em] font-bold bg-[#102727] text-white hover:bg-[#1f6361] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[11px] text-center text-[#236b69] tracking-wider pt-1">
                {SALON_INFO.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
