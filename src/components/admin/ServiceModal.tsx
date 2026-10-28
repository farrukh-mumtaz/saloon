import React, { useState } from 'react';
import { X, Sparkles, DollarSign, Clock, Tag, Check } from 'lucide-react';
import type { ServiceItem } from '../../data/salonData';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceData: Omit<ServiceItem, 'id'>, editingId?: string) => void;
  initialData?: ServiceItem | null;
}

const PRESET_SERVICE_PHOTOS: Record<string, string[]> = {
  nails: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop',
  ],
  hair: [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=900&auto=format&fit=crop',
  ],
  grooming: [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=900&auto=format&fit=crop',
  ],
  skin: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512290900672-1f5517f8b919?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=900&auto=format&fit=crop',
  ],
  body: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=900&auto=format&fit=crop',
  ],
  lashes: [
    'https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=900&auto=format&fit=crop',
  ],
};

const CATEGORIES: { id: ServiceItem['category']; label: string }[] = [
  { id: 'nails', label: 'Nails & Podology' },
  { id: 'hair', label: 'Hair Artistry' },
  { id: 'grooming', label: 'Executive Grooming & Shave' },
  { id: 'skin', label: 'Facials & Clinical Skin' },
  { id: 'body', label: 'Bodywork & Massage' },
  { id: 'lashes', label: 'Lashes & Brows' },
];

const ServiceFormDialog: React.FC<{
  onClose: () => void;
  onSave: (serviceData: Omit<ServiceItem, 'id'>, editingId?: string) => void;
  initialData?: ServiceItem | null;
}> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(() => initialData?.name || '');
  const [category, setCategory] = useState<ServiceItem['category']>(() => initialData?.category || 'nails');
  const [price, setPrice] = useState(() => initialData?.price || '$95');
  const [duration, setDuration] = useState(() => initialData?.duration || '60 min');
  const [popular, setPopular] = useState<boolean>(() => !!initialData?.popular);
  const [description, setDescription] = useState(() => initialData?.description || '');
  const [image, setImage] = useState(
    () =>
      initialData?.image ||
      PRESET_SERVICE_PHOTOS['nails'][0]
  );
  const [benefitsText, setBenefitsText] = useState(() =>
    initialData?.benefits && initialData.benefits.length > 0
      ? initialData.benefits.join('\n')
      : 'Conducted in acoustic VIP pod with Netflix & tea\nClass-B medical autoclave sterilized implements\nComplimentary espresso or organic herbal tea\nPersonalized specialist consultation'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Clean up price: ensure leading $ if not present
    let formattedPrice = price.trim();
    if (formattedPrice && !formattedPrice.startsWith('$')) {
      formattedPrice = '$' + formattedPrice;
    }

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    onSave(
      {
        name: name.trim(),
        category,
        price: formattedPrice || '$95',
        duration: duration.trim() || '60 min',
        popular,
        description: description.trim() || 'Private luxury treatment delivered by certified master specialists.',
        benefits: benefits.length > 0 ? benefits : ['Conducted in acoustic private suite', 'Medical autoclave implements'],
        image: image.trim() || PRESET_SERVICE_PHOTOS[category]?.[0] || PRESET_SERVICE_PHOTOS['nails'][0],
      },
      initialData?.id
    );
    onClose();
  };

  const handleCategoryChange = (newCat: ServiceItem['category']) => {
    setCategory(newCat);
    // Suggest preset image for new category if currently using another preset
    const currentPresets = Object.values(PRESET_SERVICE_PHOTOS).flat();
    if (currentPresets.includes(image)) {
      const catPresets = PRESET_SERVICE_PHOTOS[newCat];
      if (catPresets && catPresets.length > 0) {
        setImage(catPresets[0]);
      }
    }
  };

  const availablePresets = PRESET_SERVICE_PHOTOS[category] || PRESET_SERVICE_PHOTOS['nails'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#56bdbb] via-[#52b9b7] to-[#4da7a5] border border-white/50 text-[#0d2222] rounded-3xl shadow-2xl z-10 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/30 bg-white/25 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0d2222] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#53b8b6]" />
            </div>
            <div>
              <h3 className="font-playfair-headline text-lg font-semibold text-[#0d2222]">
                {initialData ? 'Edit Treatment Details' : 'Add New Salon Treatment'}
              </h3>
              <p className="text-[11px] text-[#102e2e]">
                Configure treatment name, pricing, duration, category, and guest experience details
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
          {/* Section 1: Core Details */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-3">
              1. Treatment Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Treatment Name *
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diamond Russian Manicure, French Balayage Melt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Service Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as ServiceItem['category'])}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Session Duration *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 60 min, 75 min, 90 min"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Treatment Price *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#102e2e]/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. $85, $140, $240"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center pt-6">
                <label className="relative flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="w-4 h-4 rounded border-[#d8d3c7] text-[#0d2222] focus:ring-[#1c1b18] accent-[#1c1b18]"
                  />
                  <span className="text-xs font-semibold text-[#0d2222]">
                    Featured / Popular Treatment
                  </span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#102e2e] font-semibold mb-1">
                  Treatment Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the treatment protocol, experience, and clinical benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Image & Presets */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-2">
              2. Cover Photo & Visuals
            </span>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={image}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-[#e5dfd3] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#102e2e]/80 font-semibold mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium"
                  />
                </div>
              </div>

              {/* Photo Presets for current category */}
              <div>
                <span className="text-[10px] text-[#102e2e] font-medium block mb-1.5">
                  Or select a curated photo for {CATEGORIES.find((c) => c.id === category)?.label}:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {availablePresets.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(presetUrl)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border transition-all cursor-pointer ${
                        image === presetUrl
                          ? 'border-[#8f6e39] ring-2 ring-[#8f6e39]'
                          : 'border-[#eae5dc] hover:border-[#1c1b18]'
                      }`}
                    >
                      <img src={presetUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      {image === presetUrl && (
                        <div className="absolute inset-0 bg-[#8f6e39]/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Included Benefits / Highlights */}
          <div className="pt-2 border-t border-[#f0ebd9]">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#0d2222] block mb-1">
              3. Included Experience & Benefits (One per line)
            </span>
            <p className="text-[11px] text-[#102e2e] mb-2">
              These points appear as checkmark highlights on the service card and detail modal.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Lasts 4+ weeks with pristine cuticles&#10;Conducted in acoustic VIP pod with Netflix & tea&#10;Surgical autoclave sterilized implements"
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/50 text-xs text-[#0d2222] placeholder:text-[#0d2222]/60 focus:outline-none focus:bg-white/40 focus:border-white font-medium resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#f0ebd9] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold border border-[#d8d3c7] text-[#666258] hover:text-[#0d2222] hover:border-[#1c1b18] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold bg-[#1c1b18] text-white hover:bg-[#33312c] cursor-pointer shadow-xs transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Treatment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  if (!isOpen) return null;

  return (
    <ServiceFormDialog
      key={initialData?.id || 'new-service'}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
};
