import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
  opacity: number;
  colorClass: string;
}

export const LuxuryCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse positions: target (real mouse) and current (smooth lerp trailing)
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Click sparkles
  const [sparkles, setSparkles] = useState<Particle[]>([]);

  const jewelColors = [
    'bg-gradient-to-tr from-teal-400 to-cyan-200 shadow-[0_0_8px_#2dd4bf]',
    'bg-gradient-to-tr from-emerald-400 to-teal-100 shadow-[0_0_8px_#34d399]',
    'bg-gradient-to-tr from-cyan-400 to-sky-200 shadow-[0_0_8px_#22d3ee]',
    'bg-gradient-to-tr from-teal-300 via-white to-emerald-200 shadow-[0_0_8px_#ffffff]',
    'bg-gradient-to-tr from-[#53b8b6] to-[#a3dcda] shadow-[0_0_8px_#53b8b6]',
  ];

  useEffect(() => {
    // Check if device has a fine pointer (mouse/trackpad, not touch screen)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, label[for], .cursor-pointer, [data-interactive="true"]'
        );
        setIsHovering(Boolean(interactive));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      // Generate a colorful burst of 8 jewel diamond sparkle particles
      const newSparkles: Particle[] = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3.5 + 2.5,
        angle: (i * (360 / 8) + Math.random() * 15) * (Math.PI / 180),
        speed: Math.random() * 2.5 + 2.5,
        opacity: 1,
        colorClass: jewelColors[i % jewelColors.length],
      }));

      setSparkles((prev) => [...prev.slice(-16), ...newSparkles]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics loop (lerp interpolation)
    const animate = () => {
      const lerp = 0.16; // Smooth fluid luxury lag
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0px) translate(-50%, -50%)`;
      }

      // Animate sparkles
      setSparkles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            opacity: p.opacity - 0.04,
          }))
          .filter((p) => p.opacity > 0)
      );

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Fluid Floating Luxury Diamond Halo */}
      <div
        ref={ringRef}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s, border-color 0.25s, box-shadow 0.25s, opacity 0.2s',
        }}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center will-change-transform ${
          isHovering
            ? 'w-12 h-12 border-2 border-teal-400 bg-gradient-to-tr from-teal-400/20 via-cyan-400/15 to-emerald-400/20 shadow-[0_0_24px_rgba(45,212,191,0.5)] backdrop-blur-[1px]'
            : isClicking
            ? 'w-7 h-7 border border-teal-500 bg-teal-500/25'
            : 'w-8 h-8 border border-[#247a78]/50 bg-teal-400/10'
        }`}
      >
        {/* Subtle center aqua gem particle */}
        <span
          className={`rounded-full transition-all duration-200 ${
            isHovering
              ? 'w-2 h-2 bg-gradient-to-r from-teal-300 to-cyan-200 shadow-[0_0_8px_#ffffff]'
              : 'w-1 h-1 bg-[#247a78]/80'
          }`}
        />
      </div>

      {/* Colorful Jewel Diamond Click Sparkle Bursts */}
      {sparkles.map((p) => (
        <span
          key={p.id}
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
          className={`fixed top-0 left-0 rounded-full ${p.colorClass} will-change-transform`}
        />
      ))}
    </div>
  );
};