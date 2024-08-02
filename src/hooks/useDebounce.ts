import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay = 250): T {
  const [debounce, setDebounce] = useState<T>(value);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => clearTimeout(timeId);
  }, [delay, value]);

  return debounce;
}

export default useDebounce;
