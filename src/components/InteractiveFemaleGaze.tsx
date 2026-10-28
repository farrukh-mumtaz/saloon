import React, { useEffect, useRef, useState, useCallback } from 'react';

type GazeDirection = 'center' | 'left' | 'right' | 'up' | 'down';

const CENTER_FRAME = 1;

// Calibrated 4-directional trajectories in female_movements_all_side
const TRAJECTORIES = {
  left: { center: 20, peak: 62 },
  right: { center: 90, peak: 128 },
  up: { center: 155, peak: 180 },
  down: { center: 215, peak: 235 },
};

// Phase 1: High-priority keyframes for instantaneous 60fps interaction
const PHASE_1_FRAMES = [
  CENTER_FRAME,
  // Left trajectory (center to extreme left)
  20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 62,
  // Right trajectory (center to extreme right)
  90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 128,
  // Up trajectory (center to extreme up)
  155, 159, 163, 167, 171, 175, 178, 180,
  // Down trajectory (center to extreme down)
  215, 219, 223, 227, 231, 235,
];

// Phase 2: In-between precision frames
const PHASE_2_FRAMES: number[] = [];
for (let i = 1; i <= 245; i++) {
  if (!PHASE_1_FRAMES.includes(i)) {
    PHASE_2_FRAMES.push(i);
  }
}

interface InteractiveFemaleGazeProps {
  className?: string;
  blendWithBackground?: boolean;
}

export const InteractiveFemaleGaze: React.FC<InteractiveFemaleGazeProps> = ({
  className = '',
  blendWithBackground = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  // References to keep animation loop 60+ FPS without re-renders
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastDrawnCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const idleTimerRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // 2D Tracking & Motion State
  const targetXRef = useRef<number>(0);
  const targetYRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const scrollBiasYRef = useRef<number>(0);

  const activeDirectionRef = useRef<GazeDirection>('center');
  const activeIntensityRef = useRef<number>(0);
  const currentDominantRef = useRef<'horizontal' | 'vertical'>('horizontal');

  // Helper to format frame path from female_movements_all_side
  const getFrameSrc = useCallback((frameNumber: number) => {
    return `/female_movements_all_side/ezgif-frame-${String(frameNumber).padStart(3, '0')}.jpg`;
  }, []);

  // Helper to retrieve the closest loaded frame from cache
  const getClosestLoadedImage = useCallback((targetNum: number): HTMLImageElement | null => {
    const cache = imagesRef.current;
    if (cache.has(targetNum)) {
      return cache.get(targetNum)!;
    }

    let closestNum = CENTER_FRAME;
    let minDiff = Infinity;
    for (const key of cache.keys()) {
      const diff = Math.abs(key - targetNum);
      if (diff < minDiff) {
        minDiff = diff;
        closestNum = key;
      }
    }
    return cache.get(closestNum) || null;
  }, []);

  // Draw image with proper headroom, studio backdrop match, and subtle 2D sub-pixel parallax
  const renderFrame = useCallback(
    (frameNum: number, curX: number, curY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = getClosestLoadedImage(frameNum);
      if (!img) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;
      const imgRatio = imgWidth / imgHeight;

      // Scale model so her full head, hair volume, and shoulders fit gracefully inside the container
      const scale = 0.88;
      const renderHeight = Math.floor(canvasHeight * scale);
      const renderWidth = Math.floor(renderHeight * imgRatio);

      // Base centered position with comfortable headroom
      const baseOffsetX = Math.floor((canvasWidth - renderWidth) / 2);
      const baseOffsetY = Math.floor(canvasHeight * 0.07);

      // Subtle 2D sub-pixel micro-parallax:
      // Adds tactile physical depth across both X and Y axes
      const parallaxX = Math.round(curX * 10);
      const parallaxY = Math.round(curY * 8);

      const offsetX = baseOffsetX + parallaxX;
      const offsetY = baseOffsetY + parallaxY;

      // Fill canvas with studio neutral tone matching photo top edge (RGB 234, 227, 217)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#eae3d9';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw the high-definition frame
      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
      lastDrawnFrameRef.current = frameNum;
      lastDrawnCoordsRef.current = { x: parallaxX, y: parallaxY };
    },
    [getClosestLoadedImage]
  );

  // Resize handler for HiDPI canvas
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      renderFrame(lastDrawnFrameRef.current > 0 ? lastDrawnFrameRef.current : CENTER_FRAME, currentXRef.current, currentYRef.current);
    }
  }, [renderFrame]);

  // Progressive frame loader
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately load the center hero image (Frame 1)
    const initialImg = new Image();
    initialImg.src = getFrameSrc(CENTER_FRAME);
    initialImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current.set(CENTER_FRAME, initialImg);
      setIsReady(true);
      handleResize();
    };

    const loadBatch = (frames: number[], onDone?: () => void) => {
      let loaded = 0;
      if (frames.length === 0) {
        onDone?.();
        return;
      }
      frames.forEach((frameNum) => {
        const img = new Image();
        img.src = getFrameSrc(frameNum);
        img.onload = () => {
          if (!isMounted) return;
          imagesRef.current.set(frameNum, img);
          loaded++;
          if (loaded === frames.length && onDone) {
            onDone();
          }
        };
        img.onerror = () => {
          loaded++;
          if (loaded === frames.length && onDone) {
            onDone();
          }
        };
      });
    };

    // Phase 1 (instant keyframes), then Phase 2 (in-between precision frames)
    loadBatch(PHASE_1_FRAMES, () => {
      if (isMounted) {
        loadBatch(PHASE_2_FRAMES);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getFrameSrc, handleResize]);

  // Setup ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  // 2D Mouse, Touch, and Scroll interaction listeners
  useEffect(() => {
    const updateTargetFromCoordinates = (clientX: number, clientY: number) => {
      const windowWidth = window.innerWidth || 1;
      const windowHeight = window.innerHeight || 1;
      let centerX = windowWidth / 2;
      let centerY = windowHeight * 0.45;
      let halfSpanX = windowWidth * 0.38;
      let halfSpanY = windowHeight * 0.38;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height * 0.42; // Center on model's eyes
        halfSpanX = Math.max(rect.width * 0.8, windowWidth * 0.35);
        halfSpanY = Math.max(rect.height * 0.7, windowHeight * 0.35);
      }

      const rawDeltaX = (clientX - centerX) / halfSpanX;
      const rawDeltaY = (clientY - centerY) / halfSpanY;

      targetXRef.current = Math.max(-1, Math.min(1, rawDeltaX));
      targetYRef.current = Math.max(-1, Math.min(1, rawDeltaY));

      // Reset idle timer: Return softly to center after 3.5s of no pointer movement
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        targetXRef.current = 0;
        targetYRef.current = 0;
      }, 3500);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateTargetFromCoordinates(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateTargetFromCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // Scroll listener: Gaze responds to scrolling up and down through content
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      // When hero is visible, bias gaze based on viewport scroll position
      if (rect.bottom > 0 && rect.top < viewportHeight) {
        const containerCenterY = rect.top + rect.height / 2;
        const viewportCenterY = viewportHeight / 2;
        // As user scrolls down, container moves up relative to viewport center,
        // so model's gaze looks downward toward the rest of the page
        const scrollDeltaY = (viewportCenterY - containerCenterY) / (viewportHeight * 0.6);
        scrollBiasYRef.current = Math.max(-0.6, Math.min(0.6, scrollDeltaY));
      } else {
        scrollBiasYRef.current = 0;
      }
    };

    const handleMouseLeave = () => {
      // Gently return to center gaze when pointer leaves window
      targetXRef.current = 0;
      targetYRef.current = 0;
    };

    // Device orientation for mobile tilt (if available)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right tilt in [-90, 90]
        // beta: front-to-back tilt in [-180, 180] (typical portrait hold is ~35-55)
        const tiltX = Math.max(-1, Math.min(1, e.gamma / 25));
        const tiltY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        targetXRef.current = tiltX;
        targetYRef.current = tiltY;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('deviceorientation', handleOrientation);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // 60+ FPS Animation loop using 2D continuous coordinates and smooth trajectory transitions
  useEffect(() => {
    let isActive = true;

    const animate = () => {
      if (!isActive) return;

      const targetX = targetXRef.current;
      const targetY = Math.max(-1, Math.min(1, targetYRef.current + scrollBiasYRef.current));

      // Smooth coordinate damping (0.14 gives a natural, responsive human head turn)
      currentXRef.current += (targetX - currentXRef.current) * 0.14;
      currentYRef.current += (targetY - currentYRef.current) * 0.14;

      const curX = currentXRef.current;
      const curY = currentYRef.current;
      const absX = Math.abs(curX);
      const absY = Math.abs(curY);
      const hypot = Math.hypot(curX, curY);

      let desiredDir: GazeDirection = 'center';
      let desiredIntensity = 0;

      if (hypot >= 0.06) {
        // Hysteresis on diagonal boundary (1.25x) prevents rapid flickering
        if (currentDominantRef.current === 'horizontal') {
          if (absY > absX * 1.25) {
            currentDominantRef.current = 'vertical';
          }
        } else {
          if (absX > absY * 1.25) {
            currentDominantRef.current = 'horizontal';
          }
        }

        if (currentDominantRef.current === 'horizontal') {
          desiredDir = curX < 0 ? 'left' : 'right';
          desiredIntensity = Math.min(1, absX);
        } else {
          desiredDir = curY < 0 ? 'up' : 'down';
          desiredIntensity = Math.min(1, absY);
        }
      }

      // Seamless directional transition:
      // When direction changes, gracefully ease intensity down through center (0) before opening the new direction
      if (activeDirectionRef.current === desiredDir) {
        activeIntensityRef.current += (desiredIntensity - activeIntensityRef.current) * 0.18;
      } else {
        activeIntensityRef.current += (0 - activeIntensityRef.current) * 0.25;
        if (activeIntensityRef.current < 0.05) {
          activeDirectionRef.current = desiredDir;
          activeIntensityRef.current = 0.05;
        }
      }

      // Map active direction and intensity to exact calibrated frame
      const dir = activeDirectionRef.current;
      const t = Math.max(0, Math.min(1, activeIntensityRef.current));
      let frameToRender = CENTER_FRAME;

      if (dir === 'left') {
        frameToRender = Math.round(TRAJECTORIES.left.center + t * (TRAJECTORIES.left.peak - TRAJECTORIES.left.center));
      } else if (dir === 'right') {
        frameToRender = Math.round(TRAJECTORIES.right.center + t * (TRAJECTORIES.right.peak - TRAJECTORIES.right.center));
      } else if (dir === 'up') {
        frameToRender = Math.round(TRAJECTORIES.up.center + t * (TRAJECTORIES.up.peak - TRAJECTORIES.up.center));
      } else if (dir === 'down') {
        frameToRender = Math.round(TRAJECTORIES.down.center + t * (TRAJECTORIES.down.peak - TRAJECTORIES.down.center));
      } else {
        frameToRender = CENTER_FRAME;
      }

      const parallaxX = Math.round(curX * 10);
      const parallaxY = Math.round(curY * 8);

      // Only re-draw canvas when either frame or sub-pixel coordinate changes
      if (
        frameToRender !== lastDrawnFrameRef.current ||
        parallaxX !== lastDrawnCoordsRef.current.x ||
        parallaxY !== lastDrawnCoordsRef.current.y
      ) {
        renderFrame(frameToRender, curX, curY);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden ${className}`}
      style={
        blendWithBackground
          ? {
              maskImage:
                'radial-gradient(ellipse 70% 75% at 50% 50%, black 50%, rgba(0, 0, 0, 0.85) 65%, rgba(0, 0, 0, 0.3) 80%, transparent 95%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 75% at 50% 50%, black 50%, rgba(0, 0, 0, 0.85) 65%, rgba(0, 0, 0, 0.3) 80%, transparent 95%)',
            }
          : undefined
      }
    >
      {/* High-performance canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Fallback & Initial Paint image to eliminate any blink or delay */}
      <img
        src={getFrameSrc(CENTER_FRAME)}
        alt="Diamond Trim Model Portrait"
        style={{
          objectPosition: 'center 22%',
          transform: 'scale(0.88) translateY(3.5%)',
        }}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
          isReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
