import { useCountDown } from "@/shared/hooks/use-countdown";
import { Button } from "@/shared/ui/kit/button";
import { formatTime } from "@/shared/utils";

interface CountdownProps {
  hours?: number;
  minutes?: number;
  seconds?: number;
  onComplete?: () => void;
}

export function Countdown({
  hours = 0,
  minutes = 0,
  seconds = 0,
  onComplete,
}: CountdownProps) {
  const durationMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;
  const { remainingMs, status, start, pause, reset } = useCountDown({
    durationMs,
    onComplete,
  });

  return (
    <section aria-label="Countdown timer">
      <div>{formatTime(remainingMs)}</div>
      <div>{status === "finished" ? "Time's up" : ""}</div>

      <div>
        {status === "running" ? (
          <Button onClick={pause}>Pause</Button>
        ) : (
          <Button onClick={start} disabled={status === "finished"}>
            {status === "paused" ? "Resume" : "Start"}
          </Button>
        )}
        <Button onClick={reset} disabled={status === "idle"}>
          Reset
        </Button>
      </div>
    </section>
  );
}
