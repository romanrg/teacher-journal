import {IPerson} from "./IPerson";

export interface IStudent extends IPerson {
  address?: string;
  description?: string;
  _id?: string;
}

export class StudentModel implements IStudent {
  constructor(
    public name: string = "",
    public surname: string = "",
    public address: string = "",
    public description: string = ""
  ) {}
}
