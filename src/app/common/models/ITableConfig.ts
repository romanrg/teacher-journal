export interface ITableConfig {
  caption: string;
  headers: string[];
  body: tableRow[];
}

export type tableRow = string[];
