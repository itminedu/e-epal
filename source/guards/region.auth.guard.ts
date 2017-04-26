import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { REGION_ROLE } from '../constants';
import { SCHOOL_ROLE } from '../constants';

@Injectable()
export default class RegionAuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isLoggedIn(REGION_ROLE,SCHOOL_ROLE).then(loggedIn => {return loggedIn;}).catch(err => {return false;});
  }
}
