import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MINISTRY_ROLE, DIDE_ROLE, PDE_ROLE } from '../constants';
import { Router } from '@angular/router';

@Injectable()
export default class ReportsAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isLoggedInForReports(DIDE_ROLE, PDE_ROLE, MINISTRY_ROLE).then(loggedIn => {
        if (!loggedIn) {
            this.router.navigate(['/ministry/logout']);
            //this.router.navigate(['/ministy/minister-settings']);
        }
        return loggedIn;
    }).catch(err => {
        return false;
    });
  }
}
