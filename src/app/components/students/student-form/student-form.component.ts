import {Component, OnDestroy, OnInit} from "@angular/core";
import {Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {IStudent} from "../../../common/models/IStudent";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {Observable} from "rxjs";
import {SubscriptionManager} from "../../../common/helpers/SubscriptionManager";

// ngxs
import * as Ngxs from "@ngxs/store";
import {Students} from "../../../@ngxs/students/students.actions";
import {StudentsStateModel} from "../../../@ngxs/students/students.state";
import {TranslateService} from "@ngx-translate/core";
import {switchMap, tap} from "rxjs/internal/operators";
import {AdService} from "../../../common/services/ad.service";

@Component({
  selector: "app-student-form",
  templateUrl: "./student-form.component.html",
  styleUrls: ["./student-form.component.sass"]
})
export class StudentFormComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  private manager: SubscriptionManager = new SubscriptionManager();
  public formConfig: IFormConfig;
  public isSaved: boolean = false;
  public translations: any;
  public confirm: string;
  public pops: [];
  constructor(
    private router: Router,
    private store: Ngxs.Store<StudentsStateModel>,
    private translate: TranslateService,
    private adService: AdService
  ) {
    this.manager.addSubscription(
      this.translate.stream("CONFIRMATION_MESSAGE").subscribe(translation => this.confirm = translation)
    );
  }
  public canDeactivate(): boolean | Observable<boolean> {
    if (this.isSaved === false) {
      this.pops = this.adService.getSuccessPop(this.confirm);
    } else {
      return true;
    }
  }

  public confirmPopUp($event: Event): boolean {
    if ($event) {
      this.pops = null;
      this.isSaved = true;
      this.router.navigate(["/students"]);
    } else {
      this.pops = null;
    }

    // this.delStudent = null;
  }
  public submit($event: IStudent): void {
    this.isSaved = true;
    this.store.dispatch(new Students.Create($event));
    this.router.navigate(["/students"]);
  }
  public ngOnInit(): void {
    this.manager.addSubscription(this.translate.stream("FORMS").subscribe(data => {
      this.translations = data;
      const errorMessages: string[] = [
        this.translations.ERRORS.REQUIRED,
        this.translations.ERRORS.MAX_LENGTH_50,
        this.translations.ERRORS.ONLY_LETTERS,
        this.translations.ERRORS.MAX_LENGTH_200,
      ];
      this.formConfig = {
        legend: this.translations.NEW_STUDENT.LEGEND,
        formGroupName: {
          name: "form",
          formControls: [
            {
              description: this.translations.NEW_STUDENT.CONTROLS_NAME.NAME.TITLE,
              initialValue: "",
              type: FormControlType.text,
              validators: [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(/^[A-Za-z]+$/)
              ],
              errorMessages,
              name: "name"
            },
            {
              description: this.translations.NEW_STUDENT.CONTROLS_NAME.SURNAME.TITLE,
              initialValue: "",
              type: FormControlType.text,
              validators: [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(/^[A-Za-z]+$/)
              ],
              errorMessages,
              name: "surname"
            },
            {
              description: this.translations.NEW_STUDENT.CONTROLS_NAME.ADDRESS.TITLE,
              initialValue: "",
              type: FormControlType.text,
              validators: [],
              errorMessages,
              name: "address"
            },
            {
              description: this.translations.NEW_STUDENT.CONTROLS_NAME.DESCRIPTION.TITLE,
              initialValue: "",
              type: FormControlType.textarea,
              validators: [Validators.maxLength(200)],
              errorMessages: [errorMessages[3]],
              name: "description"
            }
          ]
        }

      };
    }));
  }
  public ngOnDestroy(): void {
    this.manager.removeAllSubscription();
  }
}

