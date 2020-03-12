import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";

const makePaginationArray: Function = (n: number): number[] => {
  return [...Array(n).keys()].map(i => i + 1);
};

@Component({
  selector: 'app-table-foot',
  templateUrl: './table-foot.component.html',
  styleUrls: ['./table-foot.component.sass']
})
export class TableFootComponent implements OnInit, OnChanges {
  @Input() public itemsAmount: number;
  @Input() public paginationConstant: number;
  @Input() public currentPagination: number;
  @Output() public changeCurrentPage: EventEmitter<number> = new EventEmitter();
  @Output() public changePaginationConstant: EventEmitter<number> = new EventEmitter();
  public paginationConstantList: number[] = [5, 10, 20, 50];
  public pageList: number[];
  constructor() { }

  public ngOnInit(): void {
    this.pageList = makePaginationArray(Math.ceil(this.itemsAmount / this.paginationConstant));
    console.log(this.itemsAmount);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.paginationConstant) {
      this.pageList = makePaginationArray(
        Math.ceil(this.itemsAmount / changes.paginationConstant.currentValue)
      );
    }
  }

  public isLastOrFirst(isLast: boolean): void {
    isLast ? this.currentPagination = this.pageList.length : this.currentPagination = 1;
    this.changeCurrentPage.emit(this.currentPagination);
  }
  public increase(): void {
    if (this.currentPagination < this.pageList.length) {
      this.currentPagination = this.currentPagination + 1;
      this.changeCurrentPage.emit(this.currentPagination);
    }
  }

  public decrease():void {
    if (this.currentPagination > 1) {
      this.currentPagination = this.currentPagination - 1;
      this.changeCurrentPage.emit(this.currentPagination);
    }
  }

  public setCurrentPagination(page: number): void {
    this.currentPagination = page;
    this.changeCurrentPage.emit(this.currentPagination);

  }
}
