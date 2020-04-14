export class StatisticResearcher {
  constructor(values: {value: number}) {
    this.values = values;
  }

  public get average(): number {
    return this.values.reduce((acc, val) => acc + val.value, 0) / this.values.length;
  }

  public get academicPerformance(): number {
    return this.values.filter(val => val.value >= 4).length / this.values.length;
  }

  public get quality(): number {
    return this.values.filter(val => val.value >= 7).length / this.values.length;
  }

  public get degree(): number {
    return (
      this.values.filter(val => val.value < 4).length * 0.16 +
      this.values.filter(val => val.value >= 4 && val.value < 7).length * 0.36 +
      this.values.filter(val => val.value >= 7 && val.value < 9).length * 0.64 +
      this.values.filter(val => val.value >= 9).length * 1
    ) / this.values.length;
  }

  public getReport(...getters: string): string {
    return getters.reduce((report, prop) => {
      report[prop] = this[prop];
      return report;
    }, {});
  }

}

