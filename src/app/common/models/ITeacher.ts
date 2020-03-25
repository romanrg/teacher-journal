import {IPerson} from "./IPerson";
import {Validators} from "@angular/forms";
import {FormControlType, IFormConfig} from "./IFormConfig";
import {ISubject} from "./ISubject";

export class Teacher implements IPerson {
  private _config: IFormConfig;
  constructor(subject: ISubject) {
    this._config = {
      legend: `Change ${subject.name} Teacher`,
      formGroupName: {
        name: "form",
        formControls: [
          {
            name: "",
            initialValue: "",
            type: FormControlType.text,
            validators: [Validators.required],
            errorMessages: ["This field is required"],
            placeholder: subject.teacher,
          }
        ]
      },
    };
  }
  get config(): IFormConfig {
    return this._config;
  }
  get configName(): string {
    return  this._config.formGroupName.formControls[0].name;
  }
}
