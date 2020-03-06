import {ITeacher} from "./ITeacher";

export interface IFormConfig {
  legend: string;
  formGroupName: {
    name: string;
    formControls?: IFormControlConfig[]
  };
  actionOnSubmit?: Function;
}

export interface IFormControlConfig {
  name: string;
  initialValue: "" | string;
  type: FormControlType;
  validators: any;
  errorMessages: string[];
  placeholder?: string | ITeacher;
}

enum FormControlType {
  type = "text", "textarea", "date"
}
