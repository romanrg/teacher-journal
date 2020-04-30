import { MarksHighlightDirective } from "./marks-highlight.directive";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {TableCellComponent} from "../../shared/one-header-table/table-cell/table-cell.component";
import {DatePipe, DecimalPipe} from "@angular/common";
import {ButtonComponent} from "../../shared/button/button.component";
import {By} from "@angular/platform-browser";

fdescribe("MarksHighlightDirective", () => {

  /*
  *
  *   @Input() public cell: string;
  @Input() public cellType: string;
  @Input() public isSorted: boolean;*/

  let component: TableCellComponent;
  let fixture: ComponentFixture<TableCellComponent>;
  const cellType: string = "th";
  const cell: number = "5";
  const isSorted: boolean = false;


  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [TableCellComponent, ButtonComponent],
      providers: [DecimalPipe, DatePipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellComponent);
    component = fixture.componentInstance;
    component.cell = cell;
    component.cellType = cellType;
    component.isSorted = isSorted;
    fixture.detectChanges();
    fixture.detectChanges();
    fixture.detectChanges();
    fixture.detectChanges();
    fixture.detectChanges();

  });


  it("should create an instance", () => {
    expect(component).toBeTruthy();
  });

  it("should have green style if >= 5", () => {
    const debugEl: any = fixture.debugElement;
    const th: any = debugEl.query(By.css("th")).nativeNode;
    console.log(th);
  });
});
