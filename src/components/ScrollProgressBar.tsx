import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none h-[2.5px] bg-transparent">
      {/* Radiant Aqua Teal Spa Scroll Progress Indicator */}
      <div
        className="h-full bg-gradient-to-r from-[#247a78] via-[#53b8b6] to-[#a3dcda] shadow-[0_0_8px_rgba(83,184,182,0.5)] will-change-[width] transition-[width] duration-100 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {progress > 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rotate-45 bg-[#ffffff] border border-[#53b8b6] shadow-[0_0_8px_rgba(83,184,182,0.8)]" />
        )}
      </div>
    </div>
  );
};