import {ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {ITableConfig, tableRow} from "../../common/models/ITableConfig";
import {SortByPipe} from "../../common/pipes/sort-by.pipe";
import {init} from "protractor/built/launcher";

@Component({
  selector: "app-one-header-table",
  templateUrl: "./one-header-table.component.html",
  styleUrls: ["./one-header-table.component.sass"],
})
export class OneHeaderTableComponent implements OnInit, OnChanges {
  @Input() public displayDelete: boolean;
  @Input() public config: ITableConfig;
  @Output() public emitMap: EventEmitter = new EventEmitter();
  public dataForBody: string[][];
  public paginationConstant: number = 5;
  public currentPagination: number = 1;
  public currentlySorted: {col: number, times: number} = {col: null, times: null};
  public init: Map = new Map();
  constructor(
    private sortPipe: SortByPipe
  ) { }

  public ngOnInit(): void {
    if (this.config) {
      this.dataForBody = this.cutBodyDataForPagination(this.config.body, this.paginationConstant, this.currentPagination);
      this.config.body.map((row, i) => this.init.set(JSON.stringify(row.filter(v => typeof v === "string")), i));
    }
  }

  public ngDoCheck(): void {
    if (this.config) {
      this.dataForBody = this.cutBodyDataForPagination(this.config.body, this.paginationConstant, this.currentPagination);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    changes.config.currentValue.body.map((row, i) => this.init.set(JSON.stringify(row.filter(v => typeof v === "string")), i));
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
      this.emitMap.emit(this.config.body);
    } else if (this.currentlySorted.col === $event) {
      this.currentlySorted.times++;
      if (this.currentlySorted.times === 2) {
        initializeSort(null, null);
        const reInitialized: [] = new Array(this.config.body.length).fill([]);
        this.config.body
          .map((row, index, arr) => {
            const filtered: string[] = row.filter(v => typeof v === "string");
            const key: number = this.init.get(JSON.stringify(filtered));
            reInitialized[key] = arr[index];
          });
        this.config.body = reInitialized;
        this.dataForBody = this.cutBodyDataForPagination(
          this.config.body, this.paginationConstant, this.currentPagination
        );
        this.emitMap.emit(this.config.body);
      } else {
        this.dataForBody = createBody(this.config, false);
        this.emitMap.emit(this.config.body);
      }
    } else {
      initializeSort($event, 0);
      this.dataForBody = createBody(this.config, true);
      this.emitMap.emit(this.config.body);
    }

  }
}
