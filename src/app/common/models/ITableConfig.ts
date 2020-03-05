import {Observable} from "rxjs";

export interface ITableConfig {
  caption?: string[] | string;
  tableHeader?: any;
  tableHeaderCell?: {
    position: number | "last";
    action: Function;
    textContent: string;
    screenReader: string;
  };
  tableBody?: [Observable<any>, string[]];
  tableFooter?: [];
  pagination?: {
    paginationConstant: number;
    data: Observable<any>;
  };
}

type tableRow = string[];
