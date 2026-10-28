import React, { useState } from 'react';
import { Gem, ArrowUp, Check } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { ScrollReveal } from './ScrollReveal';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#50b7b5] border-t border-white/20 text-[#0d2222] pt-12 sm:pt-16 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/20">
            {/* Brand Philosophy */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full border border-white/60 bg-white/90 flex items-center justify-center">
                  <Gem className="w-4 h-4 text-[#0d2222]" />
                </div>
                <span className="font-display-luxury text-base sm:text-lg tracking-[0.2em] font-semibold text-[#0d2222]">
                  DIAMOND TRIM
                </span>
              </div>

              <p className="text-sm text-[#102e2e] font-normal leading-relaxed max-w-sm">
                A private luxury beauty &amp; spa atelier built on one idea — you matter. Uncompromising acoustic privacy, clinical hygiene standards, and exceptional value on every visit.
              </p>

              <p className="text-sm text-[#0d2222] font-semibold">
                {SALON_INFO.address}, {SALON_INFO.city}
              </p>

              {/* Social Channels */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href={SALON_INFO.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-md border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                  aria-label="Visit our Facebook page"
                  title="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={SALON_INFO.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-md border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                  aria-label="Follow us on X (Twitter)"
                  title="X (Twitter)"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={SALON_INFO.socialLinks.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-md border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                  aria-label="Discover our Pinterest moodboards"
                  title="Pinterest"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href={SALON_INFO.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-md border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                  aria-label="Follow us on Instagram"
                  title="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#0d2222]">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-[#102e2e]">
                <li>
                  <button
                    onClick={() => onNavigate('hero')}
                    className="hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('services')}
                    className="hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Treatment Menu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('why-us')}
                    className="hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Why Diamond Trim
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('gallery')}
                    className="hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Visual Tour
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('testimonials')}
                    className="hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Guest Reviews
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-white transition-colors cursor-pointer font-semibold"
                  >
                    Contact Concierge
                  </button>
                </li>
              </ul>
            </div>

            {/* Treatments */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#0d2222]">
                Featured Offerings
              </h4>
              <ul className="space-y-2.5 text-sm text-[#102e2e]">
                <li>Russian E-File Manicure &amp; Pod</li>
                <li>Clinical Podology Pedicure</li>
                <li>French Balayage &amp; Glaze Melt</li>
                <li>The Royal Diamond Beard Sculpt</li>
                <li>Diamond Micro-Infusion Facial</li>
                <li>Body Contouring Maderotherapy</li>
              </ul>
            </div>

            {/* Minimalist Newsletter */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#0d2222]">
                Private Guestlist
              </h4>
              <p className="text-sm text-[#102e2e] font-normal">
                Receive seasonal private suite invitations and priority booking notices.
              </p>

              {subscribed ? (
                <div className="p-3.5 rounded-xl bg-white/25 backdrop-blur-md text-sm text-[#0d2222] border border-white/50 flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-bold">
                  <Check className="w-4 h-4 text-[#0d2222]" />
                  <span>You are on our private guestlist.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col xs:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:border-white focus:bg-white/40 transition-colors shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0d2222] text-white text-xs sm:text-sm uppercase tracking-wider font-bold hover:bg-[#1a4444] hover:shadow-md transition-all shrink-0 whitespace-nowrap inline-flex items-center justify-center cursor-pointer shadow-xs border border-white/30 text-center"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Footer Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#102e2e] text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {SALON_INFO.name} Atelier. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[#0d2222] hover:text-white transition-colors cursor-pointer font-bold inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <span>Staff &amp; Admin Portal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center justify-center gap-1.5 text-[#0d2222] hover:text-white transition-colors cursor-pointer font-bold shrink-0 whitespace-nowrap"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
