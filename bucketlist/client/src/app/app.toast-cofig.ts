import {ToastOptions} from "ng2-toastr/ng2-toastr";

export class CustomOption extends ToastOptions {
  animate = 'fade';
  newestOnTop = true;
  showCloseButton = true;
  positionClass = 'toast-bottom-left';
}
