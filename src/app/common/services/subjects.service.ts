import { Injectable } from "@angular/core";
import {ISubject} from "../models/ISubject";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {API, SUBJECTS_ROUTE} from "../constants/API";
import {ITeacher} from "../models/ITeacher";

@Injectable({
  providedIn: "root"
})
export class SubjectsService {
  private URL: string = `${API}${SUBJECTS_ROUTE}`;
  private subjectUpToDateState: ISubject;
  constructor(private http: HttpClient) {}
  get subjectToUpdate(): ISubject {
    return this.subjectUpToDateState;
  }
  public fetchSubjects = (): Observable<ISubject[]> => <Observable<ISubject[]>>this.http.get(this.URL);

  public addSubject = (subject: ISubject): Observable<ISubject[]> => <Observable<ISubject[]>>this.http.post(this.URL, subject);

  public patchSubject = (subject: ISubject): Observable<ISubject> => this.http.patch(`${this.URL}/${subject.id}`, subject);

  public deleteSubject = (id: string): Observable<ISubject[]> => {
    console.log(id);
    return this.http.delete(`${this.URL}/${id}`)
  };

  public updateSubjectState = (state: ISubject): void => this.subjectUpToDateState = state;
}
