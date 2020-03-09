export class RowCreator {
  constructor() {
    this.row = [];
  }

  public generateRowFromObject(object, config: string[]): string[] {
    [...config.values()].map(prop => this.row.push(object[prop]));
    return this.row;
  }
}
