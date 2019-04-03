import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { APIService } from '../api/api.service';

@Injectable()
export class AuthenticationService {
  constructor(private apiService: APIService) {

  }

  public isAuthorized(): Observable<boolean> {
    const isAuthorized: boolean = this.apiService.User.current() ? true : false;

    return Observable.of(isAuthorized);
  }

  public login(username, password): Observable<any> {
    return Observable.fromPromise(this.apiService.User.logIn(username, password))
  }

}
