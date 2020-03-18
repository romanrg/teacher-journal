export class RowCreator {
  private row: string[];
  constructor() {
    this.row = [];
  }

  public generateRowFromObject(object: { [name: string]: string }, config: string[]): string[] {
    [...config.values()].map(prop => this.row.push(object[prop]));
    return this.row;
  }
}
