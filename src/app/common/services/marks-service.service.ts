import { Injectable } from "@angular/core";
import {Mark} from "../models/IMark";
import {forkJoin, from, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, MARKS_ROUTE} from "../constants/API";
import {concatMap} from "rxjs/internal/operators";
@Injectable({
  providedIn: "root"
})


export class MarksServiceService {
  private URL: string = `${API}${MARKS_ROUTE}`;
  constructor(
    private http: HttpClient
  ) {}

  public submitMark(mark: Mark): Observable<Mark[]> {
    return this.http.post(this.URL, mark);
  }
  public getMarks(): Observable<Mark> {
    return this.http.get(this.URL);
  }
  public patchMark(mark: Mark): Observable<Mark> {
    if (mark.id) {
      return this.http.patch(`${this.URL}/${mark.id}`, mark);
    }

  }
  public deleteMarks(id: string): Observable<Mark[]> {
    return this.http.delete(`${this.URL}/${id}`);
  }

}
