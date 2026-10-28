import React, { useMemo } from 'react';
import { X, Clock, Check, ShieldCheck, ArrowRight, Star, Heart, Sparkles } from 'lucide-react';
import type { ServiceItem } from '../data/salonData';
import { getSpecialistsForService } from '../services/adminStorage';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (serviceId: string, specialistId?: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
}) => {
  const specialists = useMemo(() => {
    if (!service) return [];
    return getSpecialistsForService(service.id, service.category);
  }, [service]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-[#50b7b5]/90 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-[#0d2222] hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-white/20">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

          <div className="absolute bottom-4 left-6 right-14 text-white">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#80dedb] block mb-1">
              {service.category.toUpperCase()} • PRIVATE VIP SUITE
            </span>
            <h3 className="text-xl sm:text-2xl font-playfair-headline font-semibold text-white leading-tight">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Price and Duration Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <div className="flex items-center gap-2 text-xs text-[#0d2222] font-semibold">
              <Clock className="w-4 h-4 text-[#0d2222]" />
              <span>Session Duration: <strong className="text-[#0d2222]">{service.duration}</strong></span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#0d2222]/80 block font-bold">Fixed Treatment Rate</span>
              <span className="text-xl font-playfair-headline font-bold text-[#0d2222]">{service.price}</span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold mb-2 flex items-center gap-1.5">
              <span>Treatment Description</span>
            </h4>
            <p className="text-sm sm:text-base text-[#0d2222] leading-relaxed font-medium">
              {service.description} Performed in our acoustic VIP pods or private suites with bespoke refreshments and dedicated practitioner attention.
            </p>
          </div>

          {/* Certified Specialists Providing This Service */}
          {specialists.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-[#0d2222] text-[#0d2222]" />
                  <span>Available Certified Specialists ({specialists.length})</span>
                </h4>
                <span className="text-xs text-[#0d2222] font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0d2222]" />
                  Select your artisan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialists.map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => {
                      onClose();
                      onBookService(service.id, spec.id);
                    }}
                    className="p-3.5 rounded-2xl bg-white/25 backdrop-blur-md hover:bg-white/40 border border-white/50 hover:border-white hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                    title={`Book ${service.name} with ${spec.name}`}
                  >
                    <img
                      src={spec.avatar}
                      alt={spec.name}
                      className="w-11 h-11 rounded-xl object-cover border border-white/60 shrink-0 group-hover:border-white transition-colors"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0d2222] group-hover:text-black transition-colors truncate">
                          {spec.name}
                        </span>
                        {spec.badge && (
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-[#0d2222] text-white px-2 py-0.5 rounded-full shrink-0">
                            {spec.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#0d2222]/80 font-medium truncate mt-0.5">
                        {spec.role}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#0d2222] font-bold mt-1">
                        <Star className="w-3.5 h-3.5 fill-[#0d2222] text-[#0d2222]" />
                        <span>{spec.rating}</span>
                        {spec.reviewCount && (
                          <span className="text-[#0d2222]/70 font-normal">({spec.reviewCount})</span>
                        )}
                        <span className="text-white/60 mx-0.5">•</span>
                        <span className="text-[#0d2222] font-bold">Book Chair →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included In Your Visit */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold mb-2">
                Included In Your Experience
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                  >
                    <Check className="w-4 h-4 text-[#0d2222] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Autoclave commitment */}
          <div className="p-4 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 flex items-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <ShieldCheck className="w-5 h-5 text-[#0d2222] shrink-0" />
            <p className="text-xs sm:text-sm text-[#0d2222] leading-relaxed font-medium">
              Medical Class-B autoclave sterilization protocol. Sealed surgical pouches opened exclusively in your presence.
            </p>
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:px-6 bg-white/30 backdrop-blur-md border-t border-white/40 shrink-0 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#236b69] block font-semibold">Session Rate</span>
            <span className="text-xl font-playfair-headline font-bold text-[#102727]">{service.price}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookService(service.id);
            }}
            className="flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm uppercase tracking-[0.16em] font-bold bg-[#102727] text-white hover:bg-[#1a4444] hover:shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 shrink-0 whitespace-nowrap border border-[#53b8b6]/30"
          >
            <span>Reserve Appointment</span>
            <ArrowRight className="w-4 h-4 text-[#53b8b6]" />
          </button>
        </div>
      </div>
    </div>
  );
};
