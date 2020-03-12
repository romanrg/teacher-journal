import { Injectable } from "@angular/core";
import {IMark} from "../models/IMark";
import {idGeneretor} from "../helpers/checkNumberRange";
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MarksServiceService {
  private _marks: IMark[];
  constructor() {
    this._marks = [
      {student: "5e5cbe27384ce7e093efc43e", subject: 0, value: 6, time: 1583193600000, id: "f50957c6"},
      {student: "5e5cbe27384ce7e093efc43e", subject: 0, value: 9, time: 1581193600000, id: "f1800dec"},
      {student: "5e5cbe27a198ec9edcbe9163", subject: 0, value: 10, time: 1581193600000, id: "f1800dpc"}
    ];
  }

  public addMarks(mark: IMark): void {
      const filtered: number = this._marks.findIndex(
        m => (m.student === mark.student) && (m.time === mark.time) && (m.subject === mark.subject)
      );
      if (filtered === -1) {
        this._marks.push(mark);
        return true;
      } else {
        this._marks[filtered] = mark;
      }
  }

  public mergeDataForMarks(
    student: (string|number),
    subject: (string|number),
    time: number,
    value: number,
  ): IMark {
    const newMark = {
      student: student,
      subject: subject,
      value: +value,
      time: time,
      id: idGeneretor()
    };
    return newMark;
  }

  get marks(): IMark[] {
    return this._marks;
  }

  public getMarks(): Observable<IMark> {
    return from(this._marks);
  }

}
