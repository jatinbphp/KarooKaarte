import { TestBed } from '@angular/core/testing';

import { SendReceiveRequestsService } from './send-receive-requests.service';

describe('SendReceiveRequestsService', () => {
  let service: SendReceiveRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendReceiveRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
