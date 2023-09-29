import { useState, useEffect } from 'react';

const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [active, setActive] = useState<boolean>(true);

  useEffect(() => {
    if (!active) return;

    if (seconds === 0) {
      setActive(false);
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, active]);

  const reset = () => {
    setSeconds(initialSeconds);
    setActive(true);
  };

  return { seconds, reset, active };
};

export default useCountdown;
