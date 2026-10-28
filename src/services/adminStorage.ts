import type {
  AppointmentItem,
  InquiryItem,
  SuiteItem,
  SpecialistItem,
} from '../types/admin';
import { SERVICES, type ServiceItem } from '../data/salonData';

const STORAGE_KEY_APPOINTMENTS = 'diamond_trim_appointments_v1';
const STORAGE_KEY_INQUIRIES = 'diamond_trim_inquiries_v1';
const STORAGE_KEY_SUITES = 'diamond_trim_suites_v1';
const STORAGE_KEY_SPECIALISTS = 'diamond_trim_specialists_v2';
const STORAGE_KEY_SERVICES = 'diamond_trim_services_v1';

export const DEFAULT_SPECIALISTS: SpecialistItem[] = [
  {
    id: 'spec-1',
    name: 'Elena Rostova',
    role: 'Master Podologist & Russian E-File Architect',
    category: 'nails',
    servicesProvided: ['nail-russian-mani', 'nail-gel-extensions', 'nail-podology-pedi'],
    rating: 4.99,
    reviewCount: 184,
    badge: 'Client Favorite',
    phone: '+1 (555) 392-1084',
    email: 'elena@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    workingHours: '09:00 AM - 07:00 PM',
    bio: '12+ years in medical dry manicure & podological therapies. European championship medalist.',
  },
  {
    id: 'spec-6',
    name: 'Chloe Vane',
    role: 'Haute Gel Sculptor & Nail Architect',
    category: 'nails',
    servicesProvided: ['nail-russian-mani', 'nail-gel-extensions'],
    rating: 4.97,
    reviewCount: 142,
    badge: 'Top Rated Artist',
    phone: '+1 (555) 388-9214',
    email: 'chloe@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    workingHours: '10:00 AM - 08:00 PM',
    bio: 'Specialist in architectural nail sculpting, high-gloss chrome, and immaculate Russian e-file cuticle care.',
  },
  {
    id: 'spec-7',
    name: 'Irina Belova',
    role: 'Clinical Medical Podologist',
    category: 'nails',
    servicesProvided: ['nail-russian-mani', 'nail-podology-pedi'],
    rating: 4.98,
    reviewCount: 96,
    badge: 'Podology Specialist',
    phone: '+1 (555) 441-7629',
    email: 'irina@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=300&auto=format&fit=crop',
    workingHours: '09:00 AM - 06:00 PM',
    bio: 'Certified podology therapist specializing in gentle rotary callus elimination and regenerative foot care.',
  },
  {
    id: 'spec-2',
    name: 'Antoine Moreau',
    role: 'Creative Director & Master Hair Sculptor',
    category: 'hair',
    servicesProvided: ['hair-bespoke-cut', 'hair-balayage-gloss', 'hair-nashi-filler'],
    rating: 5.0,
    reviewCount: 215,
    badge: 'Creative Director',
    phone: '+1 (555) 721-9943',
    email: 'antoine@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    workingHours: '10:00 AM - 08:00 PM',
    bio: 'Parisian-trained couture precision cutter and balayage colorist with 15+ years editorial experience.',
  },
  {
    id: 'spec-8',
    name: 'Sienna Laurent',
    role: 'Senior Balayage Artist & Color Alchemist',
    category: 'hair',
    servicesProvided: ['hair-bespoke-cut', 'hair-balayage-gloss', 'hair-nashi-filler'],
    rating: 4.98,
    reviewCount: 168,
    badge: 'Balayage Icon',
    phone: '+1 (555) 782-1139',
    email: 'sienna@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    workingHours: '09:00 AM - 07:00 PM',
    bio: 'Master of hand-painted sunlit dimensions, acidic bonding glazes, and healthy blonde transitions.',
  },
  {
    id: 'spec-9',
    name: 'Julian Thorne',
    role: 'Haute Scissor Architect & Texture Specialist',
    category: 'hair',
    servicesProvided: ['hair-bespoke-cut', 'hair-nashi-filler', 'grooming-gentleman-cut'],
    rating: 4.96,
    reviewCount: 114,
    badge: 'Precision Cutter',
    phone: '+1 (555) 673-4521',
    email: 'julian@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    workingHours: '11:00 AM - 08:00 PM',
    bio: 'London Academy trained scissor sculptor. Expert in face-framing geometry and organic movement.',
  },
  {
    id: 'spec-3',
    name: 'Dr. Celine Hayes',
    role: 'Clinical Dermal Esthetician',
    category: 'skin',
    servicesProvided: ['skin-diamond-glow', 'skin-lymphatic-modelage'],
    rating: 4.98,
    reviewCount: 178,
    badge: 'Dermal Expert',
    phone: '+1 (555) 884-2190',
    email: 'celine@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=300&auto=format&fit=crop',
    workingHours: '09:00 AM - 06:00 PM',
    bio: 'Expert in non-invasive skin regeneration, diamond micro-infusion, and clinical peptide cocktails.',
  },
  {
    id: 'spec-10',
    name: 'Amara Sinclair',
    role: 'Facial Sculptor & Buccal Modelage Specialist',
    category: 'skin',
    servicesProvided: ['skin-diamond-glow', 'skin-lymphatic-modelage', 'body-restorative-massage'],
    rating: 4.99,
    reviewCount: 139,
    badge: 'Client Favorite',
    phone: '+1 (555) 890-5421',
    email: 'amara@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop',
    workingHours: '10:00 AM - 07:00 PM',
    bio: 'Master of intra-oral buccal lifting, facial lymph drainage, and sculpting massage.',
  },
  {
    id: 'spec-4',
    name: 'Marcus Sterling',
    role: 'Senior Master Barber & Traditional Shave Specialist',
    category: 'grooming',
    servicesProvided: ['grooming-royal-shave', 'grooming-gentleman-cut'],
    rating: 4.97,
    reviewCount: 195,
    badge: 'Master Barber',
    phone: '+1 (555) 412-8871',
    email: 'marcus@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    workingHours: '09:00 AM - 08:00 PM',
    bio: 'Artisan 3-stage hot-towel straight-razor shaving and luxury executive grooming.',
  },
  {
    id: 'spec-11',
    name: 'Leo Vance',
    role: 'Executive Barber & Razor Detailing Specialist',
    category: 'grooming',
    servicesProvided: ['grooming-royal-shave', 'grooming-gentleman-cut'],
    rating: 4.96,
    reviewCount: 102,
    badge: 'Razor Artisan',
    phone: '+1 (555) 321-7789',
    email: 'leo@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
    workingHours: '10:00 AM - 07:00 PM',
    bio: 'Japanese feather razor artist specializing in crisp beard contours and tailored executive tapers.',
  },
  {
    id: 'spec-5',
    name: 'Maya Lin',
    role: 'Holistic Bodywork & Contour Therapist',
    category: 'body',
    servicesProvided: ['body-maderotherapy', 'body-restorative-massage'],
    rating: 4.99,
    reviewCount: 154,
    badge: 'Contour Master',
    phone: '+1 (555) 609-3321',
    email: 'maya@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    workingHours: '10:00 AM - 07:00 PM',
    bio: 'Specialist in wooden-roller maderotherapy, deep tissue lymph drainage, and silhouette sculpting.',
  },
  {
    id: 'spec-12',
    name: 'Gabriel Chen',
    role: 'Deep Tissue & Sports Restoration Therapist',
    category: 'body',
    servicesProvided: ['body-maderotherapy', 'body-restorative-massage'],
    rating: 4.97,
    reviewCount: 118,
    badge: 'Restoration Expert',
    phone: '+1 (555) 819-0023',
    email: 'gabriel@diamondtrim.com',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop',
    workingHours: '09:00 AM - 06:00 PM',
    bio: 'Certified neuromuscular and restorative bodywork therapist for deep tension relief.',
  },
];

export const SPECIALISTS_LIST = DEFAULT_SPECIALISTS;

export const INITIAL_SUITES: SuiteItem[] = [
  {
    id: 'suite-pod-1',
    name: 'Acoustic VIP Pod 1 (Nail & Podology)',
    type: 'vip-pod',
    category: 'nails',
    status: 'available',
    nextAvailableTime: 'Immediate',
    sanitizationCycle: 'Class-B Autoclave Complete',
  },
  {
    id: 'suite-pod-2',
    name: 'Acoustic VIP Pod 2 (Executive Grooming)',
    type: 'vip-pod',
    category: 'grooming',
    status: 'available',
    nextAvailableTime: 'Immediate',
    sanitizationCycle: 'Class-B Autoclave Complete',
  },
  {
    id: 'suite-priv-1',
    name: 'Private Skincare Sanctuary 1',
    type: 'private-suite',
    category: 'skin',
    status: 'available',
    nextAvailableTime: 'Immediate',
    sanitizationCycle: 'Class-B Autoclave Complete',
  },
  {
    id: 'suite-priv-2',
    name: 'Master Hair Atelier Suite',
    type: 'private-suite',
    category: 'hair',
    status: 'available',
    nextAvailableTime: 'Immediate',
    sanitizationCycle: 'Class-B Autoclave Complete',
  },
  {
    id: 'suite-priv-3',
    name: 'Body & Restoration Sanctuary',
    type: 'private-suite',
    category: 'body',
    status: 'available',
    nextAvailableTime: 'Immediate',
    sanitizationCycle: 'Class-B Autoclave Complete',
  },
];

// Event emitter helper for cross-component real-time sync
export const notifyAdminStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('diamond_trim_storage_update'));
  }
};

// Storage operations for Appointments (No dummy data; starts empty)
export const getStoredAppointments = (): AppointmentItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify([]));
      return [];
    }

    // Filter out any legacy dummy/seed items and known mock names
    const cleanList = parsed.filter((item: AppointmentItem) => {
      if (!item || !item.id) return false;
      if (
        item.id.startsWith('app-seed-') ||
        item.id.startsWith('mock-') ||
        item.id.startsWith('seed-') ||
        item.refCode?.startsWith('DT-8419') ||
        item.refCode?.startsWith('DT-9104') ||
        item.refCode?.startsWith('DT-6523')
      ) {
        return false;
      }
      if (
        item.clientName === 'Sophia Laurent' ||
        item.clientName === 'Claire Dubois' ||
        item.clientName === 'Alexander Vance' ||
        item.clientName === 'Vivienne Westwood'
      ) {
        return false;
      }
      return true;
    });

    if (cleanList.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(cleanList));
    }
    return cleanList;
  } catch (e) {
    console.error('Failed reading appointments from localStorage', e);
    return [];
  }
};

export const saveStoredAppointments = (appointments: AppointmentItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
    notifyAdminStorageChange();
  } catch (e) {
    console.error('Failed writing appointments to localStorage', e);
  }
};

export const createNewAppointment = (
  appointment: Omit<AppointmentItem, 'id' | 'createdAt'>
): AppointmentItem => {
  const current = getStoredAppointments();
  const newItem: AppointmentItem = {
    ...appointment,
    id: 'app-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  saveStoredAppointments(updated);
  return newItem;
};

export const updateStoredAppointment = (
  id: string,
  updates: Partial<AppointmentItem>
): AppointmentItem | null => {
  const current = getStoredAppointments();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  saveStoredAppointments([...current]);
  return updatedItem;
};

export const deleteStoredAppointment = (id: string): boolean => {
  const current = getStoredAppointments();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredAppointments(filtered);
  return true;
};

export const clearAllAppointments = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify([]));
  notifyAdminStorageChange();
};

// Storage operations for Inquiries
export const getStoredInquiries = (): InquiryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: InquiryItem) => !item.id.startsWith('inq-'));
  } catch (e) {
    console.error('Failed reading inquiries from localStorage', e);
    return [];
  }
};

export const saveStoredInquiries = (inquiries: InquiryItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
    notifyAdminStorageChange();
  } catch (e) {
    console.error('Failed writing inquiries to localStorage', e);
  }
};

export const createNewInquiry = (
  inquiry: Omit<InquiryItem, 'id' | 'createdAt'>
): InquiryItem => {
  const current = getStoredInquiries();
  const newItem: InquiryItem = {
    ...inquiry,
    id: 'inq-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  saveStoredInquiries(updated);
  return newItem;
};

export const updateStoredInquiry = (
  id: string,
  updates: Partial<InquiryItem>
): InquiryItem | null => {
  const current = getStoredInquiries();
  const index = current.findIndex((inq) => inq.id === id);
  if (index === -1) return null;
  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  saveStoredInquiries([...current]);
  return updatedItem;
};

export const deleteStoredInquiry = (id: string): boolean => {
  const current = getStoredInquiries();
  const filtered = current.filter((i) => i.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredInquiries(filtered);
  return true;
};

// Suites operations
export const getStoredSuites = (): SuiteItem[] => {
  if (typeof window === 'undefined') return INITIAL_SUITES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUITES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SUITES, JSON.stringify(INITIAL_SUITES));
      return INITIAL_SUITES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY_SUITES, JSON.stringify(INITIAL_SUITES));
      return INITIAL_SUITES;
    }

    const activeAppointments = getStoredAppointments();

    // Clean up any old dummy bookings or phantom guests attached to suites
    const cleaned = parsed.map((s: SuiteItem) => {
      // Check if current appointment genuinely exists and is in-progress
      const activeBooking = s.currentAppointmentId
        ? activeAppointments.find(
            (a) => a.id === s.currentAppointmentId && a.status === 'in-progress'
          )
        : null;

      if (activeBooking) {
        return {
          ...s,
          status: 'occupied' as const,
          currentClient: activeBooking.clientName,
          currentService: activeBooking.serviceName,
          currentAppointmentId: activeBooking.id,
          nextAvailableTime: 'In-service',
        };
      }

      // Purge any dummy seed data or unlinked phantom occupancy
      if (
        s.currentAppointmentId?.startsWith('app-seed-') ||
        s.currentAppointmentId?.startsWith('seed-') ||
        s.currentClient === 'Claire Dubois' ||
        s.currentClient === 'Sophia Laurent' ||
        (s.status === 'occupied' && !activeBooking)
      ) {
        return {
          ...s,
          status: s.status === 'sanitizing' ? ('sanitizing' as const) : ('available' as const),
          currentClient: undefined,
          currentService: undefined,
          currentAppointmentId: undefined,
          nextAvailableTime: 'Immediate',
        };
      }
      return s;
    });

    localStorage.setItem(STORAGE_KEY_SUITES, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return INITIAL_SUITES;
  }
};

export const updateStoredSuite = (
  id: string,
  updates: Partial<SuiteItem>
): SuiteItem | null => {
  const current = getStoredSuites();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SUITES, JSON.stringify(current));
    notifyAdminStorageChange();
  }
  return current[index];
};

// Specialists CRUD operations
export const getStoredSpecialists = (): SpecialistItem[] => {
  if (typeof window === 'undefined') return DEFAULT_SPECIALISTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SPECIALISTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SPECIALISTS, JSON.stringify(DEFAULT_SPECIALISTS));
      return DEFAULT_SPECIALISTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_SPECIALISTS, JSON.stringify(DEFAULT_SPECIALISTS));
      return DEFAULT_SPECIALISTS;
    }

    // Merge in any missing default specialists so all services have multiple practitioners
    const existingIds = new Set(parsed.map((s: SpecialistItem) => s.id));
    const missing = DEFAULT_SPECIALISTS.filter((d) => !existingIds.has(d.id));

    let updatedExisting = false;
    const mergedList = parsed.map((item: SpecialistItem) => {
      const defaultItem = DEFAULT_SPECIALISTS.find((d) => d.id === item.id);
      if (defaultItem) {
        // Ensure servicesProvided, badge, reviewCount are populated if missing in old stored item
        const needsServices = !item.servicesProvided || item.servicesProvided.length === 0;
        const needsBadge = !item.badge && !!defaultItem.badge;
        const needsReviews = !item.reviewCount && !!defaultItem.reviewCount;
        if (needsServices || needsBadge || needsReviews) {
          updatedExisting = true;
          return {
            ...item,
            servicesProvided: needsServices ? defaultItem.servicesProvided : item.servicesProvided,
            badge: item.badge || defaultItem.badge,
            reviewCount: item.reviewCount || defaultItem.reviewCount,
          };
        }
      }
      return item;
    });

    if (missing.length > 0 || updatedExisting) {
      const fullList = [...mergedList, ...missing];
      localStorage.setItem(STORAGE_KEY_SPECIALISTS, JSON.stringify(fullList));
      return fullList;
    }

    return mergedList;
  } catch (e) {
    console.error('Failed reading specialists from localStorage', e);
    return DEFAULT_SPECIALISTS;
  }
};

export const saveStoredSpecialists = (specialists: SpecialistItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SPECIALISTS, JSON.stringify(specialists));
    notifyAdminStorageChange();
  } catch (e) {
    console.error('Failed writing specialists to localStorage', e);
  }
};

export const createNewSpecialist = (
  specialist: Omit<SpecialistItem, 'id'>
): SpecialistItem => {
  const current = getStoredSpecialists();
  const newItem: SpecialistItem = {
    ...specialist,
    id: 'spec-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
  };
  const updated = [...current, newItem];
  saveStoredSpecialists(updated);
  return newItem;
};

export const updateStoredSpecialist = (
  id: string,
  updates: Partial<SpecialistItem>
): SpecialistItem | null => {
  const current = getStoredSpecialists();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;
  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  saveStoredSpecialists([...current]);
  return updatedItem;
};

export const deleteStoredSpecialist = (id: string): boolean => {
  const current = getStoredSpecialists();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredSpecialists(filtered);
  return true;
};

// Filter specialists available for a specific service
export const getSpecialistsForService = (
  serviceId: string,
  serviceCategory?: string
): SpecialistItem[] => {
  const specialists = getStoredSpecialists();
  return specialists.filter((s) => {
    if (s.status === 'off-duty') return false;
    // Check if serviceId is explicitly in servicesProvided
    if (s.servicesProvided && s.servicesProvided.includes(serviceId)) {
      return true;
    }
    // Check if category matches or specialist does all
    if (s.category === 'all') return true;
    if (serviceCategory && s.category === serviceCategory) return true;
    return false;
  });
};

// Get booked slots for a specialist on a specific date
export const getSpecialistBookedSlots = (
  specialistName: string,
  date: string,
  excludeAppointmentId?: string
): string[] => {
  const appointments = getStoredAppointments();
  return appointments
    .filter((a) => {
      if (a.date !== date) return false;
      if (a.status === 'cancelled') return false;
      if (excludeAppointmentId && a.id === excludeAppointmentId) return false;
      if (!specialistName || specialistName === 'Any Available Specialist') return false;
      return a.specialistName === specialistName;
    })
    .map((a) => a.time);
};

// Check if a specialist is available at a given date and time
export const isSpecialistAvailable = (
  specialistName: string,
  date: string,
  time: string,
  excludeAppointmentId?: string
): boolean => {
  if (!specialistName || specialistName === 'Any Available Specialist') return true;
  const bookedSlots = getSpecialistBookedSlots(specialistName, date, excludeAppointmentId);
  return !bookedSlots.includes(time);
};

// Services CRUD operations
export const getStoredServices = (): ServiceItem[] => {
  if (typeof window === 'undefined') return SERVICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(SERVICES));
      return SERVICES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(SERVICES));
      return SERVICES;
    }
    return parsed;
  } catch (e) {
    console.error('Failed reading services from localStorage', e);
    return SERVICES;
  }
};

export const saveStoredServices = (services: ServiceItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
    notifyAdminStorageChange();
  } catch (e) {
    console.error('Failed writing services to localStorage', e);
  }
};

export const createNewService = (
  service: Omit<ServiceItem, 'id'>
): ServiceItem => {
  const current = getStoredServices();
  const slug = service.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const id = `${service.category}-${slug || 'service'}-${(Date.now() % 9000) + 1000}`;
  const newItem: ServiceItem = {
    ...service,
    id,
  };
  const updated = [newItem, ...current];
  saveStoredServices(updated);
  return newItem;
};

export const updateStoredService = (
  id: string,
  updates: Partial<ServiceItem>
): ServiceItem | null => {
  const current = getStoredServices();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;
  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  saveStoredServices([...current]);
  return updatedItem;
};

export const deleteStoredService = (id: string): boolean => {
  const current = getStoredServices();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredServices(filtered);

  // Also clean up this service from specialists' servicesProvided list
  try {
    const specialists = getStoredSpecialists();
    let specsChanged = false;
    const updatedSpecs = specialists.map((spec) => {
      if (spec.servicesProvided && spec.servicesProvided.includes(id)) {
        specsChanged = true;
        return {
          ...spec,
          servicesProvided: spec.servicesProvided.filter((sId) => sId !== id),
        };
      }
      return spec;
    });
    if (specsChanged) {
      saveStoredSpecialists(updatedSpecs);
    }
  } catch (err) {
    console.error('Error cleaning up deleted service from specialists', err);
  }

  return true;
};

// Reset to clean empty state
export const resetToDemoData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_SUITES, JSON.stringify(INITIAL_SUITES));
  localStorage.setItem(STORAGE_KEY_SPECIALISTS, JSON.stringify(DEFAULT_SPECIALISTS));
  localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(SERVICES));
  notifyAdminStorageChange();
};

// CSV Export
export const exportAppointmentsCSV = (): void => {
  const list = getStoredAppointments();
  const headers = [
    'Ref Code',
    'Booking Source',
    'Client Name',
    'Phone',
    'Email',
    'Treatment',
    'Category',
    'Price',
    'Duration',
    'Date',
    'Time',
    'Suite',
    'Specialist',
    'Status',
    'Payment',
    'Notes',
    'Created At',
  ];

  const escapeCSV = (val: string | undefined | null) => {
    if (!val) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const rows = list.map((a) => [
    escapeCSV(a.refCode),
    escapeCSV(a.bookingType === 'walk-in' ? 'Physical Walk-In' : 'Online Website'),
    escapeCSV(a.clientName),
    escapeCSV(a.clientPhone),
    escapeCSV(a.clientEmail),
    escapeCSV(a.serviceName),
    escapeCSV(a.serviceCategory),
    escapeCSV(a.price),
    escapeCSV(a.duration),
    escapeCSV(a.date),
    escapeCSV(a.time),
    escapeCSV(a.suiteName),
    escapeCSV(a.specialistName),
    escapeCSV(a.status),
    escapeCSV(a.paymentStatus),
    escapeCSV(a.notes),
    escapeCSV(a.createdAt),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `diamond-trim-bookings-${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
