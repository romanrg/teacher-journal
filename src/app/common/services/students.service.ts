import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import {IStudent} from "../models/IStudent";
import {HttpClient} from "@angular/common/http";
import {API, STUDENTS_ROUTE} from "../constants/API";

@Injectable({
  providedIn: "root"
})
export class StudentsServiceService {
  private URL: string = `${API}${STUDENTS_ROUTE}`;
  constructor(
    private http: HttpClient,
  ) { }
  /* deprecated because of client-side searching
  public searchStudent = (searchString: string): Observable<IStudent[]> => <Observable<IStudent[]>>this.http.get(
    this.URL, {params: new HttpParams().set("q", searchString)}
  );
  */

  public addStudent = (student: IStudent): Observable<IStudent> => <Observable<IStudent>>this.http.post(this.URL, student);

  public fetchStudents = (): Observable<IStudent[]> => <Observable<IStudent[]>>this.http.get(this.URL);

  public removeStudent = (studentId: string): Observable<Object> => <Observable<Object>>this.http.delete(`${this.URL}/${studentId}`);
}
