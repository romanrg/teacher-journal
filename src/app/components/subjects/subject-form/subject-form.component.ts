import { Component, OnInit } from "@angular/core";
import {Validators} from "@angular/forms";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Router} from "@angular/router";
import {IFormConfig} from "../../../common/models/IFormConfig";
import {IStudent} from "../../../common/models/IStudent";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ISubject} from "../../../common/models/ISubject";

@Component({
  selector: "app-subject-form",
  templateUrl: "./subject-form.component.html",
  styleUrls: ["./subject-form.component.sass"]
})
export class SubjectFormComponent implements OnInit {
  public formConfig: IFormConfig;
  constructor(
    private subjectsService: SubjectsService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const type: "text" | "textarea" = "text";
    const errorMessages: string[] = ["This field is required"];
    this.formConfig = {
      legend: "Add New Subject",
      formGroupName: {
        name: "form",
        formControls: [
          {
            name: "name",
            initialValue: "",
            type,
            validators: [Validators.required],
            errorMessages,
          },
          {
            name: "teacher",
            initialValue: "",
            type,
            validators: [Validators.required],
            errorMessages,
          },
          {
            name: "cabinet",
            initialValue: "",
            type,
            validators: [],
            errorMessages,
          },
          {
            name: "description",
            initialValue: "",
            type: "textarea",
            validators: [],
            errorMessages: errorMessages
          }
        ]
      }

    };
  }

  public submit($event: ISubject): void {
    this.subjectsService.addSubject($event);
    this.router.navigate(["/subjects"]);
  }
}
