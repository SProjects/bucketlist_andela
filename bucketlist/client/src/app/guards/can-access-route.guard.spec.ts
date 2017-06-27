import { TestBed, async, inject } from '@angular/core/testing';

import { CanAccessRouteGuard } from './can-access-route.guard';

describe('CanAccessRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanAccessRouteGuard]
    });
  });

  it('should ...', inject([CanAccessRouteGuard], (guard: CanAccessRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
