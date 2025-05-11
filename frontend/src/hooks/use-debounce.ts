import debounce from 'lodash/debounce';
import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces any fast-changing value
 * @param value - the value to debounce
 * @param delay - debounce delay in ms
 */
export function useDebounce(value: any, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Create a debounced function
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    // Call the debounced function
    handler();

    // Cleanup on unmount or when value changes
    return () => {
      handler.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
}
