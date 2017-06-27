import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AppConfig } from "../app.config";
import { Utilities } from "../utilities/utilities";
import { Item } from "../models/item.model";

@Injectable()
export class BucketlistItemService {
  headers: any = null;
  itemUrl = this.config.apiV1Url;

  constructor(private http: Http,
              private config: AppConfig,
              private util: Utilities) {
    this.headers = util.getAuthHeaders();
  }

  getItem(bucketlist_id: number, id: number): Observable<Item>{
    return this.http.get(this.itemUrl + "bucketlists/" + bucketlist_id + "/items/" + id, {headers: this.headers})
      .map(response => {
        return response.json() as Item
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }

  edit(bucketlist_id: number, id: number, payload: any) {
    return this.http.put(this.itemUrl + "bucketlists/" + bucketlist_id + "/items/" + id, payload, {headers: this.headers})
      .map(response => response.json().message)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  delete(bucketlist_id: number, id: number) {
    return this.http.delete(this.itemUrl + "bucketlists/" + bucketlist_id + "/items/" + id, {headers: this.headers})
      .map(response => response.json().message)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  create(bucketlist_id: number, payload: any) {
    return this.http.post(this.itemUrl + "bucketlists/" + bucketlist_id + "/items", payload, {headers: this.headers})
      .map(response => response.json().message)
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
  }
}
