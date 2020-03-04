import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, withLatestFrom} from "rxjs/internal/operators";
import {Observable, Subscription} from "rxjs";
import {IStudent} from "../../../common/models/IStudent";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {ITableConfig} from "../../../common/models/ITableConfig";

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
  public subject: ISubject;
  public form: FormGroup = new FormGroup({
    teacher: new FormControl("", [Validators.required, Validators.min(3)])
  });
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

    this.tableConfig = {
      tableHeader: ["name", "surname", "average mark"],
      caption: [`${this.subject.name} class students:`],
      tableBody: [this.students$, ["name", "surname"]],
      pagination: {
        paginationConstant: 5,
        data: this.students$
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
