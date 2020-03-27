import {Component, OnDestroy, OnInit} from "@angular/core";
import {Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {IStudent} from "../../../common/models/IStudent";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {CONFIRMATION_MESSAGE} from "../../../common/constants/CONFIRMATION_MESSAGE";
import {Observable} from "rxjs";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Students} from "../../../@ngxs/students/students.actions";
import {StudentsStateModel} from "../../../@ngxs/students/students.state";

@Component({
  selector: "app-student-form",
  templateUrl: "./student-form.component.html",
  styleUrls: ["./student-form.component.sass"]
})
export class StudentFormComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public formConfig: IFormConfig;
  public isSaved: boolean = false;

  constructor(
    private router: Router,
    private store: Ngxs.Store<StudentsStateModel>
  ) { }
  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSaved === false) {
      return confirm(CONFIRMATION_MESSAGE);
    } else {
      return true;
    }
  }
  public submit($event: IStudent): void {
    this.isSaved = true;
    this.store.dispatch(new Students.Create($event));
    this.router.navigate(["/students"]);
  }
  public ngOnInit(): void {
    const errorMessages: string[] = ["This field is required"];
    this.formConfig = {
      legend: "Add New Student",
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
            name: "surname",
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
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}
