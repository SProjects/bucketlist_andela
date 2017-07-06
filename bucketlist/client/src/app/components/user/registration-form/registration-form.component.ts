import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  message: string = null;
  model: any = {};

  constructor(
    private router: Router,
    private userService: UserService,
    public toast: ToastsManager
  ) { }

  ngOnInit() {
  }

  createUser() {
    this.userService.create(this.model).subscribe(
      successMessage => {
        this.toast.success(successMessage);
        this.router.navigate(['/login']);
      },
      error => {
        this.toast.error(error);
      }
    );
  }

}
