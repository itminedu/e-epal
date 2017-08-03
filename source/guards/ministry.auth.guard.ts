import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";

import { MINISTRY_ROLE } from "../constants";
import { AuthService } from "../services/auth.service";

@Injectable()
export default class MinistryAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        return this.authService.isLoggedIn(MINISTRY_ROLE).then(loggedIn => {
            if (!loggedIn) {
                this.router.navigate(["/ministry/logout"]);
            }
            return loggedIn;
        }).catch(err => {
            return false;
        });
    }
}
