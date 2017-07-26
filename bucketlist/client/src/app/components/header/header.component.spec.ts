import { HeaderComponent } from './header.component';
import {TestBed, async, ComponentFixture, inject} from "@angular/core/testing";
import { UserService } from "../../services/user.service";
import createSpy = jasmine.createSpy;
import { AuthenticationService } from "../../services/authentication.service";
import { RouterModule } from "@angular/router";
import any = jasmine.any;
import { ToastsManager } from "ng2-toastr";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userServiceStub, authServiceStub, subscribeMock, toastStub, windowStub;

  beforeEach(async(() => {
    subscribeMock = {
      subscribe: createSpy('subscribe')
    };

    windowStub = {
      location: {
        reload: createSpy('reload')
      }
    };

    userServiceStub = {
      hasUser: {subscribe: createSpy('subscribe')}
    };

    authServiceStub = {
      isLoggedIn: createSpy('isLoggedIn'),
      logout: createSpy('logout').and.returnValue(subscribeMock)
    };

    toastStub = {
      success: createSpy('success'),
      error: createSpy('error'),
      setRootViewContainerRef: any
    };

    TestBed.configureTestingModule({
      imports: [
        RouterModule
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        {provide: UserService, useValue: userServiceStub},
        {provide: AuthenticationService, useValue: authServiceStub},
        {provide: ToastsManager, useValue: toastStub},
        {provide: window, useValue: windowStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created a new', () => {
    expect(component).toBeTruthy();
  });

  it('#activeUser return boolean value showing if user is logged in or not',
    async(inject([AuthenticationService], (authService) => {
    component.activeUser();

    expect(authService.isLoggedIn).toHaveBeenCalled();
  })));

  xit('#logout logs current user out of the system',
    async(inject([AuthenticationService, ToastsManager, window], (authService, toast, window) => {
      component.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(subscribeMock.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

      subscribeMock.subscribe.calls.mostRecent().args[0]();
      expect(toast.success).toHaveBeenCalledWith('Logging out...');
      expect(window.location.reload).toHaveBeenCalled();
    })));
});
