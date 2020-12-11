import { Injectable } from "@angular/core";
import {ISubject} from "../models/ISubject";
import {from, Observable, of} from "rxjs";
import {map, withLatestFrom} from "rxjs/internal/operators";
import {Params} from "@angular/router";
import {IStudent} from "../models/IStudent";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, SUBJECTS_ROUTE} from "../constants/API";
import {ITeacher} from "../models/ITeacher";



@Injectable({
  providedIn: "root"
})
export class SubjectsService {
  private URL: string = `${API}${SUBJECTS_ROUTE}`;
  private _subjects: ISubject[];
  constructor(
    private http: HttpClient
  ) {
    this._subjects = [];
  }

  public fetchSubjects(): Observable<ISubject[]> {
    return <Observable<ISubject[]>>this.http.get(this.URL);
  }

  set subjects(arr: ISubject[]): ISubject[] {
    this._subjects = arr;
  }

  get subjects(): ISubject[] {
    return this._subjects;
  }

  public addSubject(subject: ISubject): Observable<ISubject[]> {
    return this.http.post(this.URL, subject);
  }

  public patchSubject(subject: ISubject): void {
    return this.http.patch(`${this.URL}/${subject.id}`, subject);
  }

  public addUniqueDate(id: (string|number), date: number): void {
    this._subjects.filter(sub => sub.id === id)[0].uniqueDates.push(date);
    const subject: ISubject = this._subjects.filter(sub => sub.id === id)[0];
    this.patchSubject(subject);
  }

  public getUniqueDatesById(id: string ): number[] {
    return this._subjects.filter(sub => sub.id === id)[0].uniqueDates.filter((a, b) => a - b);
  }
  public deleteSubject(id: string): Observable<ISubject[]> {
    return this.http.delete(`${this.URL}/${id}`);
  }

  public getSubjectByName(current: string): Observable<ISubject[]> {
    const params: HttpParams = new HttpParams()
      .set("name", current);
    return this.http.get(this.URL, {
      params
    });
  }

}
