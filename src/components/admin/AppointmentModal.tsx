import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Sparkles, AlertCircle } from 'lucide-react';
import type { ServiceItem } from '../../data/salonData';
import {
  INITIAL_SUITES,
  getStoredSpecialists,
  isSpecialistAvailable,
  getSpecialistsForService,
  getStoredServices,
} from '../../services/adminStorage';
import type { AppointmentItem, AppointmentStatus, PaymentStatus, SuiteType, BookingSource } from '../../types/admin';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: Omit<AppointmentItem, 'id' | 'createdAt'>, editingId?: string) => void;
  initialData?: Partial<AppointmentItem> | null;
}

const generateRefCode = (prefix: string = 'DT') => {
  return `${prefix}-${(Date.now() % 900000) + 100000}`;
};

const AppointmentFormDialog: React.FC<{
  onClose: () => void;
  onSave: (appointmentData: Omit<AppointmentItem, 'id' | 'createdAt'>, editingId?: string) => void;
  initialData?: Partial<AppointmentItem> | null;
}> = ({ onClose, onSave, initialData }) => {
  const [services] = useState<ServiceItem[]>(() => getStoredServices());
  const [bookingType, setBookingType] = useState<BookingSource>(
    () => initialData?.bookingType || 'walk-in'
  );
  const [clientName, setClientName] = useState(() => initialData?.clientName || '');
  const [clientPhone, setClientPhone] = useState(() => initialData?.clientPhone || '');
  const [clientEmail, setClientEmail] = useState(() => initialData?.clientEmail || '');
  const [serviceId, setServiceId] = useState(
    () => initialData?.serviceId || getStoredServices()[0]?.id || ''
  );
  const [date, setDate] = useState(() => initialData?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => initialData?.time || '11:00 AM');
  const [suiteType, setSuiteType] = useState<SuiteType>(() => initialData?.suiteType || 'vip-pod');
  const [suiteName, setSuiteName] = useState(
    () => initialData?.suiteName || INITIAL_SUITES[0]?.name || 'Acoustic VIP Pod 1'
  );
  const [specialistName, setSpecialistName] = useState(
    () => initialData?.specialistName || 'Any Available Specialist'
  );
  const [notes, setNotes] = useState(() => initialData?.notes || '');
  const [refreshment, setRefreshment] = useState(
    () => initialData?.refreshment || ''
  );
  const [status, setStatus] = useState<AppointmentStatus>(() => initialData?.status || 'confirmed');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    () => initialData?.paymentStatus || 'pending'
  );

  const allSpecialists = useMemo(() => getStoredSpecialists(), []);
  const currentService = useMemo(
    () => services.find((s) => s.id === serviceId) || services[0] || {
      id: 'default',
      name: 'Custom Treatment',
      category: 'nails',
      duration: '60 min',
      price: '$95',
      description: '',
      benefits: [],
      image: '',
    },
    [services, serviceId]
  );

  // Specialists who specifically provide this service
  const certifiedSpecialists = useMemo(() => {
    return getSpecialistsForService(currentService.id, currentService.category);
  }, [currentService]);

  // Check if chosen specialist is occupied
  const isBusy = useMemo(() => {
    if (!specialistName || specialistName === 'Any Available Specialist') return false;
    return !isSpecialistAvailable(specialistName, date, time, initialData?.id);
  }, [specialistName, date, time, initialData?.id]);

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
    '08:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = initialData?.refCode || generateRefCode();
    const matchedSpec = allSpecialists.find((s) => s.name === specialistName);

    onSave(
      {
        refCode,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        serviceId: currentService.id,
        serviceName: currentService.name,
        serviceCategory: currentService.category,
        duration: currentService.duration,
        price: currentService.price,
        date,
        time,
        suiteType,
        suiteName,
        specialistId: matchedSpec?.id,
        specialistName,
        bookingType,
        notes,
        refreshment: refreshment || 'Complimentary Beverage',
        status,
        paymentStatus,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#56bdbb] via-[#52b9b7] to-[#4da7a5] border border-white/50 text-[#0d2222] rounded-3xl shadow-2xl z-10 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/30 bg-white/25 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0d2222] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#53b8b6]" />
            </div>
            <div>
              <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222]">
                {initialData ? 'Edit Atelier Appointment' : 'New Client Reservation'}
              </h3>
              <p className="text-[11px] text-[#102e2e]">
                {initialData ? `Reference: ${initialData.refCode}` : 'Create a private suite reservation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/50 text-[#0d2222] hover:bg-white/30 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Booking Channel (Walk-In vs Online) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e]/80">
                Booking Source:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  bookingType === 'walk-in'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}
              >
                {bookingType === 'walk-in' ? 'Physical Walk-In Guest' : 'Online Website Reservation'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setBookingType('walk-in')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  bookingType === 'walk-in'
                    ? 'bg-[#1c1b18] text-white'
                    : 'bg-white border border-[#e2dcd0] text-[#102e2e] hover:text-[#0d2222]'
                }`}
              >
                Physical Walk-In
              </button>
              <button
                type="button"
                onClick={() => setBookingType('online')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  bookingType === 'online'
                    ? 'bg-[#1c1b18] text-white'
                    : 'bg-white border border-[#e2dcd0] text-[#102e2e] hover:text-[#0d2222]'
                }`}
              >
                Online Booking
              </button>
            </div>
          </div>

          {/* Guest Details */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              1. Guest Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter guest full name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="guest@luxury.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Treatment & Specialist */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              2. Treatment & Specialist
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Selected Treatment *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.price} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold">
                    Assigned Specialist
                  </label>
                  {isBusy && (
                    <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      Already Booked at {time}
                    </span>
                  )}
                </div>
                <select
                  value={specialistName}
                  onChange={(e) => setSpecialistName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border text-xs text-[#0d2222] focus:outline-none ${
                    isBusy
                      ? 'border-rose-400 focus:border-rose-600 ring-1 ring-rose-200'
                      : 'border-[#e5dfd3] focus:border-[#1c1b18]'
                  }`}
                >
                  <option value="Any Available Specialist">Any Available Specialist (Auto-Assign)</option>
                  <optgroup label={`Certified for ${currentService.name} (${certifiedSpecialists.length})`}>
                    {certifiedSpecialists.map((spec) => (
                      <option key={spec.id} value={spec.name}>
                        ✓ {spec.name} ({spec.role})
                      </option>
                    ))}
                  </optgroup>
                  {allSpecialists.filter((s) => !certifiedSpecialists.some((cs) => cs.id === s.id)).length > 0 && (
                    <optgroup label="Other Atelier Specialists">
                      {allSpecialists
                        .filter((s) => !certifiedSpecialists.some((cs) => cs.id === s.id))
                        .map((spec) => (
                          <option key={spec.id} value={spec.name}>
                            {spec.name} ({spec.role})
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule & Suite */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              3. Date, Time & Private Setting
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#102e2e]/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Time Slot *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#102e2e]/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Suite Allocation
                </label>
                <select
                  value={suiteName}
                  onChange={(e) => {
                    setSuiteName(e.target.value);
                    setSuiteType(
                      e.target.value.toLowerCase().includes('pod') ? 'vip-pod' : 'private-suite'
                    );
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  {INITIAL_SUITES.map((suite) => (
                    <option key={suite.id} value={suite.name}>
                      {suite.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status & Payment */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              4. Booking Status & Payment
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Appointment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In-Progress (Guest Checked In)</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending Confirmation</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  <option value="paid">Paid Full ({currentService.price})</option>
                  <option value="deposit-received">50% Deposit Received</option>
                  <option value="pending">Pending Payment at Atelier</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes & Refreshment */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              5. Concierge Notes & Hospitality
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Beverage / Tea Preference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Iced Oat Matcha, Espresso, Sparkling Water"
                  value={refreshment}
                  onChange={(e) => setRefreshment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Special Instructions / Requests
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sensitive skin, silent session, anniversary gift"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ede7dc]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#666258] border border-white/50 bg-white/20 hover:bg-white/35 text-[#0d2222] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-semibold bg-[#1c1b18] text-white hover:bg-[#33312c] cursor-pointer shadow-xs transition-colors"
            >
              {initialData?.id ? 'Update Appointment' : 'Save Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  if (!isOpen) return null;

  return (
    <AppointmentFormDialog
      key={initialData?.id ? `edit-${initialData.id}` : `new-${initialData?.specialistName || ''}-${initialData?.time || ''}-${initialData?.date || ''}`}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
};
