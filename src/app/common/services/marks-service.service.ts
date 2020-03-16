import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {from, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {API, MARKS_ROUTE} from "../constants/API";
export const idGeneretor: Function = () => `f${(~~(Math.random()*1e8)).toString(16)}`;
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private _marks: Mark[];
  private URL: string = `${API}${MARKS_ROUTE}`;
  constructor(
    private http: HttpClient
  ) {
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
        this.submitMark(mark);
        return true;
      } else {
        this._marks[filtered] = mark;
      }
  }

  public submitMark(mark: Mark): void {
    this.http.post(this.URL, mark).subscribe().unsubscribe();
  }

  get marks(): Mark[] {
    return this._marks;
  }
  set marks(marks: Mark[]): Mark[] {
    this._marks = marks;
  }
  public getMarks(): Observable<Mark> {
    return this.http.get(this.URL);
    // return from(this._marks);
  }

  public getSubjectMarks(subject: string): Observable<Mark[]> {
    const queryParams = {subject};
    return this.http.get(this.URL, {params: queryParams});
  }

}
