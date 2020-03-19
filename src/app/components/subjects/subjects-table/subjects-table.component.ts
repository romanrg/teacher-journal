import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, tap} from "rxjs/internal/operators";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {ITableConfig, TableRow} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {SUBJECT_HEADERS, SUBJECT_HEADERS_LENGTH} from "../../../common/constants/SUBJECT_HEADERS";
import {DatePipe} from "@angular/common";
import {MarksServiceService} from "../../../common/services/marks-service.service";
import {IStudent} from "../../../common/models/IStudent";
import {IMark, Mark} from "../../../common/models/IMark";
import {from, Observable, of} from "rxjs";

import {AppState} from "../../../@ngrx/app.state";
import {SubjectsState} from "../../../@ngrx/subjects/subjects.state";
import {select, Store} from "@ngrx/store";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";
import {StudentsState} from "../../../@ngrx/students/students.state";
import * as StudentsActions from "src/app/@ngrx/students/students.actions.ts";
import {MarksState} from "../../../@ngrx/marks/marks.state";
import {pluck} from "../../../common/helpers/lib";
import {element} from "protractor";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public newTeacherConfig: IFormConfig;
  public subject: ISubject;
  public subjectTableConfig: ITableConfig;
  public manager: SubscriptionManager;
  public generator: Generator;
  public subjectHeadersConstantNames: string[] = SUBJECT_HEADERS;
  public headersRightShift: number = SUBJECT_HEADERS_LENGTH;
  public dateGenerator: DatePicker;
  public numberGenerator: NumberPicker;

  public public;
  public componentState$: Observable<{
    subjects: SubjectsState,
    students: StudentsState,
    marks: MarksState
  }>;
  public subjects: ISubject[];
  public students: IStudent[];
  public marks: Mark[];

  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private studentsService: StudentsServiceService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private marksService: MarksServiceService,
    private store: Store<AppState>
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer);
    this.dateGenerator = new DatePicker(this.renderer);
    this.numberGenerator = new NumberPicker(this.renderer, 1, 10);
  }

  // correctly works with @ngrx
  public changeTeacher($event: Event): void {
    const newTeacher: string = $event[
      this.newTeacherConfig.formGroupName.formControls[0].name
      ];
    const patchedSubject: ISubject = {...this.subject};
    patchedSubject.teacher = newTeacher;
    this.store.dispatch(SubjectsActions.changeTeacher({patchedSubject: patchedSubject}));
  }
  public addNewColumn(): void {
    this.subjectTableConfig.headers.push("Select date");
    this.subjectTableConfig.body.forEach(row => row.length = this.subjectTableConfig.headers.length);
  }
  public shouldAddDateInput(target: EventTarget): boolean {
    return (
      target.tagName.toLowerCase() === "th" &&
      !this.subjectHeadersConstantNames.includes(target.textContent) &&
      target.textContent.includes("Select date")
    );
  }
  public submitDate(
    dispatch: Function,
    subject: ISubject
  ): void {
    return function(value: string): void {
      const copy: ISubject = JSON.parse(JSON.stringify(subject));
      copy.uniqueDates.push((new Date(value)).getTime());
      dispatch(copy);
    };
  }

  public getCellIndex(target: EventTarget): number {
    return +target.parentNode.getAttribute("index");
  }
  public shouldAddNumberInput(target: EventTarget): boolean {
    return (target.tagName.toLowerCase() === "td" && this.getCellIndex(target) >= this.headersRightShift);
  }

  public submitMark(
    dispatch: Function,
  ): void {
    return function (value: number, arr): void {
      dispatch(value, arr);
    };
  }
  public generateInput(target: EventTarget): void {
      if (this.shouldAddDateInput(target)) {
        const _dispatcher: Function = (store, dispatcher, name) => (value) => store.dispatch(dispatcher({[name]: value}));
        this.dateGenerator.generateDatePicker(
          target,
          this.subjectTableConfig.headers.filter(head => typeof head === "number"),
          this.datePipe,
          this.submitDate(_dispatcher(this.store, SubjectsActions.addNewUniqueDate, "subject"), this.subject)
        );
      } else if (this.shouldAddNumberInput(target)) {
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(console.log)
        );
      }
  }
  public generateBodyDataFromStudents(): void {
    const result: string[][] = [];
    this.manager.addSubscription(this.studentsService.getOfStudents().pipe(
      map(data => {
        const creator: RowCreator = new RowCreator();
        const row: string[] = creator.generateRowFromObject(
          data, ["name", "surname", "average mark"]
        );
        result.push(row);
        if (this.studentsService.getStudents().length) {
          if (!this.studentsService.getStudents().includes(data)) {
            this.studentsService.pushStudent(data);
          }
        } else {
          this.studentsService.pushStudent(data);
        }
      }),
    ).subscribe());
    return result;
  }
  public addMarksToTheView(
    marksService: MarksServiceService,
    studentsService: StudentsServiceService,
    subjectService: SubjectsService,
    subject: ISubject,
    config: ITableConfig ): void {
    return marksService.getSubjectMarks(subject.id)
      .pipe(
        map(marks => {
          if (marks.length) {
            marks.forEach(mark => {
              if (!subject.uniqueDates.includes(mark.time)) {
                subjectService.addUniqueDate(subject.id, mark.time);
              }
              if (!config.headers.includes(mark.time)) {
                config.headers.push(mark.time);
              }

            });
          }
          return marks;
        }),
        map(marks => {
          if (marks.length) {
            marks.forEach(mark => {
              const student: IStudent = studentsService.findStudentById(mark.student);
              const markRow: Mark[] = (new RowCreator()).generateRowFromObject(mark, ["value"]);

              config.body
                .forEach(row => {
                  if (row[0] === student.name && row[1] === student.surname) {
                    row[config.headers.indexOf(mark.time)] = markRow[0];
                    row[2] = Mark.getAverageMark(row.slice(3, row.length));
                  } else {

                    if (row.length < config.headers.length) {
                      row.length = config.headers.length;
                    }
                  }
                });
            });
          } else {
            config.body.forEach(row => {
              if (row.length < config.headers.length) {
                row.length = config.headers.length;
              }
            });
          }

        })
      ).subscribe();
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
  public getInitialTableConfig(constants: string[], subject: ISubject): ITableConfig {
    return {
      headers: [...constants, ...subject.uniqueDates],
      caption: `${subject.name} class students:`,
      body: this.generateBodyDataFromStudents(),
    };
  }

  public deleteDate($event: Event): void {
    const dateIndex: number = $event.target.parentNode.getAttribute("index") - this.headersRightShift;
    const date: number = this.subject.uniqueDates[dateIndex];
    const deletedMarksArray: Observable<any>[] = this.marksService.deleteMarks(this.subject.id, date);
    if (deletedMarksArray.length) {
      deletedMarksArray.forEach(obs => obs.subscribe().unsubscribe());
      this.manager.addSubscription(this.marksService.getMarks().subscribe(marks => {
        this.marksService.marks = marks;
        this.subject.uniqueDates = this.subject.uniqueDates.filter((ts) => ts !== date);
        this.subjectTableConfig = this.getInitialTableConfig(this.subjectHeadersConstantNames, this.subject);
        this.manager.addSubscription(this.addMarksToTheView(
          this.marksService,
          this.studentsService,
          this.subjectsService,
          this.subject,
          this.subjectTableConfig
        ));

      }));
    } else {
      this.subjectsService.patchSubject(this.subject);
      this.subject.uniqueDates = this.subject.uniqueDates.filter((ts, i) => i !== dateIndex);
      this.subjectTableConfig = this.getInitialTableConfig(this.subjectHeadersConstantNames, this.subject);
      this.manager.addSubscription(this.addMarksToTheView(
        this.marksService,
        this.studentsService,
        this.subjectsService,
        this.subject,
        this.subjectTableConfig
      ));
    }

  }
  public isAllLoaded(state: {
    subjects: SubjectsState,
    students: StudentsState,
    marks: MarksState
  }): boolean {
    return Object.keys(state).every(key => state[key].loaded === true);
  }
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
