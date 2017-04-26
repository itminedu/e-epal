import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { STUDENT_ROLE } from '../constants';

@Injectable()
export default class StudentAuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isLoggedIn(STUDENT_ROLE,'').then(loggedIn => {return loggedIn;}).catch(err => {return false;});
  }
}
