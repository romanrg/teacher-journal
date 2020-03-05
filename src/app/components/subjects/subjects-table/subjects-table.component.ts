import {Component, EventEmitter, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, withLatestFrom} from "rxjs/internal/operators";
import {Observable, of, Subscription} from "rxjs";
import {IStudent} from "../../../common/models/IStudent";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";
import {IPerson} from "../../../common/models/IPerson";
import {MarkMaximumValue, MarkMinimumValue} from "../../../common/constants/MarkMinMax";
import {IMetaOfNewMarkInput} from "../../../common/models/IMetaOfNewMarkInput";
import {IInputNumberConfig} from "../../../common/models/IInputNumberConfig";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public tableConfig: ITableConfig = {};
  public subject$: Observable<ISubject[]>;
  public students$: Observable<IStudent[]>;
  public tableData$: Observable<any>;
  public subject: ISubject;
  public form: FormGroup = new FormGroup({
    teacher: new FormControl("", [Validators.required, Validators.min(3)])
  });
  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private studentsService: StudentsServiceService,
    private renderer2: Renderer2
  ) { }

  public changeTeacher(): void {
    const newTeacher: string = this.form.get("teacher").value;
    const auxSubscribe: Subscription = this.subject$.subscribe(
      subject => subject[0].teacher = newTeacher
    );
    this.form.reset();
    auxSubscribe.unsubscribe();
  }
  public addNewDate(): void {
    this.tableConfig.tableHeader.push(new Date());
  }
  public updateDay($event: Event): void {
    this.tableConfig.tableHeader.pop();
    this.tableConfig.tableHeader.push($event.date);
    const aux$: Observable<tableRow[]> = this.tableData$.pipe(
      map(data => data.forEach(row => {
        row.push("");
      }))
    );
    const auxSub: Subscription = aux$.subscribe();
    auxSub.unsubscribe();
  }
  public addMarkToStudent($event: Event): void {
    const newMark: number = $event.target.value;
    if (newMark >= MarkMinimumValue && newMark <= MarkMaximumValue) {
      $event.target.parentNode.innerHTML = newMark;
    }
  }
  public handleClick($event: Event): void {
    if ($event.target.classList[0] === "table__cell") {
      const meta: IMetaOfNewMarkInput = getMetaDataOfClick($event);
      const name = meta.person.name;
      const col = meta.clickCloumn;
      const surname = meta.person.surname;
      if (meta.clickCloumn > 2 && (meta.clickCloumn < meta.colLength - 1)) {
        const inputConfig: IInputNumberConfig = {
          min: MarkMinimumValue,
          max: MarkMaximumValue,
          step: 1,
          placeholder: $event.target.innerText,
          attributes: {
            name: name,
            col: col,
            surname: surname,
          }
        };
        this.renderer2.appendChild($event.target, this.generateNumberInput(inputConfig));
      }
    }
  }

  public generateNumberInput: Function = (
    config: IInputNumberConfig
  ): any => {
    const input = this.renderer2.createElement('input');
    this.renderer2.setAttribute(input, "type", "number");
    this.renderer2.setProperty(input,"max", config.max)
    this.renderer2.setProperty(input,"min", config.min)
    this.renderer2.setProperty(input,"placeholder", config.placeholder);
    for (let attr in config.attributes) {
      if (config.attributes.hasOwnProperty(attr)) {
        this.renderer2.setAttribute(input, attr, config.attributes[attr]);
      }
    }
    return input;
  };

  public ngOnInit(): void {
    this.subject$ = this.subjectsService.getSubjectByIdFromRoute(this.route.params);
    this.students$ = this.studentsService.getStudents();

    this.subscriptions.push(
      this.subject$.subscribe(data => this.subject = data[0])
    );

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
        paginationConstant: 5,
        data: this.tableData$
      },
      tableHeaderCell: {
        position: "last",
        action: this.addNewDate,
        screenReader: "Add new date",
        textContent: "+"
      }
    };

  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

const getAverageMark: Function = (arr: any[]): number => {
  const amount: number = 0;
  const sum: number = 0;
  arr.map(cell => {
    if (typeof cell === "number") {
        amount = amount + 1;
        sum = sum + cell;
    }
  });
  if (amount === 0) {
    return "";
  } else {
    return sum / amount;
  }

};

const mergeSubjectAndStudents: Function = (
  subject: Observable<ISubject>,
  persons: Observable<IPerson>,
  config: string[]
): Observable<any> => {
  let result: Observable<any> = undefined;
  const aux1: Subscription = subject.subscribe(data => {
    data.students = [];
    const aux2: Subscription = persons.subscribe(person =>  {
      const pushable: [] = [];
      for (let prop of config) {
        if (typeof prop === "function") {
          pushable.push(prop);
        } else {
          pushable.push(person[prop]);
        }

      }
      data.students.push([...pushable]);
    });
    aux2.unsubscribe();
    result = of(data.students);
  });
  aux1.unsubscribe();
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
  console.log({clickCloumn, colLength, person});
  return {clickCloumn, colLength, person};
};

const generateAttributes: Function = (attributes): string => {
  let result: string = ``;
  for (let attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      result = result + ` ${attr}="${attributes[attr]}"`;
    }
  }
  return result;
};
