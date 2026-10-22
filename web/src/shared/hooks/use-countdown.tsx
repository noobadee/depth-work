import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

type CountdownStatus = "idle" | "running" | "paused" | "finished";

interface UseCountdownOptions {
  durationMs: number;
  onComplete?: () => void;
  // How often to refresh the display. It keeps seconds from visibly skipping.
  tickMs?: number;
}

export function useCountDown({
  durationMs,
  onComplete,
  tickMs = 250,
}: UseCountdownOptions) {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [status, setStatus] = useState<CountdownStatus>("idle");

  const endAtRef = useRef(0);

  // React 19.2: an Effect Event always sees the latest onComplete,
  // but is not a dependency, so a new callback identity won't restart the interval.
  const fireComplete = useEffectEvent(() => onComplete?.());

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const id = setInterval(() => {
      const left = Math.max(0, endAtRef.current - performance.now());
      if (left === 0) {
        setStatus("finished");
        fireComplete();
      }
    }, tickMs);

    return () => clearInterval(id); // cleanup
  }, [status, tickMs]);

  const start = useCallback(() => {
    if (remainingMs <= 0) {
      return;
    }

    endAtRef.current = performance.now() + remainingMs;
    setStatus("running");
  }, [remainingMs]);

  const pause = useCallback(() => {
    setRemainingMs(Math.max(0, endAtRef.current - performance.now()));
    setStatus("paused");
  }, []);

  const reset = useCallback(() => {
    setRemainingMs(durationMs);
    setStatus("idle");
  }, [durationMs]);

  return { remainingMs, status, start, pause, reset };
}
