export class StatisticResearcher {
  public static getAverageInArray = (arr: number[], fixed: number = 2) => {
    return (arr.reduce((acc, val) => acc + val, 0) / arr.length).toFixed(fixed);
  };
}

