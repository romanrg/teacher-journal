import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: "[barVisual]",
  template: `<svg:line x1="0" y1="0" x2="100" y2="100"></svg:line>`,
  styleUrls: ["./bar.component.sass"],
})
export class BarComponent implements OnInit {

  // @Input("barVisual") public bar: any; /*{{bar}}*/

  constructor() { }

  public ngOnInit(): void {
    console.log(this.bar);
  }

}
