import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  User,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  Star,
  Sparkles,
  Check,
  Heart,
} from 'lucide-react';
import type { ServiceItem } from '../data/salonData';
import {
  createNewAppointment,
  getSpecialistsForService,
  getSpecialistBookedSlots,
  getStoredServices,
} from '../services/adminStorage';
import type { SpecialistItem } from '../types/admin';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
  preSelectedSpecialistId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedServiceId,
  preSelectedSpecialistId,
}) => {
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

  // Always reset to Step 1 and apply selected service / specialist whenever opened
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
    }
  }, [isOpen, preSelectedServiceId, preSelectedSpecialistId]);

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

  // Specialists available for this specific service
  const availableSpecialists = useMemo(() => {
    return getSpecialistsForService(currentService.id, currentService.category);
  }, [currentService]);

  const selectedSpecialist: SpecialistItem | undefined = useMemo(() => {
    if (selectedSpecialistId === 'any') return undefined;
    return availableSpecialists.find((s) => s.id === selectedSpecialistId);
  }, [availableSpecialists, selectedSpecialistId]);

  // When available specialists list changes, ensure selection is still valid
  useEffect(() => {
    if (selectedSpecialistId !== 'any') {
      const stillAvailable = availableSpecialists.some((s) => s.id === selectedSpecialistId);
      if (!stillAvailable) {
        setSelectedSpecialistId('any');
      }
    }
  }, [availableSpecialists, selectedSpecialistId]);

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

  // Booked slots for selected specialist on selected date
  const bookedSlots = useMemo(() => {
    if (!selectedSpecialist) return [];
    return getSpecialistBookedSlots(selectedSpecialist.name, selectedDate);
  }, [selectedSpecialist, selectedDate]);

  // Auto-switch away from booked slot
  useEffect(() => {
    if (bookedSlots.includes(selectedTime)) {
      const firstAvailable = timeSlots.find((t) => !bookedSlots.includes(t));
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
  }, [bookedSlots, selectedTime]);

  if (!isOpen) return null;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = 'DT-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);

    const specialistName = selectedSpecialist
      ? selectedSpecialist.name
      : availableSpecialists[0]?.name || 'Assigned Specialist';

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
      price: currentService.price,
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
      notes: clientInfo.notes,
      refreshment: clientInfo.notes || 'San Pellegrino & Espresso',
      status: 'confirmed',
      paymentStatus: 'pending',
    });

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
      <div className="relative w-full max-w-xl bg-[#50b7b5]/92 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto max-h-[92vh] flex flex-col">
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
                Step {step} of 2: {step === 1 ? 'Select Appointment' : 'Guest Information'}
              </span>
              <span className="text-xs text-[#0d2222] font-semibold">
                {step === 1 ? 'Next: Guest Details' : 'Final Step'}
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
                  className="w-full px-4 py-3 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40 transition-colors shadow-2xs"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#50b7b5] text-[#0d2222]">
                      {s.name} — {s.price} ({s.duration})
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
                      {currentService.price}
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

              {/* Specialist / Practitioner Selection (Per Service) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-[#0d2222] text-[#0d2222]" />
                    <label className="block text-[11px] uppercase tracking-wider text-[#0d2222] font-bold">
                      Select Your Favourite Specialist ({availableSpecialists.length} Available)
                    </label>
                  </div>
                  <span className="text-[10px] text-[#0d2222] font-bold flex items-center gap-1 bg-white/30 px-2 py-0.5 rounded-full border border-white/50 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-[#0d2222]" />
                    Pick Any Specialist
                  </span>
                </div>
                <p className="text-[11px] text-[#0d2222] font-medium mb-2.5">
                  Multiple master specialists provide {currentService.name}. Choose your preferred practitioner to reserve their chair directly, or select First Available:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {/* First Available Option */}
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
                      <div className="text-xs font-bold text-[#0d2222] flex items-center gap-1.5">
                        <span>First Available Master</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/40 text-[#0d2222] font-bold">
                          Fastest
                        </span>
                      </div>
                      <p className="text-[10px] text-[#0d2222]/80 truncate mt-0.5 font-medium">
                        Auto-assigned on arrival
                      </p>
                    </div>
                    {selectedSpecialistId === 'any' && (
                      <Check className="w-4 h-4 text-[#0d2222] shrink-0" />
                    )}
                  </button>

                  {/* Specific Specialists providing this service */}
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
                        <div className="relative shrink-0">
                          <img
                            src={spec.avatar}
                            alt={spec.name}
                            className={`w-10 h-10 rounded-xl object-cover border transition-all ${
                              isSelected ? 'border-white ring-2 ring-white/60' : 'border-white/50'
                            }`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {spec.badge && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0d2222] text-white flex items-center justify-center text-[8px] font-bold shadow-xs">
                              ★
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#0d2222] truncate">
                              {spec.name}
                            </span>
                            {isSelected ? (
                              <span className="flex items-center gap-0.5 text-[9px] uppercase font-bold text-[#0d2222] bg-white/80 px-1.5 py-0.5 rounded-md border border-white/60 shrink-0">
                                <Heart className="w-2.5 h-2.5 fill-[#0d2222]" /> Favourite
                              </span>
                            ) : (
                              <Heart className="w-3.5 h-3.5 text-white/70 group-hover:text-[#0d2222] shrink-0 transition-colors" />
                            )}
                          </div>

                          <div className="text-[10px] text-[#0d2222]/80 truncate mt-0.5 font-medium">
                            {spec.role}
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-[#0d2222] font-semibold mt-1">
                            <span className="flex items-center gap-0.5 font-bold">
                              <Star className="w-3 h-3 fill-[#0d2222] text-[#0d2222]" />
                              {spec.rating}
                              {spec.reviewCount ? (
                                <span className="text-[#0d2222]/70 font-normal">({spec.reviewCount})</span>
                              ) : null}
                            </span>
                            {spec.badge && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/40 text-[#0d2222] font-bold truncate">
                                {spec.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback banner for chosen specialist */}
                {selectedSpecialist ? (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={selectedSpecialist.avatar}
                        alt={selectedSpecialist.name}
                        className="w-6 h-6 rounded-full object-cover border border-white/60 shrink-0"
                      />
                      <span className="text-[#0d2222] font-semibold truncate">
                        Selected Specialist: <strong>{selectedSpecialist.name}</strong> • Chair Reserved
                      </span>
                    </div>
                    <span className="text-[10px] text-[#0d2222] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ml-2">
                      <Heart className="w-3 h-3 fill-[#0d2222]" /> Preferred Artist
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/45 flex items-center justify-between text-xs text-[#0d2222] font-medium">
                    <span>✦ First Available Master: We will pair you with the best available practitioner upon arrival.</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#0d2222] shrink-0 ml-2">Fastest</span>
                  </div>
                )}
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs uppercase tracking-wider text-[#0d2222] font-bold">
                      Time Slot
                    </label>
                    {selectedSpecialist && (
                      <span className="text-xs text-[#0d2222] font-bold">
                        {timeSlots.length - bookedSlots.length} open slots
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-sm text-[#0d2222] focus:outline-none focus:border-white focus:bg-white/40 transition-colors"
                  >
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <option
                          key={time}
                          value={time}
                          disabled={isBooked}
                          className="bg-[#50b7b5] text-[#0d2222]"
                        >
                          {time} {isBooked ? '— Booked (Unavailable)' : '— Available'}
                        </option>
                      );
                    })}
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
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      suiteType === 'vip-pod'
                        ? 'border-white bg-white/45 ring-1 ring-white shadow-sm'
                        : 'border-white/50 bg-white/25 backdrop-blur-md text-[#0d2222] hover:border-white hover:bg-white/35'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#0d2222]">
                      VIP Acoustic Pod
                    </div>
                    <p className="text-xs text-[#0d2222]/80 mt-0.5 font-medium">
                      Private entertainment screen &amp; tea
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSuiteType('private-suite')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      suiteType === 'private-suite'
                        ? 'border-white bg-white/45 ring-1 ring-white shadow-sm'
                        : 'border-white/50 bg-white/25 backdrop-blur-md text-[#0d2222] hover:border-white hover:bg-white/35'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#0d2222]">
                      Private Treatment Suite
                    </div>
                    <p className="text-xs text-[#0d2222]/80 mt-0.5 font-medium">
                      Full quiet room isolation
                    </p>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-full text-xs sm:text-sm uppercase tracking-[0.16em] font-bold bg-[#0d2222] text-white hover:bg-[#1a4444] hover:shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap border border-white/30"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#50b7b5]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details */}
          {step === 2 && (
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] flex items-center justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <div>
                  <span className="font-bold text-[#0d2222] block text-sm">
                    {currentService.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium">
                    <span>{selectedDate} at {selectedTime}</span>
                    <span className="text-white/60">•</span>
                    <strong className="text-[#0d2222] font-bold flex items-center gap-1">
                      {selectedSpecialist ? (
                        <>
                          <Heart className="w-3 h-3 fill-[#0d2222]" />
                          {selectedSpecialist.name} (Favourite Pick)
                        </>
                      ) : (
                        'First Available Specialist'
                      )}
                    </strong>
                    <span className="text-white/60">•</span>
                    <span>{suiteType === 'vip-pod' ? 'VIP Pod' : 'Private Suite'}</span>
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:border-white focus:bg-white/40 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:border-white focus:bg-white/40 transition-colors"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:border-white focus:bg-white/40 transition-colors"
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
                  className="w-full px-4 py-2 rounded-xl bg-white/25 backdrop-blur-sm border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:border-white focus:bg-white/40 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-full text-xs uppercase tracking-wider text-[#0d2222] hover:text-white hover:bg-[#0d2222] border border-white/50 bg-white/20 backdrop-blur-sm shrink-0 whitespace-nowrap inline-flex items-center justify-center transition-colors font-bold"
                >
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full text-xs uppercase tracking-[0.18em] font-semibold bg-[#0d2222] text-white hover:bg-[#1a4444] transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap inline-flex items-center justify-center border border-white/30"
                >
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmed Voucher */}
          {step === 3 && (
            <div className="text-center py-6 space-y-5">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm text-[#0d2222] border border-white/50 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-playfair-headline font-bold text-[#0d2222]">
                  Reservation Confirmed
                </h3>
                <p className="text-xs text-[#0d2222] mt-1 font-semibold">
                  Reference Code: <strong className="text-[#0d2222] tracking-widest">{bookingRef}</strong>
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-left space-y-2 text-xs text-[#0d2222] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="text-[#0d2222]/80 font-bold">Treatment:</span>
                  <span className="font-bold text-[#0d2222]">{currentService.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="text-[#0d2222]/80 font-bold">Reserved Specialist:</span>
                  <span className="font-bold text-[#0d2222] flex items-center gap-1">
                    {selectedSpecialist ? (
                      <>
                        <Heart className="w-3.5 h-3.5 fill-[#0d2222] text-[#0d2222]" />
                        <span>{selectedSpecialist.name}</span>
                        <span className="text-[10px] uppercase font-bold text-[#0d2222] bg-white/40 px-1.5 py-0.2 rounded border border-white/60">
                          Favourite
                        </span>
                      </>
                    ) : (
                      <span>{availableSpecialists[0]?.name || 'Auto-Assigned Specialist'}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="text-[#0d2222]/80 font-bold">Date &amp; Time:</span>
                  <span className="font-bold text-[#0d2222]">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between border-b border-white/40 pb-1.5">
                  <span className="text-[#0d2222]/80 font-bold">Setting:</span>
                  <span className="font-bold text-[#0d2222]">{suiteType === 'vip-pod' ? 'VIP Pod' : 'Private Suite'}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#0d2222]/80 font-bold">Estimated Total:</span>
                  <span className="font-bold text-[#0d2222]">{currentService.price}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#0d2222] text-white hover:bg-[#1a4444] transition-all shrink-0 whitespace-nowrap inline-flex items-center justify-center cursor-pointer shadow-xs border border-white/30"
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
