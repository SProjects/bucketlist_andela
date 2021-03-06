import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { Item } from "../../../models/item.model";
import { BucketlistService } from "../../../services/bucketlist.service";
import { Bucketlist } from "../../../models/bucketlist.model";
import { BucketlistItemService } from "../../../services/bucketlist-item.service";
import { ToastsManager } from "ng2-toastr";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-bucketlist-items',
  templateUrl: './bucketlist-items.component.html'
})
export class BucketlistItemsComponent implements OnInit {
  message: string = null;
  items: Item[];
  bucketlist: Bucketlist = null;
  loading: boolean = true;
  selectedItemId: number = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    private itemService: BucketlistItemService,
    private userService: UserService,
    public toast: ToastsManager
  ) { }

  ngOnInit() {
    this.getItems();
    this.userService.getCurrentUser().subscribe();
  }

  private getItems() {
    this.loading = true;
    let id = +this.route.snapshot.params['id'];
    this.bucketlistService.getBucketlist(id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
        this.items = bucketlist.items;
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );

  }

  selectItem(id: number) {
    this.selectedItemId = id;
  }

  markAsDone() {
    this.updateStatus(true, 'Hurray! Bucketlist item completed.')
  }

  markAsUnDone() {
    this.updateStatus(false, 'Bucketlist item marked as undone.')
  }

  private updateStatus(status: boolean, successMessage: string) {
    this.loading = true;
    this.itemService.edit(this.bucketlist.id, this.selectedItemId, {'done': status}).subscribe(
      () => {
        this.toast.success(successMessage);
        this.getItems();
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );
  }

  updateItem(item: Item) {
    this.router.navigate(['/bucketlists/' + this.bucketlist.id + '/edit-item/' + item.id]);
  }

  delete() {
    this.loading = true;
    this.itemService.delete(this.bucketlist.id, this.selectedItemId).subscribe(
      successMessage => {
        this.toast.success(successMessage);
        this.getItems();
        this.loading = false;
      },
      error => {
        this.toast.error(error);
        this.loading = false;
      }
    );
  }

}
