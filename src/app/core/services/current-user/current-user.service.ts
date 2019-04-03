import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { APIService } from '../api/api.service';
import { CurrentUserInterface } from '../../interfaces';

@Injectable()
export class CurrentUserService {
  private source = new BehaviorSubject({
    objectId: undefined,
    userProgramRoles: [],
    activeUserProgramRole: { program: {} }
  });
  currentUser = this.source.asObservable();
  private hasUser = false;

  constructor(private apiService: APIService) {
    if (!this.hasUser) {
      this.update();
    }
  }

  public update() {
    return new Promise(async (resolve, reject) => {
      try {
        this.apiService.currUserInfo()
          .subscribe(user => {
            // user should contains roles has been granted
            this.hasUser = true;
            this.source.next(user);
            // this.userSubject.complete();
            resolve (user)
          }, (error) => {
            this.hasUser = false;
            this.source.error(error);
            // resolve ({})
          });
      } catch (error) {
        reject(error);
      }
    })
  }

}
