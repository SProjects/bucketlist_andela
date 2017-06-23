import { TestBed, async, inject } from '@angular/core/testing';

import { CanAccessLoginGuard } from './can-access-login.guard';

describe('CanAccessLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanAccessLoginGuard]
    });
  });

  it('should ...', inject([CanAccessLoginGuard], (guard: CanAccessLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});
