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
  loading: boolean = true;

  constructor(
    private userService: UserService,
    public toast: ToastsManager
  ) { }

  ngOnInit() {
    this.getUser();
  }

  updateUser() {
    this.loading = true;
    this.userService.edit(this.user).subscribe(
      user => {
        this.toast.success('User successfully updated.');
        this.user = user;
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );
  }

  private getUser() {
    this.loading = true;
    this.userService.getCurrentUser().subscribe(
      user => {
        this.user = user;
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );
  }
}
