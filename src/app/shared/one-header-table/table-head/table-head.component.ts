import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-table-head',
  templateUrl: './table-head.component.html',
  styleUrls: ['./table-head.component.sass']
})
export class TableHeadComponent implements OnInit {

  @Input() public headers: string[];
  constructor() { }

  ngOnInit(): void {
  }

}
