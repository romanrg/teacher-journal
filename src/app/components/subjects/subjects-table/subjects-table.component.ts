import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ISubject} from "../../../common/models/ISubject";
import {AutoUnsubscribe, SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {ITableConfig, TableBody, TableRow} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {DatePipe} from "@angular/common";
import {IStudent} from "../../../common/models/IStudent";
import {IMark, Mark} from "../../../common/models/IMark";
import {
  _compose, _dispatcherNgxs, _partial, copyByJSON, nodeCrawler, NodeCrawler,
  _take, __filter,
} from "../../../common/helpers/lib";
import {Teacher} from "../../../common/models/ITeacher";

// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {SortByPipe} from "../../../common/pipes/sort-by.pipe";
import {combineLatest, Observable} from "rxjs";
import {Actions, ofActionCompleted, ofActionDispatched} from "@ngxs/store";
import {map, pluck} from "rxjs/internal/operators";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {CONFIRMATION_MESSAGE} from "../../../common/constants/CONFIRMATION_MESSAGE";
import {TranslateService} from "@ngx-translate/core";
import {Equalities} from "../../../common/models/filters";
import {AdService} from "../../../common/services/ad.service";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  // config related
  public subjectTableConfig: ITableConfig;
  public tableBody: TableBody;
  public teacherConfig: Teacher;
  public sortingState: {col: number, times: number};
  public tableBodyConfigData: string[] = ["name", "surname", "average mark"];

  // state related
  public subject: ISubject;
  public page: number;
  public itemsPerPage: number;
  public state$: Observable<SubjectTableState>;
  public isLoad$: Observable<boolean>;
  public marks: Mark[];
  public stateChangesForBtn$: Observable<Action>;
  public stateChangesForBtnComplete$: Observable<Action>;
  public stateChangesLoad$: Observable<Action>;
  public confirm: boolean = false;
  public popUp: null|string = null;

  // renderer related
  public generator: Generator;
  public dateGenerator: DatePicker;
  public numberGenerator: NumberPicker;

  // subscription manager
  public manager: SubscriptionManager;

  constructor(
    private store: Ngxs.Store,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private sortPipe: SortByPipe,
    private actions$: Actions,
    private translate: TranslateService,
    private adService: AdService
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer, this.translate);
    this.dateGenerator = new DatePicker(this.renderer, this.translate);
    this.numberGenerator = new NumberPicker(this.renderer, 1, 10, this.translate);
    this.tableBody = new TableBody(TableRow);
    this.state$ = this.store.select(state => {
      const current: ISubject = __filter(subj => subj.name === this.route.snapshot.params.name)(state.subjects.data)[0];
      const errors: (string|Error)[] = [
        ...Object
          .keys(state)
          .map(key => state[key].error)
          .filter(error => error)
      ];
      return ({
        ...state.subjects,
        current,
        students: state.students.data,
        marks: __filter(mark => mark.subject === current.id)(state.marks.data),
        errors
      });
    });

    this.isLoad$ = store
      .select(state => Object.keys(state)
        .map(key => state[key].loading)
        .some(load => load)
      );

    this.store.dispatch([new Subjects.ChangeCurrentPage(1), new Subjects.SetSortedColumn(null)]);
    this.stateChangesForBtn$ = this.actions$.pipe(
      ofActionDispatched(
        Subjects.AddDate,
        Subjects.DeleteDate,
        Subjects.ChangeTeacher,
        Subjects.Submit, Marks.Create,
        Marks.Change
      ),
      map(action => {
        this.confirm = !(action instanceof Subjects.Submit);
        return !(action instanceof Subjects.Submit);
      })
    );
    this.stateChangesLoad$ = this.actions$.pipe(ofActionDispatched(Subjects.Submit));
    this.stateChangesForBtnComplete$ = this.actions$.pipe(ofActionCompleted(Subjects.Submit));
  }

  // helpers
  public getCellIndex(target: EventTarget): number {
    try {
      const crawler: NodeCrawler = new NodeCrawler(target);
      const predicate: Function = (el) => el.getAttribute("index") !== null;
      return +_compose(_partial(crawler.executeDOMAttr, "getAttribute", "index"), crawler.crawlUntilTrue)(predicate);
    } catch {
      return;
    }
  }

  // teacher methods
  public changeTeacher($event: Event): void {

    const changeTeacherName: Function = (newTeacher: string) => (copySubject: ISubject) => {

      copySubject.teacher = newTeacher;

      return copySubject;

    };

    _compose(
      _dispatcherNgxs(this.store, Subjects.ChangeTeacher), changeTeacherName($event[this.teacherConfig.configName]),
      copyByJSON
    )(this.subject);
  }

  // add new date and mark
  public handleClickEvents(target: EventTarget): void {

    let student: IStudent;

    let needToDelete: string[];

    const crawler: NodeCrawler = new NodeCrawler(target);

    const targetCellIndex: number = this.getCellIndex(target);

    const timestamps: number[] = __filter(head => typeof head === "number")(this.subjectTableConfig.headers);

    const timestamp: number = this.subjectTableConfig.headers[targetCellIndex];

    const predicateForNumberPicker: Function = (el) => {
      try {
        return el.classList.contains("table-row");
      } catch {
        return
      }
    };

    const [name, surname]: HTMLElement[] = _compose(crawler.getChildsArray, crawler.crawlUntilTrue)(predicateForNumberPicker);

    const filterForStudents: Function = __filter(Equalities.Students({name: name.textContent, surname: surname.textContent}));

    const filterForDeletedTimestamps: Function = (stamp: number, subj: ISubject) =>  __filter(Equalities.DeleteTimestamp(stamp, subj));

    const filterForTimestamps: Function = (stamp: number) => __filter(Equalities.Timestamp(stamp));

    const createMark: Function = (
      studentId: string
    ) => new Mark(studentId, this.subject.id, null, this.subjectTableConfig.headers[targetCellIndex]);

    const dispatchNewDate: Function = this.submitDate(_dispatcherNgxs(this.store, Subjects.AddDate), this.subject);

    const dispatchNewMark: Function = (newMark: Mark): Function => this.submitMark(_dispatcherNgxs(this.store, Marks.Create), newMark);

    const dispatchChangeMark: Function = (newMark: Mark): Function => this.submitMark(_dispatcherNgxs(this.store, Marks.Change), newMark);

    const dispatchDelete: Function = (deletedMarks: Mark[], subject: ISubject) => _dispatcherNgxs(this.store, Subjects.DeleteDate)({subject: subject, marks: deletedMarks});

    const _generateNumberPicker: Function = _partial(this.numberGenerator.generateNumberPicker, target);

    const updateStamps: Function = (stamp: number) => (patchedSubject: ISubject): ISubject => {

      patchedSubject.uniqueDates = filterForTimestamps(stamp)(patchedSubject.uniqueDates);

      this.state$.subscribe(
        state => needToDelete = filterForDeletedTimestamps(timestamp, patchedSubject)(state.marks)
      ).unsubscribe();

      return [needToDelete, patchedSubject];

    };

    if (this.dateGenerator.shouldAddDateInput(target, this.tableBodyConfigData)) {

      this.dateGenerator.generateDatePicker(target, timestamps, this.datePipe, dispatchNewDate);

    } else if (this.numberGenerator.shouldAddNumberInput(target, this.tableBodyConfigData, targetCellIndex)) {

      this.state$.pipe(
          pluck("students"),
          map(students => filterForStudents(students)[0])
      ).subscribe(data => student = data).unsubscribe();


      const newMark: Mark = createMark(student.id);

      !target.textContent ? _generateNumberPicker(dispatchNewMark(newMark)) :  _generateNumberPicker(dispatchChangeMark(newMark));

    } else if (this.dateGenerator.isDeleteDateButton(target)) {


      this.store.dispatch(new Subjects.DeleteDate(_compose(updateStamps(timestamp), copyByJSON)(this.subject)));



    }
  }

  public submitDate = (dispatch: Function, subject: ISubject): void => (value: string): void => {

      const time: number = (new Date(value)).getTime();

      const addTimeStamp: Function = (date: number) => (copy: ISubject) => {
        copy.uniqueDates = [...copy.uniqueDates, date];
        return copy;
      };

      _compose(dispatch, addTimeStamp(time), copyByJSON)(subject);
  };
  public submitMark = (dispatch: Function, mark: Mark): void => (value: number): void => {

      const addValue: Function = (_value: string) => (copy: Mark) => {
        copy.value = +_value;
        return copy;
      };


      _compose(dispatch, addValue(value), copyByJSON)(mark);
  };
  // handle pagination
  public dispatchPaginationState($event: Event): void {

    if ($event.paginationConstant) {

      this.store.dispatch(new Subjects.ChangePagination($event.paginationConstant));

    } else {

      this.store.dispatch(new Subjects.ChangeCurrentPage($event.currentPage));

    }
  }
  // handle sorting
  public setSortedColumnName = ($event: number): void => this.store.dispatch(new Subjects.SetSortedColumn($event));
  // merge all data for table;
  public preRenderTable(state: SubjectTableState): void {

    this.tableBody.clear();

    const config: string|number[] = [...this.tableBodyConfigData, ...this.subject.uniqueDates];

    state.students.map((student, index) => {
      this.tableBody.generateRowByRow(student, config);
      this.tableBody.addStudentMark(state.marks, student, index, config);
    });
  }
  // apply data
  public applyChanges = (): void => this.store.dispatch(new Subjects.Submit());

  public pushHeaders(): void {

    this.translate.stream("COMPONENTS").subscribe(data => {

      this.subjectTableConfig.headers.push(data.SUBJECTS.TABLE.FORMS.DATE.SELECT);

    }).unsubscribe();
  }
  public canDeactivate = (): boolean | Observable<boolean> => this.confirm ? confirm(CONFIRMATION_MESSAGE) : true;

  public closePopUp(): void {
    this.store.dispatch(new Subjects.PopUpCancelTable());
  };
  public sendComponent(popUpComponent: []): any {
    setTimeout(() => {
      this.closePopUp()
    }, 2000);
    return this.adService.getSuccessPop(popUpComponent);
  }

  // life cycle
  public ngOnInit(): void {

    this.manager.addSubscription(combineLatest(
      this.translate.stream("COMPONENTS"),
      this.state$
    ).subscribe(([componentTranslations, state]) => {

      const translations: any = componentTranslations.SUBJECTS.TABLE;

      if (state.loaded) {
        // initialize subject
        this.subject = state.current;
        // this.subjectHeadersConstantNames = ;
        this.subjectTableConfig = {
          caption: `${this.subject.name}:`,
          headers: translations.HEADERS,
          body: this.tableBody.body
        };
        this.marks = state.marks;
        // get pagination and current page

        this.page = state.currentPage;
        this.itemsPerPage = state.paginationConstant;
        this.sortingState = state.sortedColumn;

        // initialized new teacher form
        this.teacherConfig = new Teacher(this.subject, this.translate);

        // get all marks for particular subject

        // initialize table headers with unique sorted dates
        const datesPartOfHeaders: number[] = [
          ...new Set(
            [...this.subject.uniqueDates].concat(_take(state.marks, "time"))
          )
        ].sort();
        this.subjectTableConfig.headers = [...translations.HEADERS, ...datesPartOfHeaders];
        /// handle data from sources for table
        this.preRenderTable(state);

        if (this.sortingState === null || this.sortingState.times % 3 === 0) {

          return;

        } else if (this.sortingState.times % 2 === 0) {

          this.tableBody.body = this.sortPipe.transform(this.tableBody.body, this.sortingState.col, false);

        } else {

          this.tableBody.body = this.sortPipe.transform(this.tableBody.body, this.sortingState.col, true);

        }

        this.subjectTableConfig.body = this.tableBody.body;

        this.popUp = state.popups.table;
      }
    }));
  }
  public ngOnDestroy = (): void => this.manager.removeAllSubscription();
}
