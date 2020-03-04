import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {ITableConfig} from "../../common/models/ITableConfig";
import {Observable, Subscription} from "rxjs";


@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.sass"]
})
export class TableComponent implements OnInit, OnDestroy {
  public data$: Observable<any>;
  public data: any;
  public subscriptions: Subscription[] = [];
  public currentPaginationNumber: number = 1;
  @Input("config") public config: ITableConfig;
  @Output() public onTrigger: EventEmitter<any> = new EventEmitter<any>();
  @Output() public changeDate: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  public setPaginationConstant(page: number): void {
    this.currentPaginationNumber = page;
  }
  public triggerPulled(): void {
    this.onTrigger.emit();
  }

  public ngOnInit(): void {
    this.data$ = this.config.tableBody[0];
    const dataSub: Subscription = this.data$.subscribe(data => this.data = data);
    this.subscriptions.push(dataSub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public checkDate(header: String): boolean {
    return header instanceof Date;
  }

  public changeDay($event: any): void {
    this.changeDate.emit($event);
  }
}
