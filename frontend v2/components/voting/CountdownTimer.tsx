import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: React.ReactNode[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!(timeLeft as any)[interval] && (timeLeft as any)[interval] !== 0) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="text-center">
        <span className="text-2xl lg:text-4xl font-bold text-indigo-800">
          {(timeLeft as any)[interval]}
        </span>
        <span className="block text-xs uppercase text-gray-500">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-center space-x-4 sm:space-x-8">
      {timerComponents.length ? timerComponents : <span className="text-xl font-bold text-red-600">Time's up!</span>}
    </div>
  );
};

export default CountdownTimer;