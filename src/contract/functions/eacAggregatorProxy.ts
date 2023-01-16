import { BigNumber, Contract } from "ethers";

export const getLatestRound = async (contract: Contract) => {
  try {
    const latestRound = await contract.latestRound();
    return Number(latestRound);
  } catch (error) {
    console.log("LL: getLatestRound -> error", error);
  }
};

export const getLatestRoundData = async (contract: Contract) => {
  try {
    const latestRoundData = await contract.latestRoundData();
    return {
      answer: Number(latestRoundData.answer),
      answeredInRound: Number(latestRoundData.answeredInRound),
      roundId: Number(latestRoundData.roundId),
      startedAt: Number(latestRoundData.startedAt),
      updatedAt: Number(latestRoundData.updatedAt),
    };
  } catch (error) {
    console.log("LL: getLatestRoundData -> error", error);
  }
};

export const getRoundData = async (contract: Contract, roundId: BigNumber) => {
  try {
    const roundData = await contract.getRoundData(BigNumber.from(roundId));
    return {
      answer: Number(roundData.answer),
      answeredInRound: Number(roundData.answeredInRound),
      roundId: Number(roundData.roundId),
      startedAt: Number(roundData.startedAt),
      updatedAt: Number(roundData.updatedAt),
    };
  } catch (error) {
    console.log("LL: getRoundData -> error", error);
  }
};
