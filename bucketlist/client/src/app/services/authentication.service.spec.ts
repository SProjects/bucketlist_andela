import {TestBed, inject, async } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Http, Headers } from "@angular/http";
import { AppConfig } from "../app.config";
import { Utilities } from "../utilities/utilities";
import createSpy = jasmine.createSpy;
import { error } from "util";

describe('AuthenticationService', () => {
  let mapStub, headers, responseStub, subscribeMock, httpStub;
  let tokenResponse;

  beforeEach(() => {
    mapStub = {
      map: createSpy('map')
    };

    subscribeMock = {
      subscribe: createSpy('subscribe')
    };

    tokenResponse = {
      'token': 'complex_token_key'
    };

    httpStub = {
      post: createSpy('post').and.returnValue(mapStub)
    };

    headers = new Headers ();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    TestBed.configureTestingModule({
      providers: [
        AppConfig,
        Utilities,
        AuthenticationService,
        {provide: Http, useValue: httpStub}
      ],
    });
  });

  it('should be created', inject([AuthenticationService], (service) => {
    expect(service).toBeTruthy();
  }));

  it('#login should update token, isTokenValid fields and the localStorage currentUser field',
    async(inject([Http, AuthenticationService], (http, service) => {
      responseStub = {
        ok: true,
        json: createSpy('json').and.returnValue(tokenResponse)
      };

      let payload = {
        'email': 'email@gmail.com',
        'password': 'password'
      };

      spyOn(service, 'validateToken').and.returnValue(subscribeMock);

      service.login('email@gmail.com', 'password');

      expect(http.post).toHaveBeenCalledWith(
        'http://127.0.0.1:5000/api/v1/auth/login', JSON.stringify(payload), {headers: headers});

      mapStub.map.calls.mostRecent().args[0](responseStub);

      expect(service.validateToken).toHaveBeenCalledWith(tokenResponse);
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0](true);
      expect(service.token).toEqual('complex_token_key');
      expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify('complex_token_key'));
      expect(service.isTokenValid).toBe(true);
  })));

  it('#login calls LogError if wrong details are provided', async(inject([AuthenticationService], (service) => {
    let errorResponse = {
      ok: false,
      error: 'Error message'
    };

    spyOn(service, 'logError');

    service.login('wrong_email@gmail.com', 'wrong_password');
    mapStub.map.calls.mostRecent().args[0](errorResponse);

    expect(service.logError).toHaveBeenCalledWith(errorResponse);
  })));

  it('#login returns an error if wrong details are provided', async(inject([AuthenticationService], (service) => {
    let errorResponse = {
      ok: false,
      json: createSpy('json').and.returnValue({error: "Error message"})
    };

    spyOn(console, 'error');
    service.logError(errorResponse);

    expect(console.error).toHaveBeenCalledWith('Error message');
  })));
});
