import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../data/salonData';
import { ScrollReveal } from './ScrollReveal';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-14 sm:py-20 lg:py-24 bg-[#50b7b5] border-y border-white/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#0d2222] bg-white/25 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-3 border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
              Guest Reflections
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-tight mb-3 sm:mb-4">
              Loved By <br />
              <span className="font-serif-editorial italic font-normal text-[#081818]">
                Our Clients
              </span>
              .
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#102e2e] font-normal leading-relaxed">
              Read firsthand accounts from guests who value personal privacy, attentive hospitality, and precision care.
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Review Card - Editorial Spotlight */}
        <ScrollReveal animation="zoom-in" delay={120}>
          <div className="max-w-4xl mx-auto mb-10 sm:mb-14">
            <div className="p-5 xs:p-7 sm:p-10 lg:p-14 rounded-2xl sm:rounded-3xl bg-white/25 backdrop-blur-2xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_50px_rgba(10,30,30,0.18)] space-y-5 sm:space-y-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 sm:gap-1.5 text-[#0d2222]">
                  {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#0d2222] text-[#0d2222]" />
                  ))}
                </div>

                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#0d2222] font-bold bg-white/30 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full border border-white/50 shadow-2xs">
                  {TESTIMONIALS[currentIndex].date}
                </span>
              </div>

              <blockquote className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-serif-editorial italic text-[#0d2222] leading-relaxed">
                "{TESTIMONIALS[currentIndex].text}"
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-white/40">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={TESTIMONIALS[currentIndex].avatar}
                    alt={TESTIMONIALS[currentIndex].name}
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border border-white/60 shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0d2222]">
                      {TESTIMONIALS[currentIndex].name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#0d2222]/80 font-medium">
                      {TESTIMONIALS[currentIndex].service}
                    </p>
                  </div>
                </div>

                {/* Minimalist Prev/Next Arrow Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/50 bg-white/25 backdrop-blur-md text-[#0d2222] hover:border-[#0d2222] hover:bg-[#0d2222] hover:text-white inline-flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0 whitespace-nowrap active:scale-95"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/50 bg-white/25 backdrop-blur-md text-[#0d2222] hover:border-[#0d2222] hover:bg-[#0d2222] hover:text-white inline-flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0 whitespace-nowrap active:scale-95"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Grid Reviews - Unified Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.slice(0, 3).map((item, idx) => (
            <ScrollReveal key={item.id} animation="fade-up" delay={idx * 100} className="h-full">
              <div
                className="p-7 rounded-2xl bg-white/22 backdrop-blur-xl border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_32px_rgba(10,30,30,0.14)] hover:bg-white/32 hover:border-white/80 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_48px_rgba(10,30,30,0.22)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 h-full"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1 text-[#0d2222]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#0d2222] text-[#0d2222]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#0d2222] font-medium leading-relaxed line-clamp-4">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/40 flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/60 shadow-2xs"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-[#0d2222]">
                      {item.name}
                    </h5>
                    <p className="text-xs text-[#0d2222]/80 font-medium">
                      {item.service}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
