export interface ITableConfig {
  caption: string;
  headers: string[];
  body: TableBody.body;
}
export type cell = (string|number|undefined);
export type row = cell[];

export class TableRow {
  constructor(private _config: string[], private initial: any) {
    this._config = _config;
    this._initialObject = initial;
  }
  public createRowFromObject(): row {
    const result: row = [];
    [...this._config.values()].map(prop => result.push(this._initialObject[prop]));
    return result;
  }

  public changeValueAt(bodyRow: row, index: number, value: cell): row {
    bodyRow[index] = value;
  }
  get config(): string[] {
    return this._config;
  }
}
export class TableBody {
  private _body: row[] = [];
  private row: Function;
  constructor(rowConstructor: TableRow) {
    this.row = (config: string[] = [], data: any = null) => new rowConstructor(config, data);
  }
  get body(): row[] {
    return this._body;
  }
  set body(newBody: row[]): void  {
    this._body = newBody;
  }
  public clear(): void {
    this._body.length = 0;
  }
  public generateBodyFromDataAndConfig(config: string[], data: Array<any>): void {
    data.map(value => {
      this.generateRowByRow(value, config);
    });
  }
  public changeAllValuesAtIndexWithArrayValues(index: number, arr: Array<any>): void {
    this._body.forEach((bodyRow, i) => this.row().changeValueAt(bodyRow, index, arr[i]));
  }
  public changeOnlyOneValueAt(newValue: cell, bodyRowIndex: number, cellIndex: number): void {
    this.row().changeValueAt(this._body[bodyRowIndex], cellIndex, newValue);
  }
  public generateRowByRow(dataPiece: any, config: string[]): void {
    this._body.push((this.row(config, dataPiece)).createRowFromObject());
  }
  public generateIdArray(n: number): number[] {
    return Array.from(Array(n).keys()).map( i => i + 1);
  }
  public addStudentMark(
    subjectsMarks: Mark[],
    student: IStudent,
    indexOfStudentInBody: number,
    headers: (string|number)[],
    indexOfAverageColumn: number = 2
  ): void {
    let sum: number = 0;
    let average: number;
    subjectsMarks
      .filter(mark => mark.student === student.id)
      .forEach((mark, i) => {
        if (mark) {
          sum = mark.value + sum;
          average = sum / (i + 1);
          this.changeOnlyOneValueAt(mark.value, indexOfStudentInBody, headers.indexOf(mark.time));
          this.changeOnlyOneValueAt(average, indexOfStudentInBody, indexOfAverageColumn);
        }
      });
  }
}
