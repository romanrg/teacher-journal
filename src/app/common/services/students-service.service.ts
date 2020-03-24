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
  public searchStudent(searchString: string): Observable<IStudent[]> {
    const params: HttpParams = new HttpParams()
      .set("q", searchString);
    return this.http.get(this.URL, {
      params
    });
  }

  public addStudent(student: IStudent): void {
    return this.http.post(this.URL, student);
  }
  public fetchStudents(): Observable<IStudent[]> {
    return this.http.get(this.URL);
  }

  public removeStudent(studentId: string): void {
    return this.http.delete(`${this.URL}/${studentId}`);
  }
}
