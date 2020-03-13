import {Component, OnDestroy, OnInit} from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {map, tap} from "rxjs/internal/operators";
import {IStudent} from "../../../common/models/IStudent";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public tableConfig: ITableConfig;
  constructor(
    private studentsService: StudentsServiceService,
  ) {

  }

  public ngOnInit(): void {
    if (this.studentsService.getStudents().length) {
      this.tableConfig = this.createStudentsTableConfig(this.studentsService.getStudents());
    } else {
      this.manager.addSubscription(this.studentsService.fetchStudents()
        .pipe(
          tap(data => this.studentsService.setStudents(data)),
          tap(data => this.tableConfig = this.createStudentsTableConfig(this.studentsService.getStudents()))
        ).subscribe());
    }
  }

  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

  public createStudentsTableConfig(students: IStudent[]): ITableConfig {
    const bodyData: string[][] = [];
    const headers: string[] = ["id", "name", "surname", "address", "description"];
    const caption: string = "Students list:";
    students.forEach((student, index) => {
      const creator: RowCreator = new RowCreator();
      const row: string[] = creator.generateRowFromObject(
        student,
        headers
      );
      row[0] = index + 1;
      bodyData.push(row);
    });
    return {
      headers, caption, body: bodyData
    };
  }
}
