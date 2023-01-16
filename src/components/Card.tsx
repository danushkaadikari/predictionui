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
  disableUpDown?: boolean;
  latestAnswer?: number;
  prev?: CardType;
}

const Header = ({
  live,
  loading,
  epoch,
  active,
  minutes,
}: Partial<CardType>) => {
  const progress = useMemo(() => {
    return 100 - (((minutes as number) + 1) * 100) / MAX_TIMER_IN_MINUTES;
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
        }
        ${active ? "" : "opacity-30"}`}
      >
        <p
          className={`uppercase ${
            live ? "text-red-500" : "text-white"
          } text-2xl`}
        >
          {label}
        </p>
        {loading ? (
          <div className="flex items-center justify-center text-black">
            <svg
              className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          <p className="text-2xl text-white font-poppins">#{epoch}</p>
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

const LiveBodyContent = (data: any) => {
  return (
    <div
      className={`space-y-4 h-48 border-[#3D8DFF] border-[1px] border-solid p-2 mx-2 !mt-0 rounded-lg text-white ${
        data.active ? "" : "opacity-30"
      }`}
    >
      <p className="text-xs font-bold opacity-90">Last Price</p>
      <div className="flex items-center justify-between text-xl font-bold">
        <p className="text-xl font-semibold font-poppins">
          ${data.active ? data.latestAnswer : data.closePrice}
        </p>
        <div className="bg-[#596CC4] rounded-lg px-4 py-2">
          <p className="flex items-center justify-between gap-1 text-xs font-bold">
            <svg
              width="19"
              height="22"
              viewBox="0 0 19 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`rotate-${data.diff < 0 ? "180" : "0"}`}
            >
              <path
                d="M10.3178 0.642034C9.85102 0.175294 9.09429 0.175294 8.62755 0.642034L1.02159 8.24799C0.55485 8.71473 0.55485 9.47147 1.02159 9.93821C1.48833 10.4049 2.24506 10.4049 2.7118 9.93821L9.47266 3.17735L16.2335 9.93821C16.7002 10.4049 17.457 10.4049 17.9237 9.93821C18.3905 9.47147 18.3905 8.71473 17.9237 8.24799L10.3178 0.642034ZM10.6678 21.4065L10.6678 1.48714L8.27749 1.48714L8.27749 21.4065L10.6678 21.4065Z"
                fill="white"
              />
            </svg>
            ${data.diff.toFixed(2)}
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
    <div
      className={`space-y-2 h-48 border-[#3D8DFF] border-[1px] border-solid p-2 mx-2 rounded-lg text-white ${
        data.active ? "" : "opacity-30"
      } ${data.disableUpDown ? "opacity-50" : ""}`}
    >
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
        disabled={data.disableUpDown || !data.active}
      />
      <Button
        size={"sm"}
        label="Enter Down"
        color={"danger"}
        customStyle="!w-full !py-3 !mb-8 !text-xs !font-bold"
        onClick={data.betBearHandler}
        disabled={data.disableUpDown || !data.active}
      />
    </div>
  );
};

const Body = (data: CardType) => {
  let diff = 0;
  let downPerc = 0;
  let upPerc = 0;
  let total = data.totalAmount || 0;

  if (!data.loading) {
    const price: number = (
      data.active && data.live ? data.latestAnswer : data.closePrice
    ) as number;
    if (data.prev) {
      diff = price - (data.prev.closePrice as number);
    }
  }
  if (data.live && total > 0) {
    downPerc = (total as number) / (data.bearAmount as number);
    upPerc = (total as number) / (data.bullAmount as number);
  }
  return (
    <>
      {data.loading ? (
        <div className="flex items-center justify-center py-8 mx-1 h-80">
          <svg
            className="w-12 h-12 mr-3 -ml-1 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="py-8 mx-1">
          <div
            className={`flex flex-col items-center justify-center py-4 text-sm text-white bg-no-repeat ${
              diff < 0 ? "opacity-50" : ""
            }`}
            style={{
              backgroundImage: `url('/Polygon 1.svg')`,
              backgroundSize: "100% 150%",
              backgroundPositionY: "-1px",
            }}
          >
            <p className="text-xs font-medium uppercase">up</p>
            <p className="text-xs opacity-70"> {upPerc}x Payout</p>
          </div>
          {data.live ? (
            <LiveBodyContent {...data} diff={diff} />
          ) : (
            <NextBodyContent {...data} />
          )}
          <div
            className={`text-white text-sm flex flex-col justify-center items-center bg-no-repeat py-4 mx-4 ${
              diff > 0 ? "opacity-50" : ""
            }`}
            style={{
              backgroundImage: `url('/Polygon 2.png')`,
              backgroundSize: "100% 100%",
            }}
          >
            <p className="text-xs opacity-70">{downPerc}x Payout</p>
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
      className={`rounded-3xl bg-[#283573] border-slate-600 border-[1px] backdrop-blur-lg w-full `}
    >
      <Header
        live={live}
        loading={rest.loading}
        epoch={rest.epoch}
        active={active}
        minutes={minutes}
      />
      <Body live={live} active={active} {...rest} />
    </div>
  );
}

export default Card;
