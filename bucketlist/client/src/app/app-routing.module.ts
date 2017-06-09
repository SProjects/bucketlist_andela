import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import {LoginFormComponent} from "./components/login-form/login-form.component";
import {RegistrationFormComponent} from "./components/user/registration-form/registration-form.component";
import {PageNotFoundComponent} from "./components/error/page-not-found/page-not-found.component";

const appRoutes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegistrationFormComponent },
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
