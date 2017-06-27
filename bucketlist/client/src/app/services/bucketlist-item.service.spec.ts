import { TestBed, inject } from '@angular/core/testing';

import { BucketlistItemService } from './bucketlist-item.service';

describe('BucketlistItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BucketlistItemService]
    });
  });

  it('should be created', inject([BucketlistItemService], (service: BucketlistItemService) => {
    expect(service).toBeTruthy();
  }));
});
