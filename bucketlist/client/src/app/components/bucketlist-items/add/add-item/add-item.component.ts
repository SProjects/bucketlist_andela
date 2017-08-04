import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BucketlistItemService } from "../../../../services/bucketlist-item.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { BucketlistService } from "../../../../services/bucketlist.service";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html'
})
export class AddItemComponent implements OnInit {
  bucketlist_id: number;
  bucketlist: Bucketlist = null;
  model: any = {};
  loading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    private itemService: BucketlistItemService,
    public toast: ToastsManager
  ) { }

  ngOnInit() {
    this.bucketlist_id = +this.route.snapshot.params['bucketlist_id'];
    this.getBucketlist();
  }

  createItem() {
    this.loading = true;
    if (this.validateFields()) {
      this.itemService.create(this.bucketlist_id, {"name": this.model.name}).subscribe(
        successMessage => {
          this.loading = false;
          this.toast.success(successMessage);
          this.router.navigate(['/bucketlists/' + this.bucketlist_id + '/items']);
        },
        error => {
          this.toast.error(error);
          this.loading = false;
        }
      );
    } else {
      this.toast.error('Item name is required.');
    }
  }

  private getBucketlist() {
    this.loading = true;
    this.bucketlistService.getBucketlist(this.bucketlist_id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );
  }

  private validateFields() {
    return this.model.name.length > 0;
  }
}
