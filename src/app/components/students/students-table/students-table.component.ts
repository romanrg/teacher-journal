import { Component, OnInit } from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit {

  private students: [];
  constructor(
    private studentsService: StudentsServiceService
  ) { }

  public ngOnInit(): void {
    this.students = this.studentsService.getStudents();
  }

}
