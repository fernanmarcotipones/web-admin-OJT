import { Component, OnInit } from '@angular/core';
import { UserProgramRoleService, UserProgramRole} from 'app/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public currentUserProgramRole: any;
  public isReady: boolean = false;
  
  constructor(
    public userProgramRoleService: UserProgramRoleService,
    ) {
      this.currentUserProgramRole = new UserProgramRole();
    }

  ngOnInit() {
    this.userProgramRoleService.getSelectedProgramRole().then(res => {
      console.log(res)
      if (res) { this.currentUserProgramRole.assign(res); }
      this.isReady = true;
    });
  }

}
