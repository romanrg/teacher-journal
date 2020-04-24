import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: 'app-table-head',
  templateUrl: './table-head.component.html',
  styleUrls: ['./table-head.component.sass']
})
export class TableHeadComponent implements OnInit {

  @Input() public headers: string[];
  @Output() public emitSortingEvent: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public emitUp($event: number): void {
    this.emitSortingEvent.emit($event);
  }
}
