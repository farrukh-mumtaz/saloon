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
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { PromotionsModal } from './components/PromotionsModal';
import { SaaSModal } from './components/SaaSModal';
import { FloatingActions } from './components/FloatingActions';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LuxuryCursor } from './components/LuxuryCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { LocalizationProvider } from './context/LocalizationContext';
import { getCurrentUser } from './services/customerStorage';
import type { CustomerUser } from './types/customer';
import type { ServiceItem } from './data/salonData';
import { Building2 } from 'lucide-react';

function AppContent() {
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('admin') === 'true' || window.location.hash === '#admin';
    }
    return false;
  });

  // Customer Account & Auth State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Promotions & SaaS B2B State
  const [promotionsModalOpen, setPromotionsModalOpen] = useState(false);
  const [saasModalOpen, setSaaSModalOpen] = useState(false);
  const [selectedCouponForBooking, setSelectedCouponForBooking] = useState<string | undefined>(undefined);

  // Booking & Service Detail State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  const [selectedSpecialistForBooking, setSelectedSpecialistForBooking] = useState<string | undefined>(undefined);
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);

  // Keep customer session in sync with localStorage events
  useEffect(() => {
    const handleCustomerChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('diamond_trim_customer_change', handleCustomerChange);
    window.addEventListener('storage', handleCustomerChange);
    return () => {
      window.removeEventListener('diamond_trim_customer_change', handleCustomerChange);
      window.removeEventListener('storage', handleCustomerChange);
    };
  }, []);

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

  const handleOpenBooking = (serviceId?: string, specialistId?: string, couponCode?: string) => {
    setSelectedServiceForBooking(serviceId);
    setSelectedSpecialistForBooking(specialistId);
    if (couponCode) {
      setSelectedCouponForBooking(couponCode);
    }
    setBookingModalOpen(true);
  };

  const handleSelectCouponForBooking = (couponCode: string) => {
    setSelectedCouponForBooking(couponCode);
    setBookingModalOpen(true);
  };

  // If Admin View is active, render the Atelier Management Portal
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
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAccount={() => setAccountModalOpen(true)}
        onOpenPromotions={() => setPromotionsModalOpen(true)}
        onOpenSaaS={() => setSaaSModalOpen(true)}
        currentUser={currentUser}
      />

      <main>
        {/* 2. Hero Section: Editorial Luxury Headline + Responsive Interactive Model */}
        <HeroSection
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => scrollToSection('services')}
          onOpenPromotions={() => setPromotionsModalOpen(true)}
          onOpenSaaS={() => setSaaSModalOpen(true)}
        />

        {/* 3. Services Menu: Multi-Currency Converted Treatment Cards */}
        <ServicesSection
          onSelectService={(service) => setActiveDetailService(service)}
          onBookService={(serviceId) => handleOpenBooking(serviceId)}
        />

        {/* 4. What Makes Us Different: Integrated comparison and 4 pillars */}
        <WhyChooseUs />

        {/* 5. VIP Gallery Tour */}
        <GallerySection />

        {/* 6. Client Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* 7. Questions, answered (FAQ Accordion) */}
        <FAQSection />

        {/* 8. Contact Section */}
        <ContactSection />
      </main>

      {/* 9. Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenAdmin={openAdminView}
      />

      {/* 10. Minimalist Floating Concierge Icon */}
      <FloatingActions />

      {/* 11. Floating Quick Access Pills (Bottom Left) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col gap-2">
        {/* Admin Portal Button */}
        <button
          onClick={openAdminView}
          className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#102727] text-white text-[11px] sm:text-xs uppercase tracking-wider font-semibold border border-[#53b8b6]/40 shadow-xl hover:bg-[#1a4444] hover:border-[#53b8b6] transition-all flex items-center gap-2 sm:gap-2.5 cursor-pointer group hover:scale-105 active:scale-95"
          title="Open Salon Admin Operations Portal"
        >
          <span className="w-2 h-2 rounded-full bg-[#53b8b6] animate-pulse" />
          <span>Admin<span className="hidden xs:inline"> Portal</span></span>
        </button>

        {/* B2B SaaS Platform Button */}
        <button
          onClick={() => setSaaSModalOpen(true)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/40 backdrop-blur-md text-[#0d2222] text-[10px] sm:text-[11px] uppercase tracking-wider font-bold border border-white/60 shadow-lg hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          title="Sell This Salon Site to Companies on a Monthly Basis (SaaS)"
        >
          <Building2 className="w-3.5 h-3.5 text-[#165a58]" />
          <span>Salon SaaS Plans</span>
        </button>
      </div>

      {/* 12. Service Detail Modal */}
      <ServiceDetailModal
        service={activeDetailService}
        onClose={() => setActiveDetailService(null)}
        onBookService={(serviceId, specialistId) => {
          setActiveDetailService(null);
          handleOpenBooking(serviceId, specialistId);
        }}
      />

      {/* 13. Comprehensive Booking & Reservation Modal with Coupon Redemption */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedCouponForBooking(undefined);
        }}
        preSelectedServiceId={selectedServiceForBooking}
        preSelectedSpecialistId={selectedSpecialistForBooking}
        preSelectedCouponCode={selectedCouponForBooking}
      />

      {/* 14. Customer Authentication Modal (Login / Register) */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />

      {/* 15. Customer VIP Portal & Account Modal */}
      <CustomerAccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
        onLogout={() => setCurrentUser(null)}
      />

      {/* 16. Promotions & Coupons Voucher Modal */}
      <PromotionsModal
        isOpen={promotionsModalOpen}
        onClose={() => setPromotionsModalOpen(false)}
        onSelectCouponForBooking={handleSelectCouponForBooking}
      />

      {/* 17. Salon-as-a-Service B2B Subscription Modal */}
      <SaaSModal
        isOpen={saasModalOpen}
        onClose={() => setSaaSModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
}

export default App;
