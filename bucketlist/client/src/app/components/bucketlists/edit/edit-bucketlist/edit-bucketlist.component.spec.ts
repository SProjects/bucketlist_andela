import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { EditBucketlistComponent } from './edit-bucketlist.component';
import { FormsModule } from "@angular/forms";
import { ToastOptions, ToastsManager } from "ng2-toastr";
import { CustomOption } from "../../../../app.toast-cofig";
import { Router, ActivatedRoute } from "@angular/router";
import { BucketlistService } from "../../../../services/bucketlist.service";
import createSpy = jasmine.createSpy;
import { Bucketlist } from "../../../../models/bucketlist.model";

describe('EditBucketlistComponent', () => {
  let component: EditBucketlistComponent;
  let fixture: ComponentFixture<EditBucketlistComponent>;
  let subscribeMock, routeStub, toastStub, activeRouteStub, bucketlistServiceStub;

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
          'id': 1
        }
      }
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error')
    };

    bucketlistServiceStub = {
      getBucketlist: createSpy('getBucketlist').and.returnValue(subscribeMock),
      edit: createSpy('edit').and.returnValue(subscribeMock),
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        EditBucketlistComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: Router, useValue: routeStub},
        {provide: ActivatedRoute, useValue: activeRouteStub},
        {provide: ToastsManager, useValue: toastStub},
        {provide: BucketlistService, useValue: bucketlistServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBucketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#updateBucketlist should update the bucketlist whose ID and edit fields are provided',
    async(inject([Router, ActivatedRoute, BucketlistService, ToastsManager],
      (router, route, bucketlistService, toast) => {
      component.id = route.snapshot.params['id'];
      component.bucketlist = {id: 1, name: 'Updated bucketlist name'} as Bucketlist;
      component.updateBucketlist();

      expect(bucketlistService.edit).toHaveBeenCalledWith(1, 'Updated bucketlist name');
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0]();
      expect(toast.success).toHaveBeenCalledWith('Bucketlist with ID#1 updated successfully');
      expect(router.navigate).toHaveBeenCalledWith(['/bucketlists']);
  })));

  it('#updateBucketlist should fail with an error when update call fails',
    async(inject([Router, ActivatedRoute, BucketlistService, ToastsManager],
      (router, route, bucketlistService, toast) => {
      component.id = route.snapshot.params['id'];
      component.bucketlist = {id: 1, name: 'Updated bucketlist name'} as Bucketlist;
      component.updateBucketlist();

      expect(bucketlistService.edit).toHaveBeenCalledWith(1, 'Updated bucketlist name');
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[1]('Failed to update bucketlist');
      expect(toast.error).toHaveBeenCalledWith('Failed to update bucketlist');
  })));

  it('#updateBucketlist should fails with an error if bucketlist name field is empty',
    async(inject([Router, ActivatedRoute, BucketlistService, ToastsManager],
      (router, route, bucketlistService, toast) => {
      component.id = route.snapshot.params['id'];
      component.bucketlist = {id: 1, name: ''} as Bucketlist;
      component.updateBucketlist();

      expect(bucketlistService.edit).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith('Bucketlist name is required.');
  })));
});
