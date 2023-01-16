import { BigNumber, Contract } from "ethers";
export const getMinBetAmount = async (contract: Contract) => {
  try {
    const betAmount: BigNumber = await contract.minBetAmount();
    return betAmount;
  } catch (error) {
    console.log("LL: getLatestRound -> error", error);
    throw error;
  }
};

export const postBetBearAbi = async (contract: Contract, epoch: number) => {
  try {
    return contract.interface.encodeFunctionData("betBear", [epoch]);
  } catch (error) {
    console.log("LL: getLatestRound -> error", error);
    throw error;
  }
};

export const postBetBullAbi = async (contract: Contract, epoch: number) => {
  try {
    return contract.interface.encodeFunctionData("betBull", [
      BigNumber.from(epoch),
    ]);
  } catch (error) {
    console.log("LL: getLatestRoundData -> error", error);
    throw error;
  }
};

export const getCurrentEpoch = async (contract: Contract) => {
  try {
    const latestRoundData: BigNumber = await contract.currentEpoch();
    return Number(latestRoundData);
  } catch (error) {
    console.log("LL: getLatestRoundData -> error", error);
    throw error;
  }
};

export const getEpochDetails = async (
  contract: Contract,
  roundId: BigNumber
) => {
  try {
    const roundData = await contract.rounds(roundId);
    return {
      bearAmount: Number(roundData.bearAmount),
      bullAmount: Number(roundData.bullAmount),
      closeOracleId: Number(roundData.closeOracleId),
      closePrice: Number(roundData.closePrice),
      closeTimestamp: Number(roundData.closeTimestamp),
      epoch: Number(roundData.epoch),
      lockOracleId: Number(roundData.lockOracleId),
      lockPrice: Number(roundData.lockPrice),
      lockTimestamp: Number(roundData.lockTimestamp),
      oracleCalled: roundData.oracleCalled,
      rewardAmount: Number(roundData.rewardAmount),
      rewardBaseCalAmount: Number(roundData.rewardBaseCalAmount),
      startTimestamp: Number(roundData.startTimestamp),
      totalAmount: Number(roundData.totalAmount),
    };
  } catch (error) {
    console.log("LL: getEpochDetails -> error", error);
    throw error;
  }
};
