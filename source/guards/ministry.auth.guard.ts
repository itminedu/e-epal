import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { MINISTRY_ROLE } from "../constants";
import { Router } from "@angular/router";

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
