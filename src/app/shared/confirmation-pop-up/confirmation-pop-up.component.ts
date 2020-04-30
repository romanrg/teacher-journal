import {Component, Input, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: "./confirmation-pop-up.component.html",
})
export class ConfirmationPopUpComponent implements OnInit {
  @Input() public data: any;
  public message: string;
  constructor(
    private translate: TranslateService,
  ) {
  }
  public ngOnInit() {
    if (!this.data) {
      this.translate.get("POP_UP.CONFIRM", {data: this.data}).subscribe(
        data => this.message = data
      );
    } else {
      this.message = this.data;
    }

  }
}
