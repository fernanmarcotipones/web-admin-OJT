import { Component, OnInit } from '@angular/core';
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
  constructor(
    private currentUserService: CurrentUserService,
  ) {
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
