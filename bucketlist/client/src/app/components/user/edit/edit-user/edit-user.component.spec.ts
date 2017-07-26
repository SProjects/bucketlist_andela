import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { EditUserComponent } from './edit-user.component';
import { UserService } from "../../../../services/user.service";
import { ToastOptions, ToastsManager } from "ng2-toastr";
import { CustomOption } from "../../../../app.toast-cofig";
import createSpy = jasmine.createSpy;
import { FormsModule } from "@angular/forms";
import { User } from "../../../../models/user.model";

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let subscribeMock, toastStub, userServiceStub;

  beforeEach(async(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe'),
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error')
    };

    userServiceStub = {
      getCurrentUser: createSpy('getCurrentUser').and.returnValue(subscribeMock),
      edit: createSpy('edit').and.returnValue(subscribeMock)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        EditUserComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: UserService, useValue: userServiceStub},
        {provide: ToastsManager, useValue: toastStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#updateUser should update a user by the ID',
    async(inject([UserService, ToastsManager], (userService, toast) => {
    let successMessage = 'User successfully updated.';
    component.user = {id: 1, first_name: 'First', last_name: 'Last',
      email: 'email@gmail.com', password: 'pass', password_confirm: 'pass', old_password: 'password'} as User;
    component.updateUser();

    expect(userService.edit).toHaveBeenCalledWith(component.user);
    expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

    subscribeMock.subscribe.calls.mostRecent().args[0](successMessage);
    expect(toast.success).toHaveBeenCalledWith(successMessage);
  })));

  it('#updateUser should fail with an error message when update call fails',
    async(inject([UserService, ToastsManager], (userService, toast) => {
    let errorMessage = 'Failed to update user.';
    component.user = {id: 1, first_name: 'First', last_name: 'Last',
      email: 'email@gmail.com', password: 'pass', password_confirm: 'pass', old_password: ''} as User;
    component.updateUser();

    expect(userService.edit).toHaveBeenCalledWith(component.user);
    expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

    subscribeMock.subscribe.calls.mostRecent().args[1](errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));
});
