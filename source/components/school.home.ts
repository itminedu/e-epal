import { Router, ActivatedRoute, Params } from "@angular/router";
import { OnInit, OnDestroy, Component } from "@angular/core";
import { LoginInfoActions } from "../actions/logininfo.actions";
import { ILoginInfo } from "../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../store/logininfo/logininfo.initial-state";
import { NgRedux, select } from "ng2-redux";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { IAppState } from "../store/store";
import { HelperDataService } from "../services/helper-data-service";
import { CookieService } from "ngx-cookie";
import { FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";
import { API_ENDPOINT, API_ENDPOINT_PARAMS } from "../app.settings";

@Component({
    selector: "school-home",
    template: `
<div style="min-height: 300px; margin-top: 100px;">
    <div *ngIf="(errorCode$ | async) != ''">
        <div [ngSwitch]="errorCode$ | async">
            <p class="text-danger" *ngSwitchCase="5001">Προέκυψε σφάλμα κατά την διαδικασία αυθεντικοποίησης σας.</p>
            <p class="text-danger" *ngSwitchCase="5002">Πρέπει να συνδεθείτε με λογαριασμό του Πανελλήνιου Σχολικού Δικτύου, για να χρησιμοποιήσετε την εφαρμογή.</p>
            <p class="text-danger" *ngSwitchCase="5003">Πρέπει να συνδεθείτε με τον επίσημο λογαριασμό μονάδας στο Πανελλήνιο Σχολικό Δίκτυο, για να χρησιμοποιήσετε την εφαρμογή.</p>
            <p class="text-danger" *ngSwitchCase="5004">Ο ρόλος που αντιστοιχεί στον λογαριασμό σας στο Πανελλήνιο Σχολικό Δίκτυο δεν επιτρέπεται να χρησιμοποιήσετε την εφαρμογή.</p>
            <p class="text-danger" *ngSwitchCase="5005">Προέκυψε σφάλμα κατά την διαδικασία αυθεντικοποίησης σας.</p>
            <p class="text-danger" *ngSwitchCase="6000">Προέκυψε σφάλμα κατά την διαδικασία αυθεντικοποίησης σας. <br/>Παρακαλώ συνδεθείτε χρησιμοποιώντας τα στοιχεία του επίσημου λογαριασμού που διαθέτει η μονάδα στο Πανελλήνιο Σχολικό Δίκτυο.</p>
            <p class="text-danger" *ngSwitchDefault>Προέκυψε σφάλμα {{ errorCode$ | async }}</p>
        </div>
        <div class="alert alert-danger" role="alert">Για να επαναλάβετε τη διαδικασία σύνδεσης πρέπει πρώτα να αποσυνδεθείτε.</div>
        <div class="row">
            <div class="col-sm-4">&nbsp;</div>
            <div class="col-sm-4">
                <button type="submit" class="btn btn-lg btn-block isclickable" (click)="casSignOut()">Αποσύνδεση</button>
            </div>
        </div>
    </div>
    <div *ngIf="(errorCode$ | async) == ''">
        <form [formGroup]="formGroup" method = "POST" action="{{apiEndPoint}}/cas/login{{apiEndPointParams}}" #form>
            <!-- <input type="hidden" name="X-oauth-enabled" value="true"> -->
            <div *ngFor="let loginInfoToken$ of loginInfo$ | async; let i=index"></div>
            <div class="row">
                <div *ngIf="!authToken" class="col-md-8 offset-md-4">
                    <button type="submit" class="btn-primary btn-lg" (click)="form.submit()">
                    Είσοδος μέσω Π.Σ.Δ<span class="glyphicon glyphicon-menu-right"></span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
`
})

export default class SchoolHome implements OnInit, OnDestroy {
    public formGroup: FormGroup;
    private authToken: string;
    private errorCode$: BehaviorSubject<string>;
    private authRole: string;
    private name: any;
    private xcsrftoken: any;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    private loginInfoSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private apiEndPointParams = API_ENDPOINT_PARAMS;

    constructor(private fb: FormBuilder,
        private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private activatedRoute: ActivatedRoute,
        private _hds: HelperDataService,
        private router: Router,
        private _cookieService: CookieService
    ) {
        this.authToken = "";
        this.authRole = "";
        this.name = "";
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.errorCode$ = new BehaviorSubject('');
        this.formGroup = this.fb.group({
        });
    };

    ngOnDestroy() {
        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
        this.loginInfo$.unsubscribe();
        this.errorCode$.unsubscribe();
    };

    ngOnInit() {
        this.loginInfoSub = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({ }, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    if (this.authToken && this.authToken.length > 0) {
                        if (this.authRole === "director") {
                            this.router.navigate(["/school/director-buttons"]);
                        }
                        else if (this.authRole === "pde")
                            this.router.navigate(["/school/perfecture-view"]);
                        else if (this.authRole === "dide")
                            this.router.navigate(["/school/eduadmin-view"]);
                    }
                    return loginInfoToken;
                }, {});
            }

            return state.loginInfo;
        }).subscribe(this.loginInfo$);

        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params) {
                this.authToken = params["auth_token"];
                this.authRole = params["auth_role"];
                this.errorCode$.next((params["error_code"] === undefined) ? "" : params["error_code"]);
            }
            if (this.authToken && this.authRole && this.errorCode$.getValue() == "") {
                this._ata.getloginInfo({ auth_token: this.authToken, auth_role: this.authRole });
            }
        });
    }

    getCookie(key: string) {
        return this._cookieService.get(key);
    }

    removeCookie(key: string) {
        return this._cookieService.remove(key);
    }

    checkvalidation() {

    }

    /**
     * Logout from CAS only helper
     */
    casSignOut() {
        this._hds.casSignOut().then(data => {
            this._ata.initLoginInfo();
            // this.router.navigate(['/school']);
            this.authToken = '';
            this.authRole = '';
            window.location.assign((<any>data).next);
        }).catch(err => {
            console.log(err)
        });
    }
}
