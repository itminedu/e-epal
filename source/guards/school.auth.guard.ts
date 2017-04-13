import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SCHOOL_ROLE } from '../constants';

@Injectable()
export default class SchoolAuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isLoggedIn(SCHOOL_ROLE).then(loggedIn => {return loggedIn;}).catch(err => {return false;});
  }
}
