import React, { useState } from 'react';
import { X, Eye } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/salonData';
import type { GalleryItem } from '../data/salonData';
import { ScrollReveal } from './ScrollReveal';

export const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const tabs = [
    { key: 'all', label: 'All Spaces' },
    { key: 'pods', label: 'VIP Pods' },
    { key: 'hair', label: 'Hair Studio' },
    { key: 'spa', label: 'Private Suites' },
    { key: 'lounge', label: 'Artisanal Lounge' },
    { key: 'results', label: 'Client Results' },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <section id="gallery" className="py-14 sm:py-20 lg:py-24 bg-[#50b7b5] relative border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="max-w-3xl mb-8 sm:mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#0d2222] bg-white/25 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-3 border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
              Visual Tour
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-tight mb-3 sm:mb-4">
              A glimpse <br />
              <span className="font-serif-editorial italic font-normal text-[#081818]">
                inside the spaces
              </span>
              .
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#102e2e] font-normal leading-relaxed max-w-2xl">
              Our spaces, our craft, our quiet little moments of beauty and precision.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 sm:mb-10 scrollbar-none no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center justify-center cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#0d2222] text-white shadow-[0_4px_16px_rgba(13,34,34,0.3)] scale-102'
                    : 'bg-white/20 backdrop-blur-md text-[#0d2222] border border-white/45 hover:bg-white/35 hover:border-white/70 shadow-xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={item.id} animation="zoom-in" delay={(index % 6) * 80}>
              <div
                onClick={() => setLightboxItem(item)}
                className="group relative h-64 xs:h-72 sm:h-80 md:h-84 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-white/18 backdrop-blur-xl border border-white/45 hover:border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_10px_32px_rgba(10,30,30,0.14)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_20px_48px_rgba(10,30,30,0.24)] hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-300" />

                {/* View Icon with Subtle Aqua Accent */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-[#0d2222] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-md">
                  <Eye className="w-4 h-4 text-[#0d2222]" />
                </div>

                {/* Caption */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#80dedb] block mb-1">
                    {item.category.toUpperCase()}
                  </span>
                  <h4 className="text-xl font-playfair-headline font-semibold text-white group-hover:text-[#a8e6e4] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#f0f9f8] line-clamp-1 font-normal mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-[#50b7b5]/85 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-[#0d2222] hover:bg-white flex items-center justify-center cursor-pointer shadow-sm transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              className="w-full max-h-[65vh] object-cover object-center"
            />

            <div className="p-6 bg-white/25 backdrop-blur-md border-t border-white/40">
              <span className="text-[10px] uppercase tracking-widest text-[#0d2222] font-bold block mb-1">
                {lightboxItem.category.toUpperCase()}
              </span>
              <h4 className="text-xl font-playfair-headline font-semibold text-[#0d2222]">
                {lightboxItem.title}
              </h4>
              <p className="text-sm text-[#0d2222] mt-1 font-medium">
                {lightboxItem.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
