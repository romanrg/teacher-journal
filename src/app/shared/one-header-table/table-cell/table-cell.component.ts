import {Component, Input, OnInit} from "@angular/core";
import {TableCell} from "../../../common/models/TableCellEnum";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "app-table-cell",
  templateUrl: "./table-cell.component.html",
  styleUrls: ["./table-cell.component.sass"]
})
export class TableCellComponent implements OnInit {

  @Input() public cell: string;
  @Input() public cellType: string;
  public thType: "th" = TableCell.th;
  public tdType: "td" = TableCell.td;

  constructor(
    private numberPipe: DecimalPipe
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

}
