import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.sass']
})
export class TableRowComponent implements OnInit {

  @Input() public cellType: string;
  @Input() public row: string[];

  constructor() { }

  ngOnInit(): void {
  }

  public getCellWidth(): string {
    return `${100 / this.row.length}%`;
  }
}
