import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BucketlistItemService } from "../../../../services/bucketlist-item.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { BucketlistService } from "../../../../services/bucketlist.service";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  bucketlist_id: number;
  bucketlist: Bucketlist = null;
  model: any = {};
  message: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService,
    private itemService: BucketlistItemService
  ) { }

  ngOnInit() {
    this.bucketlist_id = +this.route.snapshot.params['bucketlist_id'];
    this.getBucketlist();
  }

  createItem() {
    this.itemService.create(this.bucketlist_id, {"name": this.model.name}).subscribe(
      successMessage => {
        this.message = successMessage;
        this.router.navigate(['/bucketlists/' + this.bucketlist_id + '/items']);
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
