import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "../../store/store";
import { ILoginInfoRecords } from "../../store/logininfo/logininfo.types";
import { LoginInfoActions } from "../../actions/logininfo.actions";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";

@Component({
    selector: "reg-navbar",
    templateUrl: "navbar.component.html",
})

@Injectable() export default class NavbarComponent implements OnInit, OnDestroy {
    private authToken: string;
    private authRole: string;
    private lockCapacity: BehaviorSubject<boolean>;
    private lockStudents: BehaviorSubject<boolean>;
    private cuName: string;
    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private cuser: any;
    private loginInfoSub: Subscription;

    constructor(private _ngRedux: NgRedux<IAppState>
    ) {

        this.authToken = "";
        this.authRole = "";
        this.lockCapacity = new BehaviorSubject(true);
        this.lockStudents = new BehaviorSubject(true);
        this.cuName = "";
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

    };

    ngOnInit() {
        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoObj) => {
                        this.authToken = loginInfoObj.auth_token;
                        this.authRole = loginInfoObj.auth_role;
                        if (loginInfoObj.lock_capacity === 1)
                            this.lockCapacity.next(true);
                        else
                            this.lockCapacity.next(false);
                        if (loginInfoObj.lock_students === 1)
                            this.lockStudents.next(true);
                        else
                            this.lockStudents.next(false);
                        this.cuName = loginInfoObj.cu_name;
                        return loginInfoObj;
                    }, {});
                }

                this.loginInfo$.next(loginInfo);
            });
    }

    ngOnDestroy() {
        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
    }
}
