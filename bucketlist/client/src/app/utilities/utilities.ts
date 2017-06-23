import { Headers } from "@angular/http";

export class Utilities {
  constructor() {}

  getAuthHeaders() {
    let headers = new Headers ();
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let authString = btoa(currentUser + ':unused');

    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Basic ' + authString);
    return headers;
  }
}
