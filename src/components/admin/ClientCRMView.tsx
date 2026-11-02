import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import {
  getStoredCustomers,
  saveStoredCustomers,
  registerCustomer,
  updateCustomerProfile,
} from '../../services/customerStorage';
import { useLocalization } from '../../context/LocalizationContext';
import type { CustomerUser, CustomerJourneyStage, VIPTier } from '../../types/customer';

export const ClientCRMView: React.FC = () => {
  const { formatPrice } = useLocalization();
  const [customers, setCustomers] = useState<CustomerUser[]>(() => getStoredCustomers());
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | CustomerJourneyStage>('all');
  const [tierFilter, setTierFilter] = useState<'all' | VIPTier>('all');

  // Edit / Details Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRefreshment, setNewRefreshment] = useState('San Pellegrino & Espresso');
  const [newNotes, setNewNotes] = useState('');

  // Editing Client Form State
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editRefreshment, setEditRefreshment] = useState('');
  const [editPrivacy, setEditPrivacy] = useState<'absolute' | 'ambient' | 'silent'>('absolute');
  const [editAllergy, setEditAllergy] = useState('');
  const [editTier, setEditTier] = useState<VIPTier>('Silver');

  useEffect(() => {
    const handleUpdate = () => {
      setCustomers(getStoredCustomers());
    };
    window.addEventListener('diamond_trim_customer_change', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('diamond_trim_customer_change', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const openEditModal = (c: CustomerUser) => {
    setSelectedCustomer(c);
    setEditNotes(c.adminNotes || '');
    setEditTags(c.tags ? c.tags.join(', ') : '');
    setEditRefreshment(c.preferences?.refreshment || '');
    setEditPrivacy(c.preferences?.acousticPrivacy || 'absolute');
    setEditAllergy(c.preferences?.allergyNotes || '');
    setEditTier(c.vipTier);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const tagArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateCustomerProfile(selectedCustomer.id, {
      adminNotes: editNotes,
      tags: tagArray,
      vipTier: editTier,
      preferences: {
        ...selectedCustomer.preferences,
        refreshment: editRefreshment,
        acousticPrivacy: editPrivacy,
        allergyNotes: editAllergy,
      },
    });

    setIsEditModalOpen(false);
  };

  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) return;

    registerCustomer({
      name: newName,
      email: newEmail,
      phone: newPhone,
      refreshment: newRefreshment,
      allergyNotes: newNotes,
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Are you sure you want to remove this client record?')) {
      const current = getStoredCustomers();
      const updated = current.filter((c) => c.id !== id);
      saveStoredCustomers(updated);
    }
  };

  // Metrics
  const stats = useMemo(() => {
    const total = customers.length;
    const vips = customers.filter((c) => c.vipTier === 'Diamond VIP' || c.vipTier === 'Gold').length;
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpentUSD || 0), 0);
    const atRisk = customers.filter((c) => c.journeyStage === 'at-risk').length;
    return { total, vips, totalRevenue, atRisk };
  }, [customers]);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        const matchesPhone = c.phone.toLowerCase().includes(q);
        const matchesTag = c.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesNotes = c.adminNotes?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesTag && !matchesNotes) {
          return false;
        }
      }
      if (stageFilter !== 'all' && c.journeyStage !== stageFilter) return false;
      if (tierFilter !== 'all' && c.vipTier !== tierFilter) return false;
      return true;
    });
  }, [customers, searchQuery, stageFilter, tierFilter]);

  const stageBadges: Record<CustomerJourneyStage, { label: string; bg: string; text: string }> = {
    lead: { label: 'New Lead / Prospect', bg: 'bg-slate-500/20', text: 'text-slate-900 border-slate-400/40' },
    'first-visit': { label: 'First-Time Guest', bg: 'bg-emerald-500/20', text: 'text-emerald-950 border-emerald-500/40' },
    returning: { label: 'Returning Regular', bg: 'bg-blue-500/20', text: 'text-blue-950 border-blue-500/40' },
    vip: { label: 'VIP Diamond Member', bg: 'bg-amber-500/25', text: 'text-amber-950 border-amber-500/40' },
    'at-risk': { label: 'At-Risk (Inactive >60d)', bg: 'bg-rose-500/20', text: 'text-rose-950 border-rose-500/40' },
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Stats */}
      <div className="p-6 rounded-3xl bg-white border border-[#eae5dc] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#165a58]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#165a58]">
                Customer Record &amp; Journey Intelligence (CRM)
              </span>
            </div>
            <h3 className="font-playfair-headline text-2xl font-bold text-[#0d2222] mt-1">
              Guest Registry &amp; Lifecycle Tracking
            </h3>
            <p className="text-xs text-[#0d2222]/80 font-medium">
              Track customer milestones, lifetime value (LTV), visit frequency, loyalty points, and personalized suite preferences.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0d2222] text-white hover:bg-[#1a4444] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#50b7b5]" />
            <span>Add New Client</span>
          </button>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#eae5dc]">
          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              Total Registered Clients
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-[#0d2222] block mt-0.5">
              {stats.total}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              VIP Tier Members
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-[#0d2222] block mt-0.5">
              {stats.vips}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              Total Client Lifetime Value
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-[#0d2222] block mt-0.5">
              {formatPrice(stats.totalRevenue)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e5e0d8]">
            <span className="text-[10px] uppercase font-bold text-[#0d2222]/70 block">
              At-Risk / Retention Focus
            </span>
            <span className="font-playfair-headline text-2xl font-bold text-rose-900 block mt-0.5">
              {stats.atRisk}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Journey Funnel Stage Selector & Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#eae5dc] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              stageFilter === 'all'
                ? 'bg-[#0d2222] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#0d2222] hover:bg-[#eae5dc]'
            }`}
          >
            All Journey Stages ({customers.length})
          </button>
          <button
            onClick={() => setStageFilter('lead')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              stageFilter === 'lead'
                ? 'bg-[#0d2222] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#0d2222] hover:bg-[#eae5dc]'
            }`}
          >
            Leads ({customers.filter((c) => c.journeyStage === 'lead').length})
          </button>
          <button
            onClick={() => setStageFilter('first-visit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              stageFilter === 'first-visit'
                ? 'bg-[#0d2222] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#0d2222] hover:bg-[#eae5dc]'
            }`}
          >
            First-Time ({customers.filter((c) => c.journeyStage === 'first-visit').length})
          </button>
          <button
            onClick={() => setStageFilter('returning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              stageFilter === 'returning'
                ? 'bg-[#0d2222] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#0d2222] hover:bg-[#eae5dc]'
            }`}
          >
            Regulars ({customers.filter((c) => c.journeyStage === 'returning').length})
          </button>
          <button
            onClick={() => setStageFilter('vip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              stageFilter === 'vip'
                ? 'bg-[#0d2222] text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#0d2222] hover:bg-[#eae5dc]'
            }`}
          >
            VIP Diamond ({customers.filter((c) => c.journeyStage === 'vip').length})
          </button>
          <button
            onClick={() => setStageFilter('at-risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              stageFilter === 'at-risk'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-[#faf8f5] text-[#0d2222] hover:bg-[#eae5dc]'
            }`}
          >
            At Risk ({customers.filter((c) => c.journeyStage === 'at-risk').length})
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as 'all' | VIPTier)}
            className="px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8] text-xs font-semibold text-[#0d2222] focus:outline-none focus:bg-white cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Diamond VIP">Diamond VIP</option>
          </select>

          <div className="relative w-full md:w-56 shrink-0">
            <Search className="w-4 h-4 text-[#0d2222]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client, phone, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8] text-xs text-[#0d2222] focus:outline-none focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Clients Table / Cards */}
      <div className="bg-white rounded-3xl border border-[#eae5dc] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0d2222]">
            <thead className="bg-[#faf8f5] uppercase font-bold text-[10px] tracking-wider text-[#0d2222]/70 border-b border-[#eae5dc]">
              <tr>
                <th className="px-5 py-3.5">Guest Profile</th>
                <th className="px-5 py-3.5">Journey Stage</th>
                <th className="px-5 py-3.5">Tier &amp; Points</th>
                <th className="px-5 py-3.5">Total Visits</th>
                <th className="px-5 py-3.5">Lifetime Spend</th>
                <th className="px-5 py-3.5">Preferred Setting</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe9]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#0d2222]/70">
                    No clients found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const stage = stageBadges[c.journeyStage] || stageBadges.lead;
                  return (
                    <tr key={c.id} className="hover:bg-[#faf8f5] transition-colors">
                      {/* Guest Profile */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                            alt={c.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#e5e0d8] shadow-2xs shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#0d2222] block text-sm">
                              {c.name}
                            </span>
                            <span className="text-[11px] text-[#0d2222]/70 block font-medium">
                              {c.email}
                            </span>
                            <span className="text-[11px] text-[#0d2222]/70 block font-mono">
                              {c.phone}
                            </span>
                            {c.tags && c.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {c.tags.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-gray-100 text-gray-800"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Journey Stage */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${stage.bg} ${stage.text}`}>
                          {stage.label}
                        </span>
                        {c.lastVisitDate && (
                          <span className="text-[10px] text-[#0d2222]/60 block mt-1">
                            Last: {c.lastVisitDate}
                          </span>
                        )}
                      </td>

                      {/* Tier & Points */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#0d2222] block">
                          ✦ {c.vipTier}
                        </span>
                        <span className="text-[11px] text-[#0d2222]/70 font-semibold block mt-0.5">
                          {c.loyaltyPoints.toLocaleString()} points
                        </span>
                      </td>

                      {/* Visits */}
                      <td className="px-5 py-4 font-bold text-sm">
                        {c.totalVisits}
                      </td>

                      {/* Lifetime Spend */}
                      <td className="px-5 py-4">
                        <span className="font-playfair-headline text-base font-bold text-[#0d2222]">
                          {formatPrice(c.totalSpentUSD)}
                        </span>
                      </td>

                      {/* Preferred Setting */}
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-bold text-[#0d2222] block">
                          {c.preferences?.refreshment || 'Standard Espresso'}
                        </span>
                        <span className="text-[10px] text-[#0d2222]/70 block">
                          {c.preferences?.acousticPrivacy === 'absolute' ? '100% Silence Pod' : 'Ambient Music'}
                        </span>
                        {c.preferredSpecialistName && (
                          <span className="text-[10px] text-emerald-900 font-bold block mt-0.5">
                            Artist: {c.preferredSpecialistName}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 rounded-lg border border-[#e5e0d8] hover:bg-[#0d2222] hover:text-white transition-colors cursor-pointer"
                            title="Edit Client Notes & Preferences"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(c.id)}
                            className="p-1.5 rounded-lg border border-[#e5e0d8] hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Client Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. EDIT CLIENT MODAL */}
      {isEditModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#eae5dc] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <div>
                <h4 className="font-playfair-headline text-xl font-bold text-[#0d2222]">
                  Edit Guest: {selectedCustomer.name}
                </h4>
                <p className="text-xs text-[#0d2222]/70">
                  {selectedCustomer.email} • {selectedCustomer.phone}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  VIP Membership Tier
                </label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as VIPTier)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                >
                  <option value="Silver">Silver Tier</option>
                  <option value="Gold">Gold VIP Tier</option>
                  <option value="Diamond VIP">Diamond VIP Status</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Favorite Welcome Refreshment
                </label>
                <input
                  type="text"
                  value={editRefreshment}
                  onChange={(e) => setEditRefreshment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="e.g. San Pellegrino with Lemon & Iced Espresso"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Acoustic Privacy Mode
                </label>
                <select
                  value={editPrivacy}
                  onChange={(e) => setEditPrivacy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                >
                  <option value="absolute">100% Absolute Acoustic Silence</option>
                  <option value="ambient">Ambient Lounge Classical Music</option>
                  <option value="silent">Complete Digital Disconnect Mode</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Allergies &amp; Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={editAllergy}
                  onChange={(e) => setEditAllergy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="Skin sensitivities, preferred botanical oils..."
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Admin Private Notes &amp; Observations
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="Internal staff notes regarding booking habits, preferred pod..."
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">
                  Client Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="High LTV, Balayage Fan, Champagne, Weekend-Only"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e5e0d8] font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d2222] text-white font-bold hover:bg-[#1a4444]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD NEW CLIENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#eae5dc] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
              <h4 className="font-playfair-headline text-xl font-bold text-[#0d2222]">
                Register New Client
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0d2222] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="e.g. Eleanor Rigby"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="eleanor@example.com"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0d2222] mb-1">Welcome Refreshment</label>
                <input
                  type="text"
                  value={newRefreshment}
                  onChange={(e) => setNewRefreshment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e0d8]"
                  placeholder="e.g. San Pellegrino & Espresso"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e5e0d8] font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0d2222] text-white font-bold hover:bg-[#1a4444]"
                >
                  Create Client Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
