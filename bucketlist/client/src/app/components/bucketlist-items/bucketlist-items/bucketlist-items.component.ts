import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { Item } from "../../../models/item.model";
import { BucketlistService } from "../../../services/bucketlist.service";
import { Bucketlist } from "../../../models/bucketlist.model";
import { BucketlistItemService } from "../../../services/bucketlist-item.service";

@Component({
  selector: 'app-bucketlist-items',
  templateUrl: './bucketlist-items.component.html',
  styleUrls: ['./bucketlist-items.component.css']
})
export class BucketlistItemsComponent implements OnInit {
  message: string = null;
  items: Item[];
  bucketlist: Bucketlist = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    private itemService: BucketlistItemService,
  ) { }

  ngOnInit() {
    let id = +this.route.snapshot.params['id'];
    this.bucketlistService.getBucketlist(id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
        this.items = bucketlist.items
      }
    );
  }

  markAsDone(item: Item) {
    this.itemService.edit(this.bucketlist.id, item.id, {'done': true}).subscribe(
      responseMessage => {
        this.message = responseMessage;
        this.ngOnInit();
      },
      error => {
        this.message = error;
      }
    );
  }

  updateItem(item: Item) {
    this.router.navigate(['/bucketlists/' + this.bucketlist.id + '/edit-item/' + item.id]);
  }

  delete(item: Item) {
    this.itemService.delete(this.bucketlist.id, item.id).subscribe(
      responseMessage => {
        this.message = responseMessage;
        this.ngOnInit();
      },
      error => {
        this.message = error;
      }
    );
  }

}
