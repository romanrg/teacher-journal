import {Component, Input, OnInit, EventEmitter, Output} from "@angular/core";
import {Observable} from "rxjs";

const makePaginationArray: Function = (n: number): number[] => {
  return [...Array(n).keys()].map(i => i + 1);
};

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.sass"]
})
export class PaginationComponent implements OnInit {
  @Input() public paginationConstant: number;
  @Input("students") public data: Observable<[]>;
  @Output() public changePagination: EventEmitter<any> = new EventEmitter();
  public currentPaginationNumber: number = 1;
  public pagination: [];
  constructor() { }

  public ngOnInit(): void {
  }

  public countPagination(students: Observable<any>): void {
    let aux: number = 0;
    students.subscribe(
      data => aux = data.length / this.paginationConstant
    ).unsubscribe();
    this.pagination = makePaginationArray(Math.ceil(aux));
  }
  public increasePagination(): void {
    if (this.currentPaginationNumber < this.pagination.length) {
      this.currentPaginationNumber++;
      this.changePagination.emit(this.currentPaginationNumber);
    }
  }

  public decreasePagination(): void {
    if (this.currentPaginationNumber > 1) {
      this.currentPaginationNumber--;
      this.changePagination.emit(this.currentPaginationNumber);
    }
  }

  public setPaginationConstant(page: number): void {
    this.currentPaginationNumber = page;
    this.changePagination.emit(this.currentPaginationNumber);
  }

}


