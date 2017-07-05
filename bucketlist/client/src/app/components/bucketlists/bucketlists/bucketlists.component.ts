import { Component, OnInit } from '@angular/core';
import { BucketlistService } from "../../../services/bucketlist.service";
import { Router, ActivatedRoute } from "@angular/router";

import { Bucketlist } from "../../../models/bucketlist.model";
import { isUndefined } from "util";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-bucketlists',
  templateUrl: './bucketlists.component.html',
  styleUrls: ['./bucketlists.component.css']
})
export class BucketlistsComponent implements OnInit {
  bucketlists: any = [];
  limit: number = 4;
  searchTerm: string = '';
  hasPrevious: boolean;
  previousUrl: string;
  hasNext: boolean;
  nextUrl: string;
  loading: boolean = true;
  selectedBucketlistId: number = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    private userService: UserService,
    public toast: ToastsManager
  ) {}

  ngOnInit(): void{
    this.loadBucketlists();
    this.userService.getCurrentUser().subscribe();
  }

  search(searchTerm) {
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      this.loadBucketlists();
    } else {
      this.loading = true;
      this.bucketlistService.getAll(null, searchTerm).subscribe(
        response => {
          this.processResponse(response);
        },
        error => {
          this.toast.error(JSON.stringify(error));
        }
      );
      this.loading = false;
    }
  }

  private loadBucketlists() {
    this.loading = true;
    this.route.queryParams.subscribe(
      params => {
        if (params['limit']) {
          this.limit = params['limit'];
        }

        this.bucketlistService.getAll(this.limit, null).subscribe(
          response => {
            this.processResponse(response);
            this.loading = false;
          },
          error => {
            this.toast.error(JSON.stringify(error));
          }
        )
    })
  }

  deleteBucketlist() {
    this.bucketlistService.destroy(this.selectedBucketlistId).subscribe(
      successMessage => {
        this.toast.success(successMessage);
        this.loadBucketlists();
      },
      error => {
        this.toast.error(JSON.stringify(error));
      }
    );
  }

  selectBucketlist(id: number){
    this.selectedBucketlistId = id;
  }

  getPrevious() {
    this.bucketlistService.navigate(this.previousUrl).subscribe(
      response => {
        this.processResponse(response);
      },
      error => {
        this.toast.error(JSON.stringify(error));
      }
    );
  }

  getNext() {
    this.bucketlistService.navigate(this.nextUrl).subscribe(
      response => {
        this.processResponse(response);
      },
      error => {
        this.toast.error(JSON.stringify(error));
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
