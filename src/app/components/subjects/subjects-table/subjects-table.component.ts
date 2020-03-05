import {Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
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
import {ButtonComponent} from "../../../shared/button/button.component";

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
  public test$: any;
  public test2$: any;
  public tableData$: Observable<any>;
  public subject: ISubject;
  public form: FormGroup = new FormGroup({
    teacher: new FormControl("", [Validators.required, Validators.min(3)])
  });
  public helper = 0;
  constructor(
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private studentsService: StudentsServiceService
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

  public updateDay($event: any): void {
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

  public ngOnInit(): void {
    this.subject$ = this.subjectsService.subjects
      .pipe(
        withLatestFrom(this.route.params),
        map(data => data[0].filter(sub => sub._id === +data[1].id))
      );
    this.students$ = this.studentsService.getStudents();

    this.subscriptions.push(
      this.subject$.subscribe(data => this.subject = data[0])
    );
    this.test$ = this.studentsService.getOfStudents();
    this.test$.pipe(
      map(data => ({
        id: data._id, name: data.name, surname: data.surname
      }))
    );
    this.test2$ = this.subject$.pipe(
      map(data => data[0])
    );

    this.tableData$ = mergeSubjectAndStudents(this.test2$, this.test$, ["name", "surname", "average"]);

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

  public handleClick($event: Event): void {
    if ($event.target.classList[0] === "table__cell" && $event.target.innerText === "") {
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

      if (clickCloumn > 2 && clickCloumn < colLength) {
        $event.target.innerHTML = `<input name=${person.name} col=${clickCloumn} surname=${person.surname} type="number">`;

      }
    }
  }

  public addMarkToStudent($event): void {
    $event.target.getAttribute("name");
    $event.target.getAttribute("surname");
    const newMark: number = $event.target.value;
    this.tableData$.subscribe(data => data.forEach(row => {
      if (row[0] ===  $event.target.getAttribute("name") &&  row[1] === $event.target.getAttribute("surname")) {
        row[$event.target.getAttribute("col")] = newMark;
      }
    }));

  }
}

function mergeSubjectAndStudents(
  subject: Observable<ISubject>,
  persons: Observable<IPerson>,
  config: string[]
): Observable<any> {
  let result: Observable<any> = undefined;
  const aux1: Subscription = subject.subscribe(data => {
    data.students = [];
    const aux2: Subscription = persons.subscribe(person =>  {
      const pushable: [] = [];
      for (let prop of config) {
        pushable.push(person[prop]);
      }
      data.students.push([...pushable]);
    });
    aux2.unsubscribe();
    result = of(data.students);
  });
  aux1.unsubscribe();
  return result;
}
