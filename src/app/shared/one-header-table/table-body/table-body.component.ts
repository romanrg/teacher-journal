import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-table-body',
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.sass']
})
export class TableBodyComponent implements OnInit {
  @Input() public bodyData: string[];
  constructor() { }

  ngOnInit(): void {
    // console.log(this.bodyData);
  }

}
