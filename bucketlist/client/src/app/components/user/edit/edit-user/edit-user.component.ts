import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { User } from "../../../../models/user.model";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: User = null;
  successMessage: boolean = false;
  errorMessage: boolean = false;

  constructor(
    private userService: UserService,
    public toast: ToastsManager
  ) { }

  ngOnInit() {
    this.getUser();
  }

  updateUser() {
    this.userService.edit(this.user).subscribe(
      user => {
        this.successMessage = true;
        this.toast.success('User successfully updated.');
        this.user = user;
      },
      error => {
        this.errorMessage = true;
        this.toast.error(error);
      }
    );
  }

  private getUser() {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.user = user;
      },
      error => {
        this.toast.error(error);
      }
    );
  }
}
