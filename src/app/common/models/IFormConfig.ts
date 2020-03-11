import {ITeacher} from "./ITeacher";

export interface IFormConfig {
  legend: string;
  formGroupName: IFormGroupName;
  actionOnSubmit?: Function;
}

export interface IFormControlConfig {
  name: string;
  initialValue: string;
  type: FormControlType;
  validators: any;
  errorMessages: string[];
  placeholder?: string | ITeacher;
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
