import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { RegistrationFormComponent } from './registration-form.component';
import { ToastOptions, ToastsManager } from "ng2-toastr";
import { CustomOption } from "../../../app.toast-cofig";
import { UserService } from "../../../services/user.service";
import createSpy = jasmine.createSpy;
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../../models/user.model";

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let subscribeMock, toastStub, userServiceStub, routerStub;

  beforeEach(async(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe')
    };

    routerStub = {
      navigate: createSpy('navigate')
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error')
    };

    userServiceStub = {
      create: createSpy('create').and.returnValue(subscribeMock)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        RegistrationFormComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: UserService, useValue: userServiceStub},
        {provide: Router, useValue: routerStub},
        {provide: ToastsManager, useValue: toastStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('#createUser should create a new User', async(inject([Router, UserService, ToastsManager],
    (router, userService, toast) => {
    const successMessage = 'User successfully created.';
    component.model = {first_name: 'First', last_name: 'Last', email: 'email@gmail.com',
      password: 'pass', password_confirm: 'pass'};
    component.createUser();

    expect(userService.create).toHaveBeenCalledWith(component.model);
    expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

    subscribeMock.subscribe.calls.mostRecent().args[0](successMessage);
    expect(toast.success).toHaveBeenCalledWith(successMessage);
  })));

  it('#createUser should fails with an error if create call fails',
    async(inject([Router, UserService, ToastsManager], (router, userService, toast) => {
    const errorMessage = 'Failed to create user.';
    component.model = {first_name: 'First', last_name: 'Last', email: 'email@gmail.com',
      password: 'pass', password_confirm: 'pass'};
    component.createUser();

    expect(userService.create).toHaveBeenCalledWith(component.model);
    expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

    subscribeMock.subscribe.calls.mostRecent().args[1](errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));

  it('#createUser should fails with an error some or all fields are missing',
    async(inject([Router, UserService, ToastsManager], (router, userService, toast) => {
    const errorMessage = 'All fields are required. Try again.';
    component.model = {};
    component.createUser();

    expect(userService.create).not.toHaveBeenCalled();
    expect(subscribeMock.subscribe).not.toHaveBeenCalled();

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  })));
});
