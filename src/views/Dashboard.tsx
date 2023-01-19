import React, { useEffect } from "react";
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
import {
  getEpochDetails,
  getCurrentEpoch,
} from "../contract/functions/lumangiPredicationV1";
import { convertEpochToDate, getSecondsDiffrence } from "../utils/index";
import { getLatestAnswer } from "../contract/functions/eacAggregatorProxy";
import {
  getUserRounds,
  postClaimAbi,
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
  const {
    lumanagiPredictionV1Contract,
    postTransaction,
    eacAggregatorProxyContract,
    getBalance,
    account,
  } = useContext(MetmaskContext);
  const [userRounds, setUserRounds] = useState<any>({});
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
  const [loadingCurrentCard, setLoadingCurrentCard] = useState<boolean>(false);

  const [currentEpoch, setCurrentEpoch] = useState<number>(-1);
  const [disableUpDown, setDisableUpDown] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<null | number>(null);
  const [minutes, setMinutes] = useState<null | number>(null);
  const [latestAnswer, setLatestAnswer] = useState<null | number>(null);
  const [oldest, setOldest] = useState<any>(null);

  const setDisplayData = async (selectedEpoch: number) => {
    const allData = await getRoundsData([
      selectedEpoch - 4,
      selectedEpoch - 3,
      selectedEpoch - 2,
      selectedEpoch - 1,
      selectedEpoch,
      selectedEpoch + 1,
    ]);

    setCurrentEpoch(selectedEpoch);
    const endEpochDataTimpStamp = allData[4].lockTimestamp;

    const secondsData = getSecondsDiffrence(
      new Date(),
      convertEpochToDate(endEpochDataTimpStamp)
    );

    setSeconds(secondsData % 60);
    setMinutes(secondsData < 60 ? 0 : Math.floor(secondsData / 60));
    setOldest(allData[0]);
    setRounds([allData[1], allData[2], allData[3], allData[4], allData[5]]);
  };
  /**
   * Handles callback for start round event
   * @param epoch Epoch of newly started round
   */

  const startRoundCallback = async (epoch: BigNumber) => {
    const newEpoch = Number(epoch);
    setDisableUpDown(false);
    setLoading(true);
    setDisplayData(newEpoch);
    setLoading(false);
  };

  /**
   * Handles callback for Lock round event
   */

  const lockRoundCallback = async (
    epoch: BigNumber,
    roundId: BigNumber,
    price: BigNumber
  ) => {
    console.log("LL: lockRoundCallback Start");
    console.log("LL: lockRoundCallback -> Number(epoch)", Number(epoch));
    console.log("LL: lockRoundCallback -> Number(roundId)", Number(roundId));
    console.log("LL: lockRoundCallback -> Number(price)", Number(price));
    console.log("LL: lockRoundCallback End");
  };

  /**
   * Handles callback for end round event
   */

  const endRoundCallback = async () => {};

  /**
   * Handles click of enter up button
   */

  const betBearHandler = async (amount: Number) => {
    console.log("LL: betBearHandler -> amount", Number(amount));
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBearAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );
      // const betAmount = await getMinBetAmount(lumanagiPredictionV1Contract);
      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        BigNumber.from(amount)
      );
    }
  };

  /**
   * Handles click of enter down button
   */

  const betBullHandler = async (amount: Number) => {
    console.log("LL: betBullHandler -> amount", amount);
    if (lumanagiPredictionV1Contract) {
      const abi = await postBetBullAbi(
        lumanagiPredictionV1Contract,
        currentEpoch
      );
      // const betAmount = await getMinBetAmount(lumanagiPredictionV1Contract);

      postTransaction(
        LUMANAGI_PREDICTION_V1_ADDRESS,
        abi,
        BigNumber.from(amount)
      );
    }
  };

  /**
   * Handles click of enter up button
   */

  const postClaim = async (epoch: BigNumber) => {
    if (lumanagiPredictionV1Contract) {
      const abi = await postClaimAbi(lumanagiPredictionV1Contract, [epoch]);
      // const betAmount = await getMinBetAmount(lumanagiPredictionV1Contract);
      postTransaction(LUMANAGI_PREDICTION_V1_ADDRESS, abi);
    }
  };

  /**
   * Gets all display round details for display
   * @param epochArray
   * @returns All display round details
   */

  const getRoundsData = (epochArray: any[]) =>
    Promise.all(
      epochArray.map(async (epoch: any, index: number) => {
        const epochDetails = await getEpochDetails(
          lumanagiPredictionV1Contract as Contract,
          BigNumber.from(epoch)
        );
        const epochTemp =
          epochDetails && epochDetails.epoch > 0 ? epochDetails.epoch : epoch;
        return {
          ...(index > 0 ? rounds[index - 1] : {}),
          ...epochDetails,
          epoch: epochTemp,
        };
      })
    );

  /**
   * Gets Latest price of the currency
   */

  const getLatestPrice = async () => {
    if (eacAggregatorProxyContract) {
      const latestAnswerTemp = await getLatestAnswer(
        eacAggregatorProxyContract
      );
      setLatestAnswer(latestAnswerTemp);
    }
  };

  /**
   * Intial function calls for lumangi predication contracts
   */
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
        await setDisplayData(currentEpoch);
        await getBalance();
        if (account) {
          const userRounds = await getUserRounds(
            lumanagiPredictionV1Contract,
            account
          );
          setUserRounds(userRounds);
        }

        setLoading(false);
      })();
    }
  }, [lumanagiPredictionV1Contract]);

  /**
   * Intial function calls for Eac contract
   */
  useEffect(() => {
    setInterval(async () => {
      getLatestPrice();
    }, 10000);

    getLatestPrice();
  }, [eacAggregatorProxyContract]);

  return (
    <div className="w-full">
      <Tabs />

      <Timer
        seconds={seconds}
        minutes={minutes}
        setSeconds={setSeconds}
        setMinutes={setMinutes}
        setDisableUpDown={setDisableUpDown}
      />
      <div
        className="grid grid-flow-col auto-cols-[100%] grid-rows-none gap-10 mt-10 overflow-x-scroll w-100 card-data sm:auto-cols-[35%] md:auto-cols-[20%] lg:auto-cols-[20%] xl:auto-cols-[20%] 2xl:auto-cols-[20%]"
        style={{
          overflowX: "scroll",
          height: "450px",
          overflowY: "visible",
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
            disableUpDown={disableUpDown}
            latestAnswer={latestAnswer}
            prev={index === 0 ? oldest : rounds[index - 1]}
            userRounds={userRounds}
            postClaim={postClaim}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
