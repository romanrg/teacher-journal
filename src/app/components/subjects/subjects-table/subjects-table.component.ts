import {Component, OnDestroy, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, pluck} from "rxjs/internal/operators";
import {Observable} from "rxjs";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Generator} from "../../../common/helpers/Generator";
import {IFormConfig} from "../../../common/models/IFormConfig";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {RowCreator} from "../../../common/helpers/RowCreator";

@Component({
  selector: "app-subjects-table",
  templateUrl: "./subjects-table.component.html",
  styleUrls: ["./subjects-table.component.sass"]
})
export class SubjectsTableComponent implements OnInit, OnDestroy {
  public newTeacherConfig: IFormConfig;

  public subject$: Observable<ISubject[]>;
  public subject: ISubject;

  public subjectTableConfig: any;

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
      headers: ["name", "surname", "average mark"],
      caption: `${this.subject.name} class students:`,
      body: [],
    };

    this.studentsService.getOfStudents().pipe(
      map(data => {
        const creator: RowCreator = new RowCreator();
        const row: string[] = creator.generateRowFromObject(
          data, ["name", "surname", "average mark"]
        );
        this.subjectTableConfig.body.push(row);
      })
    ).subscribe().unsubscribe();
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }

}
