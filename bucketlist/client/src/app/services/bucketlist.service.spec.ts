import {TestBed, inject, async} from '@angular/core/testing';

import { BucketlistService } from './bucketlist.service';
import { AppConfig } from "../app.config";
import { Utilities } from "../utilities/utilities";
import { Http } from "@angular/http";
import createSpy = jasmine.createSpy;

describe('BucketlistService', () => {
  let mapStub, catchStub, httpStub, responseStub;

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
      put: createSpy('put').and.returnValue(mapStub),
      delete: createSpy('delete').and.returnValue(mapStub)
    };

    responseStub = {'result': [
      {name: 'Bucketlist 1'},
      {name: 'Bucketlist 2'}
    ],
    prev: 'link_to_previous_page',
    next: 'link_to_next_page'
    };

    TestBed.configureTestingModule({
      providers: [
        AppConfig,
        Utilities,
        BucketlistService,
        {provide: Http, useValue: httpStub}
      ]
    });
  });

  it('should be created', inject([BucketlistService], (service: BucketlistService) => {
    expect(service).toBeTruthy();
  }));

  it('#getAll should return a limited number of bucketlist for an authenticated user',
    async(inject([Http, BucketlistService, Utilities, AppConfig], (http, service, utilities, config) => {
      spyOn(service, 'processResponse').and.returnValue({'bucketlist': [],
        'previous': 'link_to_previous_page', 'next': 'link_to_next_page'});

      service.getAll(2, null);
      expect(http.get).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists?limit=2',
        {headers: utilities.getAuthHeaders()});

      mapStub.map.calls.mostRecent().args[0](responseStub);
      expect(service.processResponse).toHaveBeenCalledWith(responseStub);
    })));

  it('#getAll should return bucketlists that match a searchTerm for an authenticated user',
    async(inject([Http, BucketlistService, Utilities, AppConfig], (http, service, utilities, config) => {
      spyOn(service, 'processResponse').and.returnValue({'bucketlist': [],
        'previous': 'link_to_previous_page', 'next': 'link_to_next_page'});

      service.getAll(null, 'searchName');
      expect(http.get).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists?q=searchName',
        {headers: utilities.getAuthHeaders()});

      mapStub.map.calls.mostRecent().args[0](responseStub);
      expect(service.processResponse).toHaveBeenCalledWith(responseStub);
    })));

  it('#getBucketlist should return a bucketlist matching the passed ID',
    async(inject([Http, BucketlistService, Utilities, AppConfig], (http, service, utilities, config) => {
      let bucketlistResponse =  {
        json: createSpy('json').and.returnValue({name: 'Bucketlist 1'})
      };

      service.getBucketlist(1);

      expect(http.get).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1',
        {headers: utilities.getAuthHeaders()});

      mapStub.map.calls.mostRecent().args[0](bucketlistResponse);
    })));

  it('#create should create a new bucketlist',
    async(inject([Http, BucketlistService, Utilities, AppConfig], (http, service, utilities, config) => {
      let bucketlistCreatedResponse =  {
        json: createSpy('json').and.returnValue({message: 'Bucketlist successfully created.'})
      };

      service.create('Bucketlist Name');

      expect(http.post).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists', {name: 'Bucketlist Name'},
        {headers: utilities.getAuthHeaders()});

      mapStub.map.calls.mostRecent().args[0](bucketlistCreatedResponse);
      expect(bucketlistCreatedResponse.json().message).toEqual('Bucketlist successfully created.')
    })));

  it('#edit should update a bucketlist when the ID is provided',
    async(inject([Http, BucketlistService, Utilities, AppConfig], (http, service, utilities, config) => {
      service.edit(1, 'Bucketlist Name');

      expect(http.put).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1', {name: 'Bucketlist Name'},
        {headers: utilities.getAuthHeaders()});
    })));

  it('#delete should delete a bucketlist when the ID is provided',
    async(inject([Http, BucketlistService, Utilities, AppConfig], (http, service, utilities, config) => {
      service.destroy(1);

      expect(http.delete).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1',
        {headers: utilities.getAuthHeaders()});
    })));

  it('should fails with an error message if the call is not successful',
    async(inject([Http, BucketlistService], (http, service) => {
      let errorResponse = {
        json: createSpy('json').and.returnValue({'message': 'Error message'})
      };

      spyOn(service, 'handleError').and.returnValue(errorResponse);

      service.getAll(null, 'searchName');
      catchStub.catch.calls.mostRecent().args[0](errorResponse);

      expect(service.handleError).toHaveBeenCalledWith(errorResponse);
    })));

});
