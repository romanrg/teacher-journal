import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {from, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, MARKS_ROUTE} from "../constants/API";
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private _marks: Mark[];
  private URL: string = `${API}${MARKS_ROUTE}`;
  constructor(
    private http: HttpClient
  ) {
    this._marks = [];

  }

  public addMarks(mark: Mark): void {
      const filtered: number = this._marks.findIndex(
        m => (m.student === mark.student) && (m.time === mark.time) && (m.subject === mark.subject)
      );
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
  }
  public getSubjectMarks(subject: string): Observable<Mark[]> {
    const params: HttpParams = new HttpParams()
      .set("subject", subject);
    return this.http.get(this.URL, {params});
  }
  public deleteMarks(id: string, timestamp: number): Observable<Mark[]> {
    return this._marks
      .filter(m => m.subject === id && m.time === timestamp)
      .map(mark => {
        return this.http.delete(`${this.URL}/${mark.id}`);
      })
    ;
  }

}
