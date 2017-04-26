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
    selector: 'minister-reports',
    template: `



  <div>
      <form [formGroup]="formGroup"  #form>
        <!--<button type="submit" class="btn-primary btn-md" (click)="form.submit()" >-->
        <button type="submit" class="btn btn-default btn-block"  (click)="reportGeneral()" >
            Συγκεντρωτικά Αποτελέσματα Κατανομής
        </button>
        <div *ngFor="let generalReports$  of generalReport$ | async; let i=index">
          <div *ngIf="showMessage">
          <br>
           Αριθμός Αιτήσεων: {{generalReports$.num_applications}}<br>
           Αριθμός μαθητών που τοποθετήθηκαν στην πρώτη τους προτίμηση: {{generalReports$.numchoice1}}<br>
           Αριθμός μαθητών που τοποθετήθηκαν στη δεύτερή τους προτίμηση: {{generalReports$.numchoice2}}<br>
           Αριθμός μαθητών που τοποθετήθηκαν στην τρίτη τους προτίμηση: {{generalReports$.numchoice3}}<br>
           Αριθμός μαθητών που δεν τοποθετήθηκαν σε καμμία τους προτίμηση: {{generalReports$.num_noallocated}}<br>
        </div>
        </div>
      </form>
    </div>

   `
})

@Injectable() export default class MinisterReports implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data: string;
    private showMessage: boolean;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          this.formGroup = this.fb.group({

          });

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          this.generalReport$ = new BehaviorSubject([{}]);

          this.showMessage = false;

    }

    ngOnDestroy() {

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      this.loginInfo$.unsubscribe();

      if (this.generalReportSub)
          this.generalReportSub.unsubscribe();
      this.generalReport$.unsubscribe();

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


    reportGeneral() {

      this.generalReportSub = this._hds.makeGeneralReport(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
          this.generalReport$.next(data);
          this.data = data;
      },
        error => {
          this.generalReport$.next([{}]);
          console.log("Error Getting generalReport");
        },
        () => {
          console.log("Getting generalReport");
          /*this.numChoice1 = this.data['numchoice1'];
          console.log(this.numChoice1);*/
          this.showMessage = true;
        }
      )
  }



}
