import {Component, forwardRef, OnInit, HostBinding, Input} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.sass"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit, ControlValueAccessor {

  @Input() public label: string;
  @Input() public checked: boolean;

  public val = false;

  constructor() { }

  public ngOnInit(): void {}

  public onChange: any = ( ) => {};

  public onTouch: any = ( ) => {};

  public set value (val) {
    if (val !== undefined && this.val !== val) {
      this.val = val;

      this.onChange(val);

      this.onTouch(val);
    }
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

}
