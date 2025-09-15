import { memo, useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  durationMs: number;
  runId: number;
}


export const ProgressBar =  memo(function TimerBar({ durationMs, runId }: ProgressBarProps) {
  const [now, setNow] = useState(Date.now());
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [runId]);

 useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  const start = startRef.current;
  const end = start + durationMs;
  const total = durationMs;
  const remaining = Math.max(0, end - now);
  const pct = Math.max(0, Math.min(1, remaining / total));

  return (
    <div className="w-full h-1 bg-transparent overflow-hidden">
      <div
        className="h-full bg-orange-500 transition-[width] duration-100"
        style={{ width: `${pct * 100}%` }}
      />
    </div>
  );
});