import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BucketlistService } from "../../../../services/bucketlist.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { BucketlistItemService } from "../../../../services/bucketlist-item.service";
import { Item } from "../../../../models/item.model";

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  id: number;
  bucketlist_id: number;
  bucketlist: Bucketlist = null;
  item: Item = null;
  message: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    private itemService: BucketlistItemService
  ) { }

  ngOnInit() {
    this.bucketlist_id = +this.route.snapshot.params['bucketlist_id'];
    this.id = +this.route.snapshot.params['id'];
    this.getItem();
    this.getBucketlist();
  }

  update() {
    this.itemService.edit(this.bucketlist_id, this.id, {'name': this.item.name}).subscribe(
      successMessage => {
        this.message = successMessage;
        this.router.navigate(['/bucketlists/' + this.bucketlist_id + '/items']);
      },
      error => {
        this.message = error;
      }
    );
  }

  private getItem() {
    this.itemService.getItem(this.bucketlist_id, this.id).subscribe(
      item => {
        this.item = item;
      },
      error => {
        this.message = error;
      }
    );
  }

  private getBucketlist() {
    this.bucketlistService.getBucketlist(this.bucketlist_id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
      },
      error => {
        this.message = error;
      }
    );
  }
}
