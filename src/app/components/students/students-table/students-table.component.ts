import {Component, OnDestroy, OnInit} from "@angular/core";
import {ITableConfig, TableBody, TableRow} from "../../../common/models/ITableConfig";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {IStudent} from "../../../common/models/IStudent";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {STUDENTS_HEADERS} from "../../../common/constants/STUDENTS_HEADERS";
import {Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Select} from "@ngxs/store";
import {NgxsStudentsState, StudentsStateModel} from "../../../@ngxs/students/students.state";
import {Students} from "../../../@ngxs/students/students.actions";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})

export class StudentsTableComponent implements OnInit, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public tableConfig: ITableConfig;
  public tableHeaders: ReadonlyArray<string> = STUDENTS_HEADERS;
  public page: number;
  public itemsPerPage: number;
  public searchPlaceholder: string;
  public tableBody: TableBody = new TableBody(TableRow);
  @Select(NgxsStudentsState.Students) public studentsState$: Observable<StudentsStateModel>;
  constructor(private store: Ngxs.Store) {}
  public createStudentsTableConfig(students: IStudent[]): ITableConfig {
    const headers: ReadonlyArray<string> = this.tableHeaders;
    const caption: string = "Students list:";
    return {
      headers, caption, body: this.createBody(students, headers)
    };
  }
  public renderSearch($event: Event): void {
    this.store.dispatch(new Students.Search($event));
  }
  public createBody(students: IStudent[], config: ReadonlyArray<string>): Array<(string|number|undefined)[]> {
    this.tableBody.clear();
    this.tableBody.generateBodyFromDataAndConfig(config, students);
    this.tableBody.changeAllValuesAtIndexWithArrayValues(0, this.tableBody.generateIdArray(students.length));
    return this.tableBody.body;
  }
  public deleteStudent($event: Event): void {
    if ($event.target.parentNode.getAttribute("data")) {
      const rowData: string[] = $event.target.parentNode.getAttribute("data").split(",");
      let student: string;
      this.studentsState$.subscribe(students => {
        student = students.data.filter(stud => stud.name === rowData[1] && stud.surname === rowData[2])[0];
      }).unsubscribe();
      confirm(`Do you want to delete ${rowData[1]} ${rowData[2]}?`);
      this.store.dispatch(new Students.Delete(student));
    }

  }
  public dispatchPaginationState($event: Event): void {
    if ($event.paginationConstant) {
      this.store.dispatch(new Students.ChangePagination($event.paginationConstant));
    } else {
      this.store.dispatch(new Students.ChangeCurrentPage($event.currentPage));
    }

  }
  public ngOnInit(): void {
    this.manager.addSubscription(this.studentsState$.subscribe(students => {
      this.page = students.currentPage;
      this.itemsPerPage = students.paginationConstant;
      if (students.searchBarInputValue) {
        this.searchPlaceholder = students.searchBarInputValue;
      }
      if (students.searchedStudents) {
        this.tableConfig = this.createStudentsTableConfig(students.searchedStudents);
      } else {
        this.tableConfig = this.createStudentsTableConfig(students.data);
      }
    }));
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
