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
import {OneHeaderTableComponent} from "../../../shared/one-header-table/one-header-table.component";
import {Generator} from "../../../common/helpers/Generator";
import {IStudent} from "../../../common/models/IStudent";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  @ViewChild(OneHeaderTableComponent, {static: true}) public el: ElementRef;
  public newTeacherConfig: IFormConfig;
  public subject$: Observable<ISubject[]>;
  public subject: ISubject;
  public subjectTableConfig: ITableConfig;
  public manager: SubscriptionManager;
  public generator: Generator;
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
      headers: ["name", "surname", "average mark", ...this.subject.uniqueDates],
      caption: `${this.subject.name} class students:`,
      body: [],
    };
    this.generateBodyData();

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
      case "th":
        const uniqIndex: number = [...$event.target.parentNode.parentNode.childNodes]
          .filter(node => node.classList)
          .findIndex(
          node => node === $event.target.parentNode
          ) - 3;
        if (typeof this.subject.uniqueDates[uniqIndex] !== "string") {
          this.subject.uniqueDates.push($event.target.textContent);
        } else {
          this.subject.uniqueDates[uniqIndex] = $event.target.textContent;
        }
        this.subject.uniqueDates.sort();
        this.generateBodyData();
        $event.target.blur();
        break;
      default:
        const mark: number = +$event.target.textContent;
        const markedStudent: IStudent = this.findStudent(this.filterClickEventParentNode($event));
        const date: string = this.findDate($event);
        const dateIndex: string = this.subject.uniqueDates.findIndex(data => data === date);
        this.subjectsService.addStudentsWithMarkToTheSubject(
          this.subject._id,
          markedStudent,
          dateIndex,
          mark
        );
        this.generateBodyData();
        $event.target.blur();
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

  public generateBodyData(): void {
    this.subjectTableConfig.body = [];
    this.studentsService.getOfStudents().pipe(
      map(data => {
        const creator: RowCreator = new RowCreator();
        const row: string[] = creator.generateRowFromObject(
          data, ["name", "surname", "average mark"]
        );
        if (this.subject.students.size) {
          const mapKey: string = JSON.stringify({
            name: row[0], surname: row[1]
          });
          if (this.subject.students.has(mapKey)) {
            const marks: number[] = this.subject.students.get(mapKey);
            row.push(...marks);
          } else {
            while (row.length < this.subjectTableConfig.headers.length) {
              row.push("");
            }
          }

        }
        this.subjectTableConfig.body.push(row);
      })
    ).subscribe().unsubscribe();
  }
}
