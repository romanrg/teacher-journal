import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {filter, map, tap} from "rxjs/internal/operators";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {SUBJECT_HEADERS, SUBJECT_HEADERS_LENGTH} from "../../../common/constants/SUBJECT_HEADERS";
import {DatePipe} from "@angular/common";
import {MarksServiceService} from "../../../common/services/marks-service.service";
import {IStudent} from "../../../common/models/IStudent";
import {IMark, Mark} from "../../../common/models/IMark";

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
  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private studentsService: StudentsServiceService,
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private marksService: MarksServiceService
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer);
    this.dateGenerator = new DatePicker(this.renderer);
    this.numberGenerator = new NumberPicker(this.renderer, 1, 10);
  }

  public changeTeacher($event: Event): void {
    const newTeacher: string = $event[
      this.newTeacherConfig.formGroupName.formControls[0].name
      ];
    this.subject.teacher = newTeacher;
    this.newTeacherConfig.formGroupName.formControls[0].placeholder = newTeacher;
  }


  public getCellIndex(target: EventTarget): number {
    return +target.parentNode.getAttribute("index");
  }


  public addNewColumn(): void {
    this.subjectTableConfig.headers.push("Select date");
    this.subjectTableConfig.body.forEach(row => row.length = this.subjectTableConfig.headers.length);
  }


  public shouldAddNumberInput(target: EventTarget): boolean {
    return (target.tagName.toLowerCase() === "td" && this.getCellIndex(target) >= this.headersRightShift);
  }


  public shouldAddDateInput(target: EventTarget): boolean {
    return (
      target.tagName.toLowerCase() === "th" &&
      !this.subjectHeadersConstantNames.includes(target.textContent) &&
      target.textContent === "Select date ^"
    );
  }


  public submitDate(
    subjectsService: SubjectsService,
    subject: ISubject,
    config: ITableConfig,
  ): void {
    return function(value: string): void {
      subjectsService.addUniqueDate(subject._id, (new Date(value)).getTime());
      config.headers = [...config.headers.slice(0, 3), ...subjectsService.getUniqueDatesById(subject._id)];
    };
  }

  public submitMark(
    target: EventTarget,
    studentsService: StudentsServiceService,
    subjectsService: SubjectsService,
    marksService: MarksServiceService,
    subject: ISubject,
    config: ITableConfig,
    renderer: Renderer2,
    marksRenderFn: Function
  ): void {
    const studentRow: number = +target.parentNode.parentNode.getAttribute("rowIndex");
    const student: IStudent = studentsService.getStudentIdByName(
      config.body[studentRow][0], config.body[studentRow][1]
    );
    const timeStampArray: number[] = subjectsService.getUniqueDatesById(subject._id);
    return function (value: number, arr): void {
      const uniqueDateIndex: number = arr[0].getAttribute("index") - 3;
      const markDate: number = timeStampArray[uniqueDateIndex];
      const newMark: Mark = new Mark(
        student._id, subject._id, +value, markDate
      );
      marksService.addMarks(newMark);
      renderer.removeChild(arr[0], arr[1]);
      marksRenderFn(marksService, studentsService, subjectsService, subject, config);
    };
  }

  public generateInput(target: EventTarget): void {
      if (this.shouldAddDateInput(target)) {
        this.dateGenerator.generateDatePicker(
          target,
          this.subjectsService.getUniqueDatesById(this.subject._id),
          this.datePipe,
          this.submitDate(this.subjectsService, this.subject, this.subjectTableConfig)
        );
      } else if (this.shouldAddNumberInput(target)) {
        this.numberGenerator.generateNumberPicker(
          target,
          this.submitMark(
            target.parentNode,
            this.studentsService,
            this.subjectsService,
            this.marksService,
            this.subject,
            this.subjectTableConfig,
            this.renderer,
            this.addMarksToTheView
          )
        );
      }
  }
  public generateBodyDataFromStudents(bodyData: ITableConfig["body"]): void {
    this.studentsService.getOfStudents().pipe(
      map(data => {
        const creator: RowCreator = new RowCreator();
        const row: string[] = creator.generateRowFromObject(
          data, ["name", "surname", "average mark"]
        );
        bodyData.push(row);
      })
    ).subscribe().unsubscribe();
  }
  public addMarksToTheView(
    marksService: MarksServiceService,
    studentsService: StudentsServiceService,
    subjectService: SubjectsService,
    subject: ISubject,
    config: ITableConfig ): void {
    marksService.getMarks().pipe(
      filter(mark => mark.subject === subject._id),
      map(mark => {
        if (!config.headers.includes(mark.time)) {
          config.headers.push(mark.time);
        }
        if (!subjectService.getUniqueDatesById(subject._id).includes(mark.time)) {
          subjectService.addUniqueDate(subject._id, mark.time);
        }
        return mark;
      }),
      map(mark => {
        const student: IStudent = studentsService.findStudentById(mark.student);
        const markRow: Mark[] = (new RowCreator()).generateRowFromObject(mark, ["value"]);
        config.body.forEach(row => {
          if (row[0] === student.name && row[1] === student.surname) {
            row[config.headers.indexOf(mark.time)] = markRow[0];
            row[2] = Mark.getAverageMark(row.slice(3, row.length));
          } else {
            if (row.length < config.headers.length) {
              row.length = config.headers.length;
            }
          }
        });
      })
    ).subscribe().unsubscribe();
  }
  public ngOnInit(): void {
    this.manager.addSubscription(
      this.subjectsService.getSubjectByIdFromRoute(this.route.params).subscribe(data => this.subject = data[0])
    );
    this.newTeacherConfig = {
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
            placeholder: this.subject.teacher,
          }
        ]

      },
    };
    this.subjectTableConfig = {
      headers: [...this.subjectHeadersConstantNames, ...this.subjectsService.getUniqueDatesById(this.subject._id)],
      caption: `${this.subject.name} class students:`,
      body: [],
    };
    this.generateBodyDataFromStudents(this.subjectTableConfig.body);
    this.addMarksToTheView(
      this.marksService, this.studentsService, this.subjectsService, this.subject, this.subjectTableConfig
    );
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

}
