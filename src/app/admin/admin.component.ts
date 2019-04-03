import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { APIService, CurrentUserService, UserProgramRoleService, CurrentProgramConfigurationService, SearchFilterService } from 'app/core';
import { ParseErrorCodes } from '../shared/parse-error-codes';

import 'chartjs-plugin-datalabels';
import { Constants } from '../shared/constants';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild(BsModalRef) switchAccountModalService: BsModalRef;

  public loading: boolean;

  public currentUser: any;
  public currentProgramConfiguration: any;

  private subscriptions: Array<Subscription> = [];
  public userProgramRole: any;

  public userPrograms = [];
  public activeProgram: any;
  public showMobileProgramMenu = false;
  programForm: FormGroup;

  public fetchingPrograms = false;
  public disabled = false;
  public status: { isopen: boolean } = { isopen: false };

  public appVersion = Constants.VERSION;
  public envName = environment.name


  constructor(
    private router: Router,
    private apiService: APIService,
    private currentUserService: CurrentUserService,
    private userProgramRoleService: UserProgramRoleService,
    private currentProgramConfigurationService: CurrentProgramConfigurationService,
    public searchFilterService: SearchFilterService,
    public modalService: BsModalService,
  ) {

    this.programForm = new FormGroup({
      program: new FormControl(''),
    });

    // TODO : Move checking of session on auth service
    this.apiService.userSession().subscribe(data => {
      this.apiService.Session.current().then((session) => {
      }).catch(err => {
        if (err.code === ParseErrorCodes.INVALID_SESSION_TOKEN) {
          this.invalidSession();
        }
      });
    })

    this.subscriptions.push(this.currentUserService.currentUser
      .distinctUntilChanged()
      .subscribe(user => {
        if (user && user.objectId) {
          this.currentUser = user;
          this.userPrograms = user.userProgramRoles;
          this.activeProgram = user.activeUserProgramRole;
        }
      }))

    this.subscriptions.push(this.currentProgramConfigurationService.configuration
      .distinctUntilChanged()
      .subscribe(configuration => {
        if (Object.keys(configuration).length > 0) {
          this.currentProgramConfiguration = configuration;
        }
      }))

    // this.activatedRouyte.parrent.url.subscribe
    // this.formToJson('1FvpdmgdKsr6FtSQaZO6EMPE03q8wECGKFswbQViGOC4');
  }

  async formToJson(sourceID) {
    this.loading = true;
    const API = `${Constants.API_LINK}apiKey=${Constants.API_KEY}&operation=${Constants.API_OPERATION}&gformId=${sourceID}`;
    // await response of fetch call
    const response = await fetch(API);
    const data = await response.json();
    this.loading = false;
    const str = JSON.stringify(data);
    return data;
  }

  ngOnInit() {
    // console.log(this.router.url)
    // this.apiService.Cloud.run('samplePushNotification', {userId: 'd0fDjeBvRO'});
  }

  public toggled(open: boolean): void {
    // console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  setProgram(userProgram) {
    if (userProgram.objectId !== this.activeProgram.objectId) {
      // TODO : Make sure the function setCurrentUserSelectedProgramRoleByObjectId is in the right service
      this.userProgramRoleService.setCurrentUserSelectedProgramRoleByObjectId(userProgram)
        .then(async newProgram => {
          await this.currentUserService.update();
          await this.currentProgramConfigurationService.update();
        })
      this.showMobileProgramMenu = false;
      this.resetDefaultSearchFilterValues();
    }
  }

  triggerMobileProgramMenu() {
    this.showMobileProgramMenu = !this.showMobileProgramMenu;
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: 768px)`).matches;
  }

  logout() {
    // TODO : Move logging out in auth service
    if (confirm('Are you sure you want to quit?')) {
      this.apiService.logout().subscribe(res => {
        this.router.navigate(['/login']);
      });
      this.resetDefaultSearchFilterValues();
    }
  }

  resetDefaultSearchFilterValues() {
    this.searchFilterService.setProjectListSearchFilterValues({});
    this.searchFilterService.setReportSearchFilterValues({});
    this.searchFilterService.setCitizenFeedbackSearchFilterValues({});
    this.searchFilterService.setMapSearchFilterValues({});
    this.searchFilterService.setCSOReportSearchFilterValues({});
  }

  invalidSession() {
    if (confirm('Session Timeout. Relogin to the system.')) {
      this.apiService.logout().subscribe(res => {
        this.router.navigate(['/login']);
      });
    }
  }

  isActive() {
    let isActive = false;

    if (this.router.url) {
      isActive = (this.router.url === '/admin/project/list') ||
        (this.router.url === '/admin/dashboard') ||
        (this.router.url.includes('/admin/project/feedback/')) ||
        (this.router.url.includes('/admin/project/details/'))
    }

    return isActive;
  }

  openModal(template: TemplateRef<any>) {
    this.switchAccountModalService = this.modalService.show(
      template,
      Object.assign(
        {},
        {
          animated: true,
          keyboard: false,
          backdrop: true,
          ignoreBackdropClick: true
        },
        { class: 'modal-lg' }
      )
    );
  }

  ngOnDestroy() {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
