export interface ITableConfig {
  caption: string;
  headers: string[];
  body: tableRow[];
}

type tableRow = string[];
