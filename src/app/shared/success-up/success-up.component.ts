import {Component, Input, OnInit} from "@angular/core";

@Component({
  template: `
    <div>
      {{data}}
    </div>
  `
})
export class SuccessUpComponent implements OnInit {
  @Input() public data: any;
}
