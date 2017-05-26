import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { STUDENT_ROLE } from '../constants';
import { Router } from '@angular/router';

@Injectable()
export default class StudentAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isLoggedIn(STUDENT_ROLE).then(loggedIn => {
        if (!loggedIn) {
            this.router.navigate(['/logout']);
        }
        return loggedIn;
    }).catch(err => {
        console.log("exception");
        return false;
    });
  }
}
