import React, { useEffect, useState } from 'react';

const CountDown: React.FC = () => {
  const [days, setDays] = useState(15);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(24);
  const [seconds, setSeconds] = useState(59); // Start at 59 seconds for visual effect

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        if (minutes > 0) {
          setMinutes(minutes - 1);
          return 59; // Reset seconds
        }
        if (hours > 0) {
          setHours(hours - 1);
          setMinutes(59);
          return 59; // Reset seconds
        }
        if (days > 0) {
          setDays(days - 1);
          setHours(23);
          setMinutes(59);
          return 59; // Reset seconds
        }
        clearInterval(timer); // Clear timer when countdown is done
        return 0; // Countdown finished
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [days, hours, minutes]);

  return (
    <div className="grid grid-flow-col gap-3 text-center auto-cols-max">
      <div className="flex flex-col p-2 bg-cyan-700 rounded-box text-neutral-content text-sm italic">
        <span className="countdown font-mono text-xl">
          {/* The custom property must be cast to React.CSSProperties */}
          {days}
        </span>
        days
      </div>
      <div className="flex flex-col p-2 bg-cyan-700 rounded-box text-neutral-content text-sm italic">
        <span className="countdown font-mono text-xl">
            {hours}
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 bg-cyan-700 rounded-box text-neutral-content text-sm italic">
        <span className="countdown font-mono text-xl" >
            {minutes}
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-cyan-700 rounded-box text-neutral-content text-sm italic">
        <span className="countdown font-mono text-xl">
            {seconds}
        </span>
        sec
      </div>
    </div>
  );
};

export default CountDown;
