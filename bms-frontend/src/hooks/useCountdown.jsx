import React, { useEffect, useState } from "react";

export const useCountdown = ({ initialTimeInSeconds }) => {
  const [timeInSeconds, setTimeInSeconds] = useState(initialTimeInSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeInSeconds((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  return {
    displayTime: `${displayMinutes}:${displaySeconds}`,
    isExpired: timeInSeconds <= 0,
  };
};
