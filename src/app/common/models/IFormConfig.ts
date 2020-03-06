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
  type: "text" | "textarea" | "date";
  validators: any;
  errorMessages: string[];
  placeholder?: string;
}
