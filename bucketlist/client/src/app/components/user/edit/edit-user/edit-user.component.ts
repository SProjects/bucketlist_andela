import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { User } from "../../../../models/user.model";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: User = null;
  message: string = null;
  successMessage: boolean = false;
  errorMessage: boolean = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  updateUser() {
    this.userService.edit(this.user).subscribe(
      user => {
        this.successMessage = true;
        this.message = "User successfully updated.";
        this.user = user;
      },
      error => {
        this.errorMessage = true;
        this.message = error.message;
      }
    );
  }

  private getUser() {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.user = user;
      },
      error => {
        this.message = error;
      }
    );
  }
}
