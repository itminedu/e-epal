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

    <!--
    <div *ngIf="(isModalShownMy)" [config]="{ show: true }" (onHidden)="onHidden()" bsModal #autoShownModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Auto shown modal</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Καλημέρα σας.</p>
            <p>Αυτό είναι ένα μήνυμα</p>
            <p>από το ng2-bootstrap/modal</p>
          </div>
        </div>
      </div>
    </div>
    -->

  <div
    class = "loading" *ngIf=" distStatus === 'STARTED'" >
  </div>

    <div class="alert alert-info" *ngIf="distStatus === 'STARTED'">
      Παρακαλώ περιμένετε...Η εκτέλεση της κατανομής ενδέχεται να διαρκέσει μερικά λεπτά. Παρακαλώ μην εκτελείται οποιαδήποτε ενέργεια μετακίνησης στον φυλλομετρητή σας, μέχρι να ολοκληρωθεί η κατανομή.
    </div>
    <div class="alert alert-success" *ngIf="distStatus === 'FINISHED'">
      Η κατανομή ολοκληρώθηκε με επιτυχία!
    </div>
    <div class="alert alert-warning" *ngIf="distStatus === 'ERROR'">
      Αποτυχία κατανομής!
    </div>


    <div>
      <form [formGroup]="formGroup"  #form>
        <div class="col-md-8 offset-md-4">
          <button type="submit" class="btn-primary btn-md"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="runDistribution()" >
              Εκτέλεση Κατανομής Μαθητών<span class="glyphicon glyphicon-menu-right"></span>
          </button>
        </div>
      </form>

      <!--
      <button type="button" class="btn-primary btn-md"  (click)="testModal()" >
          Test Modal
      </button>
      -->

    </div>


   `
})

@Injectable() export default class MinisterView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    public isModalShown: BehaviorSubject<boolean>;
    public isModalShownMy: boolean;
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

          this.isModalShown = new BehaviorSubject(false);

    }

    /*
    public showModal():void {
        console.log("about to show modal");
        this.isModalShown.next(true);
        this.isModalShownMy = true;

    }

    public hideModal():void {
        this.autoShownModal.hide();
    }

    public onHidden():void {
        this.isModalShown.next(false);
        this.isModalShownMy = false;
    }
    */

    showModal(){
//        this.bootstrapModal.show();
    }

    closeModal(){
//        this.bootstrapModal.hide();
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
      .catch(err => {console.log(err); this.distStatus = "ERROR";  })
      .then(msg => {
          console.log("KATANOMH TELEIOSE");
          //this.showModal();
          if (this.distStatus !== "ERROR")
            this.distStatus = "FINISHED";
      });
    }

    testModal() {
      this.showModal();
    }



}
