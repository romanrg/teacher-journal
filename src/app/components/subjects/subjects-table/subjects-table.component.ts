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
  _compose, _dispatcherNgxs, _partial, copyByJSON, nodeCrawler, NodeCrawler, _pluck, _allPass,
  _take
} from "../../../common/helpers/lib";
import {Teacher} from "../../../common/models/ITeacher";



// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {SortByPipe} from "../../../common/pipes/sort-by.pipe";
import {combineLatest, from, Observable, of} from "rxjs";
import {Actions, ofActionCompleted, ofActionDispatched} from "@ngxs/store";
import {filter, map, pluck, tap} from "rxjs/internal/operators";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {CONFIRMATION_MESSAGE} from "../../../common/constants/CONFIRMATION_MESSAGE";
import {TranslateService} from "@ngx-translate/core";
import {flatMap} from "tslint/lib/utils";

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
    private translate: TranslateService
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer, this.translate);
    this.dateGenerator = new DatePicker(this.renderer, this.translate);
    this.numberGenerator = new NumberPicker(this.renderer, 1, 10, this.translate);
    this.tableBody = new TableBody(TableRow);
    this.state$ = this.store.select(state => {
      const current: ISubject = state.subjects.data
        .filter(subj => subj.name === this.route.snapshot.params.name)[0];
      const marks: Mark[] = state.marks.data
        .filter(mark => mark.subject === current.id);
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
        marks,
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
      _dispatcherNgxs(this.store, Subjects.ChangeTeacher),
      changeTeacherName($event[this.teacherConfig.configName]),
      copyByJSON
    )(this.subject);
  }

  // add new date and mark
  public handleClickEvents(target: EventTarget): void {
    if (
      this.dateGenerator.shouldAddDateInput(target, this.tableBodyConfigData)
    ) {
      this.dateGenerator.generateDatePicker(
        target,
        this.subjectTableConfig.headers.filter(head => typeof head === "number"),
        this.datePipe,
        this.submitDate(_dispatcherNgxs(this.store, Subjects.AddDate), this.subject)
      );
    } else if (
      this.numberGenerator.shouldAddNumberInput(target, this.tableBodyConfigData, this.getCellIndex(target))
    ) {

      let student: IStudent;
      const predicate: Function = (el) => el.classList.contains("table-row");
      const crawler: NodeCrawler = new NodeCrawler(target);
      const [rowName, rowSurname]: HTMLElement[] = _compose(crawler.getChildsArray, crawler.crawlUntilTrue)(predicate);

      this.state$.pipe(
        pluck("students"),
      ).subscribe(students => {
        student = students.filter(({name, surname}) => name === rowName.textContent && surname === rowSurname.textContent)[0];
      }).unsubscribe();

      const newMark: Mark = new Mark(
        student.id, this.subject.id, null, this.subjectTableConfig.headers[this.getCellIndex(target)]
      );

      if (!target.textContent) {
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(_dispatcherNgxs(this.store, Marks.Create), newMark)
        );

      } else {
        let patchMark: Mark;
        this.state$.pipe(
          pluck("marks")
        ).subscribe(marks =>
          patchMark = marks
            .filter(
              ({student, subject, time}) =>
              student === newMark.student &&
              subject === newMark.subject &&
              time === newMark.time
            )[0]
        ).unsubscribe();
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(_dispatcherNgxs(this.store, Marks.Change), newMark)
        );
      }

    } else if (
      this.dateGenerator.isDeleteDateButton(target)
    ) {
      const uniqueIndex: number = this.getCellIndex(target);
      const timestamp: number = this.subjectTableConfig.headers[uniqueIndex];
      let needToDelete: string[] = [];
      const patchedSubject: ISubject = {...this.subject};
      patchedSubject.uniqueDates = [...patchedSubject.uniqueDates.filter(date => date !== timestamp)];
      this.state$.subscribe(st => {
        needToDelete = [...st.marks.filter(m => m.time === timestamp && m.subject === patchedSubject.id)];
      }).unsubscribe();
      this.store.dispatch(new Subjects.DeleteDate(patchedSubject, needToDelete));
    }
  }
  public submitDate(dispatch: Function, subject: ISubject): void {
    return function(value: string): void {
      const time: number = (new Date(value)).getTime();
      const addTimeStamp: Function = (date: number) => (copy: ISubject) => {
        copy.uniqueDates = [...copy.uniqueDates, date];
        return copy;
      };
      _compose(dispatch, addTimeStamp(time), copyByJSON)(subject);
    };
  }
  public submitMark(dispatch: Function, mark: Mark): void {
    return function (value: number): void {
      const addValue: Function = (_value: string) => (copy: Mark) => {
        copy.value = +_value;
        return copy;
      };
      _compose(dispatch, addValue(value), copyByJSON)(mark);
    };
  }
  // handle pagination
  public dispatchPaginationState($event: Event): void {
    if ($event.paginationConstant) {
      this.store.dispatch(new Subjects.ChangePagination($event.paginationConstant));
    } else {
      this.store.dispatch(new Subjects.ChangeCurrentPage($event.currentPage));
    }

  }
  // handle sorting
  public setSortedColumnName($event: number): void {
    this.store.dispatch(new Subjects.SetSortedColumn($event));
  }
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
  public applyChanges(): void {
    this.store.dispatch(new Subjects.Submit());
  }
  public pushHeaders(): void {
    this.translate.stream("COMPONENTS").subscribe(data => {
      this.subjectTableConfig.headers.push(data.SUBJECTS.TABLE.FORMS.DATE.SELECT);
    }).unsubscribe();
  }
  public canDeactivate(): boolean | Observable<boolean> {
    if (this.confirm) {
      return confirm(CONFIRMATION_MESSAGE);
    } else {
      return true;
    }
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
      }
    }));
    if (this.marks) {
      this.marks.map(mark => this.store.dispatch(new Marks.AddToTheHashTable(mark)));
    }
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
