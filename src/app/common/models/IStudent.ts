import {IPerson} from "./IPerson";

export interface IStudent extends IPerson {
  id?: number;
  address?: string;
  description?: string;
}
