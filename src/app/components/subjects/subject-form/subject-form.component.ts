import {Component, OnInit} from "@angular/core";
import {Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {ISubject} from "../../../common/models/ISubject";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {CONFIRMATION_MESSAGE} from "../../../common/constants/CONFIRMATION_MESSAGE";
import {Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store";
import { SubjectsStateModel} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-subject-form",
  templateUrl: "./subject-form.component.html",
  styleUrls: ["./subject-form.component.sass"]
})
export class SubjectFormComponent implements OnInit, ComponentCanDeactivate{
  public formConfig: IFormConfig;
  public isSaved: boolean = false;
  public readonly confirm: string;
  constructor(
    private router: Router,
    private store: Ngxs.Store<SubjectsStateModel>,
    private translate: TranslateService,
  ) {
    this.translate.stream("CONFIRMATION_MESSAGE").subscribe(translation => this.confirm = translation)
  }
  public submit($event: ISubject): void {
    this.isSaved = true;
    $event.uniqueDates = [];
    this.store.dispatch(new Subjects.Create($event));
    this.router.navigate(["/subjects"]);
  }
  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSaved === false) {
      return confirm(this.confirm);
    } else {
      return true;
    }
  }
  public ngOnInit(): void {
    /*
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
            name: "address",
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
    */
    this.translate.stream("FORMS").subscribe(data => {
      this.translations = data;
      const errorMessages: string[] = [this.translations.ERRORS.REQUIRED];
      this.formConfig = {
        legend: this.translations.NEW_SUBJECT.LEGEND,
        formGroupName: {
          name: "form",
          formControls: [
            {
              name: "name",
              initialValue: "",
              type: FormControlType.text,
              validators: [Validators.required],
              errorMessages,
              description: this.translations.NEW_SUBJECT.CONTROLS_NAME.NAME.TITLE,
            },
            {
              name: "teacher",
              initialValue: "",
              type: FormControlType.text,
              validators: [Validators.required],
              errorMessages,
              description: this.translations.NEW_SUBJECT.CONTROLS_NAME.TEACHER.TITLE,
            },
            {
              name: "address",
              initialValue: "",
              type: FormControlType.text,
              validators: [],
              errorMessages,
              description: this.translations.NEW_SUBJECT.CONTROLS_NAME.ADDRESS.TITLE,
            },
            {
              name: "description",
              initialValue: "",
              type: FormControlType.textarea,
              validators: [],
              errorMessages,
              description: this.translations.NEW_SUBJECT.CONTROLS_NAME.DESCRIPTION.TITLE,
            }
          ]
        }

      };
    });
  }
}
