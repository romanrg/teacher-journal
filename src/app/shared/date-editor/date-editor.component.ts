import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {FormControlType, IFormConfig} from "../../common/models/IFormConfig";
import {Validators} from "@angular/forms";

@Component({
  selector: "app-date-editor",
  templateUrl: "./date-editor.component.html",
  styleUrls: ["./date-editor.component.sass"]
})
export class DateEditorComponent implements OnInit {
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter<any>();
  public config: IFormConfig;
  public submited: boolean = true;
  constructor() { }

  public ngOnInit(): void {
    this.config = {
      legend: "Class date:",
      formGroupName: {
        name: "Class date:",
        formControls: [{
          name: "date",
          initialValue: "",
          type: FormControlType.date,
          validators: [Validators.required],
          errorMessages: ["This field is required"],
          description: null
        }],
      }
    };
  }

  public editDate($event: any): void {
    this.onSubmit.emit($event);
    this.submited = !this.submited;
  }
}
