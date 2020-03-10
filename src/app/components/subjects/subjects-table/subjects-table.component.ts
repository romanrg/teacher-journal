import {Component, ContentChild, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/internal/operators";
import {Observable} from "rxjs";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {RowCreator} from "../../../common/helpers/RowCreator";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {Generator} from "../../../common/helpers/Generator";
import {IStudent} from "../../../common/models/IStudent";
import {TableCell} from "../../../common/models/TableCellEnum";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public newTeacherConfig: IFormConfig;
  public subject$: Observable<ISubject[]>;
  public subject: ISubject;
  public subjectTableConfig: ITableConfig;
  public manager: SubscriptionManager;
  public generator: Generator;
  public subjectHeadersConstantNames: string[] = ["name", "surname", "average mark"];
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
  public ngOnInit(): void {
    this.subject$ = this.subjectsService.getSubjectByIdFromRoute(this.route.params);
    this.manager.addSubscription(this.subject$.subscribe(data => this.subject = data[0]));
    this.newTeacherConfig = {
      legend: "Change Subject Teacher",
      formGroupName: {
        name: "form",
        formControls: [
          {
            name: "teacher: ",
            initialValue: "",
            type: "text",
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
  public addNewColumn(): void {
    this.subjectTableConfig.headers.push("select date");
    this.subjectTableConfig.body.forEach(row => row.push(""));
  }

  public handleClick($event: Event): void {
    const clickRow: [] = this.filterClickEventParentNode($event);
    if (this.checkForEditableCell(clickRow, 3, $event)) {
      this.generator.generateAttributes($event.target, {contenteditable: true});
    }
  }

  public filterClickEventParentNode($event: Event): [] {
    return [...$event.target.parentNode.parentNode.childNodes].filter(node => node.classList);
  }

  public checkForEditableCell(row: [], editablePositionConstant: number, $event: Event): boolean {
    return row.findIndex(cell => cell === $event.target.parentNode) >= editablePositionConstant;
  }

  public applyNewValue($event: Event): void {
    switch ($event.target.tagName.toLowerCase()) {
      case TableCell.th:
        this.handleThEvents($event);
        break;
      default:
        this.handleTdEvents($event);
        break;
    }
  }

  public findStudent(row: []): IStudent {
    return {name: row[0].textContent, surname: row[1].textContent};
  }

  public findDate($event: Event): void {
    const thead: [] = [
      ...$event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes
    ][1].childNodes[0].childNodes[0].childNodes[0].childNodes;
    const row: [] = [...$event.target.parentNode.parentNode.childNodes].filter(node => node.classList);
    const markIndex: number = row.findIndex(cell => cell === $event.target.parentNode);
    const date: string = [...thead].filter(node => node.classList)[markIndex].textContent;
    return date;
  }

  public generateBodyDataFromStudents(bodyData: ITableConfig.body): void {
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

  public addMarksForEachStudent(bodyData: ITableConfig.body, students: ISubject.students, subject: ISubject): void {
    const studentsWithMarks: Array<string[]> = bodyData.filter(row => students.has(personizer(row)));
    const newBody: Array<string[]> = bodyData.map(row => {
      const constantPartOfRow: string[] = row.slice(0, 2);
      if (studentsWithMarks.includes(row)) {
        console.log("student with mark");
        const marks: string[] = students.get(personizer(row));
        return [...constantPartOfRow, getAverageMark(marks), ...marks];
      } else {
        const emptyCellsForView: string[] = Array(subject.uniqueDates.length).fill("");
        return [...constantPartOfRow, "", ...emptyCellsForView];
      }
    });
    return newBody;
  }

  public getUniqDatesIndex($event: Event, moveLeftConstant: number): number {
    return [...$event.target.parentNode.parentNode.childNodes]
      .filter(node => node.classList)
      .findIndex(
        node => node === $event.target.parentNode
      ) - moveLeftConstant;
  }

  public handleThEvents($event: Event): void {
    const datesForRow: string[] = this.subjectsService.handleUniqueDates(
      this.subject._id, this.getUniqDatesIndex($event, 3), $event
    );
    this.subjectTableConfig.headers = [...this.subjectHeadersConstantNames, ...datesForRow];
    $event.target.blur();
  };

  public handleTdEvents($event: Event): void {
    this.subjectsService.addStudentsWithMarkToTheSubject(
      this.subject._id,
      this.findStudent(this.filterClickEventParentNode($event)),
      this.subject.uniqueDates.findIndex(data => data === this.findDate($event)),
      +$event.target.textContent,
    );
    this.subjectTableConfig.body = this.addMarksForEachStudent(
      this.subjectTableConfig.body, this.subject.students, this.subject
    );
    $event.target.blur();
  };
}

const personizer: Function = (row: string[]): string => {
  return JSON.stringify({name: row[0], surname: row[1]});
};

const getAverageMark: Function = (arr: []): number => {
  const filtered: number[] = arr.filter(mark => typeof mark === 'number');
  return (filtered.reduce((cur, acc) => cur + acc) / filtered.length);
};
