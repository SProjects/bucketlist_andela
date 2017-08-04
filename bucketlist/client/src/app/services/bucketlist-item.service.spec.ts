import {TestBed, inject, async} from '@angular/core/testing';

import { BucketlistItemService } from './bucketlist-item.service';
import { AppConfig } from "../app.config";
import { Utilities } from "../utilities/utilities";
import { Http } from "@angular/http";
import createSpy = jasmine.createSpy;

describe('BucketlistItemService', () => {
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
      put: createSpy('put').and.returnValue(mapStub),
      delete: createSpy('delete').and.returnValue(mapStub)
    };

    TestBed.configureTestingModule({
      providers: [
        AppConfig,
        Utilities,
        BucketlistItemService,
        {provide: Http, useValue: httpStub}
      ]
    });
  });

  it('should be created', inject([BucketlistItemService], (service) => {
    expect(service).toBeTruthy();
  }));

  it('#getItem should return an item belonging to a Bucketlist',
    async(inject([Http, BucketlistItemService, Utilities, AppConfig], (http, service, utilities, config) => {
      service.getItem(1, 2);

      expect(http.get).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1/items/2',
        {headers: utilities.getAuthHeaders()})
  })));

  it('#create should a new item for a Bucketlist',
    async(inject([Http, BucketlistItemService, Utilities, AppConfig], (http, service, utilities, config) => {
      let payload = {name: 'Item Name'};
      service.create(1, payload);

      expect(http.post).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1/items', payload,
        {headers: utilities.getAuthHeaders()})
  })));

  it('#edit should update an item for a Bucketlist',
    async(inject([Http, BucketlistItemService, Utilities, AppConfig], (http, service, utilities, config) => {
      let payload = {name: 'Item Name'};
      service.edit(1, 3, payload);

      expect(http.put).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1/items/3', payload,
        {headers: utilities.getAuthHeaders()})
  })));

  it('#delete should delete the item by ID of a Bucketlist',
    async(inject([Http, BucketlistItemService, Utilities, AppConfig], (http, service, utilities, config) => {
      service.delete(1, 3);

      expect(http.delete).toHaveBeenCalledWith(config.apiV1Url + 'bucketlists/1/items/3',
        {headers: utilities.getAuthHeaders()})
  })));

  it('should fail with error if the http call is not successful',
    async(inject([Http, BucketlistItemService], (http, service) => {
      let errorResponse = {
        json: createSpy('json').and.returnValue({'message': 'Error message'})
      };

      spyOn(service, 'handleError').and.returnValue(errorResponse);

      service.getItem(1, 2);
      catchStub.catch.calls.mostRecent().args[0](errorResponse);

      expect(service.handleError).toHaveBeenCalledWith(errorResponse);
  })));
});
