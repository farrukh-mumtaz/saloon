import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS, SALON_INFO } from '../data/salonData';
import { ScrollReveal } from './ScrollReveal';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 lg:py-24 bg-[#50b7b5] relative border-b border-white/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#0d2222] bg-white/25 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-3 border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
              Common Inquiries
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-tight mb-3 sm:mb-4">
              Questions, <br />
              <span className="font-serif-editorial italic font-normal text-[#081818]">
                answered
              </span>
              .
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#102e2e] font-normal leading-relaxed">
              Everything you need to know about our private suites, protocols, and advance booking guidelines.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List - Unified Luxury Styling */}
        <div className="space-y-3.5 sm:space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={faq.id} animation="fade-up" delay={index * 50}>
                <div
                  className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white/30 backdrop-blur-xl border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_16px_40px_rgba(10,30,30,0.18)]'
                      : 'bg-white/20 backdrop-blur-lg border border-white/45 hover:bg-white/30 hover:border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_30px_rgba(10,30,30,0.12)]'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-4.5 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm sm:text-base md:text-lg font-playfair-headline transition-colors ${isOpen ? 'text-[#0d2222] font-bold' : 'text-[#0d2222] font-semibold'}`}>
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-[#0d2222] text-white border-[#0d2222] shadow-xs'
                          : 'border-white/50 bg-white/30 text-[#0d2222]'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4.5 sm:px-6 pb-4.5 sm:pb-6 pt-1 text-xs sm:text-sm md:text-base text-[#0d2222] font-medium leading-relaxed border-t border-white/40">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Simple Footnote */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="mt-8 text-center text-sm sm:text-base text-[#102e2e]">
            Still have a question?{' '}
            <a
              href={`https://wa.me/${SALON_INFO.whatsapp}?text=Hello%20Diamond%20Trim%2C%20I%20have%20a%20question.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0d2222] font-bold underline underline-offset-4 hover:text-white transition-colors"
            >
              Chat with concierge on WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
