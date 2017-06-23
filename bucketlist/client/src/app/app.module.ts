import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms'

import {MomentModule} from "angular2-moment";

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegistrationFormComponent } from './components/user/registration-form/registration-form.component';
import { PageNotFoundComponent } from './components/error/page-not-found/page-not-found.component';
import { AppRoutingModule } from "./app-routing.module";
import { AuthenticationService } from "./services/authentication.service";
import { AppConfig} from "./app.config";
import { BucketlistsComponent } from './components/bucketlists/bucketlists/bucketlists.component';
import { BucketlistService} from "./services/bucketlist.service";
import { UserService} from "./services/user.service";
import { Utilities} from "./utilities/utilities";
import { HeaderDirective } from './directive/header/header.directive';
import { EditBucketlistComponent } from './components/bucketlists/edit/edit-bucketlist/edit-bucketlist.component';
import { NewBucketlistComponent } from './components/bucketlists/new/new-bucketlist/new-bucketlist.component';
import { BucketlistItemsComponent } from './components/bucketlist-items/bucketlist-items/bucketlist-items.component';
import { BucketlistItemService } from "./services/bucketlist-item.service";
import { EditItemComponent } from './components/bucketlist-items/edit/edit-item/edit-item.component';
import { AddItemComponent } from './components/bucketlist-items/add/add-item/add-item.component';
import { EditUserComponent } from './components/user/edit/edit-user/edit-user.component';
import { CanAccessRouteGuard } from "./guards/can-access-route.guard";
import { CanAccessLoginGuard } from "./guards/can-access-login.guard";

@NgModule({
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
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    MomentModule
  ],
  providers: [
    AuthenticationService,
    BucketlistService,
    UserService,
    BucketlistItemService,
    Utilities,
    CanAccessRouteGuard,
    CanAccessLoginGuard,
    AppConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
