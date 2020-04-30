import { HighlightDirective } from "./highlight.directive";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {TableRowComponent} from "../../shared/one-header-table/table-row/table-row.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {TableCellComponent} from "../../shared/one-header-table/table-cell/table-cell.component";
import {DatePipe, DecimalPipe} from "@angular/common";
import {By} from "@angular/platform-browser";

describe("HighlightDirective", () => {

  let component: TableRowComponent;
  let fixture: ComponentFixture<TableRowComponent>;
  const mockRow: any = ["Name", "Surname", 6, 8, 4];
  const mockRow1: any = ["Name", "Surname", undefined, undefined, undefined];
  const mockRow2: any = ["Name", "Surname", 4, 4, 4];
  const mockCellType: string = "td";
  const mockDisplayDelete: boolean = false;
  const mockRowLength: number = mockRow.length;
  const sortedCell: number = 0;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [
        TableRowComponent,
        HighlightDirective,
        TableCellComponent
      ],
      providers: [DecimalPipe, DatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowComponent);
    component = fixture.componentInstance;
    component.row = mockRow1;
    component.rowLength = mockRowLength;
    component.cellType = mockCellType;
    component.displayDelete = mockDisplayDelete;
    component.sortedCell = sortedCell;
    fixture.detectChanges();
  });

  it("should create an instance", () => {
    expect(component).toBeTruthy();
  });

  it("should not change color if no average mark", () => {
    const debugEl: any = fixture.debugElement;
    const div: any = debugEl.query(By.css("div")).nativeNode;
    let event: Event = new Event("mouseenter");
    div.dispatchEvent(event);
    expect(div.style.borderBottom).toEqual("");
  });


  it("should render average mark in green if >= 5", () => {
    component.row = mockRow;
    fixture.detectChanges();
    const debugEl: any = fixture.debugElement;
    const cell: any = debugEl.query(By.css("app-table-cell")).nativeNode;
    const div: any = debugEl.query(By.css("div")).nativeElement;
    let event: Event = new Event("mouseenter");
    div.dispatchEvent(event);
    expect(cell.style.borderBottom).toBe("0.05rem solid green");
  });

  it("should return color back when mouse leave", () => {
    component.row = mockRow;
    fixture.detectChanges();
    const debugEl: any = fixture.debugElement;
    const cell: any = debugEl.query(By.css("app-table-cell")).nativeNode;
    const div: any = debugEl.query(By.css("div")).nativeElement;
    let eventEnter: Event = new Event("mouseenter");
    let eventLeave: Event = new Event("mouseleave");
    div.dispatchEvent(eventEnter);
    expect(cell.style.borderBottom).toBe("0.05rem solid green");
    div.dispatchEvent(eventLeave);
    expect(cell.style.borderBottom).toBe("");
  });

  it("should render average mark in blue if < 5", () => {
    component.row = mockRow2;
    fixture.detectChanges();
    const debugEl: any = fixture.debugElement;
    const cell: any = debugEl.query(By.css("app-table-cell")).nativeNode;
    const div: any = debugEl.query(By.css("div")).nativeElement;
    let event: Event = new Event("mouseenter");
    div.dispatchEvent(event);
    expect(cell.style.borderBottom).toBe("0.05rem solid blue");
  });

  it("should return color back when mouse leave", () => {
    component.row = mockRow2;
    fixture.detectChanges();
    const debugEl: any = fixture.debugElement;
    const cell: any = debugEl.query(By.css("app-table-cell")).nativeNode;
    const div: any = debugEl.query(By.css("div")).nativeElement;
    let eventEnter: Event = new Event("mouseenter");
    let eventLeave: Event = new Event("mouseleave");
    div.dispatchEvent(eventEnter);
    expect(cell.style.borderBottom).toBe("0.05rem solid blue");
    div.dispatchEvent(eventLeave);
    expect(cell.style.borderBottom).toBe("");
  });

});
