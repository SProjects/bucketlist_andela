import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr";

import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.directive.html'
})
export class HeaderDirective implements OnInit {
  title = 'BUCKETLIST';
  currentUser: User = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthenticationService,
    public toast: ToastsManager,
    viewContainerRef: ViewContainerRef
  ) {
    this.toast.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.getUser();
  }

  private getUser() {
    if (this.activeUser()) {
      this.userService.getCurrentUser().subscribe(
        user => {
          this.currentUser = user
        }
      );
    }
  }

  activeUser() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout().subscribe(
      successMessage => {
        localStorage.clear();
        this.toast.success(successMessage);
        window.location.reload();
      },
      error => {
        this.toast.error(error.message);
      }
    );

  }
}
