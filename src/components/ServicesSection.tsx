import React, { useState, useEffect } from 'react';
import { Clock, Search, ArrowRight } from 'lucide-react';
import type { ServiceItem } from '../data/salonData';
import { getStoredServices } from '../services/adminStorage';
import { ScrollReveal } from './ScrollReveal';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (serviceId: string) => void;
}

type CategoryType = 'all' | 'nails' | 'hair' | 'grooming' | 'skin' | 'body' | 'lashes';

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onBookService,
}) => {
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setServices(getStoredServices());
    };
    window.addEventListener('diamond_trim_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('diamond_trim_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const categories: { key: CategoryType; label: string }[] = [
    { key: 'all', label: 'All Treatments' },
    { key: 'nails', label: 'Nails & Podology' },
    { key: 'hair', label: 'Hair Artistry' },
    { key: 'grooming', label: 'Grooming & Shave' },
    { key: 'skin', label: 'Facials & Skin' },
    { key: 'body', label: 'Body & Massage' },
    { key: 'lashes', label: 'Lashes & Brows' },
  ];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="services" className="py-14 sm:py-20 lg:py-24 bg-[#50b7b5] relative border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" delay={50} className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#0d2222] bg-white/25 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-3 border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
            Treatment Menu
          </span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-tight mb-3 sm:mb-4">
            Everything you need to feel <br />
            <span className="font-serif-editorial italic font-normal text-[#081818]">
              beautiful &amp; immaculate
            </span>
            .
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#102e2e] font-normal leading-relaxed max-w-2xl">
            A curated menu of beauty and grooming services — every treatment delivered with absolute privacy, precision, and clinical care.
          </p>
        </ScrollReveal>

        {/* Filter Bar & Search */}
        <ScrollReveal animation="fade-up" delay={100} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-white/20">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.14em] font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center justify-center cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#0d2222] text-white shadow-md scale-102'
                    : 'bg-white/20 backdrop-blur-md text-[#0d2222] border border-white/45 hover:bg-white/35 hover:text-[#051414] shadow-xs'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-[#0d2222] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] placeholder-[#102e2e]/70 focus:outline-none focus:border-white focus:bg-white/40 transition-colors shadow-xs"
            />
          </div>
        </ScrollReveal>

        {/* Services Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {filteredServices.map((service, idx) => (
            <ScrollReveal
              key={service.id}
              animation="fade-up"
              delay={(idx % 6) * 80}
              className="h-full"
            >
              <div
                className="group rounded-3xl bg-white/20 backdrop-blur-xl border border-white/45 hover:bg-white/32 hover:border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_32px_rgba(10,30,30,0.14)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_48px_rgba(10,30,30,0.22)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
              >
                {/* Card Image */}
                <div
                  onClick={() => onSelectService(service)}
                  className="relative h-60 w-full overflow-hidden bg-white/20 cursor-pointer"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-55 transition-opacity" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full bg-white/30 backdrop-blur-md text-[#0d2222] border border-white/50 shadow-xs">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs uppercase tracking-wider text-[#123635] flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#0d2222]" />
                        {service.duration}
                      </span>
                      <span className="font-playfair-headline font-bold text-2xl text-[#0d2222]">
                        {service.price}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectService(service)}
                      className="text-xl font-playfair-headline font-semibold text-[#0d2222] group-hover:text-black transition-colors cursor-pointer leading-snug"
                    >
                      {service.name}
                    </h3>

                    <p className="text-sm text-[#0d2222] font-medium leading-relaxed mt-2.5 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Clean, Single Action Row */}
                  <div className="pt-4 border-t border-white/40 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectService(service)}
                      className="text-xs uppercase tracking-[0.14em] text-[#0d2222] hover:text-black transition-colors cursor-pointer font-bold shrink-0 whitespace-nowrap"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onBookService(service.id)}
                      className="px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.14em] font-semibold bg-[#0d2222] text-white hover:bg-[#1a4444] hover:shadow-md transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0 whitespace-nowrap border border-white/30"
                    >
                      <span>Book Suite</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#50b7b5]" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white/25 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <p className="text-sm text-[#7a766c] mb-4">
              No services found matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#0d2222] text-white hover:bg-[#1a4444] transition-colors shrink-0 whitespace-nowrap inline-flex items-center justify-center cursor-pointer shadow-xs border border-white/30"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
