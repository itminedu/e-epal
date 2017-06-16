import { Component, OnInit, OnDestroy } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import { Observable} from "rxjs/Observable";
import { Http, Headers, RequestOptions} from "@angular/http";
import { NgRedux, select } from "ng2-redux";
import { IAppState } from "../../store/store";
import { Router, ActivatedRoute, Params} from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { ILoginInfo } from "../../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { MINISTRY_ROLE, PDE_ROLE, DIDE_ROLE } from "../../constants";

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from "@angular/forms";

import { API_ENDPOINT } from "../../app.settings";

@Component({
    selector: "minister-reports",
    // encapsulation: ViewEncapsulation.None,
    template: `



  <div style="min-height: 500px; ">

        <h5> >Επιλογή Αναφοράς<br><br></h5>

        <div class="col-md-1">

        <div *ngIf = "minedu_userName != '' && userRole != 'pde' && userRole != 'dide'">
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(0)"  >
          <i class="fa fa-file-text"></i>
              Αριθμός Αιτήσεων / Εγγεγραμμένων Χρηστών
          </button>
          <br><br>
        </div>

        <div *ngIf = "minedu_userName != '' && userRole != 'pde' && userRole != 'dide'">
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(1)"  >
          <i class="fa fa-file-text"></i>
              Κατανομή Μαθητών με Βάση τη Σειρά Προτίμησης
          </button>
          <br><br>
        </div>
        <div *ngIf = "minedu_userName != ''" >
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(2)"  >
          <i class="fa fa-file-text"></i>
              Συνολική Πληρότητα σχολικών μονάδων ΕΠΑΛ ανά τάξη
          </button>
          <br><br>
        </div>
        <div *ngIf = "minedu_userName != ''" >
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(3)"  >
          <i class="fa fa-file-text"></i>
              Αριθμός Μαθητών και Πληρότητα σχολικών μονάδων ΕΠΑΛ
          </button>
          <br><br>
        </div>
        <div *ngIf = "minedu_userName != '' && userRole != 'pde' && userRole != 'dide'">
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(4)"  >
          <i class="fa fa-file-text"></i>
              Σχολικές μονάδες που δεν έχουν δηλώσει Χωρητικότητα τμημάτων
          </button>
          <br><br>
        </div>
        <div *ngIf = "minedu_userName != '' && userRole != 'pde' && userRole != 'dide'">
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(5)"  >
          <i class="fa fa-file-text"></i>
              Ολιγομελή τμήματα (Προσωρινά τοποθετημένοι μαθητές)
          </button>
          <br><br>
        </div>
      </div>

    </div>

   `
})

@Injectable() export default class MinisterReports implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private userRole: string;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.formGroup = this.fb.group({
            region: ["", []],
            adminarea: ["", []],
            schoollist: ["", []],
        });

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.minedu_userName = "";
        this.userRole = MINISTRY_ROLE;

    }

    ngOnInit() {

        this.loginInfoSub = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.minedu_userName = loginInfoToken.minedu_username;
                    this.minedu_userPassword = loginInfoToken.minedu_userpassword;
                    if (loginInfoToken.auth_role === PDE_ROLE || loginInfoToken.auth_role === DIDE_ROLE) {
                        this.userRole = loginInfoToken.auth_role;
                        this.minedu_userName = loginInfoToken.auth_token;
                        this.minedu_userPassword = loginInfoToken.auth_token;
                    }
                    return loginInfoToken;
                }, {});
            }
            return state.loginInfo;
        }).subscribe(this.loginInfo$);

    }

    ngOnDestroy() {
        if (this.loginInfoSub) {
            this.loginInfoSub.unsubscribe();
        }
        if (this.loginInfo$) {
            this.loginInfo$.unsubscribe();
        }
    }

    nav_to_reportpath(repId) {
        if (repId === 0) {
            this.router.navigate(["/ministry/report-users", repId]);
        } else if (repId === 1) {
            this.router.navigate(["/ministry/report-general"]);
        } else if (repId === 2 || repId === 3 || repId === 5) {
            this.router.navigate(["/ministry/report-all-stat", repId]);
        } else if (repId === 4) {
            this.router.navigate(["/ministry/report-no-capacity", repId]);
        }
    }

}
