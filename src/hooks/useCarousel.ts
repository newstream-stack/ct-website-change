import { useState, useEffect } from 'react';

interface UseCarouselOptions {
  interval?: number;
  enabled?: boolean;
}

export function useCarousel(count: number, options: UseCarouselOptions = {}) {
  const { interval = 5000, enabled = true } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!enabled || count <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval, enabled]);

  const next = () => setActiveIndex((prev) => (prev + 1) % count);
  const prev = () => setActiveIndex((prev) => (prev - 1 + count) % count);

  return { activeIndex, setActiveIndex, next, prev };
}
