import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorUpComponent } from './error-up.component';

describe('ErrorUpComponent', () => {
  let component: ErrorUpComponent;
  let fixture: ComponentFixture<ErrorUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
