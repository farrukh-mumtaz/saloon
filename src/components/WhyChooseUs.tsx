import React from 'react';
import { ShieldCheck, Gem, Clock, Coffee, Check, X } from 'lucide-react';
import { DIFFERENTIATORS } from '../data/salonData';
import { ScrollReveal } from './ScrollReveal';

export const WhyChooseUs: React.FC = () => {
  const iconMap: Record<string, any> = {
    ShieldCheck,
    Gem,
    Clock,
    Coffee,
  };

  const comparisonData = [
    {
      feature: 'Privacy & Environment',
      ordinary: 'Open noisy hall, chatter & hair dryers',
      diamond: 'Acoustic VIP pods & sound-dampened suites',
    },
    {
      feature: 'Hygiene Standard',
      ordinary: 'Quick chemical wipe or barbicide jar',
      diamond: 'Class-B hospital autoclave steam sterilization',
    },
    {
      feature: 'Time & Attention',
      ordinary: 'Double-booked chairs & rushed stylists',
      diamond: 'Strict 1:1 dedicated artisan with generous buffer',
    },
    {
      feature: 'Beverage Ritual',
      ordinary: 'Paper cups or water cooler',
      diamond: 'Ceremonial matcha, espresso & iced botanicals',
    },
    {
      feature: 'Consultation',
      ordinary: 'Brief 60-second chat while washing',
      diamond: 'Thorough strand & skin analysis before starting',
    },
  ];

  return (
    <section id="why-us" className="py-14 sm:py-20 lg:py-24 bg-[#50b7b5] border-y border-white/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="max-w-3xl mb-10 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#0d2222] bg-white/25 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-3 border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
              What Makes Us Different
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-tight mb-3 sm:mb-4">
              Quiet luxury, <br />
              <span className="font-serif-editorial italic font-normal text-[#081818]">
                elevated in every detail
              </span>
              .
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#102e2e] font-normal leading-relaxed max-w-2xl">
              We intentionally eliminated the chaos, rush, and noise of traditional high-street salons to build a sanctuary of personal dignity.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Pillars Grid - Unified Luxury Editorial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {DIFFERENTIATORS.map((diff, index) => {
            const Icon = iconMap[diff.icon] || Gem;
            return (
              <ScrollReveal key={diff.id} animation="fade-up" delay={index * 100} className="h-full">
                <div
                  className="p-5 sm:p-7 rounded-2xl bg-white/22 backdrop-blur-xl border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_32px_rgba(10,30,30,0.14)] hover:bg-white/32 hover:border-white/80 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_48px_rgba(10,30,30,0.22)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-5 h-full"
                >
                  <div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/30 backdrop-blur-sm text-[#0d2222] border border-white/50 flex items-center justify-center mb-4 sm:mb-5 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold block mb-1">
                      0{index + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-playfair-headline font-semibold text-[#0d2222] mb-1.5 sm:mb-2">
                      {diff.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0d2222] font-medium leading-relaxed">
                      {diff.description}
                    </p>
                  </div>

                  <div className="pt-3.5 sm:pt-4 border-t border-white/40 flex items-center gap-2 text-xs text-[#0d2222] font-bold">
                    <Check className="w-3.5 h-3.5 text-[#0d2222]" />
                    <span>Guaranteed Atelier Standard</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Clean, Integrated Comparison Table - Architectural Ledger */}
        <ScrollReveal animation="fade-up" delay={180}>
          <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white/22 backdrop-blur-xl border border-white/45 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_16px_48px_rgba(10,30,30,0.16)]">
            <div className="hidden sm:grid grid-cols-12 p-4 sm:p-5 bg-white/30 backdrop-blur-md border-b border-white/40 text-xs sm:text-sm uppercase tracking-wider font-bold">
              <div className="col-span-4 text-[#0d2222]">Experience Factor</div>
              <div className="col-span-4 text-[#0d2222]/80">Standard High-Street Salon</div>
              <div className="col-span-4 text-[#0d2222] font-bold flex items-center gap-2">
                <span>Diamond Trim Atelier</span>
                <span className="w-2 h-2 rounded-full bg-[#0d2222]" />
              </div>
            </div>

            <div className="divide-y divide-white/40">
              {comparisonData.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:p-5 items-start sm:items-center gap-2.5 sm:gap-3 hover:bg-white/20 transition-colors"
                >
                  <div className="sm:col-span-4 font-bold text-sm sm:text-base text-[#0d2222]">
                    {row.feature}
                  </div>
                  <div className="sm:col-span-4 text-[#0d2222]/80 flex items-start sm:items-center gap-2 text-xs sm:text-sm font-medium">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-white/20 text-[#0d2222] flex items-center justify-center shrink-0 border border-white/45 mt-0.5 sm:mt-0">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </span>
                    <span>
                      <strong className="sm:hidden font-semibold text-[#0d2222]/90 block text-[11px] uppercase tracking-wider">Standard:</strong>
                      {row.ordinary}
                    </span>
                  </div>
                  <div className="sm:col-span-4 text-[#0d2222] flex items-start sm:items-center gap-2 font-bold text-xs sm:text-sm">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-white/35 text-[#0d2222] flex items-center justify-center shrink-0 border border-white/60 shadow-2xs mt-0.5 sm:mt-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </span>
                    <span>
                      <strong className="sm:hidden font-bold text-[#0d2222] block text-[11px] uppercase tracking-wider">Diamond Trim:</strong>
                      {row.diamond}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
