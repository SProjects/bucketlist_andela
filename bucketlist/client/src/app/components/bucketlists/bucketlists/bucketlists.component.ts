import { Component, OnInit } from '@angular/core';
import { BucketlistService } from "../../../services/bucketlist.service";
import { Router, ActivatedRoute } from "@angular/router";

import { Bucketlist } from "../../../models/bucketlist.model";
import { isUndefined } from "util";

@Component({
  selector: 'app-bucketlists',
  templateUrl: './bucketlists.component.html',
  styleUrls: ['./bucketlists.component.css']
})
export class BucketlistsComponent implements OnInit {
  message: string = null;
  bucketlists: any = [];
  limit: number = 4;
  searchTerm: string = '';
  hasPrevious: boolean;
  previousUrl: string;
  hasNext: boolean;
  nextUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService
  ) { }

  ngOnInit(): void{
    this.loadBucketlists();
  }

  search(searchTerm) {
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      this.loadBucketlists();
    } else {
      this.bucketlistService.getAll(null, searchTerm).subscribe(
        response => {
          this.processResponse(response);
        },
        error => {
          console.error(JSON.stringify(error));
        }
      );
    }
  }

  private loadBucketlists() {
    this.route.queryParams.subscribe(
      params => {
        if (params['limit']) {
          this.limit = params['limit'];
        }

        this.bucketlistService.getAll(this.limit, null).subscribe(
          response => {
            this.processResponse(response);
          },
          error => {
            console.error(JSON.stringify(error));
          }
        )
    })
  }

  deleteBucketlist(bucketlist: Bucketlist) {
    this.bucketlistService.destroy(bucketlist.id).subscribe(
      success => {
        this.ngOnInit();
      },
      error => {
        console.error(error)
      }
    );
  }

  getPrevious() {
    this.bucketlistService.navigate(this.previousUrl).subscribe(
      response => {
        this.processResponse(response);
      },
      error => {
        console.error(JSON.stringify(error));
      }
    );
  }

  getNext() {
    this.bucketlistService.navigate(this.nextUrl).subscribe(
      response => {
        this.processResponse(response);
      },
      error => {
        console.error(JSON.stringify(error));
      }
    );
  }

  viewDetails(bucketlist: Bucketlist) {
    this.router.navigate(['/bucketlists/' + bucketlist.id + '/items']);
  }

  editBucketlist(bucketlist: Bucketlist) {
    this.router.navigate(['/edit-bucketlist/' + bucketlist.id]);
  }

  totalItems(bucketlist: Bucketlist) {
    return bucketlist.items.length;
  }

  finishedItems(bucketlist: Bucketlist) {
    let count: number = 0;
    bucketlist.items.map(item => {
      if(item.done){
        count += 1;
      }
    });
    return count;
  }

  unfinishedItems(bucketlist: Bucketlist) {
    let count: number = 0;
    bucketlist.items.map(item => {
      if(!item.done){
        count += 1;
      }
    });
    return count;
  }

  private processResponse(response) {
    this.bucketlists = response['bucketlists'];

        if (isUndefined(this.bucketlistService.previous)) {
          this.hasPrevious = true
        } else {
          this.previousUrl = response['previous'];
          this.hasPrevious = false;
        }

        if (isUndefined(this.bucketlistService.next)) {
          this.hasNext = true
        } else {
          this.nextUrl = response['next'];
          this.hasNext = false;
        }
  }
}
