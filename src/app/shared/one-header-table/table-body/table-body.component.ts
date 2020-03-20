import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-table-body',
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.sass']
})
export class TableBodyComponent implements OnInit {
  @Input() public bodyData: string[];
  @Input() public paginationConstant: number;
  @Input() public currentPagination: number;
  @Input() public displayDelete: boolean;
  constructor() { }

  ngOnInit(): void {

  }

  public generateRowIndex(index: number): number {
    return index + ((this.currentPagination - 1 ) * this.paginationConstant);
  }
}
