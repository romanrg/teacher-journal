import {Component, OnDestroy, OnInit} from "@angular/core";
import {Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {ISubject} from "../../../common/models/ISubject";
import {SubjectsService} from "../../../common/services/subjects.service";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {CONFIRMATION_MESSAGE} from "../../../common/constants/CONFIRMATION_MESSAGE";
import {Observable} from "rxjs";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";
import {Store} from "@ngrx/store";
import {AppState} from "../../../@ngrx/app.state";
import * as SubjectsActions from "src/app/@ngrx/subjects/subjects.actions";

@Component({
  selector: "app-subject-form",
  templateUrl: "./subject-form.component.html",
  styleUrls: ["./subject-form.component.sass"]
})
export class SubjectFormComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  public formConfig: IFormConfig;
  public isSaved: boolean = false;
  public manager: SubscriptionManager;
  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.manager = new SubscriptionManager();
  }
  public submit($event: ISubject): void {
    this.isSaved = true;
    console.log($event);
    $event.uniqueDates = [];
    this.store.dispatch(SubjectsActions.createSubject({subject: $event}));
    this.router.navigate(["/subjects"]);
  }
  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSaved === false) {
      return confirm(CONFIRMATION_MESSAGE);
    } else {
      return true;
    }
  }
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
