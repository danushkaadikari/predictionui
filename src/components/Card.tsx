import React, { useMemo } from "react";
import { MAX_TIMER_IN_MINUTES } from "../constants/common";
import Button from "../UI/Button";

interface CardType {
  loading: boolean;
  betBearHandler: () => void;
  betBullHandler: () => void;
  active?: boolean;
  live?: boolean;
  minutes?: number;
  bearAmount?: number;
  bullAmount?: number;
  closeOracleId?: number;
  closePrice?: number;
  closeTimestamp?: number;
  epoch?: number;
  lockOracleId?: number;
  lockPrice?: number;
  lockTimestamp?: number;
  oracleCalled?: boolean;
  rewardAmount?: number;
  rewardBaseCalAmount?: number;
  startTimestamp?: number;
  totalAmount?: number;
  currentEpoch?: number;
}

const Header = ({
  live,
  loading,
  epoch,
  active,
  minutes,
}: Partial<CardType>) => {
  const progress = useMemo(() => {
    return minutes ? (minutes * 100) / MAX_TIMER_IN_MINUTES : 0;
  }, [minutes]);

  let label = "live";
  if (live && active) {
    label = "live";
  } else if (!live) {
    label = "next";
  } else if (!active) {
    label = "expired";
  }
  return (
    <>
      <div
        className={`flex justify-between px-4 py-2 ${
          live
            ? ""
            : "bg-[#fd073a80] bg-opacity-50 rounded-tl-3xl rounded-tr-3xl"
        }`}
      >
        <p
          className={`uppercase ${
            live ? "text-red-500" : "text-white"
          } text-2xl`}
        >
          {label}
        </p>
        {loading ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block w-8 h-8 border-4 rounded-full spinner-border animate-spin"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <p className="text-2xl text-white font-poppins">{epoch}</p>
        )}
      </div>
      {live && active ? (
        <div className="bg-[#fd073a80] bg-opacity-50 w-full h-4">
          <div
            className="bg-[#fd073a80] rounded-tr-3xl h-4 rounded-br-3xl transition-width transition-slowest ease duration-500"
            style={{ width: `${progress}%` }}
          >
            &nbsp;
          </div>
        </div>
      ) : live && !active ? (
        <div className="bg-[#fd073a80] w-full h-4">&nbsp;</div>
      ) : (
        <div className="bg-[#283573] bg-opacity-50 w-full h-4"></div>
      )}
    </>
  );
};

const LiveBodyContent = (data: CardType) => {
  return (
    <div className="space-y-4 h-48 border-[#3D8DFF] border-[1px] border-solid p-2 mx-2 !mt-0 rounded-lg text-white">
      <p className="text-xs font-bold opacity-90">Last Price</p>
      <div className="flex items-center justify-between text-xl font-bold">
        <p className="text-xl font-semibold font-poppins">${data.closePrice}</p>
        <div className="bg-[#596CC4] rounded-lg px-4 py-2">
          <p className="flex items-center justify-between gap-1 text-xs font-bold">
            <svg
              width="19"
              height="22"
              viewBox="0 0 19 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.3178 0.642034C9.85102 0.175294 9.09429 0.175294 8.62755 0.642034L1.02159 8.24799C0.55485 8.71473 0.55485 9.47147 1.02159 9.93821C1.48833 10.4049 2.24506 10.4049 2.7118 9.93821L9.47266 3.17735L16.2335 9.93821C16.7002 10.4049 17.457 10.4049 17.9237 9.93821C18.3905 9.47147 18.3905 8.71473 17.9237 8.24799L10.3178 0.642034ZM10.6678 21.4065L10.6678 1.48714L8.27749 1.48714L8.27749 21.4065L10.6678 21.4065Z"
                fill="white"
              />
            </svg>
            $0.0020
          </p>
        </div>
      </div>
      <div className="flex !mt-6 justify-between opacity-70 text-xs font-medium">
        <p>Locked Price</p>
        <p>${data.lockPrice}</p>
      </div>
      <div className="flex !mt-6 justify-between font-bold text-xs">
        <p>Prize Pool</p>
        <p>${data.rewardAmount}</p>
      </div>
    </div>
  );
};

const NextBodyContent = (data: CardType) => {
  return (
    <div className="space-y-2 h-48 border-[#3D8DFF] border-[1px] border-solid p-2 mx-2 rounded-lg text-white">
      <div className="flex justify-between mb-4 text-xs font-bold">
        <p>Prize Pool</p>
        <p className="text-xs font-bold">${data.rewardAmount}</p>
      </div>
      <Button
        size={"sm"}
        label="Enter Up"
        color={"success"}
        customStyle="!w-full !py-3 !text-xs !font-bold"
        onClick={data.betBullHandler}
      />
      <Button
        size={"sm"}
        label="Enter Down"
        color={"danger"}
        customStyle="!w-full !py-3 !mb-8 !text-xs !font-bold"
        onClick={data.betBearHandler}
      />
    </div>
  );
};

const Body = (data: CardType) => {
  return (
    <>
      {data.loading ? (
        <div className="flex items-center justify-center">
          <div
            className="inline-block w-8 h-8 border-4 rounded-full spinner-border animate-spin"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="py-8 mx-1">
          <div
            className="flex flex-col items-center justify-center py-4 text-sm text-white bg-no-repeat"
            style={{
              backgroundImage: `url('/Polygon 1.svg')`,
              backgroundSize: "100% 150%",
              backgroundPositionY: "-1px",
            }}
          >
            <p className="text-xs font-medium uppercase">up</p>
            <p className="text-xs opacity-70"> {data.bullAmount}</p>
          </div>
          {data.live ? (
            <LiveBodyContent {...data} />
          ) : (
            <NextBodyContent {...data} />
          )}
          <div
            className={`text-white text-sm flex flex-col justify-center items-center bg-no-repeat py-4 mx-4`}
            style={{
              backgroundImage: `url('/Polygon 2.png')`,
              backgroundSize: "100% 100%",
            }}
          >
            <p className="text-xs opacity-70">{data.bearAmount}</p>
            <p className="text-xs font-medium uppercase ">down</p>
          </div>
        </div>
      )}
    </>
  );
};

export function Card({
  live = true,
  active = false,
  minutes = 0,
  ...rest
}: CardType) {
  return (
    <div
      className={`rounded-3xl bg-[#283573] border-slate-600 border-[1px] backdrop-blur-lg w-full ${
        active ? "" : "opacity-30"
      }`}
    >
      <Header
        live={live}
        loading={rest.loading}
        epoch={rest.epoch}
        active={active}
        minutes={minutes}
      />
      <Body live={live} {...rest} />
    </div>
  );
}

export default Card;
