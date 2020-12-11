export class Mark {
  constructor(
    public student: (string|number),
    public subject: (string|number),
    public value: (number),
    public time: number,
    public id?: (string|number),
  ) {
    this.student = student;
    this.time = time;
    this.value = value;
    this.subject = subject;
  }
}
