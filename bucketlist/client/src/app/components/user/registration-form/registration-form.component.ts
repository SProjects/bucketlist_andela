import { Component, OnInit } from '@angular/core';
import { User } from "../../../models/user.model";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

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
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  createUser() {
    this.userService.create(this.model).subscribe(
      success => {
        this.message = success;
        this.router.navigate(['/login']);
      },
      error => {
        this.message = error;
      }
    );
  }

}
