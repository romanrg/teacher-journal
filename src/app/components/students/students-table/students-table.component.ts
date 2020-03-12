import { Component, OnInit } from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";
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
    this.studentsService.fetchStudents()
      .pipe(
      ).subscribe(data => {
      const bodyData: string[][] = [];
      const headers: string[] = ["id", "name", "surname", "address", "description"];
      const caption: string = "Students list:";
      data.forEach((student, index) => {
        const creator: RowCreator = new RowCreator();
        const row: string[] = creator.generateRowFromObject(
          student,
          headers
        );
        row[0] = index + 1;
        bodyData.push(row);
      });
      this.tableConfig = {
        headers, caption, body: bodyData
      };
    });
  }
}
