import { BigNumber, ethers } from "ethers";
export const convertEpochToDate = (utcSeconds: number) => {
  const date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  return date;
};

export const getSecondsDiffrence = (startDate: Date, endDate: Date) => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
};

export const getMaticValue = (amount: BigNumber) =>
  ethers.utils.formatEther(amount);

export const getGweiValue = (amount: any) => {
  return ethers.utils.parseUnits(amount);
};

export const getPercentValue = (amount: BigNumber, percent: number) =>
  amount.mul(percent).div(100);

export const getValueFromPercentage = (
  amount: BigNumber,
  numberVal: number
) => {
  console.log("LL: numberVal", numberVal, amount);

  return amount.div(100 * numberVal);
};
