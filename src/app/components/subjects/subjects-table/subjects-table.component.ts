import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ISubject} from "../../../common/models/ISubject";
import {IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {ITableConfig, TableBody, TableRow} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {SUBJECT_HEADERS} from "../../../common/constants/SUBJECT_HEADERS";
import {DatePipe} from "@angular/common";
import {IStudent} from "../../../common/models/IStudent";
import {IMark, Mark} from "../../../common/models/IMark";
import {Observable} from "rxjs";

import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {select, Store} from "@ngrx/store";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";
import * as MarksActions from "src/app/@ngrx/marks/marks.actions";
import {StudentsState} from "../../../@ngrx/students/students.state";
import {MarksState} from "../../../@ngrx/marks/marks.state";
import {_dispatcher, pluck} from "../../../common/helpers/lib";
import {Teacher} from "../../../common/models/ITeacher";
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

  // state related
  public componentState$: Observable<{
    subjects: SubjectsState,
    students: StudentsState,
    marks: MarksState
  }>;
  public subject: ISubject;
  public renderMap: [];
  public page: number;
  public itemsPerPage: number;

  // renderer related
  public generator: Generator;
  public dateGenerator: DatePicker;
  public numberGenerator: NumberPicker;

  // subscription manager
  public manager: SubscriptionManager;

  constructor(
    private store: Store<AppState>,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer);
    this.dateGenerator = new DatePicker(this.renderer);
    this.numberGenerator = new NumberPicker(this.renderer, 1, 10);
    this.tableBody = new TableBody(TableRow);
  }

  // helpers
  public getCellIndex(target: EventTarget): number {
    return +target.parentNode.getAttribute("index");
  }

  // teacher methods
  public changeTeacher($event: Event): void {
    const patchedSubject: ISubject = {...this.subject};
    patchedSubject.teacher = $event[this.teacherConfig.configName];
    this.store.dispatch(SubjectsActions.changeTeacher({patchedSubject: patchedSubject}));
  }

  // errors handling
  public isAnyErrorsOccur(st: AppState): boolean {
    return Object.keys(st).some(key => st[key].error);
  }
  public getAllStateErrors(st: AppState): ErrorEvent[] {
    return Object.keys(st).map(key => st[key].error).filter(err => err);
  }

  // add new date and mark
  public generateInput(target: EventTarget): void {
    if (
      this.dateGenerator.shouldAddDateInput(target, this.subjectHeadersConstantNames)
    ) {
      this.dateGenerator.generateDatePicker(
        target,
        this.subjectTableConfig.headers.filter(head => typeof head === "number"),
        this.datePipe,
        this.submitDate(_dispatcher(this.store, SubjectsActions.addNewUniqueDate, "subject"), this.subject)
      );
    } else if (
      this.numberGenerator.shouldAddNumberInput(target, this.subjectHeadersConstantNames, this.getCellIndex(target))
    ) {
      let student: IStudent;
      const clickRow: HTMLElement[] = [...target.parentNode.parentNode.children];
      this.componentState$.subscribe(
        st => student = st.students.data
          .filter(stud => stud.name === clickRow[0].textContent && stud.surname === clickRow[1].textContent)[0]
      ).unsubscribe();
      const newMark: Mark = new Mark(
        student.id, this.subject.id, null, this.subjectTableConfig.headers[this.getCellIndex(target)]
      );
      if (!target.textContent) {
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(_dispatcher(this.store, MarksActions.addNewMark, "mark"), newMark)
        );
      } else {
        let patchMark: Mark;
        this.componentState$.subscribe(st => patchMark = st.marks.data.filter(mark =>
          mark.student === newMark.student &&
          mark.subject === newMark.subject &&
          mark.time === newMark.time
        )[0]).unsubscribe();
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(_dispatcher(this.store, MarksActions.changeMark, "mark"), patchMark)
        );
      }

    } else if (
      this.dateGenerator.isDeleteDateButton(target)
    ) {
      const uniqueIndex: number = this.getCellIndex(target.parentNode.parentNode);
      const timestamp: number = this.subjectTableConfig.headers[uniqueIndex];
      let needToDelete: string[] = [];
      const subject: string = this.subject;
      this.store.dispatch(SubjectsActions.deleteDate({subject, timestamp}));
      this.componentState$.subscribe(st => {
        needToDelete = [...st.marks.data.filter(m => m.time === timestamp && m.subject === subject.id)];
      }).unsubscribe();
      needToDelete.map(id => this.store.dispatch(MarksActions.deleteMark({needToDelete: id})));
    }
  }
  public submitDate(dispatch: Function, subject: ISubject): void {
    return function(value: string): void {
      JSON.parse(JSON.stringify(subject)).uniqueDates.push((new Date(value)).getTime());
      dispatch(copy);
    };
  }
  public submitMark(dispatch: Function, mark: IMark): void {
    return function (value: number): void {
      const copy: Mark = JSON.parse(JSON.stringify(mark));
      copy.value = +value;
      dispatch(copy);
    };
  }

  // handle pagination
  public dispatchPaginationState($event: Event): void {
    if ($event.paginationConstant) {
      this.store.dispatch(SubjectsActions.changePaginationConstant($event));
    } else {
      this.store.dispatch(SubjectsActions.changeCurrentPage($event));
    }

  }

  // life cycles
  public ngOnInit(): void {
    const subjectName: string = this.route.snapshot.params.name;
    this.subjectTableConfig = {
      caption: `${subjectName} class journal:`,
      headers: this.subjectHeadersConstantNames,
      body: this.tableBody.body
    };

    const mapFnForSelecting: Function = (state, props): {
      subjects: SubjectsState,
      students: StudentsState,
      marks: MarksState
    } => {
      const componentsState: {
        subjects: SubjectsState,
        students: StudentsState,
        marks: MarksState
      } = {};
      props.forEach(prop => componentsState[prop] = state[prop]);
      return componentsState;
    };
    this.componentState$ = this.store.pipe(
      select(mapFnForSelecting, ["subjects", "students", "marks"])
    );

    this.manager.addSubscription(this.componentState$.subscribe(state => {
        // initialize subject
        this.subject = state.subjects.data.filter(subj => subj.name === subjectName)[0];

        // get pagination and current page
        this.page = state.subjects.currentPage;
        this.itemsPerPage = state.subjects.paginationConstant;

        // initialized new teacher form
        this.teacherConfig = new Teacher(this.subject);

        // get all marks for particular subject
        const subjectsMarks: Mark[] = state.marks.data.filter(mark => mark.subject === this.subject.id);

        // initialize table headers with unique sorted dates
        const datesPartOfHeaders: number[] = [
          ...new Set(
            [...this.subject.uniqueDates].concat(pluck(subjectsMarks, "time"))
          )
        ].sort();
        this.subjectTableConfig.headers = [...this.subjectHeadersConstantNames, ...datesPartOfHeaders];

        /// handle data from sources for table
        if (this.renderMap) {
          this.tableBody.body = this.renderMap;
          state.students.data.map((student) => {
            const studentIndex: number = this.tableBody.body
              .findIndex(row => row[0] === student.name && row[1] === student.surname);
            this.tableBody.addStudentMark(subjectsMarks, student, studentIndex, this.subjectTableConfig.headers);
          });
        } else {
          this.tableBody.clear();
          state.students.data.map((student, index) => {
            this.tableBody.generateRowByRow(student, this.subjectTableConfig.headers);
            this.tableBody.addStudentMark(subjectsMarks, student, index, this.subjectTableConfig.headers);
          });
        }
    }));

  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
