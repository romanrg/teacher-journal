import {Component, OnInit} from "@angular/core";
import {Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormControlType, IFormConfig} from "../../../common/models/IFormConfig";
import {ISubject} from "../../../common/models/ISubject";
import {ComponentCanDeactivate} from "../../../common/guards/exit-form.guard";
import {Observable} from "rxjs";

// ngxs
import * as Ngxs from "@ngxs/store";
import { SubjectsStateModel} from "../../../@ngxs/subjects/subjects.state";
import {Subjects} from "../../../@ngxs/subjects/subjects.actions";
import {TranslateService} from "@ngx-translate/core";
import {AdService} from "../../../common/services/ad.service";

@Component({
  selector: "app-subject-form",
  templateUrl: "./subject-form.component.html",
  styleUrls: ["./subject-form.component.sass"]
})
export class SubjectFormComponent implements OnInit/*, ComponentCanDeactivate*/{
  public formConfig: IFormConfig;
  public isSaved: boolean = false;
  public confirm: string;
  public pops: [];
  public translations: {[prop: string]: {[prop: string]: any}};
  constructor(
    private router: Router,
    private store: Ngxs.Store,
    private translate: TranslateService,
    private adService: AdService
  ) {
    this.translate.stream("CONFIRMATION_MESSAGE").subscribe(translation => this.confirm = translation)
  }
  public submit($event: ISubject): void {
    this.isSaved = true;
    $event.uniqueDates = [];
    this.store.dispatch(new Subjects.Create($event));
    this.router.navigate(["/subjects"]);
  }

  public confirmPopUp($event: Event): void {
    if ($event) {
      this.pops = null;
      this.isSaved = true;
      this.router.navigate(["/subjects"]);
    } else {
      this.pops = null;
    }
  }
  /*
  public canDeactivate = (): boolean | Observable<boolean> => {
    return this.isSaved ?  true : (this.pops = this.adService.getConfirmationPop(this.confirm));
  };
  */
  public ngOnInit(): void {
    this.translate.stream("FORMS").subscribe(data => {
      this.translations = data;
      const errorMessages: string[] = [
        this.translations.ERRORS.REQUIRED,
        this.translations.ERRORS.MAX_LENGTH_50,
        this.translations.ERRORS.ONLY_LETTERS,
        this.translations.ERRORS.MAX_LENGTH_200
      ];
      this.formConfig = {
        legend: this.translations.NEW_SUBJECT.LEGEND,
        formGroupName: {
          name: "form",
          formControls: [
            {
              name: "name",
              initialValue: "",
              type: FormControlType.text,
              validators: [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(/^[A-Za-z]+$/)
              ],
              errorMessages,
              description: this.translations.NEW_SUBJECT.CONTROLS_NAME.NAME.TITLE,
            },
            {
              name: "teacher",
              initialValue: "",
              type: FormControlType.text,
              validators: [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(/^[A-Za-z]+$/)
              ],
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
              validators: [Validators.maxLength(200)],
              errorMessages: [errorMessages[3]],
              description: this.translations.NEW_SUBJECT.CONTROLS_NAME.DESCRIPTION.TITLE,
            }
          ]
        }

      };
    });
  }
}
