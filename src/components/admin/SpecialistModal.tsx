import React, { useState, useMemo } from 'react';
import { X, User, Phone, Mail, Clock, Star, Sparkles, CheckSquare, Square, Image as ImageIcon } from 'lucide-react';
import { getStoredServices } from '../../services/adminStorage';
import type { SpecialistItem } from '../../types/admin';

interface SpecialistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SpecialistItem, 'id'>, editingId?: string) => void;
  initialData?: SpecialistItem | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=300&auto=format&fit=crop',
];

const SpecialistFormDialog: React.FC<{
  onClose: () => void;
  onSave: (data: Omit<SpecialistItem, 'id'>, editingId?: string) => void;
  initialData?: SpecialistItem | null;
}> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(() => initialData?.name || '');
  const [role, setRole] = useState(() => initialData?.role || '');
  const [category, setCategory] = useState(() => initialData?.category || 'nails');
  const [phone, setPhone] = useState(() => initialData?.phone || '');
  const [email, setEmail] = useState(() => initialData?.email || '');
  const [rating, setRating] = useState(() => initialData?.rating?.toString() || '4.98');
  const [badge, setBadge] = useState(() => initialData?.badge || '');
  const [status, setStatus] = useState<'active' | 'in-service' | 'off-duty'>(
    () => initialData?.status || 'active'
  );
  const [workingHours, setWorkingHours] = useState(
    () => initialData?.workingHours || '09:00 AM - 07:00 PM'
  );
  const [avatar, setAvatar] = useState(
    () => initialData?.avatar || PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]
  );
  const [bio, setBio] = useState(() => initialData?.bio || '');

  const allServices = useMemo(() => getStoredServices(), []);

  // Specific services this specialist provides
  const [servicesProvided, setServicesProvided] = useState<string[]>(() => {
    if (initialData?.servicesProvided && initialData.servicesProvided.length > 0) {
      return initialData.servicesProvided;
    }
    // Default to all services of selected category
    return getStoredServices().filter((s) => s.category === (initialData?.category || 'nails')).map((s) => s.id);
  });

  const toggleService = (serviceId: string) => {
    setServicesProvided((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleSelectAllCategory = (cat: string) => {
    const catServiceIds = allServices.filter((s) => s.category === cat).map((s) => s.id);
    setServicesProvided((prev) => Array.from(new Set([...prev, ...catServiceIds])));
  };

  const handleDeselectAllCategory = (cat: string) => {
    const catServiceIds = allServices.filter((s) => s.category === cat).map((s) => s.id);
    setServicesProvided((prev) => prev.filter((id) => !catServiceIds.includes(id)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        role: role.trim() || 'Atelier Specialist',
        category,
        servicesProvided,
        rating: parseFloat(rating) || 4.95,
        phone: phone.trim() || '+1 (555) 000-0000',
        email: email.trim(),
        status,
        avatar,
        workingHours,
        bio: bio.trim(),
        badge: badge.trim() || undefined,
        reviewCount: initialData?.reviewCount || 120,
      },
      initialData?.id
    );
    onClose();
  };

  const categories = [
    { id: 'nails', label: 'Nails & Podology' },
    { id: 'hair', label: 'Hair & Atelier' },
    { id: 'skin', label: 'Clinical Skincare' },
    { id: 'grooming', label: 'Executive Grooming' },
    { id: 'body', label: 'Bodywork & Massage' },
    { id: 'all', label: 'All Services (Master)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#56bdbb] via-[#52b9b7] to-[#4da7a5] border border-white/50 text-[#0d2222] rounded-3xl shadow-2xl z-10 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/30 bg-white/25 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0d2222] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#53b8b6]" />
            </div>
            <div>
              <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222]">
                {initialData ? 'Edit Specialist Profile' : 'Add New Specialist / Staff'}
              </h3>
              <p className="text-[11px] text-[#102e2e]">
                Configure specialist details and specific services they can perform
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              1. Personal & Professional Details
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
                    placeholder="e.g. Genevieve Blanc"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Role / Professional Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Nail Architect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Primary Specialty
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setCategory(newCat);
                    // Automatically add all services of this new category if none selected
                    if (servicesProvided.length === 0 && newCat !== 'all') {
                      setServicesProvided(allServices.filter((s) => s.category === newCat).map((s) => s.id));
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Duty Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  <option value="active">Active (Available for Bookings)</option>
                  <option value="in-service">In-Service</option>
                  <option value="off-duty">Off-Duty (Hide from booking)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="specialist@diamondtrim.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Working Shift Hours
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="09:00 AM - 07:00 PM"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Satisfaction Rating (★)
                </label>
                <div className="relative">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.01"
                    min="4.0"
                    max="5.0"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Highlight Badge (Optional)
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-[#0d2222] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Client Favorite, Balayage Icon"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Specialist Bio / Credentials
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Master colorist with 12+ years experience in Parisian haute couture ateliers."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Photo & Presets */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-2">
              2. Profile Photo
            </span>
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt="Preview"
                className="w-14 h-14 rounded-2xl object-cover border border-[#e5dfd3] shrink-0"
              />
              <div className="flex-1 space-y-1.5">
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-[10px] text-[#102e2e]/80 whitespace-nowrap">Presets:</span>
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border cursor-pointer shrink-0 transition-transform hover:scale-105 ${
                        avatar === url ? 'ring-2 ring-[#1c1b18]' : 'border-[#e2dcd0]'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specific Services Provided (Checkboxes) */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block">
                  3. Specific Services Provided *
                </span>
                <p className="text-[11px] text-[#102e2e]">
                  Select all services this person is certified to perform ({servicesProvided.length} selected)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServicesProvided(allServices.map((s) => s.id))}
                  className="text-[10px] uppercase tracking-wider font-semibold text-[#0d2222] hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-[#c8c2b5]">•</span>
                <button
                  type="button"
                  onClick={() => setServicesProvided([])}
                  className="text-[10px] uppercase tracking-wider font-semibold text-[#102e2e] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Service groups */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {['nails', 'hair', 'grooming', 'skin', 'body', 'lashes'].map((catKey) => {
                const groupServices = allServices.filter((s) => s.category === catKey);
                if (groupServices.length === 0) return null;

                const allInGroupSelected = groupServices.every((s) => servicesProvided.includes(s.id));

                return (
                  <div key={catKey} className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#e8e2d5] pb-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#0d2222]">
                        {catKey} Services
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          allInGroupSelected
                            ? handleDeselectAllCategory(catKey)
                            : handleSelectAllCategory(catKey)
                        }
                        className="text-[10px] text-[#0d2222] hover:underline cursor-pointer"
                      >
                        {allInGroupSelected ? 'Deselect category' : 'Select all in category'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groupServices.map((service) => {
                        const isChecked = servicesProvided.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-white border-[#1c1b18] shadow-2xs'
                                : 'bg-transparent border-[#eae5dc] hover:border-[#c8c2b5]'
                            }`}
                          >
                            <div className="pt-0.5 text-[#0d2222]">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#0d2222]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#c8c2b5]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-[#0d2222] truncate">
                                {service.name}
                              </div>
                              <div className="text-[10px] text-[#102e2e]">
                                {service.duration} • {service.price}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
              {initialData ? 'Update Specialist' : 'Add Specialist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SpecialistModal: React.FC<SpecialistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  if (!isOpen) return null;
  return (
    <SpecialistFormDialog
      key={initialData?.id || 'new-specialist'}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
};
