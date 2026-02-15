import { TestBed } from '@angular/core/testing';

import { Petition } from './petition';

describe('Petition', () => {
  let service: Petition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Petition);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
