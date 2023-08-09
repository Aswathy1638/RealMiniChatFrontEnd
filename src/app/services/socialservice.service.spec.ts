import { TestBed } from '@angular/core/testing';

import { SocialserviceService } from './socialservice.service';

describe('SocialserviceService', () => {
  let service: SocialserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
