import {Component, Input, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-error-message-display",
  templateUrl: "./error-message-display.component.html",
  styleUrls: ["./error-message-display.component.sass"]
})
export class ErrorMessageDisplayComponent implements OnInit {

  @Input() public error: any;
  public errorMessage: string;
  constructor(
  ) { }

  public ngOnInit(): void {
    if (this.error instanceof ErrorEvent) {
      this.errorMessage = this.error.message;
    } else {
      this.errorMessage = this.error.message;
    }
  }

}
