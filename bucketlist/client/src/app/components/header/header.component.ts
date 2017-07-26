import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from "ng2-toastr";

import { UserService } from "../../services/user.service";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
  title = 'BUCKETLIST';

  public currentUser = null;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    public toast: ToastsManager,
    viewContainerRef: ViewContainerRef
  ) {
    this.toast.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.userService.hasUser.subscribe(user => {
      this.currentUser = user;
    })
  }

  activeUser() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        localStorage.clear();
        this.toast.success("Logging out...");
        window.location.reload();
      },
      error => {
        this.toast.error(error);
      }
    );

  }
}
