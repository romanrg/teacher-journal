import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
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
import {Generator} from "../../../common/helpers/Generator";
import {IStudent} from "../../../common/models/IStudent";
import {TableCell} from "../../../common/models/TableCellEnum";
import {getAverageMark} from "../../../common/helpers/getAverageMark";
import {SUBJECT_HEADERS, SUBJECT_HEADERS_LENGTH} from "../../../common/constants/SUBJECT_HEADERS";
import {mapKeyGenerator} from "../../../common/helpers/mapKeyGenerator";

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
  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private studentsService: StudentsServiceService,
    private renderer: Renderer2
  ) {
    this.manager = new SubscriptionManager();
    this.generator = new Generator(this.renderer);
  }

  public changeTeacher($event: Event): void {
    const newTeacher: string = $event[
      this.newTeacherConfig.formGroupName.formControls[0].name
      ];
    this.subject.teacher = newTeacher;
    this.newTeacherConfig.formGroupName.formControls[0].placeholder = newTeacher;
  }
  public addNewColumn(): void {
    this.subjectTableConfig.headers.push("select date");
    this.subjectTableConfig.body.forEach(row => row.push(""));
  }
  public getRowChildsArrayOnCellClick(target: EventTarget): Element[] {
    return [...target.parentNode.parentNode.childNodes];
  }
  public getRidOfAngularCommentElements(nodesArray: Element[]): Element[] {
    return nodesArray.filter(node => node.classList);
  }
  public getRowIndex(row: Element[], target: EventTarget): number {
    return row.findIndex(cell => cell === target.parentNode);
  }
  public checkForEditableCell(row: Element[], editablePositionConstant: number, target: EventTarget): boolean {
    return this.getRowIndex(row, target) >= editablePositionConstant;
  }
  public addContentEditableAttribute(target: EventTarget): void {
    const nodesArray: Element[] = this.getRowChildsArrayOnCellClick(target);
    const clickRow: Element[] = this.getRidOfAngularCommentElements(nodesArray);
    if (this.checkForEditableCell(clickRow, 3, target)) {
      this.generator.generateAttributes(target, {contenteditable: true});
    }
  }
  public getColNumberOfUniqueDatesAsIndex(target: EventTarget, shiftLeftConstant: number): number {
    return this.getRidOfAngularCommentElements(
      this.getRowChildsArrayOnCellClick(target)
    ).findIndex(node  => node === target.parentNode) - shiftLeftConstant;
  }
  public findStudent(row: Element[]): IStudent {
    return ({
      name: row[0].textContent,
      surname: row[1].textContent
    });
  }
  public getPathToTheTheadElement(target: EventTarget): Element[] {
    return Array.from([
      ...target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes
    ][1].childNodes[0].childNodes[0].childNodes[0].childNodes);
  }
  public findDate(target: EventTarget): string {
    const thead:  Element[] = this.getPathToTheTheadElement(target);
    const row: Element[] = this.getRidOfAngularCommentElements(
      this.getRowChildsArrayOnCellClick(target)
    );
    const markIndex: number = this.getRowIndex(row, target);
    const date: string = this.getRidOfAngularCommentElements(thead)[markIndex].textContent;
    return date;
  }
  public handleThEvents(target: EventTarget, shiftLeftConstant: number, headersConstantNames: string[]): string[] {
    const datesForRow: string[] = this.subjectsService.handleUniqueDates(
      this.subject._id, this.getColNumberOfUniqueDatesAsIndex(target, shiftLeftConstant), target
    );
    return [...headersConstantNames, ...datesForRow];

  }
  public addMarksForEachStudent(bodyData: ITableConfig["body"], students: ISubject["students"], subject: ISubject): string[][] {
    const mapKey: Function = mapKeyGenerator;
    return bodyData.map(row => {
      const constantPartOfRow: string[] = row.slice(0, 2);
      if (students.has(mapKey(row))) {
        const marks: string[] = students.get(mapKey(row));
        return [...constantPartOfRow, getAverageMark(marks), ...marks];
      } else {
        const emptyCellsJustForView: string[] = Array(subject.uniqueDates.length).fill("");
        return [...constantPartOfRow, "", ...emptyCellsJustForView];
      }
    });
  }
  public handleTdEvents(target: EventTarget, subject: ISubject, body: ITableConfig["body"]): string[][] {
    const tdCellArray: Element[] = this.getRowChildsArrayOnCellClick(target);
    this.subjectsService.addStudentsWithMarkToTheSubject(
      subject._id,
      this.findStudent(this.getRidOfAngularCommentElements(tdCellArray)),
      subject.uniqueDates.findIndex(data => data === this.findDate(target)),
      +target.textContent,
    );
    return this.addMarksForEachStudent(
      body, subject.students, subject
    );
  }
  public applyNewValue(target: EventTarget): void {
    switch (target.tagName.toLowerCase()) {
      case TableCell.th:
        target.blur();
        this.subjectTableConfig.headers = this.handleThEvents(
          target, this.headersRightShift, this.subjectHeadersConstantNames
        );
        break;
      default:
        target.blur();
        this.subjectTableConfig.body = this.handleTdEvents(target, this.subject, this.subjectTableConfig.body);
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
    this.subjectTableConfig.body = this.addMarksForEachStudent(
      this.subjectTableConfig.body, this.subject.students, this.subject
    );
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
