import { Component, OnInit } from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Observable} from "rxjs";
import {IStudent} from "../../../common/models/IStudent";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {map, tap} from "rxjs/internal/operators";
import {RowCreator} from "../../../common/helpers/RowCreator";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit {
  public tableConfig: ITableConfig;
  constructor(
    private studentsService: StudentsServiceService
  ) {

  }

  public ngOnInit(): void {
    const students: Observable<IStudent[]> = this.studentsService.getStudents();
    this.tableConfig = {
      body: [],
      headers: ["id", "name", "surname", "address", "description"],
      caption: "Students list:"
    };
    students.pipe(
      map(data => {
        data.forEach(student => {
          const creator: RowCreator = new RowCreator();
          const row: string[] = creator.generateRowFromObject(
            student,
            this.tableConfig.headers
          );
          row[0] = row[0] + 1;
          this.tableConfig.body.push(row);
        });
        return data;
        }
      )
    ).subscribe().unsubscribe();
  }
}
