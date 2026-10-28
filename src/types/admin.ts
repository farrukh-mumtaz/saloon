export type AppointmentStatus = 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'pending';
export type PaymentStatus = 'paid' | 'deposit-received' | 'pending' | 'refunded';
export type SuiteType = 'vip-pod' | 'private-suite';
export type BookingSource = 'online' | 'walk-in';

export interface AppointmentItem {
  id: string;
  refCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  duration: string;
  price: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:00 AM"
  suiteType: SuiteType;
  suiteName: string; // e.g. "Acoustic VIP Pod 1", "Private Suite 3"
  specialistId?: string;
  specialistName: string;
  bookingType?: BookingSource;
  notes?: string;
  refreshment?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'archived';

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  notes: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface SuiteItem {
  id: string;
  name: string;
  type: SuiteType;
  category: string;
  status: 'available' | 'occupied' | 'sanitizing';
  currentClient?: string;
  currentService?: string;
  currentAppointmentId?: string;
  nextAvailableTime?: string;
  sanitizationCycle: 'Class-B Autoclave Complete' | 'Sterilization In-Progress' | 'Ready for Guest';
}

export interface SpecialistItem {
  id: string;
  name: string;
  role: string;
  category: string;
  servicesProvided: string[]; // List of service IDs they can perform
  rating: number;
  reviewCount?: number;
  badge?: string; // e.g. "Client Favorite", "Top Rated", "Creative Director"
  phone: string;
  email?: string;
  status: 'active' | 'in-service' | 'off-duty';
  avatar: string;
  workingHours?: string; // e.g. "09:00 AM - 07:00 PM"
  bio?: string;
}
