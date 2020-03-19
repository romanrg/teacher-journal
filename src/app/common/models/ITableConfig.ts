export interface ITableConfig {
  caption: string;
  headers: string[];
  body: string[][];
}

export class TableRow {
  constructor(private _config: string[], private initial: any) {
    this._config = _config;
    this._initialObject = initial;
  }
  public createRowFromObject(): string[] {
    const row: string[] = [];
    [...this._config.values()].map(prop => row.push(this._initialObject[prop]));
    return row;
  }
  get config(): string[] {
    return this._config;
  }
  get initialObject(): any {
    return this._initialObject;
  }
}

/*

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

*/
