import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import {LoginFormComponent} from "./components/login-form/login-form.component";
import {RegistrationFormComponent} from "./components/user/registration-form/registration-form.component";
import {PageNotFoundComponent} from "./components/error/page-not-found/page-not-found.component";
import {BucketlistsComponent} from "./components/bucketlists/bucketlists/bucketlists.component";
import {NewBucketlistComponent} from "./components/bucketlists/new/new-bucketlist/new-bucketlist.component";
import {EditBucketlistComponent} from "./components/bucketlists/edit/edit-bucketlist/edit-bucketlist.component";
import {BucketlistItemsComponent} from "./components/bucketlist-items/bucketlist-items/bucketlist-items.component";
import {EditItemComponent} from "./components/bucketlist-items/edit/edit-item/edit-item.component";
import {AddItemComponent} from "./components/bucketlist-items/add/add-item/add-item.component";
import {EditUserComponent} from "./components/user/edit/edit-user/edit-user.component";
import {CanAccessRouteGuard} from "./guards/can-access-route.guard";
import {CanAccessLoginGuard} from "./guards/can-access-login.guard";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [CanAccessLoginGuard]
  },
  {
    path: 'register',
    component: RegistrationFormComponent,
    canActivate: [CanAccessLoginGuard]
  },
  {
    path: 'bucketlists',
    component: BucketlistsComponent,
    canActivate: [CanAccessRouteGuard]
  },
  {
    path: 'new-bucketlist',
    component: NewBucketlistComponent,
    canActivate: [CanAccessRouteGuard]
  },
  {
    path: 'edit-bucketlist/:id',
    component: EditBucketlistComponent,
    canActivate: [CanAccessRouteGuard]
  },
  {
    path: 'bucketlists/:id/items',
    component: BucketlistItemsComponent,
    canActivate: [CanAccessRouteGuard]
  },
  {
    path: 'bucketlists/:bucketlist_id/add-item',
    component: AddItemComponent,
    canActivate: [CanAccessRouteGuard]
  },
  {
    path: 'bucketlists/:bucketlist_id/edit-item/:id',
    component: EditItemComponent,
    canActivate: [CanAccessRouteGuard]
  },
  {
    path: 'users/edit-user',
    component: EditUserComponent,
    canActivate: [CanAccessRouteGuard]
  },
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
