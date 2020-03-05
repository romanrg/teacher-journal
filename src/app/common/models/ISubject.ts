import {ITeacher} from "./ITeacher";

export interface ISubject {
  name: string;
  teacher: ITeacher | string;
  cabinet?: number;
  description?: string;
  address?: string;
  _id: string | number;
  marks?: [];
  students?: [];
}
