import { Injectable } from "@angular/core";
import Students from "../constants/students-mock.json";

@Injectable({
  providedIn: "root"
})
export class StudentsServiceService {

  private students: [];
  constructor() {
    this.students = Students;
  }

  public getStudents() {
    return this.students;
  }
}
