export interface ISubject {
  name: string;
  teacher: ITeacher | string;
  cabinet?: number;
  description?: string;
  id: string | number;
  uniqueDates?: number[];
}

export class SubjectModel extends ISubject {
  constructor(
    public name: string = "",
    public teacher: ITeacher | string = "",
    public cabinet: number = null,
    public description: string = "",
    public uniqueDates: number[] = [],
  ) {}
}
