import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCaptionComponent } from './table-caption.component';

describe('TableCaptionComponent', () => {
  let component: TableCaptionComponent;
  let fixture: ComponentFixture<TableCaptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCaptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
