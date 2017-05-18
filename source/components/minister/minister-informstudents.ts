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
import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'minister-informstudents',
    template: `

    <div
      class = "loading" *ngIf="successSending == -2" >
    </div>

    <div id="emaiSentNotice" (onHidden)="onHidden()" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header {{modalHeader}}" >
              <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;{{ modalTitle | async }}</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>{{ modalText | async }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>

    <br><br>
    <div class="col-md-12">
      <button type="submit" class="btn btn-lg btn-block"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="informUnlocatedStudents()" >
          Μαζική αποστολή e-mail στους μαθητές που δεν τοποθετήθηκαν<span class="glyphicon glyphicon-menu-right"></span>
      </button>
    </div>

   `
})

@Injectable() export default class InformStudents implements OnInit, OnDestroy {

    loginInfo$: BehaviorSubject<ILoginInfo>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    //public isModalShown: BehaviorSubject<boolean>;
    public modalHeader: string;
    loginInfoSub: Subscription;
    private numSuccessMails:number;
    private numFailMails:number;
    private successSending:number;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;

    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          //this.isModalShown = new BehaviorSubject(false);
          this.modalTitle =  new BehaviorSubject("");
          this.modalText =  new BehaviorSubject("");

    }

    ngOnInit() {

      (<any>$('#emaiSentNotice')).appendTo("body");

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

      (<any>$('#emaiSentNotice')).remove();

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();


    }


    public showModal():void {
        console.log("about to show modal");
        (<any>$('#emaiSentNotice')).modal('show');
    }

    public hideModal():void {
        (<any>$('#emaiSentNotice')).modal('hide');
    }

    public onHidden():void {
        //this.isModalShown.next(false);
    }

    informUnlocatedStudents() {

      this.successSending = -2;
      this.numSuccessMails = 0;
      this.numFailMails = 0;

      this._hds.informUnlocatedStudents(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
          this.numSuccessMails = data.num_success_mail;
          this.numFailMails = data.num_fail_mail;
          //console.log("HERE!");
          //console.log(this.numSuccessMails);
      },
        error => {
          console.log("Error");
          this.successSending = 0;

          this.modalTitle.next("Κατανομή Μαθητών");
          this.modalText.next("Αποτυχία αποστολής e-mails!");
          this.modalHeader = "modal-header-warning";
          this.showModal();
        },
        () => {
          console.log("Success");
          this.successSending = 1;

          this.modalHeader = "modal-header-success";
          this.modalTitle.next("Κατανομή Μαθητών");
          let txtModal = "Έγινε αποστολή " + this.numSuccessMails + " e-mails! ";
          if (this.numFailMails != 0) {
            this.modalHeader = "modal-header-warning";
            txtModal += "Κάποια e-mail δεν έχουν σταλεί. Δεν ήταν δυνατή η αποστολή " + this.numFailMails + " e-mails!";
          }
          this.modalText.next(txtModal);
          this.showModal();
        }
      )

    }


}
