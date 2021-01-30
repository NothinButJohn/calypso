import { TestBed } from '@angular/core/testing';

import { TwitterLoveService } from './twitter-love.service';

describe('TwitterLoveService', () => {
  let service: TwitterLoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitterLoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
