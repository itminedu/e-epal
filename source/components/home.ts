import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component} from '@angular/core';
import { LoginInfoActions } from '../actions/logininfo.actions';
import { ILoginInfo } from '../store/logininfo/logininfo.types';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Rx';
import { IAppState } from '../store/store';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import { AppSettings } from '../app.settings';
@Component({
    selector: 'home',
    template: `
  <div>
	   <form [formGroup]="formGroup" method = "POST" action="http://localhost/angular/eepal-front/drupal/oauth/login" #form>
<!--            <input type="hidden" name="X-oauth-enabled" value="true"> -->
            <div *ngFor="let loginInfoToken$ of loginInfo$ | async; let i=index">
                <div class="row">
                    <div class="col-md-6">
                        {{loginInfoToken$.auth_token}}
                    </div>
                    <div class="col-md-6">
                        {{loginInfoToken$.auth_role}}
                    </div>
                </div>
            </div>
            <div class="row">

            <div *ngIf="!authToken" class="col-md-7 col-md-offset-5">
                <button type="submit" class="btn-primary btn-lg pull-center" (click)="form.submit()">
                Είσοδος μέσω TaxisNet<span class="glyphicon glyphicon-menu-right"></span>
                </button>
            </div>
            </div>
            <div class="row">
            <div *ngIf="authToken" class="col-md-7 col-md-offset-5">
                <h3>Καλώς ήρθατε</h3>
            </div>
            </div>
            <div class="row">
            <div *ngIf="authToken" class="col-md-7 col-md-offset-5">
                <input type="hidden" name="dologout" value="true">
                <button type="submit" class="btn-primary btn-lg pull-center" (click)="form.submit()">
                Αποσύνδεση<span class="glyphicon glyphicon-menu-right"></span>
                </button>
            </div>
            </div>
     </form>
  </div>
  `
})
export default class Home implements OnInit {
    public formGroup: FormGroup;
    private authToken: string;
    private authRole: string;
    private loginInfo$: Observable<ILoginInfo>;
    constructor(private fb: FormBuilder,
        private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private activatedRoute: ActivatedRoute
        ) {
            this.authToken = '';
            this.authRole = '';
        this.formGroup = this.fb.group({
            Username: [],
            Paswd: []
        });
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

        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.authToken = params['auth_token'];
            this.authRole = params['auth_role'];
            if (this.authToken && this.authRole)
            this._ata.saveLoginInfo({ auth_token: this.authToken, auth_role: this.authRole });
    //        console.log(this.authToken);

        });
    }



    checkvalidation() {

    }
}
