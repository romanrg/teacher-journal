import {RowCreator} from "../helpers/RowCreator";

export interface ITableConfig {
  caption: string;
  headers: string[];
  body: tableRow[];
}

export type tableRow = RowCreator;
