import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable, ReplaySubject } from "rxjs/Rx";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AppConfig } from "../app.config";
import { User } from "../models/user.model";
import { Utilities } from "../utilities/utilities";

@Injectable()
export class UserService {
  headers: any = null;
  public currentUser: any;
  public hasUser: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(
    private http: Http,
    private config: AppConfig,
    private util: Utilities
  ) {
  }

  getCurrentUser(): Observable<User> {
    this.headers = this.util.getAuthHeaders();
    return this.http.get(this.config.apiV1Url + 'users/1?token=true', {headers: this.headers})
      .map(response => {
        let user = response.json() as User;
        this.hasUser.next(user);
        return user;
      }).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  create(user: User) {
    return this.http.post(this.config.apiV1Url + 'auth/register', user, {headers: this.headers})
      .map(response => response.json().message)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  edit(user: User): Observable<User> {
    return this.http.put(this.config.apiV1Url + 'users/' + user.id, user, {headers: this.headers})
      .map(response => {
        return response.json()
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}
