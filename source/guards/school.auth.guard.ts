import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SCHOOL_ROLE } from '../constants';
import { Router } from '@angular/router';

@Injectable()
export default class SchoolAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isLoggedIn(SCHOOL_ROLE).then(loggedIn => {
        if (!loggedIn) {
            this.router.navigate(['/school/logout']);
        }
        return loggedIn;
    }).catch(err => {
        return false;
    });
  }
}
