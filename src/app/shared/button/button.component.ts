import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.sass"]
})
export class ButtonComponent {
  @Input("screenReader") public screenReaderMessage: string;
  @Input("textContent") public textContent: string;
  @Input("action") public action: Function;
  @Input("isDisabled") public isDisabled: boolean;
  @Output() public emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public onActionTriggered = (): void => this.emitter.emit();

}
