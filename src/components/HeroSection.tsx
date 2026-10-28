import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { InteractiveFemaleGaze } from './InteractiveFemaleGaze';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

// Decorative Monstera Leaf Component
const MonsteraLeaf: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style = {},
}) => (
  <svg
    viewBox="0 0 260 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none drop-shadow-2xl select-none ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="monstera-grad" x1="30" y1="20" x2="230" y2="280" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#43a047" />
        <stop offset="50%" stopColor="#2e7d32" />
        <stop offset="100%" stopColor="#1b5e20" />
      </linearGradient>
    </defs>
    {/* Monstera Cutout Silhouette */}
    <path
      d="M130 270 C125 230 115 170 130 30 C140 35 160 45 185 65 C170 75 150 82 135 86 C165 95 205 110 220 140 C195 148 170 140 145 135 C175 155 210 180 215 215 C185 210 165 195 140 180 C155 205 160 235 150 260 C140 265 135 268 130 270 Z"
      fill="url(#monstera-grad)"
    />
    <path
      d="M130 270 C135 230 145 170 130 30 C120 35 100 45 75 65 C90 75 110 82 125 86 C95 95 55 110 40 140 C65 148 90 140 115 135 C85 155 50 180 45 215 C75 210 95 195 120 180 C105 205 100 235 110 260 C120 265 125 268 130 270 Z"
      fill="url(#monstera-grad)"
    />
    {/* Veins */}
    <path d="M130 290 Q128 160 130 25" stroke="#a5d6a7" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    <path d="M130 90 Q160 80 185 70" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M130 90 Q100 80 75 70" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M130 140 Q175 130 210 125" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M130 140 Q85 130 50 125" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Chevron Wave Pattern matching reference image
const ChevronWavePattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 160 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-40 ${className}`}
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <path
        key={i}
        d={`M${i * 32} 8 L${i * 32 + 16} 24 L${i * 32 + 32} 8 L${i * 32 + 48} 24 L${i * 32 + 64} 8`}
        stroke="#1a5554"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </svg>
);

// Dot Matrix Pattern
const DotGrid: React.FC<{ className?: string; rows?: number; cols?: number }> = ({
  className = '',
  rows = 5,
  cols = 8,
}) => (
  <div
    className={`grid gap-2 pointer-events-none select-none ${className}`}
    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
  >
    {Array.from({ length: rows * cols }).map((_, i) => (
      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" />
    ))}
  </div>
);

// Rotated Diamond Accent
const DiamondAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative pointer-events-none select-none ${className}`}>
    <div className="w-6 h-6 rotate-45 border-2 border-white/60 flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-white" />
    </div>
  </div>
);

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreServices,
}) => {
  return (
    <section
      id="hero"
      className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-gradient-to-b from-[#50b7b5] via-[#56bdbb] to-[#50b7b5] min-h-[85vh] sm:min-h-[90vh] flex items-center"
    >
      {/* Outer Canvas Geometric Patterns (matching reference image) */}
      <DotGrid rows={6} cols={8} className="absolute top-8 left-8 hidden sm:grid opacity-75" />
      <DotGrid rows={6} cols={8} className="absolute bottom-6 right-8 hidden sm:grid opacity-75" />
      <DiamondAccent className="absolute top-12 left-28 hidden md:block" />
      <DiamondAccent className="absolute top-10 right-16 hidden md:block" />
      <DiamondAccent className="absolute bottom-16 left-16 hidden md:block" />

      {/* Monstera Leaves Overlapping Canvas */}
      <MonsteraLeaf className="absolute -top-10 -left-8 w-32 xs:w-44 sm:w-64 lg:w-80 rotate-[35deg] z-20" />
      <MonsteraLeaf className="absolute -bottom-12 -right-8 w-36 xs:w-48 sm:w-72 lg:w-96 -rotate-[45deg] z-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Main Viewport Card (Framed Spa Atelier Canvas) */}
        <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-br from-[#5ebcb9] via-[#66c3c1] to-[#5cbab8] border-2 sm:border-[3px] border-[#3d8e8c]/50 shadow-[0_25px_60px_-15px_rgba(16,42,42,0.4)] overflow-hidden">
          
          {/* Subtle Chevron Texture Watermarks in Corners */}
          <ChevronWavePattern className="absolute top-4 right-6 w-44 sm:w-60 hidden sm:block" />
          <ChevronWavePattern className="absolute bottom-6 left-28 w-44 sm:w-60 hidden sm:block" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-0 lg:min-h-[640px] relative">
            
            {/* Left Column: Social Rail (desktop) + Editorial Typography + CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 flex items-stretch">
              
              {/* Vertical Social Rail with Glassmorphism & Working Links */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-5 px-3.5 py-8 bg-white/20 backdrop-blur-xl border-r border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] shrink-0">
                <a
                  href={SALON_INFO.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer"
                  aria-label="Visit our Facebook page"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={SALON_INFO.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer"
                  aria-label="Follow us on X (Twitter)"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={SALON_INFO.socialLinks.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer"
                  aria-label="Discover our Pinterest moodboards"
                  title="Pinterest"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href={SALON_INFO.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 hover:bg-[#0d2222] hover:text-white hover:border-[#0d2222] hover:scale-110 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer"
                  aria-label="Follow us on Instagram"
                  title="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>

              {/* Main Headline Content */}
              <div className="p-5 xs:p-7 sm:p-10 lg:p-12 xl:p-14 flex-1 flex flex-col justify-between">
                
                {/* Brand Logo & Tagline (Lotus / Flower line-art style) */}
                <div className="mb-5 sm:mb-8">
                  <div className="inline-flex items-center gap-2.5">
                    <svg
                      viewBox="0 0 48 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-6 sm:w-9 sm:h-7 text-[#0f2828] stroke-current stroke-[1.8]"
                    >
                      <path d="M24 32 C24 18, 16 8, 4 14 C10 24, 18 30, 24 32 Z" />
                      <path d="M24 32 C24 18, 32 8, 44 14 C38 24, 30 30, 24 32 Z" />
                      <path d="M24 32 C20 18, 20 6, 24 2 C28 6, 28 18, 24 32 Z" />
                    </svg>
                    <div>
                      <span className="font-serif-editorial text-base sm:text-xl font-bold tracking-wider text-[#0e2525] block leading-none">
                        Beauty Salon
                      </span>
                      <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.24em] font-sans font-semibold text-[#184846] block mt-0.5">
                        MAKE UP &amp; HAIRCARE • PRIVATE SUITES
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial Headline */}
                <ScrollReveal animation="fade-right" delay={100} className="space-y-3 sm:space-y-4 max-w-xl">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-[1.08]">
                    House of Allure <br />
                    <span className="font-playfair-headline font-semibold text-[#0d2222]">
                      Beauty &amp; Spa
                    </span>
                  </h1>

                  <p className="text-xs xs:text-sm sm:text-base text-[#123131] font-normal leading-relaxed max-w-md pt-0.5 sm:pt-1">
                    If you're pursuing to relax your body and mind then pass by the spa and select from our private suites and bespoke massage treatments.
                  </p>

                  {/* Buttons matching reference: Crisp outline + sleek dark pill */}
                  <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <button
                      onClick={onExploreServices}
                      className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-none sm:rounded-xs border-2 border-[#0d2222] text-[#0d2222] hover:bg-[#0d2222] hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold cursor-pointer shrink-0 whitespace-nowrap shadow-2xs inline-flex items-center justify-center text-center"
                    >
                      <span>Read More</span>
                    </button>

                    <button
                      onClick={onOpenBooking}
                      className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-none sm:rounded-xs bg-[#0d2222] text-white hover:bg-[#1a4444] transition-all duration-300 uppercase tracking-[0.2em] text-xs font-bold cursor-pointer shrink-0 whitespace-nowrap shadow-md inline-flex items-center justify-center gap-2 text-center"
                    >
                      <span>Book Suite</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#53b8b6]" />
                    </button>
                  </div>
                </ScrollReveal>

                {/* Mobile-only horizontal social link row */}
                <div className="mt-6 flex sm:hidden items-center gap-2">
                    <a
                      href={SALON_INFO.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      aria-label="Facebook"
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      aria-label="X (Twitter)"
                      title="X"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={SALON_INFO.socialLinks.pinterest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      aria-label="Pinterest"
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#0d2222] bg-white/25 backdrop-blur-sm border border-white/50 active:scale-95 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      aria-label="Instagram"
                      title="Instagram"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>

              </div>
            </div>

            {/* Right Column: Circular Aura + Model Portrait */}
            <div className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center p-4 xs:p-6 sm:p-8 lg:p-4">
              
              {/* Luminous Soft-Mint Circular Halo (Matching the arch behind the model) */}
              <div className="absolute w-[240px] xs:w-[280px] sm:w-[380px] lg:w-[480px] h-[240px] xs:h-[280px] sm:h-[380px] lg:h-[480px] rounded-full bg-gradient-to-tr from-[#98d7d5] via-[#aee3e1] to-[#caeeed] shadow-inner -z-0 opacity-95" />

              {/* Portrait Container */}
              <div className="relative z-10 w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[380px] lg:max-w-[460px] h-[340px] xs:h-[390px] sm:h-[480px] lg:h-[540px] flex items-center justify-center">
                <InteractiveFemaleGaze
                  className="w-full h-full"
                  blendWithBackground={true}
                />
              </div>

              {/* Overlapping Floating Monstera Leaf on Right Edge */}
              <MonsteraLeaf className="absolute -bottom-6 -right-4 w-28 xs:w-36 sm:w-52 lg:w-64 rotate-[15deg] z-20 pointer-events-none" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};