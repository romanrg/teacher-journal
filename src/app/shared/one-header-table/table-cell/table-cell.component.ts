import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.sass']
})
export class TableCellComponent implements OnInit {

  @Input() public cell: string;
  @Input() public cellType: string;

  constructor() { }

  ngOnInit(): void {
  }

}
