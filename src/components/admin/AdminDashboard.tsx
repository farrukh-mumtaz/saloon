import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Search,
  Plus,
  Download,
  ArrowLeft,
  CheckCircle2,
  Clock4,
  XCircle,
  Building2,
  DollarSign,
  Coffee,
  ShieldCheck,
  Edit2,
  Trash2,
  Check,
  Users,
  UserCheck,
  CalendarDays,
  Star,
  UserPlus,
  Scissors,
} from 'lucide-react';
import {
  getStoredAppointments,
  createNewAppointment,
  updateStoredAppointment,
  deleteStoredAppointment,
  getStoredSuites,
  updateStoredSuite,
  clearAllAppointments,
  exportAppointmentsCSV,
  getStoredSpecialists,
  createNewSpecialist,
  updateStoredSpecialist,
  deleteStoredSpecialist,
  getStoredServices,
  createNewService,
  updateStoredService,
  deleteStoredService,
} from '../../services/adminStorage';
import type { ServiceItem } from '../../data/salonData';
import type {
  AppointmentItem,
  AppointmentStatus,
  SuiteItem,
  SpecialistItem,
  BookingSource,
} from '../../types/admin';
import { AppointmentModal } from './AppointmentModal';
import { SpecialistModal } from './SpecialistModal';
import { ServiceModal } from './ServiceModal';

interface AdminDashboardProps {
  onExit: () => void;
}


// Decorative Monstera Leaf Component
const MonsteraLeaf: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style = {},
}) => (
  <svg
    viewBox="0 0 260 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none drop-shadow-2xl select-none ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="admin-monstera-grad" x1="30" y1="20" x2="230" y2="280" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#43a047" />
        <stop offset="50%" stopColor="#2e7d32" />
        <stop offset="100%" stopColor="#1b5e20" />
      </linearGradient>
    </defs>
    <path
      d="M130 270 C125 230 115 170 130 30 C140 35 160 45 185 65 C170 75 150 82 135 86 C165 95 205 110 220 140 C195 148 170 140 145 135 C175 155 210 180 215 215 C185 210 165 195 140 180 C155 205 160 235 150 260 C140 265 135 268 130 270 Z"
      fill="url(#admin-monstera-grad)"
    />
    <path
      d="M130 270 C135 230 145 170 130 30 C120 35 100 45 75 65 C90 75 110 82 125 86 C95 95 55 110 40 140 C65 148 90 140 115 135 C85 155 50 180 45 215 C75 210 95 195 120 180 C105 205 100 235 110 260 C120 265 125 268 130 270 Z"
      fill="url(#admin-monstera-grad)"
    />
    <path d="M130 290 Q128 160 130 25" stroke="#a5d6a7" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    <path d="M130 90 Q160 80 185 70" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M130 90 Q100 80 75 70" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M130 140 Q175 130 210 125" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M130 140 Q85 130 50 125" stroke="#a5d6a7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  // State: Appointments, Suites, Specialists, and Services
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => getStoredAppointments());
  const [suites, setSuites] = useState<SuiteItem[]>(() => getStoredSuites());
  const [specialists, setSpecialists] = useState<SpecialistItem[]>(() => getStoredSpecialists());
  const [services, setServices] = useState<ServiceItem[]>(() => getStoredServices());
  const [activeTab, setActiveTab] = useState<'appointments' | 'schedule' | 'suites' | 'specialists' | 'services'>('appointments');

  // Filters & Search for Services Tab
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Filters & Search for Appointments
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming' | 'past'>('all');
  const [suiteFilter, setSuiteFilter] = useState<'all' | 'vip-pod' | 'private-suite'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | BookingSource>('all');

  // Calendar tab filters (Schedule per person)
  const [calendarSpecialist, setCalendarSpecialist] = useState<string>('all');
  const [calendarDate, setCalendarDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Partial<AppointmentItem> | null>(null);

  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<SpecialistItem | null>(null);

  // Time & Clock state for live indicator
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Load and subscribe to storage
  const loadData = () => {
    setAppointments(getStoredAppointments());
    setSuites(getStoredSuites());
    setSpecialists(getStoredSpecialists());
    setServices(getStoredServices());
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      setAppointments(getStoredAppointments());
      setSuites(getStoredSuites());
      setSpecialists(getStoredSpecialists());
      setServices(getStoredServices());
    };

    window.addEventListener('diamond_trim_storage_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    // Live clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDateStr(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('diamond_trim_storage_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      clearInterval(interval);
    };
  }, []);

  // Dates helpers (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Performance Metrics (100% Appointment-focused)
  const stats = useMemo(() => {
    const todayList = appointments.filter((a) => a.date === todayStr);
    const inProgressList = appointments.filter((a) => a.status === 'in-progress');
    const confirmedList = appointments.filter((a) => a.status === 'confirmed');
    const completedList = appointments.filter((a) => a.status === 'completed');

    // Revenue from confirmed, in-progress, or completed bookings
    const totalRev = appointments
      .filter((a) => a.status === 'confirmed' || a.status === 'completed' || a.status === 'in-progress')
      .reduce((sum, a) => {
        const num = parseInt(a.price.replace(/[^0-9]/g, ''), 10) || 0;
        return sum + num;
      }, 0);

    return {
      todayCount: todayList.length,
      inProgressCount: inProgressList.length,
      confirmedCount: confirmedList.length,
      completedCount: completedList.length,
      totalCount: appointments.length,
      revenue: totalRev,
    };
  }, [appointments, todayStr]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.clientName.toLowerCase().includes(q);
        const matchesRef = app.refCode.toLowerCase().includes(q);
        const matchesPhone = app.clientPhone.toLowerCase().includes(q);
        const matchesService = app.serviceName.toLowerCase().includes(q);
        const matchesSpecialist = app.specialistName.toLowerCase().includes(q);
        if (!matchesName && !matchesRef && !matchesPhone && !matchesService && !matchesSpecialist) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // Date
      if (dateFilter === 'today' && app.date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && app.date !== tomorrowStr) return false;
      if (dateFilter === 'upcoming' && app.date < todayStr) return false;
      if (dateFilter === 'past' && app.date >= todayStr) return false;

      // Suite
      if (suiteFilter !== 'all' && app.suiteType !== suiteFilter) return false;

      // Booking Channel (Walk-In vs Online)
      if (sourceFilter !== 'all' && (app.bookingType || 'online') !== sourceFilter) return false;

      return true;
    });
  }, [appointments, searchQuery, statusFilter, dateFilter, suiteFilter, sourceFilter, todayStr, tomorrowStr]);

  // Filtered Services for Treatment Menu Tab
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCat = serviceCategoryFilter === 'all' || srv.category === serviceCategoryFilter;
      const matchesSearch =
        !serviceSearch.trim() ||
        srv.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        srv.description.toLowerCase().includes(serviceSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [services, serviceCategoryFilter, serviceSearch]);

  // Appointment actions
  const handleSaveAppointment = (
    data: Omit<AppointmentItem, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      updateStoredAppointment(editingId, data);
    } else {
      createNewAppointment(data);
    }
    loadData();
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    updateStoredAppointment(id, { status: newStatus });
    loadData();
  };

  const handleDeleteAppointment = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to cancel and remove the reservation for ${name}?`)) {
      deleteStoredAppointment(id);
      loadData();
    }
  };

  // Quick Walk-In Booking (Physical guest registration)
  const handleOpenWalkIn = (specName?: string, timeSlot?: string, dateStr?: string) => {
    setEditingAppointment({
      date: dateStr || calendarDate,
      time: timeSlot || '11:00 AM',
      specialistName: specName || 'Any Available Specialist',
      bookingType: 'walk-in',
      status: 'in-progress',
      clientName: '',
      clientPhone: '',
    });
    setIsModalOpen(true);
  };

  // Specialist management actions
  const handleSaveSpecialist = (data: Omit<SpecialistItem, 'id'>, editingId?: string) => {
    if (editingId) {
      updateStoredSpecialist(editingId, data);
    } else {
      createNewSpecialist(data);
    }
    loadData();
  };

  const handleDeleteSpecialist = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove specialist "${name}"?`)) {
      deleteStoredSpecialist(id);
      loadData();
    }
  };

  // Treatment / Service management actions
  const handleSaveService = (serviceData: Omit<ServiceItem, 'id'>, editingId?: string) => {
    if (editingId) {
      updateStoredService(editingId, serviceData);
    } else {
      createNewService(serviceData);
    }
    loadData();
  };

  const handleDeleteService = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the treatment "${name}" from the salon menu? This will immediately remove it from the website and booking system.`)) {
      deleteStoredService(id);
      loadData();
    }
  };

  const handleToggleSpecialistDuty = (spec: SpecialistItem) => {
    const nextStatus = spec.status === 'active' ? 'off-duty' : 'active';
    updateStoredSpecialist(spec.id, { status: nextStatus });
    loadData();
  };

  const handleToggleSuiteStatus = (suite: SuiteItem) => {
    const nextStatus =
      suite.status === 'available'
        ? 'occupied'
        : suite.status === 'occupied'
        ? 'sanitizing'
        : 'available';
    updateStoredSuite(suite.id, {
      status: nextStatus,
      sanitizationCycle:
        nextStatus === 'sanitizing'
          ? 'Sterilization In-Progress'
          : nextStatus === 'available'
          ? 'Class-B Autoclave Complete'
          : 'Ready for Guest',
    });
    loadData();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all appointment records? This will empty the schedule.')) {
      clearAllAppointments();
      loadData();
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
            In-Progress
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
            <Check className="w-3 h-3 text-[#059669]" />
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]">
            <CheckCircle2 className="w-3 h-3 text-[#64748b]" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
            <XCircle className="w-3 h-3 text-[#dc2626]" />
            Cancelled
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
            <Clock4 className="w-3 h-3 text-[#d97706]" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#50b7b5] via-[#56bdbb] to-[#50b7b5] text-[#0d2222] flex flex-col selection:bg-[#0d2222] selection:text-white relative overflow-x-hidden">
      {/* Tropical Background Leaf Accents */}
      <MonsteraLeaf className="fixed -top-16 -left-12 w-56 sm:w-72 rotate-[35deg] pointer-events-none opacity-30 z-0" />
      <MonsteraLeaf className="fixed -bottom-20 -right-16 w-64 sm:w-80 -rotate-[45deg] pointer-events-none opacity-30 z-0" />

      {/* 1. TOP EXECUTIVE HEADER */}
      <header className="sticky top-0 z-40 bg-white/25 backdrop-blur-xl border-b border-white/40 px-4 sm:px-8 py-3.5 shadow-xs relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onExit}
                className="w-8 h-8 rounded-full border border-white/50 bg-white/20 text-[#0d2222] hover:bg-[#0d2222] hover:text-white flex items-center justify-center transition-colors cursor-pointer group"
                title="Return to Public Atelier"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display-luxury text-sm tracking-[0.25em] font-bold text-[#0d2222]">
                    DIAMOND TRIM
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0d2222] text-white text-[9px] uppercase tracking-widest font-bold">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#102e2e]/80 font-bold block">
                  Appointments &amp; Reservations Manager
                </span>
              </div>
            </div>

            {/* Mobile Exit */}
            <button
              onClick={onExit}
              className="md:hidden text-xs text-[#0d2222] font-medium underline"
            >
              Exit
            </button>
          </div>

          {/* Center: Live Clock */}
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-medium">{currentTimeStr}</span>
            <span className="text-[#c0bbb1]">•</span>
            <span>{currentDateStr}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {appointments.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl border border-white/50 bg-white/20 text-[#0d2222] hover:bg-rose-600 hover:text-white hover:border-rose-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Clear all appointment records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              onClick={exportAppointmentsCSV}
              className="px-3.5 py-2 rounded-xl border border-white/50 bg-white/25 backdrop-blur-md text-[#0d2222] hover:bg-white/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#0d2222]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => handleOpenWalkIn()}
              className="px-3.5 py-2 rounded-xl bg-white/35 hover:bg-white/50 border border-white/60 text-[#0d2222] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Fast register for walk-in client"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Walk-In Booking</span>
            </button>

            <button
              onClick={() => {
                setEditingAppointment(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0d2222] text-white hover:bg-[#1a4444] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#53b8b6]" />
              <span>New Reservation</span>
            </button>

            <button
              onClick={onExit}
              className="hidden md:flex px-4 py-2 rounded-xl border border-white/50 bg-white/20 text-xs text-[#0d2222] hover:bg-[#0d2222] hover:text-white font-semibold transition-colors cursor-pointer"
            >
              <span>Back to Site</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto w-full px-3 xs:px-4 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 flex-1">
        {/* APPOINTMENTS METRICS BAR (Useful options only) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Today's Bookings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] text-[#0d2222]">
            <div className="flex items-center justify-between text-[#102e2e]/80 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Today's Sessions</span>
              <Calendar className="w-4 h-4 text-[#0d2222]" />
            </div>
            <div className="text-2xl sm:text-3xl font-playfair-headline font-semibold text-[#0d2222]">
              {stats.todayCount}
            </div>
            <p className="text-[11px] text-[#102e2e] mt-1">
              Scheduled for today
            </p>
          </div>

          {/* Card 2: In-Progress */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] text-[#0d2222]">
            <div className="flex items-center justify-between text-[#102e2e]/80 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold">In-Service Now</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-playfair-headline font-semibold text-amber-800">
              {stats.inProgressCount}
            </div>
            <p className="text-[11px] text-[#102e2e] mt-1">
              Guests checked into suites
            </p>
          </div>

          {/* Card 3: Confirmed Upcoming */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] text-[#0d2222]">
            <div className="flex items-center justify-between text-[#102e2e]/80 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Confirmed</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-playfair-headline font-semibold text-[#0d2222]">
              {stats.confirmedCount}
            </div>
            <p className="text-[11px] text-[#102e2e] mt-1">
              Ready for service
            </p>
          </div>

          {/* Card 4: Completed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] text-[#0d2222]">
            <div className="flex items-center justify-between text-[#102e2e]/80 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-[#64748b]" />
            </div>
            <div className="text-2xl sm:text-3xl font-playfair-headline font-semibold text-[#0d2222]">
              {stats.completedCount}
            </div>
            <p className="text-[11px] text-[#102e2e] mt-1">
              Successfully served
            </p>
          </div>

          {/* Card 5: Estimated Revenue */}
          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] text-[#0d2222]">
            <div className="flex items-center justify-between text-[#102e2e]/80 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Est. Revenue</span>
              <DollarSign className="w-4 h-4 text-[#0d2222]" />
            </div>
            <div className="text-2xl sm:text-3xl font-playfair-headline font-semibold text-[#0d2222]">
              ${stats.revenue}
            </div>
            <p className="text-[11px] text-[#102e2e] mt-1">
              Active &amp; completed bookings
            </p>
          </div>
        </div>

        {/* 3. TABS NAVIGATION (Appointments, Schedule & Calendars, Suites, Specialists) */}
        <div className="border-b border-white/30 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'appointments'
                  ? 'border-[#0d2222] text-[#0d2222] font-bold'
                  : 'border-transparent text-[#0d2222]/70 hover:text-[#0d2222]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>All Appointments</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/30 border border-white/50 text-[#0d2222] font-bold">
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'border-[#0d2222] text-[#0d2222] font-bold'
                  : 'border-transparent text-[#0d2222]/70 hover:text-[#0d2222]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Specialist Calendars &amp; Slots</span>
            </button>

            <button
              onClick={() => setActiveTab('suites')}
              className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'suites'
                  ? 'border-[#0d2222] text-[#0d2222] font-bold'
                  : 'border-transparent text-[#0d2222]/70 hover:text-[#0d2222]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Suites &amp; Pods Status ({suites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('specialists')}
              className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'specialists'
                  ? 'border-[#0d2222] text-[#0d2222] font-bold'
                  : 'border-transparent text-[#0d2222]/70 hover:text-[#0d2222]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team &amp; Specialists ({specialists.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 sm:px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'border-[#0d2222] text-[#0d2222] font-bold'
                  : 'border-transparent text-[#0d2222]/70 hover:text-[#0d2222]'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Treatment Menu &amp; Services ({services.length})</span>
            </button>
          </div>
        </div>

        {/* 4. TAB 1: ALL APPOINTMENTS & BOOKINGS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="p-4 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] space-y-3 text-[#0d2222]">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by guest name, phone, ref (DT-...), service, or specialist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#102e2e]/80 hover:text-[#0d2222] cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today Only</option>
                    <option value="tomorrow">Tomorrow Only</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past Records</option>
                  </select>

                  <select
                    value={suiteFilter}
                    onChange={(e) => setSuiteFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  >
                    <option value="all">All Suites &amp; Pods</option>
                    <option value="vip-pod">Acoustic VIP Pods</option>
                    <option value="private-suite">Private Suites</option>
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  >
                    <option value="all">All Channels</option>
                    <option value="walk-in">Physical Walk-In</option>
                    <option value="online">Online Booking</option>
                  </select>

                  {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all' || suiteFilter !== 'all' || sourceFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setDateFilter('all');
                        setSuiteFilter('all');
                        setSourceFilter('all');
                      }}
                      className="px-3 py-2 rounded-xl text-xs text-[#0d2222] hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Status Quick-Filter Chips */}
              <div className="pt-2 border-t border-white/30 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#102e2e]/80 font-medium">Quick Filter:</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#0d2222] text-white font-bold shadow-xs'
                      : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium'
                  }`}
                >
                  All ({appointments.length})
                </button>
                <button
                  onClick={() => setStatusFilter('in-progress')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'in-progress'
                      ? 'bg-amber-700 text-white font-medium'
                      : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium'
                  }`}
                >
                  In-Progress ({appointments.filter((a) => a.status === 'in-progress').length})
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'confirmed'
                      ? 'bg-emerald-700 text-white font-medium'
                      : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium'
                  }`}
                >
                  Confirmed ({appointments.filter((a) => a.status === 'confirmed').length})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'completed'
                      ? 'bg-slate-700 text-white font-medium'
                      : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium'
                  }`}
                >
                  Completed ({appointments.filter((a) => a.status === 'completed').length})
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'cancelled'
                      ? 'bg-rose-700 text-white font-medium'
                      : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium'
                  }`}
                >
                  Cancelled ({appointments.filter((a) => a.status === 'cancelled').length})
                </button>
              </div>
            </div>

            {/* Appointments Cards / Table */}
            {appointments.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-white border border-[#eae5dc] shadow-2xs space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] border border-[#e5dfd3] flex items-center justify-center mx-auto text-[#0d2222]">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-playfair-headline font-semibold text-[#0d2222]">
                    No Reservations on File
                  </h4>
                  <p className="text-xs text-[#102e2e] max-w-sm mx-auto mt-1">
                    Your appointment schedule is currently clear. New bookings made through the website or created manually will appear here in real-time.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setEditingAppointment(null);
                      setIsModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-semibold bg-[#1c1b18] text-[#faf8f5] hover:bg-[#33312c] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#53b8b6]" />
                    <span>Create Reservation</span>
                  </button>
                </div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white border border-[#eae5dc] space-y-3">
                <Calendar className="w-10 h-10 text-[#c2bcaf] mx-auto" />
                <h4 className="text-base font-playfair-headline font-semibold text-[#0d2222]">
                  No matching appointments
                </h4>
                <p className="text-xs text-[#102e2e] max-w-sm mx-auto">
                  Try adjusting your search query or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setDateFilter('all');
                    setSuiteFilter('all');
                  }}
                  className="px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-[#0d2222] text-[#0d2222] font-bold hover:bg-[#1c1b18] hover:text-white transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((app) => {
                  const isToday = app.date === todayStr;
                  const isTomorrow = app.date === tomorrowStr;

                  return (
                    <div
                      key={app.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] hover:border-white/80 transition-all space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/30 pb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#0d2222] tracking-wider px-2 py-0.5 rounded bg-white/30 border border-white/50">
                            {app.refCode}
                          </span>
                          {getStatusBadge(app.status)}
                          {app.bookingType === 'walk-in' ? (
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              WALK-IN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-blue-50 text-blue-900 border border-blue-200">
                              ONLINE
                            </span>
                          )}
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-[#8f6e39] text-white">
                              TODAY
                            </span>
                          )}
                          {isTomorrow && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-[#d8c39e] text-[#0d2222]">
                              TOMORROW
                            </span>
                          )}
                        </div>

                        {/* Status Quick-Switch Actions */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'in-progress')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                              title="Check guest into suite"
                            >
                              Check In (In-Progress)
                            </button>
                          )}
                          {app.status === 'in-progress' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'completed')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Mark session as completed"
                            >
                              Mark Completed ✓
                            </button>
                          )}
                          {app.status !== 'completed' && app.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'cancelled')}
                              className="px-2.5 py-1 rounded-lg text-[11px] text-[#991b1b] hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingAppointment(app);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#666258] hover:text-[#0d2222] hover:bg-[#faf8f5] transition-colors cursor-pointer"
                            title="Edit reservation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteAppointment(app.id, app.clientName)}
                            className="p-1.5 rounded-lg text-[#991b1b] hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete booking record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Info Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        {/* Guest Details */}
                        <div className="md:col-span-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/40 text-[#0d2222] border border-white/50 font-bold text-xs flex items-center justify-center shrink-0">
                              {app.clientName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#0d2222]">
                                {app.clientName}
                              </h4>
                            </div>
                          </div>

                          <div className="pl-9 space-y-0.5 text-xs text-[#6e685e]">
                            <a
                              href={`tel:${app.clientPhone}`}
                              className="flex items-center gap-1.5 hover:text-[#0d2222] transition-colors"
                            >
                              <Phone className="w-3 h-3 text-[#102e2e]/80" />
                              <span>{app.clientPhone}</span>
                            </a>
                            {app.clientEmail && (
                              <a
                                href={`mailto:${app.clientEmail}`}
                                className="flex items-center gap-1.5 hover:text-[#0d2222] transition-colors truncate"
                              >
                                <Mail className="w-3 h-3 text-[#102e2e]/80" />
                                <span className="truncate">{app.clientEmail}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Treatment & Pricing */}
                        <div className="md:col-span-4 space-y-1.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0d2222] block">
                                {app.serviceCategory}
                              </span>
                              <h5 className="text-xs font-semibold text-[#0d2222]">
                                {app.serviceName}
                              </h5>
                              <span className="text-[11px] text-[#102e2e]">
                                {app.duration} • Specialist: <strong>{app.specialistName}</strong>
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-playfair-headline text-base font-semibold text-[#0d2222] block">
                                {app.price}
                              </span>
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#f7f4ef] border border-[#e5dfd3] text-[#55524b]">
                                {app.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Schedule & Suite Allocation */}
                        <div className="md:col-span-4 space-y-1 text-xs text-[#55524b]">
                          <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#eae5dc] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e]/80">
                                Date &amp; Time:
                              </span>
                              <span className="font-medium text-[#0d2222]">
                                {app.date} at {app.time}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e]/80">
                                Suite:
                              </span>
                              <span className="font-medium text-[#0d2222] truncate max-w-[160px]">
                                {app.suiteName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hospitality / Refreshment & Notes */}
                      {(app.notes || app.refreshment) && (
                        <div className="pt-2 border-t border-[#f7f4ef] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#6e685e]">
                          {app.refreshment && (
                            <div className="flex items-center gap-1.5">
                              <Coffee className="w-3.5 h-3.5 text-[#0d2222] shrink-0" />
                              <span>
                                Refreshment: <strong className="text-[#0d2222]">{app.refreshment}</strong>
                              </span>
                            </div>
                          )}
                          {app.notes && (
                            <div className="text-[11px] text-[#78746b] italic bg-[#faf8f5] px-3 py-1 rounded-lg border border-[#ede7dc] flex-1 sm:text-right">
                              "{app.notes}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 2: SPECIALIST CALENDARS & WALK-IN SLOTS */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Calendar Controls & Specialist Filter */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/30 pb-4">
                <div>
                  <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222] flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#0d2222]" />
                    <span>Specialist Daily Calendars &amp; Walk-In Slots</span>
                  </h3>
                  <p className="text-xs text-[#102e2e] mt-0.5">
                    Individual daily schedules for each staff member. Click any open slot to instantly book physical walk-in clients.
                  </p>
                </div>

                {/* Date Controls & Fast Walk-In Button */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#faf8f5] border border-[#e5dfd3]">
                    <button
                      type="button"
                      onClick={() => setCalendarDate(todayStr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        calendarDate === todayStr
                          ? 'bg-[#1c1b18] text-white'
                          : 'text-[#102e2e] hover:text-[#0d2222]'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarDate(tomorrowStr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        calendarDate === tomorrowStr
                          ? 'bg-[#1c1b18] text-white'
                          : 'text-[#102e2e] hover:text-[#0d2222]'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <input
                      type="date"
                      value={calendarDate}
                      onChange={(e) => setCalendarDate(e.target.value)}
                      className="px-2.5 py-1 rounded-lg text-xs border-0 bg-transparent text-[#0d2222] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() =>
                      handleOpenWalkIn(
                        calendarSpecialist !== 'all'
                          ? specialists.find((s) => s.id === calendarSpecialist)?.name
                          : undefined,
                        undefined,
                        calendarDate
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#1c1b18] text-[#faf8f5] hover:bg-[#33312c] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#53b8b6]" />
                    <span>+ Book Walk-In</span>
                  </button>
                </div>
              </div>

              {/* Specialist Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#102e2e]/80 shrink-0 mr-1">
                  Practitioner:
                </span>
                <button
                  onClick={() => setCalendarSpecialist('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    calendarSpecialist === 'all'
                      ? 'bg-[#1c1b18] text-white shadow-xs'
                      : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium border border-[#e5dfd3]'
                  }`}
                >
                  All Specialists ({specialists.length})
                </button>
                {specialists.map((spec) => {
                  const isSelected = calendarSpecialist === spec.id;
                  const specAppCount = appointments.filter(
                    (a) =>
                      a.date === calendarDate &&
                      (a.specialistName === spec.name || a.specialistId === spec.id) &&
                      a.status !== 'cancelled'
                  ).length;

                  return (
                    <button
                      key={spec.id}
                      onClick={() => setCalendarSpecialist(spec.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#1c1b18] text-white shadow-xs'
                          : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium border border-[#e5dfd3]'
                      }`}
                    >
                      <img
                        src={spec.avatar}
                        alt={spec.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{spec.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#e5dfd3] text-[#55524b]'
                        }`}
                      >
                        {specAppCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialist Schedule Cards / Columns */}
            <div
              className={`grid gap-6 ${
                calendarSpecialist === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {(calendarSpecialist === 'all'
                ? specialists
                : specialists.filter((s) => s.id === calendarSpecialist)
              ).map((spec) => {
                const specAppointments = appointments.filter(
                  (a) =>
                    a.date === calendarDate &&
                    (a.specialistName === spec.name || a.specialistId === spec.id) &&
                    a.status !== 'cancelled'
                );

                const timeSlotsList = [
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

                const bookedSlotTimes = specAppointments.map((a) => a.time);

                return (
                  <div
                    key={spec.id}
                    className="p-6 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] space-y-5"
                  >
                    {/* Specialist Profile Bar */}
                    <div className="flex items-start justify-between border-b border-white/30 pb-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={spec.avatar}
                          alt={spec.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-[#e5dfd3] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-playfair-headline text-base font-semibold text-[#0d2222]">
                              {spec.name}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                                spec.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : spec.status === 'in-service'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {spec.status}
                            </span>
                          </div>
                          <span className="text-xs text-[#102e2e] block">
                            {spec.role}
                          </span>
                          <span className="text-[11px] text-[#0d2222] font-medium flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {spec.workingHours || '09:00 AM - 07:00 PM'} • ★ {spec.rating}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#0d2222] block">
                          {specAppointments.length} Booked
                        </span>
                        <span className="text-[11px] text-[#059669] font-medium">
                          {timeSlotsList.length - bookedSlotTimes.length} Slots Open
                        </span>
                      </div>
                    </div>

                    {/* Services Certified Pill tags */}
                    {spec.servicesProvided && spec.servicesProvided.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e]/80">
                          Services:
                        </span>
                        {spec.servicesProvided.slice(0, 3).map((sId) => {
                          const sObj = services.find((s) => s.id === sId);
                          return (
                            <span
                              key={sId}
                              className="px-2 py-0.5 rounded-lg bg-[#faf8f5] border border-[#ede7dc] text-[10px] text-[#55524b]"
                            >
                              {sObj?.name || sId}
                            </span>
                          );
                        })}
                        {spec.servicesProvided.length > 3 && (
                          <span className="text-[10px] text-[#102e2e]/80 font-medium">
                            +{spec.servicesProvided.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Hourly Slots Timeline */}
                    <div className="space-y-2.5">
                      {timeSlotsList.map((slot) => {
                        const matchingApp = specAppointments.find((a) => a.time === slot);

                        if (matchingApp) {
                          return (
                            <div
                              key={slot}
                              className="p-3.5 rounded-xl border border-[#ede7dc] bg-[#faf8f5] space-y-2"
                            >
                              <div className="flex items-center justify-between border-b border-[#e8e2d5] pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#0d2222]">
                                    {slot}
                                  </span>
                                  {getStatusBadge(matchingApp.status)}
                                  {matchingApp.bookingType === 'walk-in' ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                      WALK-IN
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-blue-50 text-blue-900 border border-blue-200">
                                      ONLINE
                                    </span>
                                  )}
                                </div>
                                <span className="font-playfair-headline font-semibold text-xs text-[#0d2222]">
                                  {matchingApp.price}
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="text-xs font-semibold text-[#0d2222]">
                                    {matchingApp.clientName}
                                  </div>
                                  <div className="text-[11px] text-[#102e2e]">
                                    {matchingApp.serviceName} • {matchingApp.suiteName}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {matchingApp.status === 'confirmed' && (
                                    <button
                                      onClick={() => handleStatusChange(matchingApp.id, 'in-progress')}
                                      className="px-2 py-1 rounded text-[10px] font-medium bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
                                    >
                                      Check In
                                    </button>
                                  )}
                                  {matchingApp.status === 'in-progress' && (
                                    <button
                                      onClick={() => handleStatusChange(matchingApp.id, 'completed')}
                                      className="px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                                    >
                                      Done ✓
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditingAppointment(matchingApp);
                                      setIsModalOpen(true);
                                    }}
                                    className="p-1 rounded text-[#102e2e] hover:text-[#0d2222] hover:bg-white cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Available slot for this specialist!
                        return (
                          <div
                            key={slot}
                            className="p-2.5 sm:p-3 rounded-xl border border-dashed border-[#d8d3c7] hover:border-[#1c1b18] bg-white transition-colors flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-bold text-[#102e2e]/80 w-20">
                                {slot}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Open Slot Available
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenWalkIn(spec.name, slot, calendarDate)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#faf8f5] group-hover:bg-[#1c1b18] text-[#55524b] group-hover:text-white border border-[#e5dfd3] group-hover:border-[#1c1b18] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Book Walk-In</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. TAB 3: VIP SUITES & PODS REAL-TIME OCCUPANCY */}
        {activeTab === 'suites' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#eae5dc] pb-4">
                <div>
                  <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222]">
                    VIP Suites &amp; Acoustic Pods Real-Time Status
                  </h3>
                  <p className="text-xs text-[#102e2e]">
                    Hospital-grade Class-B autoclave sterilization tracking and live room occupancy.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-xs font-semibold text-[#065f46] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Autoclave Certified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suites.map((suite) => (
                  <div
                    key={suite.id}
                    className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 space-y-4 shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#0d2222] font-bold block">
                          {suite.type === 'vip-pod' ? 'VIP Acoustic Pod' : 'Private Treatment Suite'}
                        </span>
                        <h4 className="text-sm font-semibold text-[#0d2222]">
                          {suite.name}
                        </h4>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                          suite.status === 'occupied'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : suite.status === 'available'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {suite.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#eae5dc] space-y-2 text-xs text-[#55524b]">
                      {suite.status === 'occupied' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-[#102e2e]/80">Current Guest:</span>
                            <strong className="text-[#0d2222]">{suite.currentClient}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#102e2e]/80">Service:</span>
                            <span className="text-[#0d2222] truncate max-w-[140px]">{suite.currentService}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-[#059669] font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Suite sanitized and prepped for next guest</span>
                        </div>
                      )}

                      <div className="pt-1 border-t border-[#f0ebd9] flex justify-between text-[11px]">
                        <span className="text-[#102e2e]/80">Sterilization:</span>
                        <span className="font-semibold text-[#0d2222]">{suite.sanitizationCycle}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-[#102e2e]">
                        Next available: <strong>{suite.nextAvailableTime || 'Now'}</strong>
                      </span>
                      <button
                        onClick={() => handleToggleSuiteStatus(suite)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#d8d3c7] hover:border-[#0d2222] text-[#0d2222] font-bold hover:bg-white transition-colors cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB 4: TEAM & SPECIALISTS MANAGEMENT */}
        {activeTab === 'specialists' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#eae5dc] shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eae5dc] pb-4">
                <div>
                  <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0d2222]" />
                    <span>Team Specialists &amp; Services Architecture</span>
                  </h3>
                  <p className="text-xs text-[#102e2e] mt-0.5">
                    Add certified specialists and customize which specific salon treatments each person can perform.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSpecialist(null);
                    setIsSpecialistModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1c1b18] text-[#faf8f5] hover:bg-[#33312c] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#53b8b6]" />
                  <span>+ Add New Specialist</span>
                </button>
              </div>

              {/* Specialists Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {specialists.map((spec) => (
                  <div
                    key={spec.id}
                    className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 hover:border-[#c8c2b5] transition-all space-y-4 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={spec.avatar}
                            alt={spec.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-[#e5dfd3] shrink-0"
                          />
                          <div>
                            <h4 className="font-playfair-headline text-sm font-semibold text-[#0d2222]">
                              {spec.name}
                            </h4>
                            <span className="text-[11px] text-[#102e2e] block">
                              {spec.role}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#0d2222] font-medium mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <span>{spec.rating}</span>
                              <span className="text-[#c8c2b5]">•</span>
                              <span className="capitalize">{spec.category}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSpecialistDuty(spec)}
                          className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
                            spec.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : spec.status === 'in-service'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                          }`}
                          title="Click to toggle active / off-duty"
                        >
                          {spec.status}
                        </button>
                      </div>

                      {/* Contact & Hours */}
                      <div className="p-3 rounded-xl bg-white border border-[#eae5dc] space-y-1.5 text-xs text-[#55524b]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#102e2e]/80 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Shift:
                          </span>
                          <span className="font-medium text-[#0d2222]">
                            {spec.workingHours || '09:00 AM - 07:00 PM'}
                          </span>
                        </div>
                        {spec.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#102e2e]/80 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Phone:
                            </span>
                            <span className="font-mono text-[#0d2222]">{spec.phone}</span>
                          </div>
                        )}
                        {spec.email && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#102e2e]/80 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> Email:
                            </span>
                            <span className="truncate max-w-[150px] text-[#0d2222]">{spec.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Services Certified Checklist Badges */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e]/80">
                            Services Certified:
                          </span>
                          <span className="text-[#0d2222] font-semibold text-[10px]">
                            {spec.servicesProvided?.length || 0} Treatments
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                          {spec.servicesProvided && spec.servicesProvided.length > 0 ? (
                            spec.servicesProvided.map((sId) => {
                              const sObj = services.find((s) => s.id === sId);
                              return (
                                <span
                                  key={sId}
                                  className="px-2 py-0.5 rounded-lg bg-white border border-[#e5dfd3] text-[10px] text-[#0d2222] font-medium"
                                >
                                  {sObj?.name || sId}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-[11px] text-[#102e2e]/80 italic">
                              No specific services assigned yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-[#ede7dc] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCalendarSpecialist(spec.id);
                          setActiveTab('schedule');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#d8d3c7] hover:border-[#0d2222] text-[#0d2222] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CalendarDays className="w-3 h-3 text-[#0d2222]" />
                        <span>View Calendar</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSpecialist(spec);
                            setIsSpecialistModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#55524b] hover:text-[#0d2222] hover:bg-white transition-colors cursor-pointer"
                          title="Edit Specialist & Services"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSpecialist(spec.id, spec.name)}
                          className="p-1.5 rounded-lg text-[#991b1b] hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Specialist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB 5: TREATMENT MENU & SERVICES ARCHITECTURE */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Top Bar Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_25px_rgba(10,30,30,0.1)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/30 pb-4">
                <div>
                  <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222] flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-[#0d2222]" />
                    <span>Treatment Menu &amp; Services Architecture</span>
                  </h3>
                  <p className="text-xs text-[#102e2e] mt-0.5">
                    Add, edit, or remove salon treatments. Any changes instantly update the customer website and booking engine.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1c1b18] text-[#faf8f5] hover:bg-[#33312c] text-xs uppercase tracking-wider font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-[#53b8b6]" />
                  <span>+ Add New Treatment</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  {[
                    { id: 'all', label: 'All Services', count: services.length },
                    { id: 'nails', label: 'Nails', count: services.filter((s) => s.category === 'nails').length },
                    { id: 'hair', label: 'Hair', count: services.filter((s) => s.category === 'hair').length },
                    { id: 'grooming', label: 'Grooming', count: services.filter((s) => s.category === 'grooming').length },
                    { id: 'skin', label: 'Skin', count: services.filter((s) => s.category === 'skin').length },
                    { id: 'body', label: 'Body', count: services.filter((s) => s.category === 'body').length },
                    { id: 'lashes', label: 'Lashes', count: services.filter((s) => s.category === 'lashes').length },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setServiceCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                        serviceCategoryFilter === cat.id
                          ? 'bg-[#1c1b18] text-white shadow-xs'
                          : 'bg-white/20 text-[#0d2222] hover:bg-white/35 border border-white/40 font-medium border border-[#e5dfd3]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${serviceCategoryFilter === cat.id ? 'bg-white/20 text-white' : 'bg-[#eae5dc] text-[#102e2e]'}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick Search */}
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-[#102e2e]/80 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search treatments..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service) => {
                // Find certified specialists for this service
                const certSpecs = specialists.filter(
                  (sp) => sp.servicesProvided && sp.servicesProvided.includes(service.id)
                );

                return (
                  <div
                    key={service.id}
                    className="rounded-3xl bg-white border border-[#eae5dc] shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Service Photo Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-[#faf8f5]">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#0d2222] shadow-xs">
                            {service.category}
                          </span>
                          {service.popular && (
                            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-white" /> Popular
                            </span>
                          )}
                        </div>

                        {/* Price & Duration Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-xs flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-lg">
                            <Clock className="w-3 h-3 text-[#53b8b6]" />
                            {service.duration}
                          </span>
                          <span className="font-playfair-headline font-bold text-lg text-[#faf8f5]">
                            {service.price}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="font-playfair-headline font-semibold text-base text-[#0d2222] group-hover:text-[#0d2222] transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-xs text-[#102e2e] font-light mt-1 line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        {/* Benefits list (up to 2) */}
                        {service.benefits && service.benefits.length > 0 && (
                          <div className="space-y-1 pt-1 border-t border-[#f7f4ef]">
                            {service.benefits.slice(0, 2).map((b, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#55524b]">
                                <Check className="w-3 h-3 text-[#0d2222] shrink-0" />
                                <span className="truncate">{b}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Certified Specialists indicator */}
                        <div className="pt-2 border-t border-[#f7f4ef] flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e]/80">
                            Certified Team:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {certSpecs.length > 0 ? (
                              <div className="flex items-center -space-x-1.5 overflow-hidden">
                                {certSpecs.slice(0, 3).map((sp) => (
                                  <img
                                    key={sp.id}
                                    src={sp.avatar}
                                    alt={sp.name}
                                    className="w-5 h-5 rounded-full ring-2 ring-white object-cover"
                                    title={sp.name}
                                  />
                                ))}
                              </div>
                            ) : null}
                            <span className="text-[11px] font-semibold text-[#0d2222]">
                              {certSpecs.length} {certSpecs.length === 1 ? 'Specialist' : 'Specialists'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-[#faf8f5] border-t border-[#ede7dc] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService(service);
                          setIsServiceModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#d8d3c7] hover:border-[#0d2222] text-[#0d2222] font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Edit2 className="w-3 h-3 text-[#0d2222]" />
                        <span>Edit Service</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id, service.name)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Remove service from menu"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#eae5dc] space-y-3">
                <Scissors className="w-8 h-8 text-[#102e2e]/80 mx-auto" />
                <h4 className="font-playfair-headline text-base font-semibold text-[#0d2222]">
                  No Treatments Found
                </h4>
                <p className="text-xs text-[#102e2e] max-w-sm mx-auto">
                  {serviceSearch ? `No services match your search "${serviceSearch}".` : 'No treatments in this category yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsServiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1c1b18] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  + Add Treatment Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 8. APPOINTMENT MODAL (ADD / EDIT / WALK-IN) */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
        }}
        onSave={handleSaveAppointment}
        initialData={editingAppointment}
      />

      {/* 9. SPECIALIST MODAL (ADD / EDIT) */}
      <SpecialistModal
        isOpen={isSpecialistModalOpen}
        onClose={() => {
          setIsSpecialistModalOpen(false);
          setEditingSpecialist(null);
        }}
        onSave={handleSaveSpecialist}
        initialData={editingSpecialist}
      />

      {/* 10. SERVICE MODAL (ADD / EDIT) */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        initialData={editingService}
      />
    </div>
  );
};
