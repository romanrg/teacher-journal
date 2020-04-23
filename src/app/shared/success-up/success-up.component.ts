import {Component, Input, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: "./success-up.component.html"
})
export class SuccessUpComponent implements OnInit {
  @Input() public data: any;
  public message: string;
  constructor(
    private translate: TranslateService,
  ) {
    console.log(this.data);
  }
  public ngOnInit() {
    if (this.data.action === "add") {
      this.translate.get("POP_UP.ADD.SUCCESS", {data: this.data.value}).subscribe(
        data => this.message = data
      );
    } else if (this.data.action === "delete") {
      this.translate.get("POP_UP.DELETE.SUCCESS", {data: this.data.value}).subscribe(
        data => this.message = data
      );
    } else if (this.data.action === "change") {
      this.translate.get("POP_UP.CHANGE.SUCCESS", {data: this.data.value}).subscribe(
        data => this.message = data
      );
    }

  }
}
