import React, { useEffect, useMemo } from "react";
import { MAX_TIMER_IN_MINUTES } from "../constants/common";
import Button from "../UI/Button";
import { useState, useRef, useContext } from "react";
import RangeSlider from "../common/RangeSlider";
import { ReactComponent as Down } from "../assets/images/down.svg";
import { ReactComponent as Loader } from "../assets/images/loader.svg";
import { ReactComponent as Back } from "../assets/images/back.svg";
import { MetmaskContext } from "../contexts/MetmaskContextProvider";
import { BigNumber } from "ethers";
import {
  getMaticValue,
  getGweiValue,
  getPercentValue,
  // getValueFromPercentage,
} from "../utils/index";

interface CardType {
  loading: boolean;
  betBearHandler: (amount: number) => void;
  betBullHandler: (amount: number) => void;
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
  innerRef?: any;
  key: string | number;
  diff: number;
  downPerc: number;
  upPerc: number;
  userRounds: any;
  postClaim: Function;
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
            <Loader className="w-12 h-12 mr-3 -ml-1 text-white animate-spin" />
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
  const epochPresent = data.userRounds[data.epoch];
  if (epochPresent)
    console.log("LL: LiveBodyContent -> epochPresent", epochPresent);

  return (
    <div
      className={`space-y-4 h-48 border-[#3D8DFF] border-[1px] border-solid p-2 mx-2 !mt-0 rounded-lg text-white `}
    >
      <div className="flex w-100">
        <p
          className={`text-xs font-bold  ${
            data.active ? "opacity-90" : "opacity-30"
          }`}
        >
          Last Price
        </p>
        {epochPresent && epochPresent.claimable && !epochPresent.claimed && (
          <Button
            label={"Claim"}
            customStyle={"text-xs p-0 ml-auto"}
            onClick={() => data.postClaim(data.epoch)}
          />
        )}
      </div>
      <div className={`${data.active ? "" : "opacity-30"}`}>
        <div className="flex items-center justify-between text-xl font-bold">
          <p className="text-xl font-semibold font-poppins">
            ${data.active ? data.latestAnswer : data.closePrice}
          </p>
          <div className="bg-[#596CC4] rounded-lg px-4 py-2">
            <p className="flex items-center justify-between gap-1 text-xs font-bold ">
              <Down className={`${data.diff < 0 ? "rotate-180" : ""}`} />$
              {data.diff.toFixed(2)}
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
  return (
    <>
      {data.loading ? (
        <div className="flex items-center justify-center py-8 mx-1 h-80">
          <Loader className="w-12 h-12 mr-3 -ml-1 text-white animate-spin" />
        </div>
      ) : (
        <div className="py-8 mx-1">
          <div
            className={`flex flex-col items-center justify-center py-4 text-sm text-white bg-no-repeat ${
              data.diff < 0 ? "opacity-50" : ""
            }`}
            style={{
              backgroundImage: `url('/Polygon 1.svg')`,
              backgroundSize: "100% 150%",
              backgroundPositionY: "-1px",
            }}
          >
            <p className="text-xs font-medium uppercase">up</p>
            <p className="text-xs opacity-70"> {data.upPerc}x Payout</p>
          </div>
          {data.live ? (
            <LiveBodyContent {...data} diff={data.diff} />
          ) : (
            <NextBodyContent {...data} />
          )}
          <div
            className={`text-white text-sm flex flex-col justify-center items-center bg-no-repeat py-4 mx-4 ${
              data.diff > 0 ? "opacity-50" : ""
            }`}
            style={{
              backgroundImage: `url('/Polygon 2.png')`,
              backgroundSize: "100% 100%",
            }}
          >
            <p className="text-xs opacity-70">{data.downPerc}x Payout</p>
            <p className="text-xs font-medium uppercase ">down</p>
          </div>
        </div>
      )}
    </>
  );
};

export const FlipCardBack = ({
  innerRef,
  direction,
  setDirection,
  setShowBack,
  betBearHandler,
  betBullHandler,
  disabled,
}: {
  innerRef: any;
  direction: string;
  setDirection: Function;
  setShowBack: Function;
  betBearHandler: Function;
  betBullHandler: Function;
  disabled: boolean;
}) => {
  const flipCard = () => {
    if (innerRef && innerRef.current) {
      innerRef.current.style.transform = "rotateY(0deg)";
      setShowBack(false);
    }
  };
  const [rangeValue, setRangeValue] = useState("0");
  const [inputVal, setInputVal] = useState<number | string>("");

  const percentages = [10, 25, 50, 75, 100];
  const { connectHandler, balance, getBalance, setBalance } =
    useContext(MetmaskContext);

  useEffect(() => {
    (async () => {
      setBalance(await getBalance());
    })();
  }, []);

  useEffect(() => {
    if (balance) {
      setInputVal(
        getMaticValue(
          getPercentValue(BigNumber.from(balance), Number(rangeValue))
        )
      );
    }
  }, [rangeValue]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    connectHandler();

    if (!disabled) {
      const formatedInput = getGweiValue(inputVal);
      if (direction === "UP") {
        betBullHandler(formatedInput);
      } else {
        betBearHandler(formatedInput);
      }
      flipCard();
    }
  };
  const balanceStr =
    typeof balance === "string"
      ? balance
      : getMaticValue(balance || BigNumber.from(0));

  return (
    <div className="flip-card-back rounded-3xl bg-[#283573] border-slate-600 border-[1px] backdrop-blur-lg w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex px-4 py-2 text-xl w-100">
          <Back onClick={flipCard} />
          <div className="text-red-500">Set Position</div>

          {direction === "UP" ? (
            <div
              className="float-right px-2 ml-auto bg-[#84FF90] bg-opacity-30 rounded text-sm flex justify-between items-center gap-1 cursor-pointer"
              onClick={() => setDirection("DOWN")}
            >
              UP
              <Down />
            </div>
          ) : (
            <div
              className="float-right px-2 ml-auto bg-[#C3C3C3] bg-opacity-30 rounded text-sm flex justify-between items-center gap-1 cursor-pointer"
              onClick={() => setDirection("UP")}
            >
              DOWN
              <Down className="rotate-180" />
            </div>
          )}
        </div>
        <div
          className="bg-[#fd073a80] rounded-tr-3xl h-4 rounded-br-3xl transition-width   transition-slowest ease duration-500"
          style={{ width: "100%" }}
        ></div>
        <div className="mt-4 h-4/5">
          <div
            className={`flex px-4 py-2 w-100 ${disabled ? "opacity-50" : ""}`}
          >
            Commit:
          </div>
          <div className={`flex flex-col ${disabled ? "opacity-50" : ""}`}>
            <div className="flex px-4 py-2 w-100">
              <input
                type="number"
                className="block w-full px-3 py-3 m-0 text-base font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded-2xl form-control bg-clip-padding focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="amount"
                placeholder="Enter Amount"
                max={Number(balanceStr)}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                required
                disabled={disabled}
              />
            </div>
            <div className="px-4 py-2 text-xs text-right w-100">
              Balance : <span>{balanceStr}</span>
            </div>
            <div className="py-2 mx-4">
              <RangeSlider value={rangeValue} setValue={setRangeValue} />
            </div>
            <div className="flex justify-between gap-1 px-4 py-2 w-100 ">
              {percentages.map((percentage) => (
                <button
                  className="flex px-3 text-xs transition duration-300 bg-[#FF073A] rounded-full align-center w-max text-white ease py-1"
                  onClick={() => setRangeValue(percentage.toString())}
                  type="button"
                  disabled={disabled}
                  key={percentage}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col px-4 mt-10 w-100">
            <Button
              label={disabled ? "Connect Wallet" : "Predict"}
              customStyle="mb-2"
              type="submit"
            />
            <div className="text-xs">
              You won't be able to remove or change your position once you enter
              it.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export function Card({
  live = true,
  active = false,
  minutes = 0,
  ...rest
}: CardType) {
  const [direction, setDirection] = useState("UP");
  const [showBack, setShowBack] = useState(false);
  const [disabledBack, setDisabledBack] = useState(false);

  const innerRef = useRef<HTMLDivElement>(null);
  let diff = 0;
  let downPerc = 0;
  let upPerc = 0;
  let total = rest.totalAmount || 0;
  const { account } = useContext(MetmaskContext);
  if (!rest.loading) {
    const price: number = (
      active && live ? rest.latestAnswer : rest.closePrice
    ) as number;
    if (rest.prev) {
      diff = price - (rest.prev.closePrice as number);
    }
  }
  if (live && total > 0) {
    downPerc = (total as number) / (rest.bearAmount as number);
    upPerc = (total as number) / (rest.bullAmount as number);
  }

  const betBullHandler = () => {
    if (innerRef && innerRef.current) {
      innerRef.current.style.transform = "rotateY(180deg)";
      setDirection("UP");
      setShowBack(true);

      if (!window.ethereum || !account) {
        setDisabledBack(true);
      }
    }
  };
  const betBearHandler = () => {
    if (innerRef && innerRef.current) {
      innerRef.current.style.transform = "rotateY(180deg)";
      setDirection("DOWN");
      setShowBack(true);
      if (!window.ethereum || !account) {
        setDisabledBack(true);
      }
    }
  };

  useEffect(() => {
    if (disabledBack && account) {
      setDisabledBack(false);
    }
  }, [account]);

  return (
    <div className="h-full flip-card" key={rest.key}>
      <div className="flip-card-inner " ref={innerRef}>
        <div className="flip-card-front rounded-3xl bg-[#283573] border-slate-600 border-[1px] backdrop-blur-lg w-full">
          {/* <div
            className={` `}
          > */}
          <Header
            live={live}
            loading={rest.loading}
            epoch={rest.epoch}
            active={active}
            minutes={minutes}
          />
          <Body
            live={live}
            active={active}
            {...rest}
            betBearHandler={betBearHandler}
            betBullHandler={betBullHandler}
            upPerc={upPerc}
            downPerc={downPerc}
            diff={diff}
          />
          {/* </div> */}
        </div>
        {showBack && (
          <FlipCardBack
            innerRef={innerRef}
            direction={direction}
            setDirection={setDirection}
            setShowBack={setShowBack}
            betBearHandler={rest.betBearHandler}
            betBullHandler={rest.betBullHandler}
            disabled={disabledBack}
          />
        )}
      </div>
    </div>
  );
}

export default Card;
