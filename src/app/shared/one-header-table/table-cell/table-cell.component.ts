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
  @Output() public sortEmitter: EventEmitter = new EventEmitter();
  public thType: "th" = TableCell.th;
  public tdType: "td" = TableCell.td;

  constructor(
    private numberPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {
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

  public sortColumn(): void {
    this.sortEmitter.emit();
  }

  public dateTransformer(cell: String): number {
    if (typeof cell === 'number') {
      return this.datePipe.transform(cell, 'LL / dd');
    } else {
      return cell;
    }
  }
}
