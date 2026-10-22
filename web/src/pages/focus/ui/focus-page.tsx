import { Countdown } from "@/pages/focus/index";

export function FocusPage() {
  const durationOptions = [
    { title: "25 min", value: 25 },
    { title: "50 min", value: 50 },
    { title: "90 min", value: 90 },
  ];

  return (
    <>
      {/* <h3>Focus Session</h3>
      <p>What are you working on?</p>
      <p>Pick a duration, optionally bundle a few tasks, then go distraction-free.</p>

      <p>Duration</p>
      <ul className="flex gap-2">
        {durationOptions.map((duration) => (
          <li key={duration.title} className="border rounded-sm p-2">{duration.title}</li>
        ))}
      </ul> */}
      {/* <StopWatch /> */}
      <Countdown
        hours={0}
        minutes={30}
        seconds={0}
        onComplete={() => console.log("Time's up!")}
      />
    </>
  );
}
