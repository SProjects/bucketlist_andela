import { Component, OnInit } from '@angular/core';
import { BucketlistService } from "../../../../services/bucketlist.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-edit-bucketlist',
  templateUrl: './edit-bucketlist.component.html'
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
  }

  updateBucketlist () {
    this.loading = true;
    if (this.validateFields()) {
      this.bucketlistService.edit(this.bucketlist.id, this.bucketlist.name).subscribe(
        () => {
          this.loading = false;
          this.toast.success("Bucketlist with ID#" + this.bucketlist.id + " updated successfully");
          this.router.navigate(['/bucketlists']);
        },
        errorMessage => {
          this.toast.error(errorMessage);
          this.loading = false;
        }
      );
    } else {
      this.toast.error("Bucketlist name is required.");
    }
  }

  private getBucketlist() {
    this.loading = true;
    this.bucketlistService.getBucketlist(this.id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
        this.loading = false;
      },
      errorMessage => {
        this.toast.error(errorMessage);
        this.loading = false;
      }
    );
  }

  private validateFields() {
    return this.bucketlist.name.length > 0;
  }
}
