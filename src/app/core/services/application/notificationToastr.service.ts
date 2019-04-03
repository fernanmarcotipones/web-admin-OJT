import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class NotificationToastrService {

  constructor(private toastr: ToastrService) { };

  alert(type, msg) {
    type = type.charAt(0).toUpperCase() + type.substr(1).toLowerCase();
    switch (type.toUpperCase()) {
      case 'SUCCESS':
        this.toastr.success(msg, type, {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        break;

      case 'INFO':
        this.toastr.info(msg, type, {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        break;

      case 'WARNING':
        this.toastr.warning(msg, type, {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        break;

      case 'DANGER':
        this.toastr.error(msg, type, {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        break;

      case 'ERROR':
        this.toastr.error(msg, type, {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        break;

      default:
        break;
    }
  }

}
