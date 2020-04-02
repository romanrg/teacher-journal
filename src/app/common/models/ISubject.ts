import {Teacher} from "./ITeacher";

export interface ISubject {
  name: string;
  teacher: ITeacher | string;
  address?: string;
  description?: string;
  id?: string | number;
  uniqueDates?: number[];
}

export class SubjectModel implements ISubject {
  constructor(
    public name: string = "",
    public teacher: Teacher | string = "",
    public address: string = "",
    public description: string = "",
    public uniqueDates: number[] = [],
  ) {}
}
