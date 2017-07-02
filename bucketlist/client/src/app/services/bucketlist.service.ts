import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AppConfig } from "../app.config";
import { Bucketlist } from "../models/bucketlist.model";
import { Utilities } from "../utilities/utilities";

@Injectable()
export class BucketlistService {
  next: string = '';
  previous: string = '';
  headers: any = null;
  bucketlistUrl = this.config.apiV1Url + "bucketlists";

  constructor(
    private http: Http,
    private config: AppConfig,
    private util: Utilities
  ) {
    this.headers = util.getAuthHeaders();
  }

  getAll (limit, searchTerm) {
    let bucketlistUrl = this.bucketlistUrl + '?limit=' + limit;
    if (searchTerm) {
      bucketlistUrl = this.bucketlistUrl + '?q=' + searchTerm;
    }

    return this.http.get(bucketlistUrl, {headers: this.headers})
      .map(response => {
        return this.processResponse(response);
      }).catch(this.handleError);
  }

  navigate(navUrl) {
    return this.http.get(this.config.siteRoot + navUrl, {headers: this.headers}).map(
      response => {
        return this.processResponse(response);
      }
    ).catch(this.handleError)
  }

  getBucketlist(id: number): Observable<Bucketlist> {
    return this.http.get(this.bucketlistUrl  + '/' +  id, {headers: this.headers})
      .map(response => response.json() as Bucketlist)
      .catch(this.handleError);
  }

  destroy(id: number) {
    return this.http.delete(this.bucketlistUrl + '/' + id, {headers: this.headers})
      .map(response => response.json().message)
      .catch(this.handleError);
  }

  create(name: string) {
    let payload = {
      'name': name
    };
    return this.http.post(this.bucketlistUrl, payload, {headers: this.headers})
      .map(response => response.json().message)
      .catch(this.handleError);
  }

  edit(id: number, name: string) {
    let payload = {
      'name': name
    };
    return this.http.put(this.bucketlistUrl +  '/' + id, payload, {headers: this.headers})
      .map(response => response.json().message)
      .catch(this.handleError);
  }

  private processResponse(response) {
    let bucketlists = response.json().results as Bucketlist[];
    this.next = response.json().next;
    this.previous = response.json().prev;
    return {"bucketlists": bucketlists, "next": this.next, "previous": this.previous};
  }

  private handleError(error: Response) {
    return Observable.throw(error.json()['message'] || 'Server error')
  }
}
