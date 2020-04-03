import { TestBed } from '@angular/core/testing';

import { MarksServiceService } from './marks.service';

describe('MarksServiceService', () => {
  let service: MarksServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarksServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
