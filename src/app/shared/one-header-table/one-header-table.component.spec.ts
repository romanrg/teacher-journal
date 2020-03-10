import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneHeaderTableComponent } from './one-header-table.component';

describe('OneHeaderTableComponent', () => {
  let component: OneHeaderTableComponent;
  let fixture: ComponentFixture<OneHeaderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneHeaderTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneHeaderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
