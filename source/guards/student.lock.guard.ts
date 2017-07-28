import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { STUDENT_ROLE } from "../constants";
import { Router } from "@angular/router";

@Injectable()
export default class StudentLockGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        return this.authService.isApplicationLocked(STUDENT_ROLE).then(isLocked => {
            if (isLocked) {
                this.router.navigate([""]);
                return false;
            } else
                return true;
        }).catch(err => {
            console.log("exception");
            return false;
        });
    }
}
