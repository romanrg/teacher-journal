import {IPerson} from "./IPerson";
import {Validators} from "@angular/forms";
import {FormControlType, IFormConfig} from "./IFormConfig";
import {ISubject} from "./ISubject";
import {TranslateService} from "@ngx-translate/core";

export class Teacher {
  #config: IFormConfig;
  public translate: TranslateService
  constructor(subject: ISubject, translate: TranslateService) {
    this.translate = translate;
    this.translate.stream("FORMS").subscribe(data => {
      this.#config = {
        legend: data.CHANGE_TEACHER.LEGEND,
        formGroupName: {
          name: "form",
          formControls: [
            {
              name: "",
              initialValue: "",
              type: FormControlType.text,
              validators: [Validators.required],
              errorMessages: [data.CHANGE_TEACHER.ERRORS],
              placeholder: subject.teacher,
              description: data.CHANGE_TEACHER.DESCRIPTION
            }
          ]
        },
      };

    });

  }
  get config(): IFormConfig {
    return this.#config;
  }
  get configName(): string {
    return  this.#config.formGroupName.formControls[0].name;
  }
}
