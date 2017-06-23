import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AppConfig } from "../app.config";
import { User } from "../models/user.model";
import { Utilities } from "../utilities/utilities";

@Injectable()
export class UserService {
  headers: any = null;
  public currentUser: any;

  constructor(
    private http: Http,
    private config: AppConfig,
    private util: Utilities
  ) {
    this.headers = util.getAuthHeaders();
  }

  getCurrentUser(): Observable<User> {
    return this.http.get(this.config.apiV1Url + 'users/1?token=true', {headers: this.headers})
      .map(response => {
        this.currentUser = response.json() as User;
        return response.json() as User;
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
