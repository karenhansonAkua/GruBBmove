import { useState, useEffect } from "react";

export const uid = () => `GBM-${Date.now().toString(36).toUpperCase()}`;
export const pad = n => String(n).padStart(2, "0");

export function useCountdown(targetDate) {
  const [delta, setDelta] = useState(null);
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - Date.now();
      if (diff <= 0) { setDelta({ d:0,h:0,m:0,s:0 }); return; }
      setDelta({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return delta;
}
