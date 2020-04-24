import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {TableCell} from "../../../common/models/TableCellEnum";
import {DatePipe, DecimalPipe} from "@angular/common";

@Component({
  selector: "app-table-cell",
  templateUrl: "./table-cell.component.html",
  styleUrls: ["./table-cell.component.sass"]
})
export class TableCellComponent implements OnInit {

  @Input() public cell: string;
  @Input() public cellType: string;
  @Input() public isSorted: boolean;
  @Output() public sortEmitter: EventEmitter<number> = new EventEmitter();
  public thType: "th" = TableCell.th;
  public tdType: "td" = TableCell.td;
  public sortCount: number = 0;
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

  public sortColumn($event: Event): void {
    const sortingCheck: boolean = !(
      (<HTMLElement>$event.target).textContent.includes("Select date") ||
      (<HTMLElement>$event.target).textContent.includes("Выберите дату")
    );
    if (sortingCheck) {
      this.sortEmitter.emit();
      this.sortCount++;
      this.isSorted = true;
      if (this.sortCount === 3) {
        this.isSorted = false;
        this.sortCount = 0;
      }

    }
  }

  public isEven(): boolean {
    return !(this.sortCount & 1);
  }

  public dateTransformer(cell: any): number|string {
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
