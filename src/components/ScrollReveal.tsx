import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'blur-in';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: ScrollAnimationType;
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.08,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
      observer.disconnect();
    };
  }, [threshold]);

  const getInitialStyle = (): React.CSSProperties => {
    const baseTransition = {
      transitionProperty: 'opacity, transform, filter',
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform',
    };

    if (isVisible) {
      return {
        ...baseTransition,
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'blur(0px)',
      };
    }

    switch (animation) {
      case 'fade-up':
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'translate3d(0, 32px, 0)',
        };
      case 'fade-down':
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'translate3d(0, -28px, 0)',
        };
      case 'fade-left':
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'translate3d(32px, 0, 0)',
        };
      case 'fade-right':
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'translate3d(-32px, 0, 0)',
        };
      case 'zoom-in':
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'scale(0.93)',
        };
      case 'blur-in':
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'scale(0.97)',
          filter: 'blur(8px)',
        };
      default:
        return {
          ...baseTransition,
          opacity: 0,
          transform: 'translate3d(0, 24px, 0)',
        };
    }
  };

  return (
    <div ref={elementRef} style={getInitialStyle()} className={className}>
      {children}
    </div>
  );
};