import { Component, OnInit } from '@angular/core';

import { BucketlistService } from "../../../../services/bucketlist.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-bucketlist',
  templateUrl: './new-bucketlist.component.html',
  styleUrls: ['./new-bucketlist.component.css']
})
export class NewBucketlistComponent implements OnInit {
  message: string = null;
  payload: any = {};

  constructor(
    private router: Router,
    private bucketlistService: BucketlistService
  ) { }

  ngOnInit() {
  }

  createBucketlist () {
    this.bucketlistService.create(this.payload.name).subscribe(
      data => {
        this.message = data;
        this.router.navigate(['/bucketlists'], { queryParams: {limit: 5} });
      },
      error => {
        this.message = error;
      }
    );
  }
}
