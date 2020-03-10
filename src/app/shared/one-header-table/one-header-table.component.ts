import {Component, DoCheck, Input, OnInit} from "@angular/core";
import {ITableConfig, tableRow} from "../../common/models/ITableConfig";
import {SortByPipe} from "../../common/pipes/sort-by.pipe";
import {config} from "rxjs";

@Component({
  selector: "app-one-header-table",
  templateUrl: "./one-header-table.component.html",
  styleUrls: ["./one-header-table.component.sass"],
})
export class OneHeaderTableComponent implements OnInit, DoCheck {

  @Input() public config: ITableConfig;
  public dataForBody: string[][];
  public paginationConstant: number = 5;
  public currentPagination: number = 1;
  constructor(
    private sortPipe: SortByPipe
  ) { }

  public ngOnInit(): void {
    this.dataForBody = this.cutBodyDataForPagination(this.config.body, this.paginationConstant, this.currentPagination);
  }

  public ngDoCheck(): void {
    this.dataForBody = this.cutBodyDataForPagination(this.config.body, this.paginationConstant, this.currentPagination);
  }

  public changeCurrent($event: number): void {
    this.currentPagination = $event;
    this.dataForBody = this.cutBodyDataForPagination(
      this.config.body, this.paginationConstant, this.currentPagination
    );
  }

  public cutBodyDataForPagination(body: tableRow[], constant: number, current: number): string[][] {
    return body.slice(
      ((current - 1) * constant), current * constant
    );
  }

  public changeConstant($event: number): void {
    this.paginationConstant = $event;
    this.currentPagination = 1;
    this.dataForBody = this.cutBodyDataForPagination(
      this.config.body, this.paginationConstant, this.currentPagination
    );
  }


  public executeSorting($event: Event): void {
    this.config.body = this.sortPipe.transform(this.config.body, $event);
    this.dataForBody = this.cutBodyDataForPagination(
      this.config.body, this.paginationConstant, this.currentPagination
    );
  }
}
