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
import {map, pluck} from "rxjs/internal/operators";
import {__filter, _chain, _compose, _curry, _partial, NodeCrawler, _allPass} from "../../../common/helpers/lib";
import {Equalities} from "../../../common/models/filters";
import {AdService} from "../../../common/services/ad.service";

@Component({
  selector: "app-students-table",
  templateUrl: "./students-table.component.html",
  styleUrls: ["./students-table.component.sass"]
})

export class StudentsTableComponent implements OnInit, OnDestroy {

  private manager: SubscriptionManager = new SubscriptionManager();
  public pops: [];
  public popUpComponent: [];
  public tableConfig: ITableConfig;
  public page: number;
  public itemsPerPage: number;
  public searchPlaceholder: string;
  public delStudent: IStudent;
  public tableBody: TableBody = new TableBody(TableRow);
  public readonly confirmation: string;
  public readonly successfullMessage: string;
  public readonly errorMessage: string;
  public readonly tableBodyRowConfig: string[] = ["id", "name", "surname", "address", "description"];
  @Select(NgxsStudentsState.Students) public studentsState$: Observable<StudentsStateModel>;
  constructor(
    private store: Ngxs.Store,
    private translate: TranslateService,
    private adService: AdService
  ) {}

  public createStudentsTableConfig = (
    headers: string[],
    caption: string,
    students: IStudent[]
  ): ITableConfig => (
    {
      headers,
      caption,
      body: this.createBody(students, this.tableBodyRowConfig)
    }
  );

  public dispatchSearch = ($event: Event): void => this.store.dispatch(new Students.Search($event));

  public createBody = (
    students: IStudent[],
    config: ReadonlyArray<string>
  ): Array<(string|number|undefined)[]> => {

    const _clearBody: Function = this.tableBody.clear;

    const _generateBodyFromDataAndConfig: Function = _curry(
      this.tableBody.generateBodyFromDataAndConfig
    )(config, students);

    const _changeAllValuesAtFirstPositionWithId: Function = _curry(
      this.tableBody.changeAllValuesAtIndexWithArrayValues
    )(0, this.tableBody.generateIdArray(students.length));

    _chain(_clearBody, _generateBodyFromDataAndConfig, _changeAllValuesAtFirstPositionWithId);

    return this.tableBody.body;

  };

  public deleteStudent($event: Event): void {

    let student: string;

    const crawler: NodeCrawler = new NodeCrawler($event.target);

    const predicate: Function = (node): null|boolean => node.getAttribute("data");

    const _executeDOM: Function = _partial(crawler.executeDOMAttr, "getAttribute", "data");

    const [, name, surname] = _compose(_executeDOM, crawler.crawlUntilTrue)(predicate).split(",");

    if (name && surname) {

      this.studentsState$
        .pipe(
          pluck("data"),
          map(
            students => __filter(Equalities.Students({name, surname}))(students)[0]
          )
        )
        .subscribe(removedStudent => student = removedStudent)
        .unsubscribe();

      this.pops = this.adService.getSuccessPop(
        `${this.confirmation.START} ${name} ${surname} ${this.confirmation.END}`
      );

      this.store.dispatch(new Students.Delete(student));
    }

  }
  public dispatchPaginationState = (
    $event: Event
  ): void => $event.paginationConstant ?
    this.store.dispatch(new Students.ChangePagination($event.paginationConstant)) :
    this.store.dispatch(new Students.ChangeCurrentPage($event.currentPage));

  public ngOnInit(): void {
    combineLatest(
      this.translate.stream("COMPONENTS"),
      this.studentsState$
    ).subscribe(([translations, students]) => {

      this.page = students.currentPage;

      this.itemsPerPage = students.paginationConstant;

      this.confirmation = translations.STUDENTS.DELETE_CONFIRMATION;

      this.successfullMessage = translations.STUDENTS.SUCCESSFULL;

      this.popUpComponent = students.popUpComponent;

      this.errorMessage = translations.STUDENTS.NOT_SUCCESSFULL;

      const _createStudentsTableConfig: Function = _partial(
        this.createStudentsTableConfig,
        translations.STUDENTS.TABLE.HEADERS,
        translations.STUDENTS.TABLE.CAPTION
      );

      if (students.searchBarInputValue) {

        this.searchPlaceholder = students.searchBarInputValue;

      }
      if (students.data.length) {

        this.tableConfig = students.searchedStudents ?
          _createStudentsTableConfig(students.searchedStudents) :
          _createStudentsTableConfig(students.data);

      }
    });
  }
  public ngOnDestroy = (): void => this.manager.removeAllSubscription();


  public confirmPopUp($event: Event): boolean {
    if ($event) {

      this.deleteStudent(this.delStudent);
      this.pops = null;

    } else {

      this.pops = null;

    }

    this.delStudent = null;
  }

  public showPopUp($event: Event): void {

    const crawler: NodeCrawler = new NodeCrawler($event.target);
    const _isDeleteButton: Function = _allPass(
      crawler.simpleCheck(({tagName}) => tagName.toLowerCase() === "button"),
      crawler.simpleCheck(({children}) => children[0]?.textContent === "Delete"),
    );

    if (_isDeleteButton()) {
      this.pops = this.adService.getSuccessPop(
        `${this.confirmation.START} ${this.confirmation.END}`
      );
      this.delStudent = $event;
    }

  }

  public closePopUp(): void {
      this.store.dispatch(new Students.PopUpCancel())
  };

  public sendComponent(popUpComponent: []): any {
    setTimeout(() => {
      this.closePopUp()
    }, 2000);
    return this.adService.getSuccessPop(popUpComponent.value);
  }
}
