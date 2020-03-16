import { TestBed } from '@angular/core/testing';

import { ModifyHeadersInterceptor } from './modify-headers.interceptor';

describe('ModifyHeadersInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ModifyHeadersInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ModifyHeadersInterceptor = TestBed.inject(ModifyHeadersInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
