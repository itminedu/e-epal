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
} from '@angular/forms';

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'minister-informstudents',
    template: `

    <div
      class = "loading" *ngIf="successSending == -2" >
    </div>

    <div id="mailSuccessNotice" (onHidden)="onHidden('#mailSuccessNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Κατανομή μαθητών</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#mailSuccessNotice')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Έγινε αποστολή {{numSuccessMails}} e-mails!</p>
          </div>
        </div>
      </div>
    </div>

    <div id="mailFailureNotice" (onHidden)="onHidden('#mailFailureNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Κατανομή μαθητών</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#mailFailureNotice')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Αποτυχία αποστολής e-mails!</p>
          </div>
        </div>
      </div>
    </div>

    <div id="mailNonSendingNotice" (onHidden)="onHidden('#mailNonSendingNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Κατανομή μαθητών</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#mailNonSendingNotice')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Κάποια e-mail δεν έχουν σταλεί.
            Δεν ήταν δυνατή η αποστολή {{numFailMails}} e-mails!</p>
          </div>
        </div>
      </div>
    </div>

    <!--
    <div class="alert alert-success" *ngIf="successSending == 1 ">
      Έγινε αποστολή {{numSuccessMails}} e-mails!
    </div>
    <div class="alert alert-warning" *ngIf="successSending == 0">
      Αποτυχία αποστολής e-mails!
    </div>
    <div class="alert alert-warning" *ngIf="numFailMails != 0">
      Κάποια e-mail δεν έχουν σταλεί.
      Δεν ήταν δυνατή η αποστολή {{numFailMails}} e-mails!
    </div>
    -->

    <br><br>
    <div class="col-md-12">
      <button type="submit" class="btn btn-lg btn-block"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="informUnlocatedStudents()" >
          Μαζική αποστολή e-mail στους μαθητές που δεν τοποθετήθηκαν<span class="glyphicon glyphicon-menu-right"></span>
      </button>
    </div>




   `
})

@Injectable() export default class InformStudents implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    //private loginInfo$: Observable<ILoginInfo>;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private numSuccessMails:number;
    private numFailMails:number;
    private successSending:number;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;

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

    ngOnInit() {

      (<any>$('#mailSuccessNotice')).appendTo("body");
      (<any>$('#mailFailureNotice')).appendTo("body");
      (<any>$('#mailNonSendingNotice')).appendTo("body");

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

      this.numSuccessMails = 0;
      this.numFailMails = 0;
      this.successSending = -1;

    }

    ngOnDestroy() {

      (<any>$('#mailSuccessNotice')).remove();
      (<any>$('#mailFailureNotice')).remove();
      (<any>$('#mailNonSendingNotice')).remove();

      if (this.loginInfoSub) this.loginInfoSub.unsubscribe();
      this.loginInfo$.unsubscribe();

    }

    public showModal(popupMsgId):void {
        console.log("about to show modal");
        //(<any>$('#distributionWaitingNotice')).modal('show');
        (<any>$(popupMsgId)).modal('show');
    }

    public hideModal(popupMsgId):void {
        //(<any>$('#distributionWaitingNotice')).modal('hide');
        (<any>$(popupMsgId)).modal('hide');
    }

    public onHidden(popupMsgId):void {

    }

    informUnlocatedStudents() {

      /*
      this._hds.informUnlocatedStudents(this.minedu_userName, this.minedu_userPassword)
      .catch(err => {console.log(err);   })
      .then(msg => {
          console.log("Success");
      });
      */

      this.successSending = -2;
      this.numSuccessMails = 0;
      this.numFailMails = 0;

      this._hds.informUnlocatedStudents(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
          //this.data = data;
          //this.successSending = 0;
          this.numSuccessMails = data.num_success_mail;
          this.numFailMails = data.num_fail_mail;
          //console.log("HERE!");
          //console.log(this.numSuccessMails);
      },
        error => {
          console.log("Error");
          this.successSending = 0;
          this.showModal("#mailFailureNotice");
        },
        () => {
          console.log("Success");
          this.successSending = 1;
          this.showModal("#mailSuccessNotice");
          if (this.numFailMails != 0)
            this.showModal("#mailNonSendingNotice");
        }
      )

    }


}
