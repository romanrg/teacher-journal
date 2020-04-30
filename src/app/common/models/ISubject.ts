export interface ISubject {
  name: string;
  teacher: string;
  address?: string;
  description?: string;
  id?: string;
  uniqueDates?: number[];
  _id?: string;
}

export class SubjectModel implements ISubject {
  constructor(
    public name: string = "",
    public teacher: string = "",
    public address: string = "",
    public description: string = "",
    public uniqueDates: number[] = [],
  ) {}
}
