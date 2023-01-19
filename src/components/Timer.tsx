import React, { useEffect, useCallback, useMemo } from "react";

interface TimerType {
  seconds: number | null;
  minutes: number | null;
  setSeconds: any;
  setMinutes: any;
  setDisableUpDown: any;
}

const Timer = ({
  seconds,
  minutes,
  setSeconds = () => {},
  setMinutes = () => {},
  setDisableUpDown,
}: TimerType) => {
  // const tabsItems = useMemo(() => {
  //   return ["LMNG/USDT", "BNB/USDT", "SOL/BNB"];
  // }, []);

  const setTimer = useCallback(() => {
    if (typeof minutes === "number" && typeof seconds === "number") {
      const _seconds = seconds === 0 ? 59 : seconds - 1;
      setSeconds(_seconds);
      if (seconds === 0) {
        const _minutes = minutes - 1;
        setMinutes(_minutes);
        setSeconds(_minutes >= 0 ? 59 : 0);
      }
    }
  }, [seconds, minutes, setSeconds, setMinutes]);

  useEffect(() => {
    let timeoutObject: any;
    if (typeof minutes === "number" && typeof seconds === "number") {
      if (minutes >= 0) {
        timeoutObject = setTimeout(() => setTimer(), 1000);
      }
      if (seconds === 10 && minutes <= 0) {
        setDisableUpDown(true);
      }
      if (seconds === 0 && minutes === 0) {
        setSeconds(null);
        setMinutes(null);
      }
    }

    return () => {
      clearTimeout(timeoutObject);
    };
  }, [seconds, minutes]);

  const displayTimer = useMemo(() => {
    if (typeof minutes === "number" && typeof seconds === "number") {
      const _minutes = minutes > 0 ? minutes : 0;
      return `${_minutes >= 10 ? _minutes : `0${_minutes}`}:${
        seconds >= 10 ? seconds : `0${seconds}`
      }`;
    }
    return "Calculating";
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
