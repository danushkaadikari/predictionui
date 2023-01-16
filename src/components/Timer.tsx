import React, { useEffect, useCallback, useMemo } from "react";
import { MAX_TIMER_IN_MINUTES } from "../constants/common";
import Button from "../UI/Button";

interface TimerType {
  seconds: number;
  minutes: number;
  setSeconds: any;
  setMinutes: any;
}

const Timer = ({
  seconds = 0,
  minutes = 0,
  setSeconds = () => {},
  setMinutes = () => {},
}: TimerType) => {
  const tabsItems = useMemo(() => {
    return ["LMNG/USDT", "BNB/USDT", "SOL/BNB"];
  }, []);

  const setTimer = useCallback(() => {
    const _seconds = seconds === 0 ? 59 : seconds - 1;
    setSeconds(_seconds);
    if (seconds === 0) {
      const _minutes = minutes - 1;
      setMinutes(_minutes);
      setSeconds(_minutes >= 0 ? 59 : 0);
    }
  }, [seconds, minutes, setSeconds, setMinutes]);

  useEffect(() => {
    if (minutes >= 0) {
      setTimeout(() => setTimer(), 1000);
    }
  }, [seconds, minutes]);

  const displayTimer = useMemo(() => {
    const _minutes = minutes > 0 ? minutes : 0;
    return `${_minutes >= 10 ? _minutes : `0${_minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }, [seconds, minutes]);

  return (
    <div className="flex items-center">
      {/* <div className="flex justify-end w-1/2 space-x-2">
        {tabsItems.map((item, index) => (
          <React.Fragment key={`tab-item-${index}`}>
            <Button color="default" label={item} customStyle="!text-white" />
          </React.Fragment>
        ))}
      </div> */}
      <div className="flex justify-end w-screen mr-20">
        <div className="bg-[#259da814] border-slate-600 border-solid border-[1px] rounded-xl text-white flex py-4 px-8 justify-center items-center">
          <p className="text-2xl font-semibold">{displayTimer}</p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
