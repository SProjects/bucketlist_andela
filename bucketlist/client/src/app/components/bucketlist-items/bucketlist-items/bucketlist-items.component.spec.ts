import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketlistItemsComponent } from './bucketlist-items.component';
import { FormsModule } from "@angular/forms";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { ToastOptions, ToastsManager } from "ng2-toastr";
import { CustomOption } from "../../../app.toast-cofig";
import { BucketlistItemService } from "../../../services/bucketlist-item.service";
import { BucketlistService } from "../../../services/bucketlist.service";
import { UserService } from "../../../services/user.service";
import { MomentModule } from "angular2-moment";
import { LocationStrategy } from "@angular/common";
import createSpy = jasmine.createSpy;
import any = jasmine.any;

describe('BucketlistItemsComponent', () => {
  let component: BucketlistItemsComponent;
  let fixture: ComponentFixture<BucketlistItemsComponent>;
  let subscribeMock, routeStub, toastStub, activeRouteStub,
    bucketlistServiceStub, itemServiceStub, userServiceStub, locationStrategyStub;

  beforeEach(async(() => {
    // subscribeMock = {
    //   subscribe: createSpy('subscribe'),
    // };
    //
    // routeStub = {
    //   navigate: createSpy('navigate')
    // };
    //
    // activeRouteStub = {
    //   snapshot: { params: { 'id': 1 } }
    // };
    //
    // toastStub = {
    //   success: createSpy('success'),
    //   error: createSpy('error')
    // };
    //
    // bucketlistServiceStub = {
    //   getBucketlist: createSpy('getBucketlist').and.returnValue(subscribeMock),
    // };
    //
    // itemServiceStub = {
    //   edit: createSpy('edit').and.returnValue(subscribeMock),
    //   delete: createSpy('delete').and.returnValue(subscribeMock)
    // };
    //
    // userServiceStub = {
    //   getCurrentUser: createSpy('getCurrentUser').and.returnValue(subscribeMock)
    // };
    //
    // locationStrategyStub = jasmine.any(Function);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule,
        MomentModule
      ],
      declarations: [
        BucketlistItemsComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: Router, useValue: routeStub},
        {provide: ActivatedRoute, useValue: activeRouteStub},
        {provide: ToastsManager, useValue: toastStub},
        {provide: UserService, useValue: userServiceStub},
        {provide: BucketlistService, useValue: bucketlistServiceStub},
        {provide: BucketlistItemService, useValue: itemServiceStub},
        {provide: LocationStrategy, useValue: locationStrategyStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketlistItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
  });
});
