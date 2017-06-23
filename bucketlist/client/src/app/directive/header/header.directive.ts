import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

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
    private authService: AuthenticationService
  ) {}

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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
