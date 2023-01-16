export const convertEpochToDate = (utcSeconds: number) => {
  const date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  return date;
};

export const getSecondsDiffrence = (startDate: Date, endDate: Date) => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
};
