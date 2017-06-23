import { Component, OnInit } from '@angular/core';
import { BucketlistService } from "../../../../services/bucketlist.service";
import { Bucketlist } from "../../../../models/bucketlist.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-edit-bucketlist',
  templateUrl: './edit-bucketlist.component.html',
  styleUrls: ['./edit-bucketlist.component.css']
})
export class EditBucketlistComponent implements OnInit{
  id: number = null;
  bucketlist: Bucketlist = null;
  message: string = null;
  payload: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketlistService: BucketlistService
  ) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.getBucketlist();
  }

  updateBucketlist () {
    this.bucketlistService.edit(this.bucketlist.id, this.bucketlist.name).subscribe(
      data => {
        this.message = data;
        this.router.navigate(['/bucketlists']);
      },
      error => {
        this.message = error;
      }
    );
  }

  private getBucketlist() {
    this.bucketlistService.getBucketlist(this.id).subscribe(
      bucketlist => {
        this.bucketlist = bucketlist;
      },
      error => {
        console.error(JSON.stringify(error));
      }
    )
  }
}
