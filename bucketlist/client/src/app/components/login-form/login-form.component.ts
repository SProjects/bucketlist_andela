import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit{
  payload: any = {
    email: '',
    password: ''
  };
  message: string = null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public toast: ToastsManager
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
                this.toast.error(errorMessage.message[key]);
              }
            } else {
              this.toast.error(errorMessage.message);
            }
          }
        );
    } else {
      this.toast.error('Email and Password are required.');
    }
  }

  private validateCredentials() {
    return (this.payload.email.length > 0 && this.payload.password.length > 0);
  }

}
