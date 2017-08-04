import { TestBed, async, inject } from '@angular/core/testing';

import { CanAccessLoginGuard } from './can-access-login.guard';
import { Router } from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import createSpy = jasmine.createSpy;

describe('CanAccessLoginGuard', () => {
  let subscribeMock, authServiceStub, routerStub;

  beforeEach(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe')
    };

    routerStub = {
      navigate: createSpy('navigate')
    };

    authServiceStub = {
      isLoggedIn: createSpy('isLoggedIn')
    };

    TestBed.configureTestingModule({
      providers: [
        CanAccessLoginGuard,
        {provide: Router, useValue: routerStub},
        {provide: AuthenticationService, useValue: authServiceStub}
      ]
    });
  });

  it('should be created', inject([CanAccessLoginGuard], (guard: CanAccessLoginGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should prevent authenticated user from going to the login page',
    inject([CanAccessLoginGuard, AuthenticationService, Router], (guard, authService, router) => {
      authService.isLoggedIn.and.returnValue(true);
      const response = guard.canActivate(jasmine.any(Function), jasmine.any(Function));

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(response).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/bucketlists']);
  }));

  it('should route unauthenticated user to login page',
    inject([CanAccessLoginGuard, AuthenticationService, Router], (guard, authService, router) => {
      authService.isLoggedIn.and.returnValue(false);
      const response = guard.canActivate(jasmine.any(Function), jasmine.any(Function));

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(response).toEqual(true);
      expect(router.navigate).not.toHaveBeenCalledWith(['/bucketlists']);
  }));
});
