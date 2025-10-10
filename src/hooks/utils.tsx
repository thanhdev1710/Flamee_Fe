import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delaySecond: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delaySecond * 1000);

    return () => clearTimeout(handler);
  }, [value, delaySecond]);

  return debounceValue;
}
