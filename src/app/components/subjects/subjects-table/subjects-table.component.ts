import {Component, EventEmitter, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/internal/operators";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {DatePicker, Generator, NumberPicker} from "../../../common/helpers/Generator";
import {getAverageMark} from "../../../common/helpers/getAverageMark";
import {SUBJECT_HEADERS, SUBJECT_HEADERS_LENGTH} from "../../../common/constants/SUBJECT_HEADERS";
import {mapKeyGenerator} from "../../../common/helpers/mapKeyGenerator";
import {IPerson} from "../../../common/models/IPerson";
import {DatePipe} from "@angular/common";
import {personizer} from "../../../common/constants/personizer";

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
    private datePipe: DatePipe
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
  public getRowIndex(target: EventTarget): number {
    return +target.parentNode.parentNode.parentNode.getAttribute("rowindex");
  }
  public addNewColumn(): void {
    this.subjectTableConfig.headers.push("Select date");
    this.subjectTableConfig.body.forEach(row => row.push(""));
  }

  public shouldAddNumberInput(target: EventTarget): boolean {
    return (target.tagName.toLowerCase() === "td" && this.getCellIndex(target) >= this.headersRightShift);
  }
  public shouldAddDateInput(target: EventTarget): boolean {
    return (
      target.tagName.toLowerCase() === "th" &&
      !this.subjectHeadersConstantNames.includes(target.textContent) &&
      target.textContent === "Select date"
    );
  }

  public addDatePicker(target: EventTarget): void {
      if (this.shouldAddDateInput(target)) {
        this.dateGenerator.generateDatePicker(
          target,
          this.subject.uniqueDates,
          this.datePipe,
          this.subjectTableConfig.headers,
          this.subjectHeadersConstantNames,
        );
      } else if (this.shouldAddNumberInput(target)) {
        this.numberGenerator.generateNumberPicker(
          target
        );
      }
  }

  public addNewDateHeaders(target: EventTarget): void {
    const dateFromInput: string = target.value;
    const newDate: string = dateFromInput.split("-").join("/");
    const timeStamp: number = (new Date(newDate)).getTime();
    this.subject.uniqueDates.push(timeStamp);
    this.subjectTableConfig.headers = [...this.subjectHeadersConstantNames, ...this.subject.uniqueDates];
  }

  public addNewMarkToTheStudent(
    target: EventTarget,
    subject: ISubject,
    shiftConstant: number,
    body: string[][]
  ): void {
    const newMark: number = +target.value;
    const uniqueDateIndex: number = +(this.getCellIndex(target) - shiftConstant);
    const studentRow: string[] = body[this.getRowIndex(target)];
    const student: string = personizer(studentRow[0], studentRow[1]);
    this.subjectsService.addStudentsWithMarkToTheSubject(
      subject._id, student, uniqueDateIndex, newMark
    );
    return this.mergeStudentsAndMarksForView(
      body, subject.students, subject
    );
  }

  public mergeStudentsAndMarksForView(bodyData: ITableConfig["body"], students: ISubject["students"], subject: ISubject): string[][] {
    const mapKey: Function = mapKeyGenerator;
    const data = bodyData.map(row => {
      const constantPartOfRow: string[] = row.slice(0, 2);
      if (students.has(mapKey(row))) {
        const marks: string[] = students.get(mapKey(row));
        return [...constantPartOfRow, getAverageMark(marks), ...marks];
      } else {
        const emptyCellsJustForView: string[] = Array(subject.uniqueDates.length).fill("");
        return [...constantPartOfRow, "", ...emptyCellsJustForView];
      }
    });
    return data;
  }
  public applyNewValue(target: EventTarget): void {
    switch (target.getAttribute("type")) {
      case "date":
        target.blur();
        this.addNewDateHeaders(target);
        break;
      default:
        this.subjectTableConfig.body = this.addNewMarkToTheStudent(
          target, this.subject, this.headersRightShift, this.subjectTableConfig.body
        );
        target.blur();
        break;
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
      headers: [...this.subjectHeadersConstantNames, ...this.subject.uniqueDates],
      caption: `${this.subject.name} class students:`,
      body: [],
    };

    this.generateBodyDataFromStudents(this.subjectTableConfig.body);
    this.subjectTableConfig.body = this.mergeStudentsAndMarksForView(
      this.subjectTableConfig.body, this.subject.students, this.subject
    );
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

}
