import React, { useState, useEffect } from 'react';
import {
  X,
  Ticket,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { getStoredCoupons } from '../services/couponStorage';
import { useLocalization } from '../context/LocalizationContext';
import type { CouponItem } from '../types/coupon';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCouponForBooking: (code: string) => void;
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({
  isOpen,
  onClose,
  onSelectCouponForBooking,
}) => {
  const { t, formatPrice } = useLocalization();
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const all = getStoredCoupons();
      setCoupons(all.filter((c) => c.active && c.isPublic));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#50b7b5]/95 backdrop-blur-2xl border border-white/60 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_25px_60px_rgba(0,0,0,0.35)] z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/40 bg-white/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#0d2222]" />
            <span className="font-display-luxury text-xs tracking-widest font-bold text-[#0d2222]">
              DIAMOND TRIM • ATELIER OFFERS
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/50 bg-white/30 text-[#0d2222] hover:bg-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Banner */}
        <div className="p-6 text-center border-b border-white/30 bg-white/20 shrink-0">
          <h3 className="font-playfair-headline text-2xl font-bold text-[#0d2222]">
            {t('promo.title')}
          </h3>
          <p className="text-xs text-[#0d2222]/80 mt-1 max-w-md mx-auto font-medium">
            {t('promo.subtitle')}
          </p>
        </div>

        {/* Coupons List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3.5">
          {coupons.map((c) => {
            const isCopied = copiedCode === c.code;
            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white/35 backdrop-blur-md border border-white/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative group hover:bg-white/45 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0d2222] text-[#50b7b5] tracking-widest">
                      {c.code}
                    </span>
                    {c.badge && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-500/40">
                        {c.badge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[#0d2222]">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `${formatPrice(c.discountValue)} OFF`}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0d2222] pt-0.5">{c.title}</h4>
                  <p className="text-xs text-[#0d2222]/85 font-medium leading-relaxed">
                    {c.description}
                  </p>
                  <p className="text-[10px] text-[#0d2222]/60 font-semibold pt-0.5">
                    Valid until {c.expiryDate} {c.minSpendUSD ? `• Min spend $${c.minSpendUSD}` : ''}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/20">
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="flex-1 sm:w-full px-3 py-1.5 rounded-xl bg-white border border-white/60 hover:bg-[#0d2222] hover:text-white text-xs font-bold text-[#0d2222] transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('common.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('common.copyCode')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onSelectCouponForBooking(c.code);
                      onClose();
                    }}
                    className="flex-1 sm:w-full px-3 py-1.5 rounded-xl bg-[#0d2222] text-white hover:bg-[#1a4444] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>{t('common.redeem')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
