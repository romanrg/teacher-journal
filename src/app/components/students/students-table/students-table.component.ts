import { Component, OnInit } from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Observable} from "rxjs";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit {
  public currentPaginationNumber: number = 1;
  public students: Observable<[]>;
  public paginationConstant: number = 4;
  constructor(
    private studentsService: StudentsServiceService
  ) { }

  public ngOnInit(): void {
    this.students = this.studentsService.getStudents();
  }
  public setPaginationConstant(page: number): void {
    this.currentPaginationNumber = page;
  }
}
