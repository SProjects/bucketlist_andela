import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BucketlistService } from "../../../../services/bucketlist.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { BucketlistItemService } from "../../../../services/bucketlist-item.service";
import { Item } from "../../../../models/item.model";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html'
})
export class EditItemComponent implements OnInit {
  id: number;
  bucketlist_id: number;
  bucketlist: Bucketlist = null;
  item: Item = null;
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
    this.id = +this.route.snapshot.params['id'];
    this.getItem();
    this.getBucketlist();
  }

  update() {
    this.loading = true;
    if (this.validateFields()) {
      this.itemService.edit(this.bucketlist_id, this.id, {'name': this.item.name}).subscribe(
        () => {
          this.loading = false;
          this.toast.success("Bucketlist item updated successfully.");
          this.router.navigate(['/bucketlists/' + this.bucketlist_id + '/items']);
        },
        error => {
          this.toast.error(error);
          this.loading = false;
        }
      );
    } else {
      this.toast.error("Item name is required.");
    }
  }

  private getItem() {
    this.loading = true;
    this.itemService.getItem(this.bucketlist_id, this.id).subscribe(
      item => {
        this.item = item;
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );
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
    return this.item.name.length > 0;
  }
}
