import { Injectable } from "@angular/core";
import Students from "../constants/students-mock.json";
import { from } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class StudentsServiceService {

  private students: [];
  constructor() {
    this.students = Array.from(Students);
  }

  public getStudents() {
    return from([this.students]);
  }
}
