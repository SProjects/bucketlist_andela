import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class CanAccessRouteGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authenticationService.isLoggedIn()) {
        return true;
    }

    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }
}
