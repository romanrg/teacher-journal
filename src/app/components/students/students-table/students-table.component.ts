import {Component, OnDestroy, OnInit} from "@angular/core";
import {ITableConfig, TableBody, TableRow} from "../../../common/models/ITableConfig";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {IStudent} from "../../../common/models/IStudent";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {combineLatest, Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Select} from "@ngxs/store";
import {NgxsStudentsState, StudentsStateModel} from "../../../@ngxs/students/students.state";
import {Students} from "../../../@ngxs/students/students.actions";
import {TranslateService} from "@ngx-translate/core";
import {switchMap} from "rxjs/internal/operators";
import {_partial} from "../../../common/helpers/lib";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})

export class StudentsTableComponent implements OnInit, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public tableConfig: ITableConfig;
  public page: number;
  public itemsPerPage: number;
  public searchPlaceholder: string;
  public tableBody: TableBody = new TableBody(TableRow);
  public readonly confirmation: string;
  public readonly tableBodyRowConfig: string[] = ["id", "name", "surname", "address", "description"];
  @Select(NgxsStudentsState.Students) public studentsState$: Observable<StudentsStateModel>;
  constructor(
    private store: Ngxs.Store,
    private translate: TranslateService
  ) {

  }
  public createStudentsTableConfig = (
    headers: string[], caption: string, students: IStudent[]
  ): ITableConfig => ({headers, caption, body: this.createBody(students, this.tableBodyRowConfig)})
  public renderSearch = ($event: Event): void => this.store.dispatch(new Students.Search($event));
  public createBody = (
    students: IStudent[], config: ReadonlyArray<string>
  ): Array<(string|number|undefined)[]> => {
    this.tableBody.clear();
    this.tableBody.generateBodyFromDataAndConfig(config, students);
    this.tableBody.changeAllValuesAtIndexWithArrayValues(0, this.tableBody.generateIdArray(students.length));
    return this.tableBody.body;
  };
  public deleteStudent($event: Event): void {
    if ($event.target.parentNode.getAttribute("data")) {
      const rowData: string[] = $event.target.parentNode.getAttribute("data").split(",");
      let student: string;
      this.studentsState$.subscribe(students => {
        student = students.data.filter(stud => stud.name === rowData[1] && stud.surname === rowData[2])[0];
      }).unsubscribe();
      confirm(`${this.confirmation.START} ${rowData[1]} ${rowData[2]} ${this.confirmation.END}`);
      this.store.dispatch(new Students.Delete(student));
    }

  }
  public dispatchPaginationState = (
    $event: Event
  ): void => $event.paginationConstant ?
    this.store.dispatch(new Students.ChangePagination($event.paginationConstant)) :
    this.store.dispatch(new Students.ChangeCurrentPage($event.currentPage))

  public ngOnInit(): void {
    combineLatest(
      this.translate.stream("COMPONENTS"),
      this.studentsState$
    ).subscribe(([translations, students]) => {
      this.page = students.currentPage;
      this.itemsPerPage = students.paginationConstant;
      this.confirmation = translations.STUDENTS.DELETE_CONFIRMATION;
      if (students.searchBarInputValue) {
        this.searchPlaceholder = students.searchBarInputValue;
      }
      if (students.data.length) {
        const _createStudentsTableConfig: Function = _partial(
          this.createStudentsTableConfig,
          translations.STUDENTS.TABLE.HEADERS,
          translations.STUDENTS.TABLE.CAPTION
        );
        this.tableConfig = students.searchedStudents ?
          _createStudentsTableConfig(students.searchedStudents) :
          _createStudentsTableConfig(students.data);
      }
    });
  }
  public ngOnDestroy = (): void => this.manager.removeAllSubscription();
}
