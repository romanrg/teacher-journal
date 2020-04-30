import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {IFormConfig, IFormControlConfig} from "../../common/models/IFormConfig";
import {AbstractControl, FormControl, FormGroup, ValidationErrors} from "@angular/forms";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.sass"]
})
export class FormComponent implements OnInit {

  @Input("config") public config: IFormConfig;
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();
  public form: FormGroup;
  public isSaved: boolean = false;
  constructor() {
  }
  private createFormFromConfig: Function = (config: IFormConfig): FormGroup => {
    return new FormGroup(
      this.createFormControlFromConfig(config.formGroupName.formControls)
    );
  };

  private createFormControlFromConfig(config: IFormControlConfig[]): { [key: string]: AbstractControl; } {
    let result: any = {};
    config.forEach(control => {
      if (!result[control.name]) {
        result[control.name] = new FormControl(control.initialValue, control.validators);
      }
    });
    return result;
  }

  public getControlName(name: string): AbstractControl {
    return this.form.get(name);
  }

  public isShowErrorMessage(control: AbstractControl): ValidationErrors {
    return (
      !control.valid &&
      control.touched &&
      control.errors
    );
  }

  public submit(): void {
    this.isSaved = true;
    this.onSubmit.emit(this.form.value);
    this.form.reset();
  }

  public ngOnInit(): void {
    this.form = this.createFormFromConfig(this.config);
  }

}
