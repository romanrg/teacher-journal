import {ITeacher} from "./ITeacher";

export interface ISubject {
  name: string;
  teacher: ITeacher | string;
  cabinet?: number;
  description?: string;
  _id: string | number;
}
