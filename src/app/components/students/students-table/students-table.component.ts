import { Component, OnInit } from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Observable} from "rxjs";
import {IStudent} from "../../../common/models/IStudent";
import {ITableConfig} from "../../../common/models/ITableConfig";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit {
  public tableConfig: ITableConfig;
  constructor(
    private studentsService: StudentsServiceService
  ) { }

  public ngOnInit(): void {
    const students: Observable<IStudent[]> = this.studentsService.getStudents();
    const headers: string[] = ["name", "surname", "address", "description"]
    this.tableConfig = {
      caption: ["Students"],
      tableBody: [students, headers],
      pagination: {
        paginationConstant: 5,
        data: students
      },
      tableHeader: headers
    };
  }
}
