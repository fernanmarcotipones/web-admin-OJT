import { Component, OnInit } from '@angular/core';
import { UserProgramRoleService, UserProgramRole, UserService} from 'app/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public currentUserProgramRole: any;
  public isReady = false;

  constructor(
    public userProgramRoleService: UserProgramRoleService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
      this.currentUserProgramRole = new UserProgramRole();
    }

  ngOnInit() {
    this.userProgramRoleService.getSelectedProgramRole().then(res => {
      console.log(res)
      if (res) { this.currentUserProgramRole.assign(res); }
      this.isReady = true;
    });

    console.log
    (
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
        this.userService.getByObjectId(params.get('id')))
      )
    );

  }

}
