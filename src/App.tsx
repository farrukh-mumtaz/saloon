import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingModal } from './components/BookingModal';
import { FloatingActions } from './components/FloatingActions';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LuxuryCursor } from './components/LuxuryCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import type { ServiceItem } from './data/salonData';

export function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('admin') === 'true' || window.location.hash === '#admin';
    }
    return false;
  });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [selectedSpecialistForBooking, setSelectedSpecialistForBooking] = useState<string | undefined>(undefined);
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdminView(isHashAdmin);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdminView = () => {
    setIsAdminView(true);
    window.location.hash = 'admin';
  };

  const closeAdminView = () => {
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (serviceId?: string, specialistId?: string) => {
    setSelectedServiceForBooking(serviceId);
    setSelectedSpecialistForBooking(specialistId);
    setBookingModalOpen(true);
  };

  // If Admin View is active, render the comprehensive Atelier Management Portal
  if (isAdminView) {
    return (
      <>
        <LuxuryCursor />
        <AdminDashboard onExit={closeAdminView} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#50b7b5] text-[#0d2222] font-sans selection:bg-[#0d2222] selection:text-white">
      {/* Luxury Fluid Diamond Halo & Click Sparkle Trail */}
      <LuxuryCursor />

      {/* Top Scroll-driven Progress Indicator */}
      <ScrollProgressBar />

      {/* 1. Header & Navigation */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onNavigate={scrollToSection}
        onOpenAdmin={openAdminView}
      />

      <main>
        {/* 2. Hero Section: "You matter. Beauty & Grooming, in private." */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => scrollToSection('services')}
        />

        {/* 3. Services Menu: "Everything you need to feel beautiful & immaculate." */}
        <ServicesSection
          onSelectService={(service) => setActiveDetailService(service)}
          onBookService={(serviceId) => handleOpenBooking(serviceId)}
        />

        {/* 5. What Makes Us Different: Integrated comparison and 4 pillars */}
        <WhyChooseUs />

        {/* 6. VIP Gallery Tour */}
        <GallerySection />

        {/* 7. Client Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* 8. Questions, answered (FAQ Accordion) */}
        <FAQSection />

        {/* 9. Contact Section: "Let's plan your Diamond Trim moment." */}
        <ContactSection />
      </main>

      {/* 10. Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenAdmin={openAdminView}
      />

      {/* 11. Minimalist Floating Concierge Icon */}
      <FloatingActions />

      {/* 12. Floating Admin Portal Access Pill (Bottom Left) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={openAdminView}
          className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#102727] text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold border border-[#53b8b6]/40 shadow-xl hover:bg-[#1a4444] hover:border-[#53b8b6] transition-all flex items-center gap-2 sm:gap-2.5 cursor-pointer group hover:scale-105 active:scale-95"
          title="Open Salon Admin Operations Portal"
        >
          <span className="w-2 h-2 rounded-full bg-[#53b8b6] animate-pulse" />
          <span>Admin<span className="hidden xs:inline"> Portal</span></span>
        </button>
      </div>

      {/* 13. Service Detail Modal */}
      <ServiceDetailModal
        service={activeDetailService}
        onClose={() => setActiveDetailService(null)}
        onBookService={(serviceId, specialistId) => {
          setActiveDetailService(null);
          handleOpenBooking(serviceId, specialistId);
        }}
      />

      {/* 14. Comprehensive Booking & Reservation Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preSelectedServiceId={selectedServiceForBooking}
        preSelectedSpecialistId={selectedSpecialistForBooking}
      />
    </div>
  );
}

export default App;
