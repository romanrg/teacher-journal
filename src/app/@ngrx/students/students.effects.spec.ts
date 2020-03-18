import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { StudentsEffects } from './students.effects';

describe('StudentsEffects', () => {
  let actions$: Observable<any>;
  let effects: StudentsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<StudentsEffects>(StudentsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
