import {TestBed, inject, async} from '@angular/core/testing';

import { UserService } from './user.service';
import { AppConfig } from "../app.config";
import { Utilities } from "../utilities/utilities";
import { Http } from "@angular/http";
import createSpy = jasmine.createSpy;
import {User} from "../models/user.model";

describe('UserService', () => {
  let httpStub, mapStub, catchStub;

  beforeEach(() => {
    catchStub = {
      catch: createSpy('catch')
    };

    mapStub = {
      map: createSpy('map').and.returnValue(catchStub)
    };

    httpStub = {
      get: createSpy('get').and.returnValue(mapStub),
      post: createSpy('post').and.returnValue(mapStub),
      put: createSpy('put').and.returnValue(mapStub)
    };

    TestBed.configureTestingModule({
      providers: [
        AppConfig,
        Utilities,
        UserService,
        {provide: Http, useValue: httpStub}
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('#getCurrentUser should be created',
    async(inject([Http, UserService, Utilities, AppConfig], (http, service, utilities, config) => {
      service.getCurrentUser();

      expect(http.get).toHaveBeenCalledWith(config.apiV1Url + 'users/1?token=true',
        {headers: utilities.getAuthHeaders()});
  })));

  it('#getCurrentUser should return the currently logged-in user',
    async(inject([Http, UserService, Utilities, AppConfig], (http, service, utilities, config) => {
      localStorage.setItem('currentUser', JSON.stringify('complex_user_token'));
      service.getCurrentUser();

      expect(http.get).toHaveBeenCalledWith(config.apiV1Url + 'users/1?token=true',
        {headers: utilities.getAuthHeaders()});
  })));

  it('#create should create a new user',
    async(inject([Http, UserService, Utilities, AppConfig], (http, service, utilities, config) => {
      let user = createSpy('User');
      service.create(user);

      expect(http.post).toHaveBeenCalledWith(config.apiV1Url + 'auth/register', user,
        {headers: null});
  })));

  it('#edit should create a new user',
    async(inject([Http, UserService, Utilities, AppConfig], (http, service, utilities, config) => {
      localStorage.setItem('currentUser', JSON.stringify('complex_user_token'));
      let user = {
        id: 2
      };
      service.edit(user);

      expect(http.put).toHaveBeenCalledWith(config.apiV1Url + 'users/2', user,
        {headers: utilities.getAuthHeaders()});
  })));
});
