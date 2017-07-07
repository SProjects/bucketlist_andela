import { Component } from '@angular/core';
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { isUndefined } from "util";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html'
})
export class RegistrationFormComponent {
  message: string = null;
  model: any = {};

  constructor(
    private router: Router,
    private userService: UserService,
    public toast: ToastsManager
  ) {}

  createUser() {
    if (this.validateFields()) {
      this.userService.create(this.model).subscribe(
        successMessage => {
          this.toast.success(successMessage);
          this.router.navigate(['/login']);
        },
        error => {
          this.toast.error(error);
        }
      );
    } else {
      this.toast.error('All fields are required. Try again.');
    }
  }

  private validateFields() {
    return !(
      isUndefined(this.model.first_name) || isUndefined(this.model.last_name) ||
      isUndefined(this.model.email) || isUndefined(this.model.password) ||
      isUndefined(this.model.password_confirm)
    )
  }
}
