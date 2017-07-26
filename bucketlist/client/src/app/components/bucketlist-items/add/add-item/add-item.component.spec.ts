import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { AddItemComponent } from './add-item.component';
import {FormsModule} from "@angular/forms";
import {BucketlistItemService} from "../../../../services/bucketlist-item.service";
import {ToastOptions, ToastsManager} from "ng2-toastr";
import {CustomOption} from "../../../../app.toast-cofig";
import {Router, ActivatedRoute, RouterModule} from "@angular/router";
import {BucketlistService} from "../../../../services/bucketlist.service";
import createSpy = jasmine.createSpy;

describe('AddItemComponent', () => {
  let component: AddItemComponent;
  let fixture: ComponentFixture<AddItemComponent>;
  let subscribeMock, routeStub, toastStub, activeRouteStub,
    bucketlistServiceStub, itemServiceStub;

  beforeEach(async(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe'),
    };

    routeStub = {
      navigate: createSpy('navigate')
    };

    activeRouteStub = {
      snapshot: {
        params: {
          'bucketlist_id': 1
        }
      }
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error')
    };

    bucketlistServiceStub = {
      getBucketlist: createSpy('getBucketlist').and.returnValue(subscribeMock),
    };

    itemServiceStub = {
      create: createSpy('create').and.returnValue(subscribeMock)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule,
      ],
      declarations: [
        AddItemComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: Router, useValue: routeStub},
        {provide: ActivatedRoute, useValue: activeRouteStub},
        {provide: ToastsManager, useValue: toastStub},
        {provide: BucketlistItemService, useValue: itemServiceStub},
        {provide: BucketlistService, useValue: bucketlistServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#createItem should create a new item for a bucketlist whose ID is provided',
    async(inject([Router, BucketlistItemService, ToastsManager], (router, itemService, toast) => {
      const itemName = 'New item name';
      const successMessage = 'Item successfully created.';
      component.bucketlist_id = 1;
      component.model.name = itemName;
      component.createItem();

      expect(itemService.create).toHaveBeenCalledWith(1, {name: itemName});
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0](successMessage);
      expect(toast.success).toHaveBeenCalledWith(successMessage);
      expect(router.navigate).toHaveBeenCalledWith(['/bucketlists/1/items']);
  })));

  it('#createItem should fail with an error when the create call fails',
    async(inject([Router, BucketlistItemService, ToastsManager], (router, itemService, toast) => {
      const itemName = 'New item name';
      const errorMessage = 'Failed to create item.';
      component.bucketlist_id = 1;
      component.model.name = itemName;
      component.createItem();

      expect(itemService.create).toHaveBeenCalledWith(1, {name: itemName});
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[1](errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));

  it('#createItem should with an error message if Item name field is empty',
    async(inject([Router, BucketlistItemService, ToastsManager], (router, itemService, toast) => {
      const errorMessage = 'Item name is required.';
      component.bucketlist_id = 1;
      component.model.name = '';
      component.createItem();

      expect(itemService.create).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));
});
