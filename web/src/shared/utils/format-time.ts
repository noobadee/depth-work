interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

export function msToParts(ms: number): TimeParts {
  // ceil: 0.9s left should appear 00:00:01, not 00:00:00.
  // "00:00:00" should appear only when the timer is completely done.
  const total = Math.max(0, Math.ceil(ms / 1000));

  return {
    hours: Math.floor(total / (60 * 60)),
    // minutes: Math.floor((total * 60) % 60),
    minutes: Math.floor((total % 60) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatTime(ms: number): string {
  const { hours, minutes, seconds } = msToParts(ms);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
