import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SCHOOL_ROLE } from '../constants';
import { Router } from '@angular/router';

@Injectable()
export default class SchoolStudentsLockedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isStudentsLocked(SCHOOL_ROLE).then(isLocked => {
        if (isLocked) {
            this.router.navigate(['/school']);
            return false;
        } else
            return true;
    }).catch(err => {
        return false;
    });
  }
}
