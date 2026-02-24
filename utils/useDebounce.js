import { useCallback, useRef } from "react";

/**
 * Returns a debounced version of `fn` that only fires after
 * `delay` ms of inactivity.
 *
 * Usage:
 *   const debouncedFn = useDebounce(myFn, 300);
 */
export function useDebounce(fn, delay) {
  const timerRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );
}