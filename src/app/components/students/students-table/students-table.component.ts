import {Component, OnDestroy, OnInit} from "@angular/core";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {IStudent, StudentModel} from "../../../common/models/IStudent";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {STUDENTS_HEADERS} from "../../../common/constants/STUDENTS_HEADERS";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../../@ngrx/app.state";
import {Observable} from "rxjs";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})
export class StudentsTableComponent implements OnInit, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public tableConfig: ITableConfig;
  public tableHeaders: ReadonlyArray<string> = STUDENTS_HEADERS;
  public studentsState$: Observable<StudentsState>;
  constructor(
    private store: Store<AppState>,
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
    const name: string = [...$event.target.parentNode.parentNode.childNodes].filter(node => node.classList)[1].textContent;
    const surname: string = [...$event.target.parentNode.parentNode.childNodes].filter(node => node.classList)[2].textContent;
    let student: string;
    this.studentsState$.subscribe(students => {
      student = students.data.filter(stud => stud.name === name && stud.surname === surname)[0];
    }).unsubscribe();

    this.store.dispatch(StudentsActions.deleteStudent(student));
  }
  public ngOnInit(): void {
    this.studentsState$ = this.store.pipe(select("students"));
    this.store.dispatch(StudentsActions.getStudents());
    this.manager.addSubscription(
      this.studentsState$.subscribe(students => {
        this.tableConfig = this.createStudentsTableConfig(students.data);
      })
    );
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
