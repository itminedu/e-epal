import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs/Rx';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo, ILoginInfoToken } from '../../store/logininfo/logininfo.types';
import { HelperDataService } from '../../services/helper-data-service';
import { LoginInfoActions } from '../../actions/logininfo.actions';



@Component({
  selector: 'reg-navbar',
  templateUrl: 'navbar.component.html',
})

@Injectable() export default class NavbarComponent implements OnInit{
    private authToken: string;
    private authRole: string;
    private loginInfo$: Observable<ILoginInfo>;
 	public cuser :any;

    constructor( private _ata: LoginInfoActions,
                private _hds: HelperDataService,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
                ) {

                        this.authToken = '';
                        this.authRole = '';

        };

    ngOnInit() {
        this.loginInfo$ = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    return loginInfoToken;
                }, {});
            }

            return state.loginInfo;
        });


    }

    oauthSignOut() {
        this._hds.signOut().then(data => {
            this._ata.initLoginInfo();
            this.authToken = '';
            this.authRole = '';
            this.router.navigate(['/']);
        });
    }

}
