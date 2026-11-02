import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  User,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  Sparkles,
  Check,
  Heart,
  Ticket,
  Tag,
} from 'lucide-react';
import type { ServiceItem } from '../data/salonData';
import {
  createNewAppointment,
  getSpecialistsForService,
  getSpecialistBookedSlots,
  getStoredServices,
} from '../services/adminStorage';
import {
  validateCoupon,
  redeemCouponUsage,
} from '../services/couponStorage';
import {
  getCurrentUser,
  recordCustomerBooking,
  recordCustomerCouponRedemption,
} from '../services/customerStorage';
import { useLocalization } from '../context/LocalizationContext';
import { parsePriceUSD } from '../services/localization';
import type { SpecialistItem } from '../types/admin';
import type { CouponItem } from '../types/coupon';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
  preSelectedSpecialistId?: string;
  preSelectedCouponCode?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedServiceId,
  preSelectedSpecialistId,
  preSelectedCouponCode,
}) => {
  const { formatPrice } = useLocalization();
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedServiceId || getStoredServices()[0]?.id || ''
  );
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>(
    preSelectedSpecialistId || 'any'
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [suiteType, setSuiteType] = useState<'vip-pod' | 'private-suite'>('vip-pod');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [bookingRef, setBookingRef] = useState<string>('');

  // Coupon & Promotion State
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [couponDiscountUSD, setCouponDiscountUSD] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Keep services list synced with localStorage
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

  // Reset and auto-fill customer profile whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      const currentList = getStoredServices();
      setServices(currentList);
      if (preSelectedServiceId) {
        setSelectedServiceId(preSelectedServiceId);
      } else if (!selectedServiceId && currentList.length > 0) {
        setSelectedServiceId(currentList[0].id);
      }
      if (preSelectedSpecialistId) {
        setSelectedSpecialistId(preSelectedSpecialistId);
      }

      // Auto-fill logged-in customer info if available
      const user = getCurrentUser();
      if (user) {
        setClientInfo((prev) => ({
          name: prev.name || user.name,
          phone: prev.phone || user.phone,
          email: prev.email || user.email,
          notes: prev.notes || user.preferences?.refreshment || '',
        }));
      }

      // Pre-apply coupon code if provided
      if (preSelectedCouponCode) {
        setCouponCodeInput(preSelectedCouponCode);
      }
    }
  }, [isOpen, preSelectedServiceId, preSelectedSpecialistId, preSelectedCouponCode]);

  const currentService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || services[0] || {
      id: 'default',
      name: 'Custom Treatment',
      category: 'nails',
      duration: '60 min',
      price: '$95',
      description: 'Private luxury salon treatment',
      benefits: [],
      image: '',
    },
    [services, selectedServiceId]
  );

  // Raw numeric price in USD
  const subtotalUSD = useMemo(() => {
    return parsePriceUSD(currentService.price);
  }, [currentService]);

  // Final Price after coupon discount
  const finalPriceUSD = useMemo(() => {
    return Math.max(0, subtotalUSD - couponDiscountUSD);
  }, [subtotalUSD, couponDiscountUSD]);

  // Available specialists
  const availableSpecialists = useMemo(() => {
    return getSpecialistsForService(currentService.id, currentService.category);
  }, [currentService]);

  const selectedSpecialist: SpecialistItem | undefined = useMemo(() => {
    if (selectedSpecialistId === 'any') return undefined;
    return availableSpecialists.find((s) => s.id === selectedSpecialistId);
  }, [availableSpecialists, selectedSpecialistId]);

  // Validate coupon whenever code or service changes
  useEffect(() => {
    if (preSelectedCouponCode && !appliedCoupon) {
      const res = validateCoupon(preSelectedCouponCode, subtotalUSD, currentService.category);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponDiscountUSD(res.discountUSD);
        setCouponError(null);
      }
    }
  }, [preSelectedCouponCode, subtotalUSD, currentService, appliedCoupon]);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCouponError(null);
    if (!couponCodeInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const res = validateCoupon(couponCodeInput, subtotalUSD, currentService.category);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscountUSD(res.discountUSD);
      setCouponError(null);
    } else {
      setAppliedCoupon(null);
      setCouponDiscountUSD(0);
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountUSD(0);
    setCouponCodeInput('');
    setCouponError(null);
  };

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  const bookedSlots = useMemo(() => {
    if (!selectedSpecialist) return [];
    return getSpecialistBookedSlots(selectedSpecialist.name, selectedDate);
  }, [selectedSpecialist, selectedDate]);

  if (!isOpen) return null;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = 'DT-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);

    const specialistName = selectedSpecialist
      ? selectedSpecialist.name
      : availableSpecialists[0]?.name || 'Assigned Specialist';

    const formattedFinalPrice = formatPrice(finalPriceUSD);

    // Save booking to admin dashboard storage
    createNewAppointment({
      refCode: randomRef,
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
      clientEmail: clientInfo.email,
      serviceId: currentService.id,
      serviceName: currentService.name,
      serviceCategory: currentService.category,
      duration: currentService.duration,
      price: formattedFinalPrice,
      date: selectedDate,
      time: selectedTime,
      suiteType: suiteType,
      suiteName:
        suiteType === 'vip-pod'
          ? 'Acoustic VIP Pod 1 (Nail & Podology)'
          : 'Private Treatment Suite',
      specialistId: selectedSpecialist?.id,
      specialistName,
      bookingType: 'online',
      notes: clientInfo.notes + (appliedCoupon ? ` [Coupon: ${appliedCoupon.code} -${formatPrice(couponDiscountUSD)}]` : ''),
      refreshment: clientInfo.notes || 'San Pellegrino & Espresso',
      status: 'confirmed',
      paymentStatus: 'pending',
    });

    // If a coupon was redeemed, record it in coupon tracker
    if (appliedCoupon) {
      redeemCouponUsage(appliedCoupon.code);
    }

    // Record booking in customer journey & loyalty points CRM
    const user = getCurrentUser();
    if (user) {
      if (appliedCoupon) {
        recordCustomerCouponRedemption(user.id, appliedCoupon.code, randomRef, couponDiscountUSD);
      }
      recordCustomerBooking(user.email, {
        priceRaw: String(finalPriceUSD),
        date: selectedDate,
        serviceName: currentService.name,
        specialistName,
      });
    } else if (clientInfo.email || clientInfo.phone) {
      recordCustomerBooking(clientInfo.email || clientInfo.phone, {
        priceRaw: String(finalPriceUSD),
        date: selectedDate,
        serviceName: currentService.name,
        specialistName,
      });
    }

    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-[#50b7b5]/95 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md shrink-0">
          <span className="font-display-luxury text-xs tracking-widest font-bold text-[#0d2222]">
            DIAMOND TRIM • RESERVATION
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/50 bg-white/30 text-[#0d2222] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {/* Step Indicators */}
          {step < 3 && (
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-white/40">
              <span className="text-xs uppercase tracking-wider text-[#0d2222] font-bold">
                Step {step} of 2: {step === 1 ? 'Select Appointment' : 'Guest Details & Payment'}
              </span>
              <span className="text-xs text-[#0d2222] font-semibold">
                {step === 1 ? 'Next: Details & Coupons' : 'Final Step'}
              </span>
            </div>
          )}

          {/* STEP 1: Service, Date, Time & Setting */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                  Select Treatment
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40 transition-colors shadow-2xs font-semibold"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#50b7b5] text-[#0d2222]">
                      {s.name} — {formatPrice(parsePriceUSD(s.price))} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Treatment Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 flex items-center gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <img
                  src={currentService.image}
                  alt={currentService.name}
                  className="w-16 h-16 rounded-xl object-cover border border-white/60 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#0d2222] truncate">
                      {currentService.category}
                    </span>
                    <span className="font-playfair-headline font-bold text-lg text-[#0d2222] shrink-0">
                      {formatPrice(subtotalUSD)}
                    </span>
                  </div>
                  <h5 className="text-base font-bold text-[#0d2222] truncate mt-0.5">
                    {currentService.name}
                  </h5>
                  <p className="text-xs sm:text-sm text-[#0d2222] flex items-center gap-1.5 mt-0.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0d2222]" />
                    <span>{currentService.duration}</span>
                    <span className="text-white/60">•</span>
                    <span>Class-B Sterile Suite</span>
                  </p>
                </div>
              </div>

              {/* Specialist Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-[#0d2222] text-[#0d2222]" />
                    <label className="block text-[11px] uppercase tracking-wider text-[#0d2222] font-bold">
                      Select Specialist ({availableSpecialists.length} Available)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSpecialistId('any')}
                    className={`group p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                      selectedSpecialistId === 'any'
                        ? 'border-[#0d2222] bg-white/45 ring-2 ring-[#0d2222] shadow-sm'
                        : 'border-white/50 bg-white/25 backdrop-blur-md hover:border-white hover:bg-white/35 shadow-2xs'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#0d2222] text-[#50b7b5] flex items-center justify-center font-bold text-sm shrink-0">
                      ✦
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#0d2222]">
                        First Available Master
                      </div>
                      <p className="text-[10px] text-[#0d2222]/80 truncate mt-0.5 font-medium">
                        Auto-assigned on arrival
                      </p>
                    </div>
                    {selectedSpecialistId === 'any' && (
                      <Check className="w-4 h-4 text-[#0d2222] shrink-0" />
                    )}
                  </button>

                  {availableSpecialists.map((spec) => {
                    const isSelected = selectedSpecialistId === spec.id;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => setSelectedSpecialistId(spec.id)}
                        className={`group p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? 'border-white bg-white/45 ring-2 ring-white shadow-sm'
                            : 'border-white/50 bg-white/25 backdrop-blur-md hover:border-white/80 hover:bg-white/35 shadow-2xs'
                        }`}
                      >
                        <img
                          src={spec.avatar}
                          alt={spec.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/60 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-[#0d2222] truncate block">
                            {spec.name}
                          </span>
                          <span className="text-[10px] text-[#0d2222]/80 truncate block mt-0.5 font-medium">
                            {spec.role}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#0d2222] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40 transition-colors font-semibold"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="bg-[#50b7b5] text-[#0d2222]">
                        {time} {bookedSlots.includes(time) ? '— Reserved' : '— Available'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Suite Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold mb-1.5">
                  Private Suite Setting
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSuiteType('vip-pod')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      suiteType === 'vip-pod'
                        ? 'border-white bg-white/45 ring-1 ring-white shadow-sm'
                        : 'border-white/50 bg-white/25 text-[#0d2222] hover:bg-white/35'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#0d2222]">VIP Acoustic Pod</div>
                    <p className="text-[10px] text-[#0d2222]/80 mt-0.5">Private entertainment &amp; espresso</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSuiteType('private-suite')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      suiteType === 'private-suite'
                        ? 'border-white bg-white/45 ring-1 ring-white shadow-sm'
                        : 'border-white/50 bg-white/25 text-[#0d2222] hover:bg-white/35'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#0d2222]">Private Treatment Suite</div>
                    <p className="text-[10px] text-[#0d2222]/80 mt-0.5">Full quiet room isolation</p>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-full text-xs uppercase tracking-[0.16em] font-bold bg-[#0d2222] text-white hover:bg-[#1a4444] transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Guest Details &amp; Coupons</span>
                  <ArrowRight className="w-4 h-4 text-[#50b7b5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details, Coupon Redemption & Price Breakdown */}
          {step === 2 && (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0d2222] block text-sm">
                    {currentService.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium">
                    <span>{selectedDate} at {selectedTime}</span>
                    <span className="text-white/60">•</span>
                    <span>{selectedSpecialist ? selectedSpecialist.name : 'First Available'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#0d2222] font-bold underline cursor-pointer hover:text-black"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#0d2222] font-bold mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#0d2222] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Guest name"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#0d2222] font-bold mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#0d2222] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#0d2222] font-bold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#0d2222] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="guest@email.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#0d2222] font-bold mb-1">
                  Special Notes or Refreshment Preference
                </label>
                <textarea
                  rows={2}
                  placeholder="Matcha, Espresso, Herbal tea, or quiet appointment..."
                  value={clientInfo.notes}
                  onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/25 border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40"
                />
              </div>

              {/* PROMOTION & COUPON CODE INPUT */}
              <div className="p-4 rounded-2xl bg-white/35 backdrop-blur-md border border-white/60 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#0d2222] flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Have a Promo or Gift Coupon?</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-950 font-bold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#0d2222]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={!!appliedCoupon}
                      placeholder="e.g. WELCOME20, DIAMOND50"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/40 border border-white/60 text-xs font-mono font-bold uppercase tracking-wider text-[#0d2222] placeholder:text-[#0d2222]/50 focus:outline-none focus:bg-white/60"
                    />
                  </div>
                  {!appliedCoupon && (
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 rounded-xl bg-[#0d2222] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1a4444] cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="text-[11px] text-red-950 font-bold">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-950 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold">{appliedCoupon.code}: {appliedCoupon.title}</span>
                    </div>
                    <span className="font-bold text-sm">
                      -{formatPrice(couponDiscountUSD)}
                    </span>
                  </div>
                )}

                {/* Pricing Calculation Ledger */}
                <div className="pt-2 border-t border-white/30 space-y-1 text-xs text-[#0d2222]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotalUSD)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-950 font-bold">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>-{formatPrice(couponDiscountUSD)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/20">
                    <span>Total Estimated:</span>
                    <span className="font-playfair-headline text-base">{formatPrice(finalPriceUSD)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-full text-xs uppercase tracking-wider text-[#0d2222] hover:bg-[#0d2222] hover:text-white border border-white/50 bg-white/20 font-bold transition-colors cursor-pointer"
                >
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-full text-xs uppercase tracking-[0.18em] font-bold bg-[#0d2222] text-white hover:bg-[#1a4444] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Confirm Reservation ({formatPrice(finalPriceUSD)})</span>
                  <ArrowRight className="w-4 h-4 text-[#50b7b5]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmed Voucher with Loyalty Perks & Final Converted Price */}
          {step === 3 && (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#0d2222] text-[#50b7b5] border-2 border-white mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-playfair-headline font-bold text-[#0d2222]">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-[#0d2222] mt-1 font-semibold">
                  Reference Code: <strong className="text-[#0d2222] tracking-widest bg-white/40 px-2 py-0.5 rounded-md font-mono">{bookingRef}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/60 text-left space-y-2 text-xs text-[#0d2222] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="font-bold">Treatment:</span>
                  <span className="font-bold">{currentService.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="font-bold">Reserved Specialist:</span>
                  <span className="font-bold">
                    {selectedSpecialist ? selectedSpecialist.name : 'First Available Master'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="font-bold">Date &amp; Time:</span>
                  <span className="font-bold">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="font-bold">Setting:</span>
                  <span className="font-bold">{suiteType === 'vip-pod' ? 'VIP Pod' : 'Private Suite'}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between border-b border-white/40 pb-1.5 text-emerald-950 font-bold">
                    <span>Applied Voucher:</span>
                    <span>{appliedCoupon.code} (-{formatPrice(couponDiscountUSD)})</span>
                  </div>
                )}
                <div className="flex justify-between pt-0.5 text-sm font-bold">
                  <span>Total Amount:</span>
                  <span className="font-playfair-headline text-base">{formatPrice(finalPriceUSD)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/25 border border-white/40 max-w-md mx-auto text-center text-[11px] text-[#0d2222] font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0d2222]" />
                <span>Earned +{Math.round(finalPriceUSD * 10)} Loyalty VIP points added to your client journey!</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full text-xs uppercase tracking-wider font-bold bg-[#0d2222] text-white hover:bg-[#1a4444] transition-all cursor-pointer shadow-md"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
