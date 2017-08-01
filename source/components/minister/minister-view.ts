import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import { Observable} from "rxjs/Observable";
import { Http, Headers, RequestOptions} from "@angular/http";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "../../store/store";
import { Router, ActivatedRoute, Params} from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { ILoginInfoRecords } from "../../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";


import { API_ENDPOINT } from "../../app.settings";

@Component({
    selector: "minister-view",
    template: `

    <h5> >Κατανομή <br></h5>

    <div
      class = "loading" *ngIf=" distStatus === 'STARTED'" >
    </div>

    <div style="min-height: 400px;">

    <div id="distributionNotice" (onHidden)="onHidden()" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
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

    <div id="distributionWaitingNotice" (onHidden)="onHidden('#distributionWaitingNotice')" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-warning">
            <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Κατανομή μαθητών</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#distributionWaitingNotice')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Παρακαλώ περιμένετε...Η εκτέλεση της κατανομής ενδέχεται να <strong>διαρκέσει μερικά λεπτά</strong>.
            Παρακαλώ <strong>μην</strong> εκτελείτε οποιαδήποτε <strong>ενέργεια μετακίνησης</strong> στον φυλλομετρητή σας, μέχρι να ολοκληρωθεί η κατανομή.
            Παρακαλώ κλείστε αυτό το μήνυμα μόλις το διαβάσετε.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>

    <br><br>
    <div>
        <div class="col-md-6">
          <button type="submit" class="btn btn-lg btn-block"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="runDistribution()" [disabled] = "!capacityDisabled || secondPeriodEnabled" >
              Εκτέλεση  Κατανομής  Μαθητών<span class="glyphicon glyphicon-menu-right"></span>
          </button>
        </div>
        <br>

        <div class="col-md-6">
          <button type="submit" class="btn btn-lg btn-block"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="runDistributionSecondPeriod()" [disabled] = "!secondPeriodEnabled" >
              Τοποθέτηση Μαθητών Β' Περιόδου<span class="glyphicon glyphicon-menu-right"></span>
          </button>
        </div>

    </div>

    </div>

   `
})

@Injectable() export default class MinisterView implements OnInit, OnDestroy {

    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private settings$: BehaviorSubject<any>;
    private loginInfoSub: Subscription;
    private settingsSub: Subscription;

    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private capacityDisabled: boolean;
    private directorViewDisabled: boolean;
    private applicantsResultsDisabled: boolean;
    private secondPeriodEnabled: boolean;

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

    public showModal(popupMsgId): void {
        (<any>$(popupMsgId)).modal("show");
    }

    public hideModal(popupMsgId): void {
        (<any>$(popupMsgId)).modal("hide");
    }

    public onHidden(popupMsgId): void {

    }

    ngOnDestroy() {
        (<any>$("#distributionWaitingNotice")).remove();
        (<any>$("#distributionNotice")).remove();
        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
        if (this.settingsSub)
            this.settingsSub.unsubscribe();
    }

    ngOnInit() {
        (<any>$("#distributionWaitingNotice")).appendTo("body");
        (<any>$("#distributionNotice")).appendTo("body");
        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoObj) => {
                        this.minedu_userName = loginInfoObj.minedu_username;
                        this.minedu_userPassword = loginInfoObj.minedu_userpassword;
                        return loginInfoObj;
                    }, {});
                }
                this.loginInfo$.next(loginInfo);
            }, error => console.log("error selecting loginInfo"));

        this.retrieveSettings();
    }


    runDistribution() {
        this.distStatus = "STARTED";
        this.showModal("#distributionWaitingNotice");
        this._hds.makeDistribution(this.minedu_userName, this.minedu_userPassword)
            .then(msg => {
                this.modalTitle.next("Κατανομή Μαθητών");
                this.modalText.next("Η κατανομή ολοκληρώθηκε με επιτυχία!");
                this.modalHeader.next("modal-header-success");
                this.showModal("#distributionNotice");

                if (this.distStatus !== "ERROR")
                    this.distStatus = "FINISHED";
            })
            .catch(err => {
                console.log(err);
                this.distStatus = "ERROR";

                this.modalTitle.next("Κατανομή Μαθητών");
                this.modalText.next("Αποτυχία κατανομής. Προσπαθήστε ξανά. Σε περίπτωση που το πρόβλημα παραμένει, παρακαλώ επικοινωνήστε με το διαχειριστή του συστήματος.");
                this.modalHeader.next("modal-header-danger");
                this.showModal("#distributionNotice");
            });
    }

    runDistributionSecondPeriod() {

        this.distStatus = "STARTED";

        this.showModal("#distributionWaitingNotice");

        this._hds.makeDistributionSecondPeriod(this.minedu_userName, this.minedu_userPassword)
            .then(msg => {
                this.modalTitle.next("Τοποθέτηση Μαθητών 2ης Περιόδου Αιτήσεων");
                this.modalText.next("Η τοποθέτηση μαθητών της δεύτερης περιόδου αιτήσεων ολοκληρώθηκε με επιτυχία!");
                this.modalHeader.next("modal-header-success");
                this.showModal("#distributionNotice");

                if (this.distStatus !== "ERROR")
                    this.distStatus = "FINISHED";
            })
            .catch(err => {
                console.log(err);
                this.distStatus = "ERROR";

                this.modalTitle.next("Τοποθέτηση Μαθητών 2ης Περιόδου Αιτήσεων");
                this.modalText.next("Αποτυχία τοποθέτησης. Προσπαθήστε ξανά. Σε περίπτωση που το πρόβλημα παραμένει, παρακαλώ επικοινωνήστε με το διαχειριστή του συστήματος.");
                this.modalHeader.next("modal-header-danger");
                this.showModal("#distributionNotice");
            });

    }

    retrieveSettings() {

        this.settingsSub = this._hds.retrieveAdminSettings(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
            this.settings$.next(data);
            this.capacityDisabled = Boolean(Number(this.settings$.value["capacityDisabled"]));
            this.directorViewDisabled = Boolean(Number(this.settings$.value["directorViewDisabled"]));
            this.applicantsResultsDisabled = Boolean(Number(this.settings$.value["applicantsResultsDisabled"]));

            this.secondPeriodEnabled = Boolean(Number(this.settings$.value["secondPeriodEnabled"]));

            if (this.capacityDisabled === false) {
                this.modalTitle.next("Κατανομή Μαθητών");
                this.modalText.next(("ΠΡΟΣΟΧΗ: Για να μπορείτε να εκτελέσετε την κατανομή, παρακαλώ πηγαίνετε στις Ρυθμίσεις και ΑΠΕΝΕΡΓΟΠΟΙΗΣΤΕ  ") +
                    ("τη δυνατότητα των Διευθυντών να τροποποιούν τη χωρητικότητα του σχολείου τους."));
                this.modalHeader.next("modal-header-warning");
                this.showModal("#distributionNotice");
            }
            else if (this.directorViewDisabled === false) {
                this.modalTitle.next("Κατανομή Μαθητών");
                this.modalText.next(("ΠΡΟΣΟΧΗ: Για να μπορείτε να εκτελέσετε την κατανομή, παρακαλώ πηγαίνετε στις Ρυθμίσεις και ΑΠΕΝΕΡΓΟΠΟΙΗΣΤΕ  ") +
                    ("τη δυνατότητα των Διευθυντών της προβολής κατανομής των μαθητών του σχολείου τους."));
                this.modalHeader.next("modal-header-warning");
                this.showModal("#distributionNotice");
            }
            else if (this.applicantsResultsDisabled === false) {
                this.modalTitle.next("Κατανομή Μαθητών");
                this.modalText.next(("ΠΡΟΣΟΧΗ: Για να μπορείτε να εκτελέσετε την κατανομή, παρακαλώ πηγαίνετε στις Ρυθμίσεις και ΑΠΕΝΕΡΓΟΠΟΙΗΣΤΕ  ") +
                    ("τη δυνατότητα της προβολής αποτελεσμάτων κατανομής από τους μαθητές."));
                this.modalHeader.next("modal-header-warning");
                this.showModal("#distributionNotice");
            }
        },
            error => {
                this.settings$.next([{}]);
                console.log("Error Getting MinisterRetrieveSettings");
            });
    }

}
