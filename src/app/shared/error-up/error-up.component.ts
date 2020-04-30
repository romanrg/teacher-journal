import {Component, Input} from "@angular/core";

@Component({
  template: `
    <div>
      <h4>Error!</h4>
      {{data}}
    </div>
  `
})
export class ErrorUpComponent {

  @Input() public data: any;

}
