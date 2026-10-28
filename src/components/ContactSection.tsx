import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';
import { SALON_INFO, type ServiceItem } from '../data/salonData';
import { createNewInquiry, getStoredServices } from '../services/adminStorage';
import { ScrollReveal } from './ScrollReveal';

export const ContactSection: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewInquiry({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service || 'General Concierge Inquiry',
      notes: formData.notes,
      status: 'new',
    });
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-24 bg-[#50b7b5] border-t border-white/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Title */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="max-w-3xl mb-10 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#0d2222] bg-white/25 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-3 border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
              Atelier Contact
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-playfair-headline font-bold text-[#0d2222] tracking-tight leading-tight mb-3 sm:mb-4">
              Let's plan your <br />
              <span className="font-serif-editorial italic font-normal text-[#081818]">
                Diamond Trim
              </span>{' '}
              moment.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#102e2e] font-normal leading-relaxed">
              Send us an inquiry. Our concierge coordinates your timing, specialist preferences, and private suite preparation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Details Directory */}
          <ScrollReveal animation="fade-right" delay={100} className="lg:col-span-5 w-full">
            <div className="space-y-4 sm:space-y-6">
              <div className="p-5 sm:p-7 rounded-2xl bg-white/22 backdrop-blur-xl border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_32px_rgba(10,30,30,0.14)] hover:bg-white/32 hover:border-white/80 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_48px_rgba(10,30,30,0.22)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-3.5 sm:gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center shrink-0 text-[#0d2222] shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold mb-1">
                    Location
                  </h4>
                  <p className="text-base font-bold text-[#0d2222]">
                    {SALON_INFO.address}
                  </p>
                  <p className="text-sm text-[#0d2222]/80 mt-1 font-medium">
                    {SALON_INFO.city} • Private Elevator &amp; Valet Parking
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-7 rounded-2xl bg-white/22 backdrop-blur-xl border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_32px_rgba(10,30,30,0.14)] hover:bg-white/32 hover:border-white/80 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_48px_rgba(10,30,30,0.22)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center shrink-0 text-[#0d2222] shadow-2xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold mb-1">
                    Telephone &amp; WhatsApp
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-[#0d2222]">
                    {SALON_INFO.phone}
                  </p>
                  <p className="text-xs sm:text-sm text-[#0d2222]/80 mt-1 font-medium">
                    Direct concierge available during atelier hours
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-7 rounded-2xl bg-white/22 backdrop-blur-xl border border-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_32px_rgba(10,30,30,0.14)] hover:bg-white/32 hover:border-white/80 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_48px_rgba(10,30,30,0.22)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center shrink-0 text-[#0d2222] shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm text-[#0d2222] w-full">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#0d2222] font-bold mb-2">
                    Atelier Hours
                  </h4>
                  <div className="flex justify-between py-1 border-b border-white/40 font-medium">
                    <span className="font-bold text-[#0d2222]">Monday – Friday</span>
                    <span>9:00 AM – 9:00 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/40 font-medium">
                    <span className="font-bold text-[#0d2222]">Saturday</span>
                    <span>10:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span className="font-bold text-[#0d2222]">Sunday</span>
                    <span>11:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Minimalist Inquiry Form - Bespoke Editorial */}
          <ScrollReveal animation="fade-left" delay={150} className="lg:col-span-7 w-full">
            <div className="p-5 xs:p-7 sm:p-10 rounded-2xl sm:rounded-3xl bg-white/25 backdrop-blur-2xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_50px_rgba(10,30,30,0.18)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm text-[#0d2222] border border-white/50 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-playfair-headline font-bold text-[#0d2222]">
                    Inquiry Received, {formData.name || 'Guest'}
                  </h3>
                  <p className="text-base text-[#0d2222] max-w-sm mx-auto font-medium leading-relaxed">
                    Our atelier concierge has received your request and will contact you promptly to finalize your private suite reservation.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', service: '', notes: '' });
                    }}
                    className="mt-4 px-7 py-3 rounded-full text-xs uppercase tracking-wider text-[#0d2222] hover:text-white hover:bg-[#0d2222] border border-white/50 font-bold shrink-0 whitespace-nowrap inline-flex items-center justify-center transition-all cursor-pointer bg-white/20"
                  >
                    <span>Send Another Note</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-playfair-headline font-bold text-[#0d2222] mb-1">
                    Direct Atelier Inquiry
                  </h3>
                  <p className="text-sm text-[#0d2222] font-medium mb-5">
                    Please leave your details below and our team will get back to you promptly.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] placeholder:text-[#0d2222]/60 focus:bg-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] placeholder:text-[#0d2222]/60 focus:bg-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] placeholder:text-[#0d2222]/60 focus:bg-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                        Desired Service
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] focus:bg-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors shadow-2xs"
                      >
                        <option value="" className="bg-[#50b7b5] text-[#0d2222]">Select a treatment...</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.name} className="bg-[#50b7b5] text-[#0d2222]">
                            {s.name} ({s.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                      Notes or Timing Preferences
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Preferred date/time or specific requests..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] placeholder:text-[#0d2222]/60 focus:bg-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full text-xs sm:text-sm uppercase tracking-[0.16em] font-semibold bg-[#0d2222] text-white hover:bg-[#1a4444] hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 whitespace-nowrap border border-white/30"
                    >
                      <Send className="w-4 h-4 text-[#50b7b5]" />
                      <span>Send Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
