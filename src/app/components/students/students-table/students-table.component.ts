import {Component, OnDestroy, OnInit} from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {map, tap} from "rxjs/internal/operators";
import {IStudent} from "../../../common/models/IStudent";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {STUDENTS_HEADERS} from "../../../common/constants/STUDENTS_HEADERS";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public tableConfig: ITableConfig;
  public tableHeaders: ReadonlyArray<string> = STUDENTS_HEADERS;
  constructor(
    private studentsService: StudentsServiceService,
  ) {}
  public createStudentsTableConfig(students: IStudent[]): ITableConfig {
    const headers: ReadonlyArray<string> = this.tableHeaders;
    const caption: string = "Students list:";
    return {
      headers, caption, body: this.createBody(students, headers)
    };
  }
  public renderSearch($event: Event): void {
    const headers: string[] = this.tableHeaders;
    this.tableConfig.body = this.createBody(<IStudent[]>$event, headers);
  }
  public createBody(students: IStudent[], config: ReadonlyArray<string>): string[][] {
    const newBody: string[][] = [];
    <IStudent[]>students.forEach((student, index) => {
      const creator: RowCreator = new RowCreator();
      const row: string[] = creator.generateRowFromObject(
        student,
        config
      );
      row[0] = index + 1;
      newBody.push(row);
    });
    return newBody;
  }
  public deleteStudent($event: Event): void {
    $event.preventDefault()
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
}
