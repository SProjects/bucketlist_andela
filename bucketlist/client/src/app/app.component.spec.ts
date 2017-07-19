import { TestBed, async } from '@angular/core/testing';
import { ToastOptions, ToastModule } from "ng2-toastr";

import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { RegistrationFormComponent } from "./components/user/registration-form/registration-form.component";
import { BucketlistsComponent } from "./components/bucketlists/bucketlists/bucketlists.component";
import { NewBucketlistComponent } from "./components/bucketlists/new/new-bucketlist/new-bucketlist.component";
import { EditBucketlistComponent } from "./components/bucketlists/edit/edit-bucketlist/edit-bucketlist.component";
import { BucketlistItemsComponent } from "./components/bucketlist-items/bucketlist-items/bucketlist-items.component";
import { PageNotFoundComponent } from "./components/error/page-not-found/page-not-found.component";
import { HeaderDirective } from "./directive/header/header.directive";
import { EditItemComponent } from "./components/bucketlist-items/edit/edit-item/edit-item.component";
import { AddItemComponent } from "./components/bucketlist-items/add/add-item/add-item.component";
import { EditUserComponent } from "./components/user/edit/edit-user/edit-user.component";
import { FormsModule } from "@angular/forms";
import { MomentModule } from "angular2-moment";
import { CustomOption } from "./app.toast-cofig";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { AuthenticationService } from "./services/authentication.service";
import { BucketlistService } from "./services/bucketlist.service";
import { UserService } from "./services/user.service";
import { BucketlistItemService } from "./services/bucketlist-item.service";
import { Utilities } from "./utilities/utilities";
import { CanAccessRouteGuard } from "./guards/can-access-route.guard";
import { CanAccessLoginGuard } from "./guards/can-access-login.guard";
import { AppConfig } from "./app.config";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MomentModule,
        HttpModule,
        ToastModule.forRoot()
      ],
      declarations: [
        AppComponent,
        LoginFormComponent,
        RegistrationFormComponent,
        PageNotFoundComponent,
        BucketlistsComponent,
        HeaderDirective,
        EditBucketlistComponent,
        NewBucketlistComponent,
        BucketlistItemsComponent,
        EditItemComponent,
        AddItemComponent,
        EditUserComponent
      ],
      providers: [
        AuthenticationService,
        BucketlistService,
        UserService,
        BucketlistItemService,
        Utilities,
        CanAccessRouteGuard,
        CanAccessLoginGuard,
        AppConfig,
        {provide: ToastOptions, useClass: CustomOption}
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it(`should initialize the toast and viewContainerRef`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component.viewContainerRef).toBeTruthy();
    expect(component.toast).toBeTruthy();
  }));
});
