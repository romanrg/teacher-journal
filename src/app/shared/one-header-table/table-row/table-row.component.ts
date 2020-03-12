import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.sass']
})
export class TableRowComponent implements OnInit {

  @Input() public cellType: string;
  @Input() public row: string[];
  @Output() public emitSorting: EventEmitter = new EventEmitter();
  public sortedCell: number;
  constructor() { }

  ngOnInit(): void {
  }

  public getCellWidth(): string {
    return `${100 / this.row.length}%`;
  }

  public emitTopLevel(index: number): void {
    this.emitSorting.emit(index);
    this.sortedCell = index;
  }
}
