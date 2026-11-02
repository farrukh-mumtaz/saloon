import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Search,
  X,
  Check,
  Copy,
} from 'lucide-react';
import {
  getStoredCoupons,
  createNewCoupon,
  updateStoredCoupon,
  deleteStoredCoupon,
} from '../../services/couponStorage';
import { useLocalization } from '../../context/LocalizationContext';
import type { CouponItem, DiscountType } from '../../types/coupon';

export const CouponManagerView: React.FC = () => {
  const { formatPrice } = useLocalization();
  const [coupons, setCoupons] = useState<CouponItem[]>(() => getStoredCoupons());
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State for New Coupon
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minSpend, setMinSpend] = useState<number>(50);
  const [category, setCategory] = useState<string>('all');
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });
  const [badge, setBadge] = useState('Exclusive Deal');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const handleUpdate = () => {
      setCoupons(getStoredCoupons());
    };
    window.addEventListener('diamond_trim_coupon_change', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('diamond_trim_coupon_change', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStoredCoupon(id, { active: !currentStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      deleteStoredCoupon(id);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    createNewCoupon({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      minSpendUSD: minSpend ? Number(minSpend) : undefined,
      categoryRestriction: category,
      expiryDate,
      badge: badge.trim() || undefined,
      isPublic,
      active: true,
    });

    setCode('');
    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.active).length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.timesRedeemed || 0), 0);
    return { total, active, totalRedemptions };
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [coupons, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Stats */}
      <div className="p-6 rounded-3xl bg-white border border-[#eae5dc] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Marketing, Offers &amp; Coupon Engine
              </span>
            </div>
            <h3 className="font-playfair-headline text-2xl font-bold text-[#0d2222] mt-1">
              Promotions &amp; Voucher Management
            </h3>
            <p className="text-xs text-[#0d2222]/80 font-medium">
              Create and distribute discount promo codes for new guests, VIP members, and seasonal campaigns. Codes redeem automatically in online booking.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0d2222] text-white hover:bg-[#1a4444] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#50b7b5]" />
            <span>Create New Promo Code</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#eae5dc]">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              Total Campaigns Created
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-[#0d2222] block mt-0.5">
              {stats.total}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              Active Public &amp; VIP Offers
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-emerald-800 block mt-0.5">
              {stats.active}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              Total Guest Redemptions
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-[#0d2222] block mt-0.5">
              {stats.totalRedemptions} redeemed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#eae5dc] shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-[#0d2222]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code (e.g. WELCOME20) or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8] text-xs text-[#0d2222] focus:outline-none focus:bg-white"
          />
        </div>

        <span className="text-xs text-[#0d2222]/70 font-semibold">
          Showing {filteredCoupons.length} of {coupons.length} Promotions
        </span>
      </div>

      {/* 3. Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#eae5dc] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0d2222]">
            <thead className="bg-[#faf8f5] uppercase font-bold text-[10px] tracking-wider text-[#0d2222]/70 border-b border-[#eae5dc]">
              <tr>
                <th className="px-5 py-3.5">Promo Code</th>
                <th className="px-5 py-3.5">Campaign Title &amp; Description</th>
                <th className="px-5 py-3.5">Discount Rate</th>
                <th className="px-5 py-3.5">Min Spend &amp; Category</th>
                <th className="px-5 py-3.5">Valid Until</th>
                <th className="px-5 py-3.5">Redemptions</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe9]">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-xs text-[#0d2222]/70">
                    No promotions found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => {
                  const isCopied = copiedCode === c.code;
                  return (
                    <tr key={c.id} className="hover:bg-[#faf8f5] transition-colors">
                      {/* Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#0d2222] text-[#50b7b5] tracking-wider">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopy(c.code)}
                            className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                            title="Copy Code"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-[#0d2222]">{c.title}</span>
                          {c.badge && (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-800">
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#0d2222]/70 line-clamp-2">
                          {c.description}
                        </p>
                      </td>

                      {/* Discount Rate */}
                      <td className="px-5 py-4 font-bold text-sm">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `${formatPrice(c.discountValue)} OFF`}
                      </td>

                      {/* Min Spend & Category */}
                      <td className="px-5 py-4">
                        <span className="block font-semibold">
                          {c.minSpendUSD ? `Min: ${formatPrice(c.minSpendUSD)}` : 'No minimum'}
                        </span>
                        <span className="text-[10px] text-[#0d2222]/60 uppercase block">
                          Category: {c.categoryRestriction || 'all'}
                        </span>
                      </td>

                      {/* Expiry Date */}
                      <td className="px-5 py-4 font-medium">
                        {c.expiryDate}
                      </td>

                      {/* Redemptions */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#0d2222]">
                          {c.timesRedeemed}
                        </span>
                        {c.maxRedemptions && (
                          <span className="text-[10px] text-[#0d2222]/60 block">
                            / {c.maxRedemptions} max
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleStatus(c.id, c.active)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors border ${
                            c.active
                              ? 'bg-emerald-500/20 text-emerald-950 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                          }`}
                        >
                          {c.active ? '● Active' : '○ Paused'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg border border-[#e5e0d8] hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-gray-600"
                          title="Delete Promotion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CREATE NEW PROMO CODE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#eae5dc] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <h4 className="font-playfair-headline text-xl font-bold text-[#0d2222]">
                Create New Promotion Voucher
              </h4>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0d2222] mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8] font-mono uppercase font-bold"
                    placeholder="e.g. SUMMER30"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0d2222] mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                    placeholder="e.g. VIP Special"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="e.g. 30% Off Balayage & Hair Sculpting"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="Explain terms, benefits and private suite setting..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0d2222] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Fixed Dollar Off ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0d2222] mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8] font-bold"
                    placeholder="e.g. 20 for 20% or 50 for $50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0d2222] mb-1">
                    Minimum Spend (USD)
                  </label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0d2222] mb-1">
                    Category Restriction
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  >
                    <option value="all">All Services</option>
                    <option value="nails">Nails &amp; Podology</option>
                    <option value="hair">Hair Artistry</option>
                    <option value="grooming">Grooming &amp; Shave</option>
                    <option value="skin">Facials &amp; Skin</option>
                    <option value="body">Body &amp; Massage</option>
                    <option value="lashes">Lashes &amp; Brows</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publicPromo"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-[#0d2222]"
                />
                <label htmlFor="publicPromo" className="font-semibold text-[#0d2222] cursor-pointer">
                  Display in Public Offers Modal (Uncheck for VIP-only private codes)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#eae5dc]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e5e0d8] font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d2222] text-white font-bold hover:bg-[#1a4444]"
                >
                  Launch Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
