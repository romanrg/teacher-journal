import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {from, Observable} from "rxjs";
export const idGeneretor: Function = () => `f${(~~(Math.random()*1e8)).toString(16)}`;
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private _marks: Mark[];
  constructor() {
    this._marks = [
    ];
  }

  public addMarks(mark: Mark): void {
      const filtered: number = this._marks.findIndex(
        m => (m.student === mark.student) && (m.time === mark.time) && (m.subject === mark.subject)
      );
      mark.id = idGeneretor();
      if (filtered === -1) {
        this._marks.push(mark);
        return true;
      } else {
        this._marks[filtered] = mark;
      }
  }

  get marks(): Mark[] {
    return this._marks;
  }

  public getMarks(): Observable<Mark> {
    return from(this._marks);
  }

}
