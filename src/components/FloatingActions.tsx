import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

export const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {/* Floating Concierge Icon with Animated Pulse Glow */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#53b8b6] opacity-40 animate-ping" />
        <a
          href={`https://wa.me/${SALON_INFO.whatsapp}?text=Hello%20Diamond%20Trim%2C%20I%20would%20like%20to%20inquire%20about%20availability.`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#102727] via-[#164444] to-[#258886] border border-[#53b8b6]/50 text-white shadow-lg hover:shadow-teal-500/40 hover:bg-[#25D366] hover:text-white hover:scale-110 flex items-center justify-center transition-all duration-300"
          title="Chat with Atelier Concierge on WhatsApp"
          aria-label="WhatsApp Concierge"
        >
          <MessageCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#80dedb] group-hover:text-white" />
        </a>
      </div>
    </div>
  );
};
