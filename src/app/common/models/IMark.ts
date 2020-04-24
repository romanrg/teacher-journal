export class Mark {
  constructor(
    public student: (string|number),
    public subject: (string|number),
    public value: (number),
    public time: number,
    public id?: (string|number),
    public _deletedAt?: number,
    public _id?: string,
  ) {
    this.student = student;
    this.time = time;
    this.value = value;
    this.subject = subject;
  }
}
