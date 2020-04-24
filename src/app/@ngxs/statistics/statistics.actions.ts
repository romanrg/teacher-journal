import {ISubject} from "../../common/models/ISubject";
import {Mark} from "../../common/models/IMark";
import {IStudent} from "../../common/models/IStudent";

export namespace Statistics {
  export class Initialize {
    public static readonly type = "[Statistics (App)] Initialize";
  }
  export class SetSubjects {
    public static readonly type = "[Subjects (App)] Set Subjects";
    constructor(public payload: ISubject[]) {}
  }
  export class SetMarks {
    public static readonly type = "[Marks (App)] Set Marks";
    constructor(public payload: Mark[]) {}
  }
  export class SetStudents {
    public static readonly type = "[Students (App)] Set Students";
    constructor(public payload: IStudent[]) {}
  }
  export class SetDates {
    public static readonly type = "[Statistics (App)] Set Dates";
    constructor(
        public payload: {subjects: [ISubject, boolean, boolean][], marks: {[prop: string]: Mark[]}}
    ) {}
  }
  export class CheckOne {
    public static readonly type = "[Statistics] Check One";
    constructor (public payload: [any, boolean, boolean]) {}
  }

  export class ChangeSelector {
    public static readonly type = "[Statistics] Change Selector";
    constructor (public payload: string) {}
  }
}

