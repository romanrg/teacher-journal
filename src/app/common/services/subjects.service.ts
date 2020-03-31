import { Injectable } from "@angular/core";
import {ISubject} from "../models/ISubject";
import {from, Observable, of} from "rxjs";
import {map, withLatestFrom} from "rxjs/internal/operators";
import {Params} from "@angular/router";
import {IStudent} from "../models/IStudent";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, SUBJECTS_ROUTE} from "../constants/API";
import {ITeacher} from "../models/ITeacher";
import {HashFunctions, HashTable} from "../helpers/HashTable";



@Injectable({
  providedIn: "root"
})
export class SubjectsService {
  private URL: string = `${API}${SUBJECTS_ROUTE}`;
  private subjectUpToDateState: ISubject;
  constructor(
    private http: HttpClient
  ) {
  }

  get subjectToUpdate(): ISubject {
    return this.subjectUpToDateState;
  }

  public fetchSubjects(): Observable<ISubject[]> {
    return <Observable<ISubject[]>>this.http.get(this.URL);
  }

  public addSubject(subject: ISubject): Observable<ISubject[]> {
    return <Observable<ISubject[]>>this.http.post(this.URL, subject);
  }

  public patchSubject(subject: ISubject): Observable<ISubject> {
    return this.http.patch(`${this.URL}/${subject.id}`, subject);
  }
  public deleteSubject(id: string): Observable<ISubject[]> {
    return this.http.delete(`${this.URL}/${id}`);
  }
  public updateSubjectState(state: ISubject): void {
    this.subjectUpToDateState = state;
  }
}
