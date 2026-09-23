/**
 * useScrollDirection — Custom hook for detecting scroll direction
 * Uses requestAnimationFrame for performance (no jank)
 * Returns 'up' | 'down' and the current scroll position
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const THRESHOLD = 10; // Minimum scroll delta to trigger direction change

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDir = useCallback(() => {
    const currentScrollY = window.scrollY;

    setScrollY(currentScrollY);
    setIsAtTop(currentScrollY < 50);

    if (Math.abs(currentScrollY - lastScrollY.current) < THRESHOLD) {
      ticking.current = false;
      return;
    }

    setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
    lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateScrollDir]);

  return { scrollDirection, scrollY, isAtTop };
}
