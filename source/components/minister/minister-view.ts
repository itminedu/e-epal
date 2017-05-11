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

    <div class="row">
         <breadcrubs></breadcrubs>
    </div>

    <div
      class = "loading" *ngIf=" distStatus === 'STARTED'" >
    </div>

    <div id="distributionCompletedNotice" (onHidden)="onHidden('#distributionCompletedNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Κατανομή μαθητών</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#distributionCompletedNotice')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Η κατανομή ολοκληρώθηκε με επιτυχία!</p>
          </div>
        </div>
      </div>
    </div>

    <div id="distributionWaitingNotice" (onHidden)="onHidden('#distributionWaitingNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Κατανομή μαθητών</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#distributionWaitingNotice')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Παρακαλώ περιμένετε...Η εκτέλεση της κατανομής ενδέχεται να διαρκέσει μερικά λεπτά.
            Παρακαλώ μην εκτελείτε οποιαδήποτε ενέργεια μετακίνησης στον φυλλομετρητή σας, μέχρι να ολοκληρωθεί η κατανομή.
            Αν διαβάσατε αυτό το μήνυμα, μπορείτε να το κλείσετε οποιαδήποτε στιγμή.</p>
          </div>
        </div>
      </div>
    </div>

    <div id="distributionFailureNotice" (onHidden)="onHidden('#distributionFailureNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title pull-left">Κατανομή μαθητών</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#distributionFailureNotice')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Αποτυχία κατανομής. Παρακαλώ προσπαθήστε ξανά.
            Σε περίπτωση που το πρόβλημα παραμένει, παρακαλώ απευθυνθείτε στο διαχειριστή του συστήματος.</p>
          </div>
        </div>
      </div>
    </div>

    <!--
    <div class="alert alert-info" *ngIf="distStatus === 'STARTED'">
      Παρακαλώ περιμένετε...Η εκτέλεση της κατανομής ενδέχεται να διαρκέσει μερικά λεπτά. Παρακαλώ μην εκτελείτε οποιαδήποτε ενέργεια μετακίνησης στον φυλλομετρητή σας, μέχρι να ολοκληρωθεί η κατανομή.
    </div>
    <div class="alert alert-success" *ngIf="distStatus === 'FINISHED'">
      Η κατανομή ολοκληρώθηκε με επιτυχία!
    </div>
    <div class="alert alert-warning" *ngIf="distStatus === 'ERROR'">
      Αποτυχία κατανομής!
    </div>
    -->

    <br><br>
    <div>
      <form [formGroup]="formGroup"  #form>
        <div class="col-md-6">
          <button type="submit" class="btn btn-lg btn-block"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="runDistribution()" >
              Εκτέλεση  Κατανομής  Μαθητών<span class="glyphicon glyphicon-menu-right"></span>
          </button>
        </div>
      </form>

    </div>

   `
})

@Injectable() export default class MinisterView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    //public isModalShownWaiting: BehaviorSubject<boolean>;
    //public isModalShownCompleted: BehaviorSubject<boolean>;
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

          //this.isModalShownWaiting = new BehaviorSubject(false);
          //this.isModalShownCompleted = new BehaviorSubject(false);

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
      /*
      if (popupMsgId == "#distributionWaitingNotice")
        this.isModalShownWaiting.next(false);
        else if (popupMsgId == "#distributionCompletedNotice")
          this.isModalShownCompleted.next(false);
      */
        //this.isModalShownWaiting.next(false);
    }


    ngOnDestroy() {

      (<any>$('#distributionWaitingNotice')).remove();
      (<any>$('#distributionCompletedNotice')).remove();
      (<any>$('#distributionFailureNotice')).remove();
      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      //this.loginInfo$.unsubscribe();

    }

    ngOnInit() {

      (<any>$('#distributionWaitingNotice')).appendTo("body");
      (<any>$('#distributionCompletedNotice')).appendTo("body");
      (<any>$('#distributionFailureNotice')).appendTo("body");


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

      this.showModal("#distributionWaitingNotice");

      this._hds.makeDistribution(this.minedu_userName, this.minedu_userPassword)
      .catch(err => {console.log(err); this.distStatus = "ERROR";  })
      .then(msg => {
          console.log("KATANOMH TELEIOSE");
          this.showModal("#distributionCompletedNotice");
          if (this.distStatus !== "ERROR")
            this.distStatus = "FINISHED";
      });
    }





}
