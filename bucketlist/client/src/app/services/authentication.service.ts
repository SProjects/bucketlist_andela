import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Auth } from "../models/auth.model";
import { AppConfig } from "../app.config";
import { Utilities } from "../utilities/utilities";

@Injectable()
export class AuthenticationService {
  token: string;
  isTokenValid: boolean = true;

  constructor(
    private http: Http,
    private config: AppConfig,
    private util: Utilities
  ) { }

  login(email: string, password: string) {
    let payload = {
      'email': email,
      'password': password
    };
    let headers = this.getHeaders();

    return this.http.post(this.config.apiV1Url + 'auth/login', JSON.stringify(payload), {headers: headers})
      .map((response: Response) => {
        if (response.ok) {
          let authObject = response.json() as Auth;
          this.token = authObject.token;

          if (authObject && this.token) {
            localStorage.setItem('currentUser', JSON.stringify(authObject.token));
            this.validateToken({token: JSON.parse(localStorage.getItem('currentUser'))}).subscribe(
              valid => {
                this.isTokenValid = valid;
              }
            );
          }
        } else {
          return this.logError(response)
        }
    });
  }

  private validateToken(token): Observable<boolean> {
    return this.http.post(this.config.apiV1Url + 'validate', JSON.stringify(token))
      .map(response => {
        return response.json().message == 'true';
      });
  }

  private logError(error: any) {
    try {
      error = error.json();
      console.error(error.error);
    } catch (e) {
      console.error(error);
    }

    return Observable.throw(error);
  }

  private getHeaders () {
        let headers = new Headers ();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }

  isLoggedIn() {
    return !!localStorage.getItem('currentUser') && this.isTokenValid;
  }

  logout() {
    let headers = this.util.getAuthHeaders();

    return this.http.get(this.config.apiV1Url + 'logout', {headers: headers})
      .map(response => { return response.json().message })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.json()['message'] || 'Server error')
  }
}
