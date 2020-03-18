import { Injectable } from "@angular/core";
import {Observable, of} from "rxjs";
import {IStudent} from "../models/IStudent";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API, STUDENTS_ROUTE} from "../constants/API";
import {map, tap, flatMap, skip} from "rxjs/internal/operators";

@Injectable({
  providedIn: "root"
})
export class StudentsServiceService {

  private students: IStudent[];
  private URL: string = `${API}${STUDENTS_ROUTE}`;
  private lastSearchString: string = "";
  constructor(
    private http: HttpClient,
  ) {
    this.students = [];

  }

  public pushStudent(student: IStudent): void {
    this.students.push(student);
  }

  public getStudents(): IStudent[] {
    return this.students;
  }

  public searchStudent(searchString: string): Observable<IStudent[]> {
    console.log(searchString);
    const params: HttpParams = new HttpParams()
      .set("q", searchString);
    return this.http.get(this.URL, {
      params
    })

  }

  public setStudents(students: IStudent[]): IStudent[] {
    this.students = students;
  }

  public addStudent(student: IStudent): void {
    return this.http.post(this.URL, student);
  }
  public getOfStudents(): Observable<IStudent> {
    if (this.students.length) {
      return of(...this.students);
    } else {
      return this.fetchStudents().pipe(
        flatMap(data => data)
      );
    }

  }

  public getStudentIdByName(name: string, surname: string): IStudent {
    return this.students.filter(student => student.name === name && student.surname === surname)[0];
  }

  public findStudentById(id: string): IStudent {
    return this.students.filter(student => student.id === id)[0];
  }

  public fetchStudents(): Observable<IStudent[]> {
    return this.http.get(this.URL);
  }

  public removeStudent(studentId: string): void {
    return this.http.delete(`${this.URL}/${studentId}`);
  }
}
