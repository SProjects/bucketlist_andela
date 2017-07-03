import { Component, OnInit } from '@angular/core';
import { BucketlistService } from "../../../../services/bucketlist.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-edit-bucketlist',
  templateUrl: './edit-bucketlist.component.html',
  styleUrls: ['./edit-bucketlist.component.css']
})
export class EditBucketlistComponent implements OnInit{
  id: number = null;
  bucketlist: Bucketlist = null;
  payload: any = {};
  loading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    public toast: ToastsManager
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.getBucketlist();
    this.loading = false;
  }

  updateBucketlist () {
    this.loading = true;
    this.bucketlistService.edit(this.bucketlist.id, this.bucketlist.name).subscribe(
      () => {
        this.toast.success("Bucketlist with ID#" + this.bucketlist.id + " updated successfully");
        this.router.navigate(['/bucketlists']);
      },
      errorMessage => {
        this.toast.error(errorMessage);
      }
    );
    this.loading = false;
  }

  private getBucketlist() {
    this.bucketlistService.getBucketlist(this.id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
      },
      errorMessage => {
        this.toast.error(errorMessage);
      }
    )
  }
}
