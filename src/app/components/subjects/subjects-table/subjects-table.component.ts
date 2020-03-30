import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ISubject} from "../../../common/models/ISubject";
import {AutoUnsubscribe, SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {ITableConfig, TableBody, TableRow} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {SUBJECT_HEADERS} from "../../../common/constants/SUBJECT_HEADERS";
import {DatePipe} from "@angular/common";
import {IStudent} from "../../../common/models/IStudent";
import {IMark, Mark} from "../../../common/models/IMark";

import {_dispatcherNgxs, pluck} from "../../../common/helpers/lib";
import {Teacher} from "../../../common/models/ITeacher";



// ngxs
import * as Ngxs from "@ngxs/store";
import {SubjectTableState} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {Marks} from "../../../@ngxs/marks/marks.actions";
import {SortByPipe} from "../../../common/pipes/sort-by.pipe";
import {Observable} from "rxjs";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  // config related
  public subjectTableConfig: ITableConfig;
  public subjectHeadersConstantNames: string[] = SUBJECT_HEADERS;
  public tableBody: TableBody;
  public teacherConfig: Teacher;
  public initialPositioning: [];
  public sortingState: {col: number, times: number};

  // state related
  public subject: ISubject;
  public renderMap: [];
  public page: number;
  public itemsPerPage: number;
  public state$: Observable<SubjectTableState>
  public isLoad$: Observable<boolean>;
  // renderer related
  public generator: Generator;
  public dateGenerator: DatePicker;
  public numberGenerator: NumberPicker;

  // subscription manager
  public manager: SubscriptionManager;

  constructor(
    private ngxsStore: Ngxs.Store,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private sortPipe: SortByPipe
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer);
    this.dateGenerator = new DatePicker(this.renderer);
    this.numberGenerator = new NumberPicker(this.renderer, 1, 10);
    this.tableBody = new TableBody(TableRow);
    this.state$ = this.ngxsStore.select(state => {
      const current: ISubject = state.subjects.data
        .filter(subj => subj.name === this.route.snapshot.params.name)[0];
      const marks: Mark[] = state.marks.data
        .filter(mark => mark.subject === current.id);
      const errors: (string|Error)[] = [...Object.keys(state).map(key => state[key].error).filter(error => error)];
      return ({
        ...state.subjects,
        current,
        students: state.students.data,
        marks,
        errors
      });
    });
    this.isLoad$ = ngxsStore
      .select(state => Object.keys(state)
        .map(key => state[key].loading)
        .some(load => load)
      );

    this.ngxsStore.dispatch(new Subjects.ChangeCurrentPage(1));
    this.ngxsStore.dispatch(new Subjects.SetSortedColumn(null));
  }

  // helpers
  public getCellIndex(target: EventTarget): number {
    return +target.parentNode.getAttribute("index");
  }

  // teacher methods
  public changeTeacher($event: Event): void {
    const patchedSubject: ISubject = {...this.subject};
    patchedSubject.teacher = $event[this.teacherConfig.configName];
    this.ngxsStore.dispatch(new Subjects.ChangeTeacher(patchedSubject));
  }

  // add new date and mark
  public handleClickEvents(target: EventTarget): void {
    if (
      this.dateGenerator.shouldAddDateInput(target, this.subjectHeadersConstantNames)
    ) {
      this.dateGenerator.generateDatePicker(
        target,
        this.subjectTableConfig.headers.filter(head => typeof head === "number"),
        this.datePipe,
        this.submitDate(_dispatcherNgxs(this.ngxsStore, Subjects.AddDate), this.subject)
      );
    } else if (
      this.numberGenerator.shouldAddNumberInput(target, this.subjectHeadersConstantNames, this.getCellIndex(target))
    ) {
      let student: IStudent;
      const clickRow: HTMLElement[] = [...target.parentNode.parentNode.children];
      this.state$.subscribe(
        st => student = st.students
          .filter(stud => stud.name === clickRow[0].textContent && stud.surname === clickRow[1].textContent)[0]
      ).unsubscribe();
      const newMark: Mark = new Mark(
        student.id, this.subject.id, null, this.subjectTableConfig.headers[this.getCellIndex(target)]
      );
      if (!target.textContent) {
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(_dispatcherNgxs(this.ngxsStore, Marks.Create), newMark)
        );
      } else {
        let patchMark: Mark;
        this.state$.subscribe(st => patchMark = st.marks.filter(mark =>
          mark.student === newMark.student &&
          mark.subject === newMark.subject &&
          mark.time === newMark.time
        )[0]).unsubscribe();
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(_dispatcherNgxs(this.ngxsStore, Marks.Change), patchMark)
        );
      }

    } else if (
      this.dateGenerator.isDeleteDateButton(target)
    ) {
      const uniqueIndex: number = this.getCellIndex(target.parentNode.parentNode);
      const timestamp: number = this.subjectTableConfig.headers[uniqueIndex];
      let needToDelete: string[] = [];
      const patchedSubject: ISubject = {...this.subject};
      patchedSubject.uniqueDates = [...patchedSubject.uniqueDates.filter(date => date !== timestamp)];
      this.state$.subscribe(st => {
        needToDelete = [...st.marks.filter(m => m.time === timestamp && m.subject === patchedSubject.id)];
      }).unsubscribe();
      this.ngxsStore.dispatch(new Subjects.DeleteDate(patchedSubject, needToDelete));
    }
  }
  public submitDate(dispatch: Function, subject: ISubject): void {
    return function(value: string): void {
      const copy: ISubject = JSON.parse(JSON.stringify(subject));
      copy.uniqueDates.push((new Date(value)).getTime());
      dispatch(copy);
    };
  }
  public submitMark(dispatch: Function, mark: Mark): void {
    return function (value: number): void {
      const copy: Mark = JSON.parse(JSON.stringify(mark));
      copy.value = +value;
      dispatch(copy);
    };
  }

  // handle pagination
  public dispatchPaginationState($event: Event): void {
    if ($event.paginationConstant) {
      this.ngxsStore.dispatch(new Subjects.ChangePagination($event.paginationConstant));
    } else {
      this.ngxsStore.dispatch(new Subjects.ChangeCurrentPage($event.currentPage));
    }

  }

  // handle sorting
  public setSortedColumnName($event: number): void {
    this.ngxsStore.dispatch(new Subjects.SetSortedColumn($event));
  }

  // merge all data for table;
  public preRenderTable(state: SubjectTableState): void {
    this.tableBody.clear();
    state.students.map((student, index) => {
      this.tableBody.generateRowByRow(student, this.subjectTableConfig.headers);
      this.tableBody.addStudentMark(state.marks, student, index, this.subjectTableConfig.headers);
    });
  }

  // life cycle
  public ngOnInit(): void {
    this.manager.addSubscription(this.state$.subscribe(state => {
      if (state.loaded) {
        // initialize subject
        this.subject = state.current;
        this.subjectTableConfig = {
          caption: `${this.subject.name} class journal:`,
          headers: this.subjectHeadersConstantNames,
          body: this.tableBody.body
        };

        // get pagination and current page

        this.page = state.currentPage;
        this.itemsPerPage = state.paginationConstant;
        this.initialPositioning = state.renderMap;
        this.sortingState = state.sortedColumn;

        // initialized new teacher form
        this.teacherConfig = new Teacher(this.subject);

        // get all marks for particular subject

        // initialize table headers with unique sorted dates
        const datesPartOfHeaders: number[] = [
          ...new Set(
            [...this.subject.uniqueDates].concat(pluck(state.marks, "time"))
          )
        ].sort();
        this.subjectTableConfig.headers = [...this.subjectHeadersConstantNames, ...datesPartOfHeaders];

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
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

  public applyChanges(): void {
    const stateSnapshot = this.ngxsStore.selectSnapshot(state => Object.keys(state).map(key => ({[key]: state[key].data})));
    console.log(stateSnapshot);
    this.ngxsStore.dispatch(new Subjects.PostSnapshot(stateSnapshot));
  }
}
