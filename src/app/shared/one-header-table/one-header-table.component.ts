import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {ITableConfig, row, TableRow} from "../../common/models/ITableConfig";
import {SortByPipe} from "../../common/pipes/sort-by.pipe";

@Component({
  selector: "app-one-header-table",
  templateUrl: "./one-header-table.component.html",
  styleUrls: ["./one-header-table.component.sass"],
})
export class OneHeaderTableComponent implements OnInit, OnChanges {
  @Input() public displayDelete: boolean;
  @Input() public config: ITableConfig;
  @Input() public paginationConstant: number;
  @Input() public currentPagination: number;
  @Output() public emitMap: EventEmitter<any> = new EventEmitter();
  @Output() public emitPagination: EventEmitter<any> = new EventEmitter();
  public tableRowLength: number;
  public dataForBody: string[][];
  public currentlySorted: {col: (null|number), times: (null|number)} = {col: null, times: null};
  public init: Map<string, any> = new Map();
  constructor(
    private sortPipe: SortByPipe
  ) {

  }
  public changeCurrent($event: number): void {
    this.emitPagination.emit({currentPage: $event});
    this.currentPagination = $event;
    this.dataForBody = this.cutBodyDataForPagination(
      this.config.body, this.paginationConstant, this.currentPagination
    );
  }
  public cutBodyDataForPagination(body: row[], constant: number, current: number): string[][] {
    return <string[][]>body.slice(
      ((current - 1) * constant), current * constant
    );
  }
  public changeConstant($event: number): void {
    this.emitPagination.emit({paginationConstant: $event});
    this.paginationConstant = $event;
    this.currentPagination = 1;
    this.dataForBody = this.cutBodyDataForPagination(
      this.config.body, this.paginationConstant, this.currentPagination
    );
  }
  public executeSorting($event: number): void {
    const initializeSort: Function = (col, times) => {
      this.currentlySorted.col = col;
      this.currentlySorted.times = times;
    };
    const createBody: Function = (config, isReversed) => {
      config.body = this.sortPipe.transform(config.body, $event, isReversed);
      return this.cutBodyDataForPagination(
        config.body, this.paginationConstant, this.currentPagination
      );
    };
    if (this.currentlySorted.col === null) {
      initializeSort($event, 0);
      this.dataForBody = createBody(this.config, true);
      this.emitMap.emit(/*this.config.body*/$event);
    } else if (this.currentlySorted.col === $event) {
      this.currentlySorted.times++;
      if (this.currentlySorted.times === 2) {
        initializeSort(null, null);
        const reInitialized: any[] = <Array<any>>(new Array(this.config.body.length).fill([]));
        this.config.body
          .map((row, index, arr) => {
            const filtered: string[] = <string[]>row.filter(v => typeof v === "string");
            const key: number = this.init.get(JSON.stringify(filtered));
            reInitialized[key] = arr[index];
          });
        this.config.body = reInitialized;
        this.dataForBody = this.cutBodyDataForPagination(
          this.config.body, this.paginationConstant, this.currentPagination
        );
        this.emitMap.emit(/*this.config.body*/$event);
      } else {
        this.dataForBody = createBody(this.config, false);
        this.emitMap.emit(/*this.config.body*/$event);
      }
    } else {
      initializeSort($event, 0);
      this.dataForBody = createBody(this.config, true);
      this.emitMap.emit(/*this.config.body*/$event);
    }

  }
  public ngOnInit(): void {
    if (this.config) {
      this.dataForBody = this.cutBodyDataForPagination(this.config.body, this.paginationConstant, this.currentPagination);
      this.config.body.map((row, i) => this.init.set(JSON.stringify(row.filter(v => typeof v === "string")), i));
    }
  }
  public ngDoCheck(): void {
    this.tableRowLength = this.config?.headers.length * 10;
    if (this.config) {
      this.dataForBody = this.cutBodyDataForPagination(this.config.body, this.paginationConstant, this.currentPagination);
    }
  }
  public ngOnChanges(changes: SimpleChanges): void {
    changes.config?.currentValue.body?.map(
        (row, i) => this.init.set(JSON.stringify(row.filter(v => typeof v === "string")), i)
      );
  }
}
