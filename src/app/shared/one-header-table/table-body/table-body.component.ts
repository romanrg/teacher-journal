import {Component, DoCheck, Input, OnChanges, OnInit} from "@angular/core";

@Component({
  selector: "app-table-body",
  templateUrl: "./table-body.component.html",
  styleUrls: ["./table-body.component.sass"],
})
export class TableBodyComponent implements OnInit, DoCheck, OnChanges {
  @Input() public bodyData: string[];
  @Input() public paginationConstant: number;
  @Input() public currentPagination: number;
  @Input() public displayDelete: boolean;
  constructor() { }

  public ngOnInit(): void {
  }

  public ngDoCheck(): void {
  }

  public ngOnChanges(ch): void {
    if (JSON.stringify(ch.bodyData.previousValue) === JSON.stringify(ch.bodyData.currentvalue)) {
      console.log('Changed!!!!');
    }
  }

  public generateRowIndex(index: number): number {
    return index + ((this.currentPagination - 1 ) * this.paginationConstant);
  }
}
