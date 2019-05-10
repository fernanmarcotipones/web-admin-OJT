import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CurrentUserService } from 'app/core';

@Component({
  selector: 'app-admin-form-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {

  private subscriptions: Array<Subscription> = [];
  public currentUser: any;
  formSourceId: any;

  constructor(
    private currentUserService: CurrentUserService,
  ) {
  }
  setSource(value) {
    this.formSourceId = value
    return this.formSourceId
  }

  ngOnInit() {
    this.subscriptions.push(this.currentUserService.currentUser
      .distinctUntilChanged()
      .subscribe(user => {
        if (user && user.objectId) {
          this.currentUser = user;
        }
      }))
  }

}
