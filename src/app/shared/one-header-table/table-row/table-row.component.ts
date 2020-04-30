import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: "app-table-row",
  templateUrl: "./table-row.component.html",
  styleUrls: ["./table-row.component.sass"]
})
export class TableRowComponent {

  @Input() public cellType: string;
  @Input() public row: string[];
  @Input() public displayDelete: boolean;
  @Input() public rowLength: number;
  @Output() public emitSorting: EventEmitter<number> = new EventEmitter();
  public sortedCell: number;
  public isLowOrHigh: boolean = true;
  constructor() { }
  public emitTopLevel(index: number): void {
    this.emitSorting.emit(index);
    if (index === this.sortedCell) {
      this.isLowOrHigh = !this.isLowOrHigh;
    }
    this.sortedCell = index;
  }

  public attuneRowWidth(): string {
    return `${this.rowLength}rem`;
  }

}
