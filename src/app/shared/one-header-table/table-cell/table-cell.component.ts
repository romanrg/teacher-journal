import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {TableCell} from "../../../common/models/TableCellEnum";
import {DatePipe, DecimalPipe} from "@angular/common";
import {SortByPipe} from "../../../common/pipes/sort-by.pipe";
import {SUBJECT_HEADERS} from "../../../common/constants/SUBJECT_HEADERS";

@Component({
  selector: "app-table-cell",
  templateUrl: "./table-cell.component.html",
  styleUrls: ["./table-cell.component.sass"]
})
export class TableCellComponent implements OnInit {

  @Input() public cell: string;
  @Input() public cellType: string;
  @Input() public isSorted: boolean;
  @Output() public sortEmitter: EventEmitter = new EventEmitter();
  public thType: "th" = TableCell.th;
  public tdType: "td" = TableCell.td;
  public sortCount: number = 1;
  constructor(
    private numberPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {
    if (!this.cell) {
      this.cell = "";
    }
  }

  public numberCheck(cell: any): boolean {
    return (isNaN(cell) === false && cell !== 0);
  }

  public cellCut(cell: any): string {
    if (this.numberCheck(+cell)) {
      return this.numberPipe.transform(cell, ".0-2");
    } else {
      return cell;
    }
  }

  public sortColumn($event): void {
    if ($event.target.textContent.includes("V")) {
      this.sortEmitter.emit();
      this.sortCount++;
    }
  }

  public isEven(): boolean {
    return !(this.sortCount & 1);
  }

  public dateTransformer(cell: String): number {
    if (typeof cell === "number") {
      return this.datePipe.transform(cell, "yyyy-MM-dd");
    } else {
      return cell;
    }
  }

  public doNothing($event): void {
    $event.preventDefault()
  }
}
