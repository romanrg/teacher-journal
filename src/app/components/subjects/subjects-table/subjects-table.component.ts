import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/internal/operators";
import {Observable, of, Subscription} from "rxjs";
import {IStudent} from "../../../common/models/IStudent";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {IPerson} from "../../../common/models/IPerson";
import {MarkMaximumValue, MarkMinimumValue} from "../../../common/constants/MarkMinMax";
import {IMetaOfNewMarkInput} from "../../../common/models/IMetaOfNewMarkInput";
import {IInputNumberConfig} from "../../../common/models/IInputNumberConfig";
import {Generator} from "../../../common/helpers/Generator";
import {checkNumberRange} from "../../../common/helpers/checkNumberRange";
import {IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";

const addMarkToTheView: Function = (mark, element, generator): void => {
  generator.createText(element.parentNode, `${mark}`);
  generator.removeChild(element.parentNode, element);
};

const mergeSubjectAndStudents: Function = (
  subject: Observable<ISubject>,
  persons: Observable<IPerson>,
  config: string[]
): Observable<any> => {
  let result: Observable<any> = undefined;
  subject.subscribe(data => {
    data.students  = [];
    persons.subscribe(person =>  {
      const pushable: any = [];
      for (let prop of config) {
        if (typeof prop === "function") {
          pushable.push(prop);
        } else {
          pushable.push(person[prop]);
        }

      }
      data.students.push([...pushable]);
    }).unsubscribe();
    result = of(data.students);
  }).unsubscribe();

  return result;
};

const getMetaDataOfClick: Function = (
  $event: Event
): IMetaOfNewMarkInput => {
  let clickCloumn: number = 0;
  let person: {name: string; surname: string} = {name: "", surname: ""};
  let colLength: number = 0;
  Array.from($event.target.parentNode.childNodes)
    .filter(node => node.classList)
    .map(data => {
      colLength = colLength + 1;
      return data;
    })
    .map((node, i) => {
      node === $event.target ? clickCloumn = i : "";
      return node;
    })
    .map((data, i) => {
      if (i === 0) {
        person.name = data.innerText;
      } else if (i === 1) {
        person.surname = data.innerText;
      }
    });
  return {clickCloumn, colLength, person};
};

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public tableConfig: ITableConfig = {};
  public newTeacherConfig: IFormConfig;

  public subject$: Observable<ISubject[]>;
  public students$: Observable<IStudent[]>;
  public tableData$: Observable<any>;
  public subject: ISubject;

  public generator: Generator;
  public manager: SubscriptionManager;

  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private studentsService: StudentsServiceService,
    private render: Renderer2
  ) {
    this.generator = new Generator(this.render);
    this.manager = new SubscriptionManager();
  }

  public changeTeacher($event: Event): void {
    const newTeacher: string = $event[
      this.newTeacherConfig.formGroupName.formControls[0].name
      ];
    this.subject.teacher = newTeacher;
    this.newTeacherConfig.formGroupName.formControls[0].placeholder = newTeacher;
  }
  public addNewDate(): void {
    this.tableConfig.tableHeader.push(new Date());
  }
  public updateDay($event: {date: string}): void {
    this.tableConfig.tableHeader.pop();
    this.tableConfig.tableHeader.push($event.date);
    const aux$: Observable<any[]> = this.tableData$.pipe(
      map(data => data.forEach(row => {
        row.push("");
      }))
    );
    const auxSub: Subscription = aux$.subscribe();
    this.manager.addSubscription(auxSub);
  }
  public addMarkToStudent($event: Event): void {
    const newMark: number = $event.target.value;
    if (checkNumberRange(newMark, [MarkMinimumValue, MarkMaximumValue])) {
      addMarkToTheView(newMark, $event.target, this.generator);
    }
  }
  public handleClick($event: Event): void {
    if ($event.target.classList[0] === "table__cell" && $event.target.innerText === "") {
      const meta: IMetaOfNewMarkInput = getMetaDataOfClick($event);
      if (checkNumberRange(meta.clickCloumn, [2, meta.colLength - 1], false)) {
        const inputConfig: IInputNumberConfig = {
          attributes: {
            name: meta.person.name,
            col: meta.clickCloumn,
            surname: meta.person.surname,
          },
          properties: {
            min: MarkMinimumValue,
            max: MarkMaximumValue,
            step: 1,
            placeholder: $event.target.innerText,
            type: "number",
          }
        };
        this.generator.appendChild($event.target, this.generateNumberInput(inputConfig));
      }
    }
  }
  public generateNumberInput(config: IInputNumberConfig): any {
    const input: any = this.generator.generateElement("input");
    this.generator.generateProperties(input, config.properties);
    this.generator.generateAttributes(input, config.attributes);
    return input;
  }

  public ngOnInit(): void {
    this.subject$ = this.subjectsService.getSubjectByIdFromRoute(this.route.params);
    this.students$ = this.studentsService.getStudents();
    this.manager.addSubscription(this.subject$.subscribe(data => this.subject = data[0]));

    let aux$: Observable<IStudent> = this.studentsService.getOfStudents()
      .pipe(
        map(data => ({
          id: data._id, name: data.name, surname: data.surname
        }))
    );
    let auxSubject$: Observable<ISubject> = this.subject$.pipe(
      map(data => data[0])
    );
    this.tableData$ = mergeSubjectAndStudents(auxSubject$, aux$, ["name", "surname", "average"]);

    this.tableConfig = {
      tableHeader: ["name", "surname", "average mark"],
      caption: [`${this.subject.name} class students:`],
      tableBody: [this.tableData$, ["all"]],
      pagination: {
        paginationConstant: 10,
        data: this.tableData$
      },
      tableHeaderCell: {
        position: "last",
        action: this.addNewDate,
        screenReader: "Add new date",
        textContent: "+"
      }
    };
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

  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

}
