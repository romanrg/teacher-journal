import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {ITableConfig, TableRow} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {SUBJECT_HEADERS, SUBJECT_HEADERS_LENGTH} from "../../../common/constants/SUBJECT_HEADERS";
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
import {pluck} from "../../../common/helpers/lib";
@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {

  // config related
  public newTeacherConfig: IFormConfig;
  public subjectTableConfig: ITableConfig;
  public subjectHeadersConstantNames: string[] = SUBJECT_HEADERS;

  // state related
  public componentState$: Observable<{
    subjects: SubjectsState,
    students: StudentsState,
    marks: MarksState
  }>;
  public subject: ISubject;

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
  }

  // helpers
  public getCellIndex(target: EventTarget): number {
    return +target.parentNode.getAttribute("index");
  }

  // teacher methods
  public changeTeacher($event: Event): void {
    const newTeacher: string = $event[
      this.newTeacherConfig.formGroupName.formControls[0].name
      ];
    const patchedSubject: ISubject = {...this.subject};
    patchedSubject.teacher = newTeacher;
    this.store.dispatch(SubjectsActions.changeTeacher({patchedSubject: patchedSubject}));
  }
  public getTeacherFormConfig(subject: ISubject): IFormConfig {
    return {
      legend: "Change Subject Teacher",
      formGroupName: {
        name: "form",
        formControls: [
          {
            name: "teacher: ",
            initialValue: "",
            type: FormControlType.text,
            validators: [Validators.required],
            errorMessages: ["This field is required"],
            placeholder: subject.teacher,
          }
        ]

      },
    };
  }

  // validations
  public shouldAddDateInput(target: EventTarget): boolean {
    return (
      target.tagName.toLowerCase() === "th" &&
      !this.subjectHeadersConstantNames.includes(target.textContent) &&
      target.textContent.includes("Select date")
    );
  }
  public shouldAddNumberInput(target: EventTarget): boolean {
    return (target.tagName.toLowerCase() === "td" && this.getCellIndex(target) >= this.subjectHeadersConstantNames.length);
  }
  public isDeleteDateButton(target: EventTarget): boolean {
    return (target.tagName.toLowerCase() === "button" && target.children[0]?.textContent === "Delete column");
  }
  public isAllLoaded( st: AppState): boolean {
    return Object.keys(st).every(key => st[key].loaded === true);
  }

  // add new date and mark
  public generateInput(target: EventTarget): void {
    const _dispatcher: Function = (store, dispatcher, name) => (value) => store.dispatch(dispatcher({[name]: value}));
    if (this.shouldAddDateInput(target)) {
      this.dateGenerator.generateDatePicker(
        target,
        this.subjectTableConfig.headers.filter(head => typeof head === "number"),
        this.datePipe,
        this.submitDate(_dispatcher(this.store, SubjectsActions.addNewUniqueDate, "subject"), this.subject)
      );
    } else if (this.shouldAddNumberInput(target)) {
      let student: IStudent;
      const clickRow: HTMLElement[] = [...target.parentNode.parentNode.children];
      this.componentState$.subscribe(
        st => student = st.students.data
          .filter(stud => stud.name === clickRow[0].textContent && stud.surname === clickRow[1].textContent)[0]
      ).unsubscribe();
      const newMark: Mark = {
        student: student.id,
        subject: this.subject.id,
        time: this.subjectTableConfig.headers[this.getCellIndex(target)],
      };
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

    } else if (this.isDeleteDateButton(target)) {
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
  public addNewColumn(): void {
    this.subjectTableConfig.headers.push("Select date");
    this.subjectTableConfig.body.forEach(row => row.length = this.subjectTableConfig.headers.length);
  }
  public submitDate(dispatch: Function, subject: ISubject): void {
    return function(value: string, target: EventTarget): void {
      const copy: ISubject = JSON.parse(JSON.stringify(subject));
      copy.uniqueDates.push((new Date(value)).getTime());
      dispatch(copy);
    };
  }
  public submitMark(dispatch: Function, mark: IMark): void {
    return function (value: number): void {
      const newMark: Mark = JSON.parse(JSON.stringify(mark));
      newMark.value = +value;
      dispatch(newMark);
    };
  }

  // life cycles
  public ngOnInit(): void {
    const subjectName: string = this.route.snapshot.params.name;
    this.subjectTableConfig = {
      caption: `${subjectName} class journal:`,
      headers: this.subjectHeadersConstantNames,
      body: []
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
    this.componentState$.subscribe(state => {
      if (this.isAllLoaded(state)) {

        // initialize subject
        this.subject = state.subjects.data.filter(subj => subj.name === subjectName)[0];

        // initialized new teacher form
        this.newTeacherConfig = this.getTeacherFormConfig(this.subject);

        // get all marks for particular subject
        const subjectsMarks: Mark[] = state.marks.data.filter(mark => mark.subject === this.subject.id);

        // initialize table headers with unique sorted dates
        const datesPartOfHeaders: number[] = [
          ...new Set(
            [...this.subject.uniqueDates].concat(pluck(subjectsMarks, "time"))
          )
        ].sort();
        this.subjectTableConfig.headers = [...this.subjectHeadersConstantNames, ...datesPartOfHeaders];

        /// initialize students for table
        this.subjectTableConfig.body = state.students.data.map(student => {
          const studentRowForTable: (string|number)[] = (
            new TableRow(this.subjectTableConfig.headers, student)
          ).createRowFromObject();
          let sum: number = 0;
          let average: number;
          subjectsMarks
            .filter(mark => mark.student === student.id)
            .forEach((mark, i) => {
                sum = mark.value + sum;
                average = sum / (i + 1);
                studentRowForTable[this.subjectTableConfig.headers.indexOf(mark.time)] = mark.value;
              }
            );
          if (average) {
            studentRowForTable[2] = average;
          }
          return studentRowForTable;
        });
      }
    });

  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
