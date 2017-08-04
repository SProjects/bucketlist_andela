import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { FormsModule } from '@angular/forms';
import { ToastModule, ToastOptions, ToastsManager } from 'ng2-toastr';
import { AuthenticationService } from '../../services/authentication.service';
import { CustomOption } from '../../app.toast-cofig';
import createSpy = jasmine.createSpy;
import { Router } from '@angular/router';


describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let returnMock, authServiceStub, routeStub, toastStub;

  beforeEach(async(() => {
    returnMock = {
      subscribe: createSpy('subscribe'),
    };

    authServiceStub = {
      login: createSpy('login').and.returnValue(returnMock)
    };

    routeStub = {
      navigate: createSpy('navigate')
    };

    toastStub = {
      error: createSpy('error')
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ToastModule.forRoot()
      ],
      declarations: [
        LoginFormComponent
      ],
      providers: [
        {provide: ToastOptions, useClass: CustomOption},
        {provide: AuthenticationService, useValue: authServiceStub},
        {provide: Router, useValue: routeStub},
        {provide: ToastsManager, useValue: toastStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should log in user that has valid login details', async(inject([Router, AuthenticationService],
  (route, authenticationService) => {
    component.payload.email = 'test@email.com';
    component.payload.password = 'password';

    fixture.detectChanges();
    component.login();
    expect(authenticationService.login).toHaveBeenCalledWith('test@email.com', 'password');
    expect(returnMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

    returnMock.subscribe.calls.mostRecent().args[0]();
    expect(route.navigate).toHaveBeenCalledWith(['/bucketlists']);
  })));


  xit('should not log in user that has invalid login details',
    async(inject([Router, AuthenticationService, ToastsManager], (route, authenticationService, toast) => {
    let errorMessage = {
      "_body": {
        "message": "Error message 1"
      }
    };
    component.payload.email = 'wrong@email.com';
    component.payload.password = 'wrong_password';

    fixture.detectChanges();
    component.login();
    expect(authenticationService.login).toHaveBeenCalledWith('wrong@email.com', 'wrong_password');
    expect(returnMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

    returnMock.subscribe.calls.mostRecent().args[1](errorMessage);
    expect(toast.error).toHaveBeenCalled();
  })));


  it('should not log in user when they do not provide details',
    async(inject([Router, AuthenticationService, ToastsManager], (route, authenticationService, toast) => {

    component.payload.email = '';
    component.payload.password = '';

    fixture.detectChanges();
    component.login();
    expect(authenticationService.login).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Email and Password are required.');
  })));
});
