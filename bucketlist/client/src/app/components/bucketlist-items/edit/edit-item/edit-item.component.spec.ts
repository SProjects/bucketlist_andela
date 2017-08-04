import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { EditItemComponent } from './edit-item.component';
import { ToastOptions, ToastsManager } from "ng2-toastr";
import { CustomOption } from "../../../../app.toast-cofig";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { BucketlistItemService } from "../../../../services/bucketlist-item.service";
import { BucketlistService } from "../../../../services/bucketlist.service";
import { FormsModule } from "@angular/forms";
import createSpy = jasmine.createSpy;
import {Item} from "../../../../models/item.model";

describe('EditItemComponent', () => {
  let component: EditItemComponent;
  let fixture: ComponentFixture<EditItemComponent>;
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
          'bucketlist_id': 1,
          'id': 2
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
      getItem: createSpy('getItem').and.returnValue(subscribeMock),
      edit: createSpy('edit').and.returnValue(subscribeMock)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule,
      ],
      declarations: [
        EditItemComponent
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
    fixture = TestBed.createComponent(EditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#update should update the Item by ID',
    async(inject([Router, BucketlistItemService, ToastsManager], (router, itemService, toast) => {
      const successMessage = 'Bucketlist item updated successfully.';
      const newItemName = 'Updated Item Name';
      component.bucketlist_id = 1;
      component.id = 2;
      component.item = {id: 2, name: newItemName} as Item;
      component.update();

      expect(itemService.edit).toHaveBeenCalledWith(1, 2, {name: newItemName});
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0](successMessage);
      expect(toast.success).toHaveBeenCalledWith(successMessage);
      expect(router.navigate).toHaveBeenCalledWith(['/bucketlists/1/items']);
  })));

  it('#update should fail with an error message if the update call fails',
    async(inject([Router, BucketlistItemService, ToastsManager], (router, itemService, toast) => {
      const errorMessage = 'Failed to update bucketlist item.';
      const newItemName = 'Updated Item Name';
      component.bucketlist_id = 1;
      component.id = 2;
      component.item = {id: 2, name: newItemName} as Item;
      component.update();

      expect(itemService.edit).toHaveBeenCalledWith(1, 2, {name: newItemName});
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[1](errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));

  it('#update should fail with an error message if Item name field is empty',
    async(inject([Router, BucketlistItemService, ToastsManager], (router, itemService, toast) => {
      const errorMessage = 'Item name is required.';
      component.bucketlist_id = 1;
      component.id = 2;
      component.item = {id: 2, name: ''} as Item;
      component.update();

      expect(itemService.edit).not.toHaveBeenCalled();

      subscribeMock.subscribe.calls.mostRecent().args[1](errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));
});
