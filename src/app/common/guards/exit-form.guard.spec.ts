import { TestBed } from '@angular/core/testing';

import { ExitFormGuard } from './exit-form.guard';

describe('ExitFormGuard', () => {
  let guard: ExitFormGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExitFormGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
