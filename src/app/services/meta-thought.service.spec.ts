import { TestBed } from '@angular/core/testing';

import { MetaThoughtService } from './meta-thought.service';

describe('MetaThoughtService', () => {
  let service: MetaThoughtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaThoughtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
