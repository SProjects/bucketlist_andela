import { TestBed, inject } from '@angular/core/testing';

import { BucketlistService } from './bucketlist.service';

describe('BucketlistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BucketlistService]
    });
  });

  it('should be created', inject([BucketlistService], (service: BucketlistService) => {
    expect(service).toBeTruthy();
  }));
});
