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

  public submitMark(mark: Mark): Observable<Mark[]> {
    return this.http.post(this.URL, mark);
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
  public patchMark(mark: Mark): Observable<Mark> {
    return this.http.patch(`${this.URL}/${mark.id}`, mark);
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
