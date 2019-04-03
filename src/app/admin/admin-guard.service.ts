import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import { APIService } from 'app/core';

@Injectable()
export class AdminGuardService implements CanActivateChild {

  constructor(private apiService: APIService, private router: Router) {
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('AdminGuardService#canActivateChild called', state.url, 'Verify login and permissions');

    return this.checkLogin(route, state);
  }

  checkLogin(route, state) {
    if (!state.url.startsWith('/admin')) {
      return true;
    }

    // has logged in
    if (this.apiService.User.current()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
