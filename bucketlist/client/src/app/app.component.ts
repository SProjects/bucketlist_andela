import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from "ng2-toastr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private viewContainerRef: ViewContainerRef;

  constructor(public toast: ToastsManager, viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
    this.toast.setRootViewContainerRef(viewContainerRef);
  }
}
