import React, { useEffect, useRef, useState, useCallback } from 'react';

const MIN_FRAME = 55; // Female looking extreme left
const MAX_FRAME = 155; // Female looking extreme right
const CENTER_FRAME = 105; // Female looking dead center forward

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
  const currentFrameRef = useRef<number>(CENTER_FRAME);
  const targetFrameRef = useRef<number>(CENTER_FRAME);
  const lastDrawnFrameRef = useRef<number>(-1);
  const idleTimerRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Helper to format frame path from the updated high-headroom asset set
  const getFrameSrc = useCallback((frameNumber: number) => {
    return `/female_movements_updated/ezgif-frame-${String(frameNumber).padStart(3, '0')}.jpg`;
  }, []);

  // Helper to retrieve the closest loaded frame
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

  // Draw image with proper headroom and studio backdrop match
  const renderFrame = useCallback(
    (frameNum: number) => {
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
      const offsetX = Math.floor((canvasWidth - renderWidth) / 2);
      // Position photo top at 7% from canvas top, giving comfortable headroom above her hair
      const offsetY = Math.floor(canvasHeight * 0.07);

      // Fill canvas with studio neutral tone matching photo top edge (RGB 234, 227, 217)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#eae3d9';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw the high-definition frame
      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
      lastDrawnFrameRef.current = frameNum;
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
      const current = Math.round(currentFrameRef.current);
      renderFrame(current);
    }
  }, [renderFrame]);

  // Progressive frame loader
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately load the center hero image (Frame 150)
    const initialImg = new Image();
    initialImg.src = getFrameSrc(CENTER_FRAME);
    initialImg.onload = () => {
      if (!isMounted) return;
      imagesRef.current.set(CENTER_FRAME, initialImg);
      setIsReady(true);
      handleResize();
    };

    // 2. Preload Phase 1: Keyframes every 2nd frame for instant 60fps tracking coverage
    const phase1Frames: number[] = [];
    for (let i = MIN_FRAME; i <= MAX_FRAME; i += 2) {
      if (i !== CENTER_FRAME) {
        phase1Frames.push(i);
      }
    }

    // 3. Preload Phase 2: In-between odd frames
    const phase2Frames: number[] = [];
    for (let i = MIN_FRAME + 1; i <= MAX_FRAME; i += 2) {
      if (i !== CENTER_FRAME) {
        phase2Frames.push(i);
      }
    }

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

    // Start Phase 1, then chain Phase 2
    loadBatch(phase1Frames, () => {
      if (isMounted) {
        loadBatch(phase2Frames);
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

  // Mouse and touch interaction listeners
  useEffect(() => {
    const updateTargetFromCoord = (clientX: number) => {
      const windowWidth = window.innerWidth || 1;
      let centerX = windowWidth / 2;
      let halfSpan = windowWidth * 0.38;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        // halfSpan: allows natural, responsive head sweep across container with smooth extension
        halfSpan = Math.max(rect.width * 0.75, windowWidth * 0.35);
      }

      const rawDelta = (clientX - centerX) / halfSpan;
      const normalizedDelta = Math.max(-1, Math.min(1, rawDelta));

      // Map normalized delta [-1, 1] across [55, 105, 155]
      // -1 -> 55 (left), 0 -> 105 (center), +1 -> 155 (right)
      const mappedFrame = CENTER_FRAME + normalizedDelta * (MAX_FRAME - CENTER_FRAME);
      targetFrameRef.current = mappedFrame;

      // Reset idle timer: Return softly to center after 3.5s of no pointer movement
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        targetFrameRef.current = CENTER_FRAME;
      }, 3500);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateTargetFromCoord(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateTargetFromCoord(e.touches[0].clientX);
      }
    };

    const handleMouseLeave = () => {
      // Gently return to center gaze when pointer leaves window
      targetFrameRef.current = CENTER_FRAME;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // Buttery-smooth animation loop using linear interpolation (lerp)
  useEffect(() => {
    let isActive = true;

    const animate = () => {
      if (!isActive) return;

      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      // Smooth damping factor (0.13 gives a very natural human head turn)
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current = current + diff * 0.13;
      } else {
        currentFrameRef.current = target;
      }

      const frameToRender = Math.round(currentFrameRef.current);
      if (frameToRender !== lastDrawnFrameRef.current) {
        renderFrame(frameToRender);
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
