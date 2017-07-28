import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions } from "@angular/http";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "../../store/store";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { ILoginInfo } from "../../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { API_ENDPOINT } from "../../app.settings";

@Component({
    selector: "minister-informstudents",
    template: `

    <div
      class = "loading" *ngIf="successSending == -2" >
    </div>

    <div id="emaiSentNotice" (onHidden)="onHidden()" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header {{modalHeader | async}}" >
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

    <h5> >Αποστολή ειδοποιήσεων <br></h5>
    <br><br>
    <div class="row" style="margin: 2em 0 2em 0;">
        <div class="col-md-12">
            <h3>Αποστολή e-mail στους μαθητές που ΔΕΝ τοποθετήθηκαν</h3>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(1, 0)" [disabled] = "!applicantsResultsDisabled" >
                Α' Περίοδος
            </button>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(1, 1)" [disabled] = "!applicantsResultsDisabled" >
                B' Περίοδος
            </button>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(1, 2)" [disabled] = "!applicantsResultsDisabled" >
                Α' και Β' Περίοδος
            </button>
        </div>
    </div>

    <div class="row" style="margin: 2em 0 2em 0;">
        <div class="col-md-12">
            <h3>Αποστολή e-mail στους μαθητές που τοποθετήθηκαν προσωρινά σε ολιγομελή τμήματα</h3>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(2, 0)" [disabled] = "!applicantsResultsDisabled" >
                Α' Περίοδος
            </button>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(2, 1)" [disabled] = "!applicantsResultsDisabled" >
                B' Περίοδος
            </button>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(2, 2)" [disabled] = "!applicantsResultsDisabled" >
                Α' και Β' Περίοδος
            </button>
        </div>
    </div>

    <div class="row" style="margin: 2em 0 2em 0;">
        <div class="col-md-12">
            <h3>Αποστολή e-mail στους μαθητές που τοποθετήθηκαν</h3>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(3, 0)" [disabled] = "!applicantsResultsDisabled" >
                Α' Περίοδος
            </button>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(3, 1)" [disabled] = "!applicantsResultsDisabled" >
                B' Περίοδος
            </button>
        </div>
        <div class="col-md-4">
            <button type="submit" class="btn btn-lg btn-block" *ngIf="(loginInfo$ | async).size !== 0" (click)="informUnlocatedStudents(3, 2)" [disabled] = "!applicantsResultsDisabled" >
                Α' και Β' Περίοδος
            </button>
        </div>
    </div>

   `
})

@Injectable() export default class InformStudents implements OnInit, OnDestroy {

    loginInfo$: BehaviorSubject<ILoginInfo>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private settings$: BehaviorSubject<any>;
    loginInfoSub: Subscription;
    private settingsSub: Subscription;
    private numSuccessMails: number;
    private numFailMails: number;
    private successSending: number;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private applicantsResultsDisabled: boolean;

    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.settings$ = new BehaviorSubject([{}]);

    }

    ngOnInit() {

        (<any>$("#emaiSentNotice")).appendTo("body");

        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfo>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({ }, loginInfoToken) => {
                        this.minedu_userName = loginInfoToken.minedu_username;
                        this.minedu_userPassword = loginInfoToken.minedu_userpassword;
                        return loginInfoToken;
                    }, {});
                }
                this.loginInfo$.next(loginInfo);
            }, error => console.log("error selecting loginInfo"));

        this.numSuccessMails = 0;
        this.numFailMails = 0;
        this.successSending = -1;

        this.retrieveSettings();

    }

    ngOnDestroy() {

        (<any>$("#emaiSentNotice")).remove();

        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
        if (this.settingsSub)
            this.settingsSub.unsubscribe();

    }

    public showModal(): void {
        (<any>$("#emaiSentNotice")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#emaiSentNotice")).modal("hide");
    }

    public onHidden(): void {
        // this.isModalShown.next(false);
    }

    informUnlocatedStudents(unallocated, period) {

        this.successSending = -2;
        this.numSuccessMails = 0;
        this.numFailMails = 0;

        this._hds.informUnlocatedStudents(this.minedu_userName, this.minedu_userPassword, unallocated, period)
            .subscribe(data => {
                this.numSuccessMails = data.num_success_mail;
                this.numFailMails = data.num_fail_mail;
                this.successSending = 1;

                this.modalHeader.next("modal-header-success");
                this.modalTitle.next("Κατανομή Μαθητών");
                let txtModal = "Έγινε αποστολή " + this.numSuccessMails + " e-mails! ";
                if (this.numFailMails !== 0) {
                    this.modalHeader.next("modal-header-warning");
                    txtModal += "Κάποια e-mail δεν έχουν σταλεί. Δεν ήταν δυνατή η αποστολή " + this.numFailMails + " e-mails!";
                }
                this.modalText.next(txtModal);
                this.showModal();
            },
            error => {
                console.log("Error");
                this.successSending = 0;

                this.modalTitle.next("Κατανομή Μαθητών");
                this.modalText.next("Αποτυχία αποστολής e-mails!");
                this.modalHeader.next("modal-header-warning");
                this.showModal();
            });

    }

    retrieveSettings() {
        this.settingsSub = this._hds.retrieveAdminSettings(this.minedu_userName, this.minedu_userPassword)
            .subscribe(data => {
                this.settings$.next(data);
                this.applicantsResultsDisabled = Boolean(Number(this.settings$.value["applicantsResultsDisabled"]));

                if (this.applicantsResultsDisabled === false) {
                    this.modalTitle.next("Κατανομή Μαθητών");
                    this.modalText.next(("ΠΡΟΣΟΧΗ: Για να μπορείτε να αποστείλετε e-mail ενημέρωσης, παρακαλώ πηγαίνετε στις Ρυθμίσεις και ΕΝΕΡΓΟΠΟΙΗΣΤΕ  ") +
                        ("τη δυνατότητα της προβολής αποτελεσμάτων κατανομής από τους μαθητές."));
                    this.modalHeader.next("modal-header-warning");
                    this.showModal();
                }
            },
            error => {
                this.settings$.next([{}]);
                console.log("Error Getting MinisterRetrieveSettings");
            });
    }

}
