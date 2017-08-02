import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";

import { DIDE_ROLE, MINISTRY_ROLE, PDE_ROLE } from "../constants";
import { AuthService } from "../services/auth.service";

@Injectable()
export default class ReportsAuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        return this.authService.isLoggedInForReports(DIDE_ROLE, PDE_ROLE, MINISTRY_ROLE).then(loggedIn => {
            if (!loggedIn) {
                this.router.navigate(["/ministry/logout"]);
            }
            return loggedIn;
        }).catch(err => {
            return false;
        });
    }
}
