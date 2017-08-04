import { TestBed, async, inject } from '@angular/core/testing';

import { CanAccessRouteGuard } from './can-access-route.guard';
import createSpy = jasmine.createSpy;
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

describe('CanAccessRouteGuard', () => {
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
        CanAccessRouteGuard,
        {provide: Router, useValue: routerStub},
        {provide: AuthenticationService, useValue: authServiceStub}
      ]
    });
  });

  it('should be created', inject([CanAccessRouteGuard], (guard: CanAccessRouteGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should route user to the protected route if guard returns true',
    inject([CanAccessRouteGuard, AuthenticationService, Router], (guard, authService, router) => {
      authService.isLoggedIn.and.returnValue(true);
      const response =  guard.canActivate(jasmine.any(Function), jasmine.any(Function));

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(response).toEqual(true);
      expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should route user to login page if user is not authenticated',
    inject([CanAccessRouteGuard, AuthenticationService, Router], (guard, authService, router) => {
      authService.isLoggedIn.and.returnValue(false);
      const response =  guard.canActivate(jasmine.any(Function), jasmine.any(Function));

      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(response).toEqual(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
