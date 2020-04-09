import { Injectable } from "@angular/core";
import {Observable, of} from "rxjs";
import {IStudent} from "../models/IStudent";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, STUDENTS_ROUTE} from "../constants/API";

@Injectable({
  providedIn: "root"
})
export class StudentsServiceService {
  private URL: string = `${API}${STUDENTS_ROUTE}`;
  constructor(
    private http: HttpClient,
  ) { }
  public searchStudent = (searchString: string): Observable<IStudent[]> => this.http.get(
    this.URL, {params: new HttpParams().set("q", searchString)}
  );

  public addStudent = (student: IStudent): Observable<IStudent> => this.http.post(this.URL, student);

  public fetchStudents = (): Observable<IStudent[]> => this.http.get(this.URL);

  public removeStudent = (studentId: string): object => this.http.delete(`${this.URL}/${studentId}`);
}
