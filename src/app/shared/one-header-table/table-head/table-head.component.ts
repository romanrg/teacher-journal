import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: 'app-table-head',
  templateUrl: './table-head.component.html',
  styleUrls: ['./table-head.component.sass']
})
export class TableHeadComponent implements OnInit {

  @Input() public headers: string[];
  @Output() public emitSortingEvent: EventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public emitUp($event: Event): void {
    this.emitSortingEvent.emit($event);
  }
}
