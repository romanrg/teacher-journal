export interface IMark {
  student: (string|number);
  subject: (string|number);
  value: (number);
  time: number;
  id: (string|number);
}

export class Mark {
  constructor(
    public student: (string|number),
    public subject: (string|number),
    public value: (number),
    public time: number,
    public id: (string|number),
  ) {
    this.student = student;
    this.time = time;
    this.value = value;
    this.subject = subject;
  }

  public static getAverageMark: Function = (arr: []): number => {
    const filtered: number[] = arr.filter(mark => mark);
    return (filtered.reduce((cur, acc) => +cur + +acc, 0) / filtered.length);
  }
}
