import {Teacher} from "./ITeacher";
import {ValidatorFn} from "@angular/forms";

export interface IFormConfig {
  legend: string;
  formGroupName: IFormGroupName;
  actionOnSubmit?: Function;
}

export interface IFormControlConfig {
  name: string;
  initialValue: string;
  type: FormControlType;
  validators: ValidatorFn[];
  errorMessages: string[];
  placeholder?: string | Teacher;
}

export interface IFormGroupName {
  name: string;
  formControls?: IFormControlConfig[];
}

export enum FormControlType {
  text = "text",
  textarea = "textarea",
  date = "date",
  number = "number"
}
