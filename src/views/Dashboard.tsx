import React, { useMemo, useEffect } from "react";
import Card from "../components/Card";
import { MetmaskContext } from "../contexts/MetmaskContextProvider";
import Button from "../UI/Button";
import { useContext, useState } from "react";
import { BigNumber, Contract } from "ethers";
import Timer from "../components/Timer";
import {
  postBetBearAbi,
  postBetBullAbi,
} from "../contract/functions/lumangiPredicationV1";
import { LUMANAGI_PREDICTION_V1_ADDRESS } from "../constants/contract";
import { getMinBetAmount } from "../contract/functions/lumangiPredicationV1";
import {
  getEpochDetails,
  getCurrentEpoch,
} from "../contract/functions/lumangiPredicationV1";

const Tabs = () => {
  return (
    <>
      <div className="mx-20">
        <Button color={"secondary"} label="Crypto" size={"sm"} />
        <Button
          color="default"
          label="Stock"
          size={"sm"}
          customStyle="!text-white ml-2"
        />
      </div>
    </>
  );
};

const Dashboard: React.FC<{}> = () => {
  const { lumanagiPredictionV1Contract, postTransaction } =
    useContext(MetmaskContext);
  const [rounds, setRounds] = useState<any[]>([
    {
      live: true,
      active: false,
    },
    {
      live: true,
      active: false,
    },
    {
      live: true,
      active: true,
    },
    {
      live: false,
      active: true,
    },
    {
      live: false,
      active: false,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentEpoch, setCurrentEpoch] = useState<number>(-1);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const startRoundCallback = async (roundNo: BigNumber) => {
    const roundDetails = await getEpochDetails(
      lumanagiPredictionV1Contract as Contract,
      roundNo
    );
    console.log("LL: startRoundCallback -> roundDetails", roundDetails);

    // setRounds([...rounds, roundDetails]);
  };
  const lockRoundCallback = async (roundNo: BigNumber, price: BigNumber) => {
    const roundDetails = await getEpochDetails(
      lumanagiPredictionV1Contract as Contract,
      roundNo
    );
    console.log("LL: lockRoundCallback -> price", Number(price));
    console.log("LL: lockRoundCallback -> roundDetails", Number(roundDetails));
  };
  const endRoundCallback = async (
    roundNo: BigNumber,
    oracleRoundId: BigNumber,
    price: BigNumber
  ) => {
    const roundDetails = await getEpochDetails(
      lumanagiPredictionV1Contract as Contract,
      roundNo
    );
    console.log("LL: endRoundCallback -> roundDetails", Number(roundDetails));
    console.log("LL: endRoundCallback -> oracleRoundId", Number(oracleRoundId));
    console.log("LL: endRoundCallback -> price", Number(price));
  };
  const betBearHandler = async () => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBearAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );
      const betAmount = await getMinBetAmount(lumanagiPredictionV1Contract);
      postTransaction(LUMANAGI_PREDICTION_V1_ADDRESS, abi, betAmount);
    }
  };
  const betBullHandler = async () => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBullAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );
      const betAmount = await getMinBetAmount(lumanagiPredictionV1Contract);

      postTransaction(LUMANAGI_PREDICTION_V1_ADDRESS, abi, betAmount);
    }
  };

  useEffect(() => {
    if (lumanagiPredictionV1Contract) {
      setLoading(true);
      lumanagiPredictionV1Contract.on("StartRound", startRoundCallback);
      lumanagiPredictionV1Contract.on("LockRound", lockRoundCallback);
      lumanagiPredictionV1Contract.on("EndRound", endRoundCallback);
      (async () => {
        const currentEpoch = await getCurrentEpoch(
          lumanagiPredictionV1Contract
        );

        const allData = await Promise.all(
          [
            currentEpoch - 2,
            currentEpoch - 1,
            currentEpoch,
            currentEpoch + 1,
            currentEpoch + 2,
          ].map(async (epoch, index) => {
            const epochDetails = await getEpochDetails(
              lumanagiPredictionV1Contract,
              BigNumber.from(epoch)
            );
            const epochTemp =
              epochDetails && epochDetails.epoch > 0
                ? epochDetails.epoch
                : epoch;
            return { ...rounds[index], ...epochDetails, epoch: epochTemp };
          })
        );
        setCurrentEpoch(currentEpoch);
        setRounds(allData);
        setLoading(false);
      })();
    }
  }, [lumanagiPredictionV1Contract]);

  return (
    <div className="w-full">
      <Tabs />
      <Timer
        seconds={seconds}
        minutes={minutes}
        setSeconds={setSeconds}
        setMinutes={setMinutes}
      />
      <div
        className="grid grid-flow-col auto-cols-[100%] grid-rows-none gap-10 mt-10 overflow-x-scroll w-100 card-data sm:auto-cols-[35%] md:auto-cols-[20%] lg:auto-cols-[20%] xl:auto-cols-[20%] 2xl:auto-cols-[20%]"
        style={{
          overflowX: "scroll",
        }}
      >
        {rounds.map((data, index) => (
          <Card
            {...data}
            key={index}
            loading={loading}
            currentEpoch={currentEpoch}
            postTransaction={postTransaction}
            betBearHandler={betBearHandler}
            betBullHandler={betBullHandler}
            minutes={minutes}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
