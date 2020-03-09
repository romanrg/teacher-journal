import { Component, OnInit } from "@angular/core";
import {Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {ISubject} from "../../../common/models/ISubject";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {CONFIRMATION_MESSAGE} from "../../../common/constants/CONFIRMATION_MESSAGE";

@Component({
  selector: "app-subject-form",
  templateUrl: "./subject-form.component.html",
  styleUrls: ["./subject-form.component.sass"]
})
export class SubjectFormComponent implements OnInit, ComponentCanDeactivate {
  public formConfig: IFormConfig;
  public isSaved: boolean = false;
  constructor(
    private subjectsService: SubjectsService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const errorMessages: string[] = ["This field is required"];
    this.formConfig = {
      legend: "Add New Subject",
      formGroupName: {
        name: "form",
        formControls: [
          {
            name: "name",
            initialValue: "",
            type: FormControlType.text,
            validators: [Validators.required],
            errorMessages,
          },
          {
            name: "teacher",
            initialValue: "",
            type: FormControlType.text,
            validators: [Validators.required],
            errorMessages,
          },
          {
            name: "cabinet",
            initialValue: "",
            type: FormControlType.text,
            validators: [],
            errorMessages,
          },
          {
            name: "description",
            initialValue: "",
            type: FormControlType.textarea,
            validators: [],
            errorMessages: errorMessages
          }
        ]
      }

    };
  }

  public submit($event: ISubject): void {
    this.isSaved = true;
    this.subjectsService.addSubject($event);
    this.router.navigate(["/subjects"]);
  }
  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSaved === false) {
      return confirm(CONFIRMATION_MESSAGE);
    } else {
      return true;
    }
  }
}
