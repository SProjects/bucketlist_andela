import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { NewBucketlistComponent } from './new-bucketlist.component';
import {FormsModule} from "@angular/forms";
import {ToastOptions, ToastsManager} from "ng2-toastr";
import {CustomOption} from "../../../../app.toast-cofig";
import {Router, ActivatedRoute} from "@angular/router";
import {BucketlistService} from "../../../../services/bucketlist.service";
import createSpy = jasmine.createSpy;

describe('NewBucketlistComponent', () => {
  let component: NewBucketlistComponent;
  let fixture: ComponentFixture<NewBucketlistComponent>;
  let subscribeMock, routeStub, toastStub, bucketlistServiceStub;

  beforeEach(async(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe'),
    };

    routeStub = {
      navigate: createSpy('navigate')
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error')
    };

    bucketlistServiceStub = {
      create: createSpy('create').and.returnValue(subscribeMock),
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        NewBucketlistComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: Router, useValue: routeStub},
        {provide: ToastsManager, useValue: toastStub},
        {provide: BucketlistService, useValue: bucketlistServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBucketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#createBucketlist should create a new bucketlist',
    async(inject([Router, BucketlistService, ToastsManager], (router, bucketlistService, toast) => {
      const successMessage = 'Bucketlist successfully created.';
      component.payload.name = 'New bucketlist name';
      component.createBucketlist();

      expect(bucketlistService.create).toHaveBeenCalledWith('New bucketlist name');
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0](successMessage);
      expect(toast.success).toHaveBeenCalledWith(successMessage);
      expect(router.navigate).toHaveBeenCalledWith(['/bucketlists']);
  })));

  it('#createBucketlist should fail with an error message when create call fails',
    async(inject([Router, BucketlistService, ToastsManager], (router, bucketlistService, toast) => {
      const errorMessage = 'Failed to create bucketlist.';
      component.payload.name = 'New bucketlist name';
      component.createBucketlist();

      expect(bucketlistService.create).toHaveBeenCalledWith('New bucketlist name');
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[1](errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));

  it('#createBucketlist should fail with an error message if bucketlist name field is empty',
    async(inject([Router, BucketlistService, ToastsManager], (router, bucketlistService, toast) => {
      const errorMessage = 'Bucketlist name is required.';
      component.payload.name = '';
      component.createBucketlist();

      expect(bucketlistService.create).not.toHaveBeenCalled();
      expect(subscribeMock.subscribe).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));
});
