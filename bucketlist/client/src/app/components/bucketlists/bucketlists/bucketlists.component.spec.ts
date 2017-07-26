import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { BucketlistsComponent } from './bucketlists.component';
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastsManager, ToastOptions } from "ng2-toastr";
import createSpy = jasmine.createSpy;
import { CustomOption } from "../../../app.toast-cofig";
import { BucketlistService } from "../../../services/bucketlist.service";
import { UserService } from "../../../services/user.service";
import any = jasmine.any;
import { Bucketlist } from "../../../models/bucketlist.model";

describe('BucketlistsComponent', () => {
  let component: BucketlistsComponent;
  let fixture: ComponentFixture<BucketlistsComponent>;
  let subscribeMock, routeStub, toastStub, activeRouteStub,
    bucketlistServiceStub, userServiceStub;

  beforeEach(async(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe'),
    };

    routeStub = {
      navigate: createSpy('navigate')
    };

    activeRouteStub = {
      queryParams: { subscribe: createSpy('subscribe') }
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error')
    };

    bucketlistServiceStub = {
      getAll: createSpy('getAll').and.returnValue(subscribeMock),
      destroy: createSpy('destroy').and.returnValue(subscribeMock),
      navigate: createSpy('navigate').and.returnValue(subscribeMock)
    };

    userServiceStub = {
      getCurrentUser: createSpy('getCurrentUser').and.returnValue(subscribeMock)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        BucketlistsComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: Router, useValue: routeStub},
        {provide: ActivatedRoute, useValue: activeRouteStub},
        {provide: ToastsManager, useValue: toastStub},
        {provide: BucketlistService, useValue: bucketlistServiceStub},
        {provide: UserService, useValue: userServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#search should populate the bucketlists field with bucketlists that match the searchTerm',
    async(inject([Router, ActivatedRoute, BucketlistService], (router, route, bucketlistService) => {
      let bucketlists = {
        'bucketlists': [{name: 'Bucketlist 1'}, {name: 'Bucketlist 2'}],
        'previous': 'link_to_previous_page',
        'next': 'link_to_next_page'
      };
      component.search('bucketlist');
      expect(bucketlistService.getAll).toHaveBeenCalledWith(null, 'bucketlist');
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0](bucketlists);
      expect(component.bucketlists.length).toEqual(2);
    })));

  it('#deleteBucketlist should delete a bucketlist given its ID',
    async(inject([Router, ActivatedRoute, BucketlistService, ToastsManager],
      (router, route, bucketlistService, toast) => {
      let successMessage = 'Bucketlist with ID#1 successfully deleted.';
      component.selectedBucketlistId = 1;
      component.deleteBucketlist();

      expect(bucketlistService.destroy).toHaveBeenCalledWith(1);
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0](successMessage);
      expect(toast.success).toHaveBeenCalledWith(successMessage)
    })));

  it('#getPrevious should return bucketlists on the previous pagination page',
    async(inject([Router, ActivatedRoute, BucketlistService],
      (router, route, bucketlistService) => {
      component.hasPrevious = true;
      component.previousUrl = 'link_to_previous_page';
      component.getPrevious();

      expect(bucketlistService.navigate).toHaveBeenCalledWith(component.previousUrl);
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
    })));

  it('#getNext should return bucketlists on the next pagination page',
    async(inject([Router, ActivatedRoute, BucketlistService],
      (router, route, bucketlistService) => {
      component.hasNext = true;
      component.nextUrl = 'link_to_next_page';
      component.getNext();

      expect(bucketlistService.navigate).toHaveBeenCalledWith(component.nextUrl);
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
    })));

  it('#viewDetails should navigate to the items page of a bucketlist', async(inject([Router], (router) => {
      let bucketlist = {id: 1, name: 'Bucketlist 1'} as Bucketlist;
      component.viewDetails(bucketlist);

      expect(router.navigate).toHaveBeenCalledWith(['/bucketlists/1/items']);
    })));

  it('#editBucketlist should navigate to the bucketlist edit page', async(inject([Router], (router) => {
      let bucketlist = {id: 1, name: 'Bucketlist 1'} as Bucketlist;
      component.editBucketlist(bucketlist);

      expect(router.navigate).toHaveBeenCalledWith(['/edit-bucketlist/1']);
    })));
});
