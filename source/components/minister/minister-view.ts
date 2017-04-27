import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import { Observable} from "rxjs/Observable";
import { Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';


import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'minister-view',
    template: `

    <div
      class = "loading" *ngIf=" distStatus === 'STARTED'" >
    </div>
    <div class="alert alert-info" *ngIf="distStatus === 'STARTED'">
      Παρακαλώ περιμένετε...Η εκτέλεση της κατανομής ενδέχεται να διαρκέσει μερικά λεπτά. Παρακαλώ μην εκτελείται οποιαδήποτε ενέργεια μετακίνησης στον φυλλομετρητή σας, μέχρι να ολοκληρωθεί η κατανομή.
    </div>
    <div class="alert alert-info" *ngIf="distStatus === 'FINISHED'">
      Η κατανομή ολοκληρώθηκε με επιτυχία!
    </div>
    <div class="alert alert-info" *ngIf="distStatus === 'ERROR'">
      Αποτυχία κατανομής!
    </div>

  <div>
      <!--
      <form [formGroup]="formGroup" method = "POST" action="{{apiEndPoint}}/epal/distribution" #form>
      -->
      <form [formGroup]="formGroup"  #form>
        <!--<div *ngFor="let loginInfoToken$ of loginInfo$ | async; let i=index"></div>-->
        <!--<button type="submit" class="btn-primary btn-md" (click)="form.submit()" >-->
        <button type="submit" class="btn-primary btn-md"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="runDistribution()" >
            Εκτέλεση Κατανομής Μαθητών
        </button>
      </form>
    </div>

   `
})

@Injectable() export default class MinisterView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    //private loginInfo$: Observable<ILoginInfo>;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";

    constructor(private fb: FormBuilder,
      //  private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          this.formGroup = this.fb.group({

          });

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

    }

    ngOnDestroy() {

      if (this.loginInfoSub) this.loginInfoSub.unsubscribe();
      this.loginInfo$.unsubscribe();

    }

    ngOnInit() {

      this.loginInfoSub = this._ngRedux.select(state => {
          if (state.loginInfo.size > 0) {
              state.loginInfo.reduce(({}, loginInfoToken) => {
                this.minedu_userName = loginInfoToken.minedu_username;
                this.minedu_userPassword = loginInfoToken.minedu_userpassword;
                  return loginInfoToken;
              }, {});
          }
          return state.loginInfo;
      }).subscribe(this.loginInfo$);

    }




    runDistribution() {
      this.distStatus = "STARTED";
      this._hds.makeDistribution(this.minedu_userName, this.minedu_userPassword)
      .catch(err => {console.log(err); this.distStatus = "ERROR"; })
      .then(msg => {
          console.log("KATANOMH TELEIOSE");
          if (this.distStatus !== "ERROR")
            this.distStatus = "FINISHED";
      });
    }



}
