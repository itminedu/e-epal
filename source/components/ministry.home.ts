import { NgRedux } from "@angular-redux/store";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { LoginInfoActions } from "../actions/logininfo.actions";
import { API_ENDPOINT } from "../app.settings";
import { HelperDataService } from "../services/helper-data-service";
import { LOGININFO_INITIAL_STATE } from "../store/logininfo/logininfo.initial-state";
import { ILoginInfoRecords } from "../store/logininfo/logininfo.types";
import { IAppState } from "../store/store";

@Component({
    selector: "ministry-home",
    template: `
  <div>
       <form novalidate [formGroup]="userDataGroup"  #form>
            <div
              class = "loading" *ngIf="validLogin === -1" >
            </div>
            <div class="form-group">
                <label for="minedu_username">Όνομα διαχειριστή</label><input class="form-control" type="text" formControlName="minedu_username">
            </div>
            <div class="alert alert-danger" *ngIf="userDataGroup.get('minedu_username').touched && userDataGroup.get('minedu_username').hasError('required')">
                Το πεδίο δεν μπορεί να αφεθεί κενό!
            </div>

            <div class="form-group">
                <label for="minedu_userpassword">Κωδικός πρόσβασης</label><input class="form-control" type="password" formControlName="minedu_userpassword">
            </div>
            <div class="alert alert-danger" *ngIf="userDataGroup.get('minedu_userpassword').touched && userDataGroup.get('minedu_userpassword').hasError('required')">
                Το πεδίο δεν μπορεί να αφεθεί κενό!
            </div>
            <div class="alert alert-danger" *ngIf="!validLogin">
                Λάθος όνομα χρήστη / κωδικός. Παρακαλώ προσπαθήστε ξανά.
            </div>

            <div *ngFor="let loginInfoToken$ of loginInfo$ | async; let i=index"></div>
              <div class="row" style="min-height: 300px; margin-top: 100px;">
              <!--<div *ngIf="!mineduUsername" class="col-md-8 offset-md-4">-->
              <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn-primary btn-lg" (click)="submitCredentials()" [disabled]="userDataGroup.invalid">
                    Είσοδος<span class="glyphicon glyphicon-menu-right"></span>
                    </button>
                </div>
            </div>

     </form>
  </div>
  `
})

export default class MinistryHome implements OnInit, OnDestroy {
    private userDataGroup: FormGroup;
    private authRole: string;
    private mineduUsername: string;
    // private mineduPassword: string;
    // private cuName: string;
    private validLogin: number;
    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private loginInfoSub: Subscription;
    private apiEndPoint = API_ENDPOINT;

    constructor(private fb: FormBuilder,
        private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private http: Http,
        private router: Router
    ) {

        this.mineduUsername = "";
        this.authRole = "";
        this.validLogin = 1;


        this.userDataGroup = this.fb.group({
            minedu_username: ["", [Validators.required]],
            minedu_userpassword: ["", [Validators.required]],
            cu_name: [""],
            auth_role: [""],
        });
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
    };

    ngOnInit() {
        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(linfo => {
                if (linfo.size > 0) {
                    linfo.reduce(({}, loginInfoObj) => {
                        this.mineduUsername = loginInfoObj.minedu_username;
                        if (this.mineduUsername && this.mineduUsername.length > 0)
                            this.router.navigate(["/ministry/minister-settings"]);
                        return loginInfoObj;
                    }, {});
                }
                this.loginInfo$.next(linfo);
            }, error => { console.log("error selecting loginInfo"); });

    }

    ngOnDestroy() {
        if (this.loginInfoSub) this.loginInfoSub.unsubscribe();
    }

    submitCredentials() {
        this.validLogin = -1;
        let success = true;
        this._hds.sendMinisrtyCredentials(this.userDataGroup.value["minedu_username"], this.userDataGroup.value["minedu_userpassword"])
            .catch(err => { console.log(err); success = false; this.validLogin = 0; })
            .then(msg => {
                if (success) {
                    this.authRole = "supervisor";
                    this._hds.setMineduCurrentUser(this.userDataGroup.value["minedu_username"], this.userDataGroup.value["minedu_userpassword"], this.authRole);

                    this.validLogin = 1;
                    this.userDataGroup.value["cu_name"] = this.userDataGroup.value["minedu_username"];
                    this.userDataGroup.value["auth_role"] = "supervisor";
                    this._ata.saveMinEduloginInfo([this.userDataGroup.value]);
                }
            });
    }

}
