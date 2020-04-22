import {Component, Input, OnInit} from "@angular/core";

@Component({
  template: `
    <div>
      <h4>Error!</h4>
      {{data}}
    </div>
  `
})
export class ErrorUpComponent implements OnInit {

  @Input() public data: any;

}
