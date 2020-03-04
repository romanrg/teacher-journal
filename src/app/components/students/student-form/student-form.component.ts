import { Component, OnInit } from "@angular/core";
import {Validators} from "@angular/forms";
import {StudentsServiceService} from "../../../common/services/students-service.service";
import {Router} from "@angular/router";
import {IFormConfig} from "../../../common/models/IFormConfig";
import {IStudent} from "../../../common/models/IStudent";

@Component({
  selector: "app-student-form",
  templateUrl: "./student-form.component.html",
  styleUrls: ["./student-form.component.sass"]
})
export class StudentFormComponent implements OnInit {
  public formConfig: IFormConfig;
  constructor(
    private studentsService: StudentsServiceService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const type: "text" | "textarea" = "text";
    const errorMessages: string[] = ["This field is required"];
    this.formConfig = {
      legend: "Add New Student",
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
            name: "surname",
            initialValue: "",
            type,
            validators: [Validators.required],
            errorMessages,
          },
          {
            name: "address",
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

  public submit($event: IStudent): void {
    this.studentsService.addStudent($event);
    this.router.navigate(["/students"]);
  }
}
