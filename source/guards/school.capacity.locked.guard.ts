import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Router } from "@angular/router";

import { SCHOOL_ROLE } from "../constants";
import { AuthService } from "../services/auth.service";

@Injectable()
export default class SchoolCapacityLockedGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        return this.authService.isCapacityLocked(SCHOOL_ROLE).then(isLocked => {
            if (isLocked) {
                this.router.navigate(["/school"]);
                return false;
            } else
                return true;
        }).catch(err => {
            return false;
        });
    }
}
