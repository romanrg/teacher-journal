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
    const headers: string[] = ["id", "name", "surname", "address", "description"];
    const caption: string = "Students list:";
    return {
      headers, caption, body: this.createBody(students, headers)
    };
  }

  public renderSearch($event: Event): void {
    const headers: string[] = ["id", "name", "surname", "address", "description"];
    this.tableConfig.body = this.createBody(<IStudent[]>$event, headers);
  }

  public createBody(students: IStudent[], config: string[]): string[][] {
    const newBody: string[][] = [];
    <IStudent[]>students.forEach((student, index) => {
      const creator: RowCreator = new RowCreator();
      const headers: string[] = config;
      const row: string[] = creator.generateRowFromObject(
        student,
        headers
      );
      row[0] = index + 1;
      newBody.push(row);
    });
    return newBody;
  }

  public deleteStudent($event: Event): void {
    const studentId: string = $event.target.parentNode.parentNode.parentNode.getAttribute("rowindex");
    this.manager.addSubscription(this.studentsService.removeStudent(this.studentsService.getStudents()[studentId].id)
      .subscribe(data => {
        this.manager.addSubscription(this.studentsService.fetchStudents().subscribe(
          students => {
            this.studentsService.setStudents(students);
            this.tableConfig = this.createStudentsTableConfig(this.studentsService.getStudents());
          }
        ));
      }));
  }
}
