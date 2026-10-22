import { Button } from "@/shared/ui/kit/button";
import { useState, useEffect, useRef } from "react";

export function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  const formatTime = () => {
    let hours: number | string = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes: number | string = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds: number | string = Math.floor((elapsedTime / 1000) % 60);
    // let milliseconds = Math.floor(elapsedTime % 1000);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col gap-8 w-screen items-center justify-center">
      <div className="text-7xl font-bold">{formatTime()}</div>
      <div className="flex gap-2">
        <Button onClick={start} size="lg">
          Start
        </Button>
        <Button onClick={stop} size="lg" variant="destructive">
          Stop
        </Button>
        <Button onClick={reset} size="lg" variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
