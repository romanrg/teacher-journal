import { TestBed } from '@angular/core/testing';

import { MissingTranslationService } from './missing-translation.service';

describe('MissingTranslationService', () => {
  let service: MissingTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissingTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
