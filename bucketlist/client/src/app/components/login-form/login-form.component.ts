import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";
import {isUndefined} from "util";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit{
  payload: any = {};
  message: string = null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(){
  }

  login (){
    if (this.validateCredentials()) {
      this.authenticationService.login(this.payload.email, this.payload.password)
        .subscribe(
          () => {
            this.router.navigate(['/bucketlists']);
          },
          error => {
            let errorMessage = JSON.parse(error._body);

            if (typeof errorMessage.message === 'object') {
              for (let key in errorMessage.message) {
                this.message = errorMessage.message[key];
              }
            } else {
              this.message = errorMessage.message;
            }
          }
        );
    } else {
      this.message = 'Email and Password are required.'
    }
  }

  private validateCredentials() {
    return !(isUndefined(this.payload.email) || isUndefined(this.payload.password));
  }

}
