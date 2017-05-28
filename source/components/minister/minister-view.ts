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
    selector: 'minister-view',
    template: `

    <h5> >Κατανομή <br></h5>
    <!--
    <div class="row">
         <breadcrumbs></breadcrumbs>
    </div>
    -->

    <div
      class = "loading" *ngIf=" distStatus === 'STARTED'" >
    </div>


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
      <!--
      <form [formGroup]="formGroup"  #form>
      -->


        <div class="col-md-6">
          <button type="submit" class="btn btn-lg btn-block"  *ngIf="(loginInfo$ | async).size !== 0"  (click)="runDistribution()" [disabled] = "!capacityDisabled" >
              Εκτέλεση  Κατανομής  Μαθητών<span class="glyphicon glyphicon-menu-right"></span>
          </button>
        </div>

    </div>

   `
})

@Injectable() export default class MinisterView implements OnInit, OnDestroy {

    //public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private settings$: BehaviorSubject<any>;
    loginInfoSub: Subscription;
    private settingsSub: Subscription;

    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private capacityDisabled: boolean;
    private directorViewDisabled: boolean;

    constructor(/*private fb: FormBuilder,*/
      //  private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          //this.formGroup = this.fb.group({

          //});

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          this.modalTitle =  new BehaviorSubject("");
          this.modalText =  new BehaviorSubject("");
          this.modalHeader =  new BehaviorSubject("");
          this.settings$ = new BehaviorSubject([{}]);

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


    /*
    public showModal():void {
        console.log("about to show modal");
        (<any>$('#distributionSentNotice')).modal('show');
    }

    public hideModal():void {
        (<any>$('#distributionSentNotice')).modal('hide');
    }

    public onHidden():void {
        //this.isModalShown.next(false);
    }
    */


    ngOnDestroy() {

      (<any>$('#distributionWaitingNotice')).remove();
      (<any>$('#distributionNotice')).remove();
      //(<any>$('#distributionFailureNotice')).remove();
      //(<any>$('#distributionSentNotice')).remove();
      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      if (this.settingsSub)
        this.settingsSub.unsubscribe();
        if (this.loginInfo$)
          this.loginInfo$.unsubscribe();
        if (this.settings$)
          this.settings$.unsubscribe();
    }

    ngOnInit() {

      (<any>$('#distributionWaitingNotice')).appendTo("body");
      (<any>$('#distributionNotice')).appendTo("body");
      //(<any>$('#distributionFailureNotice')).appendTo("body");
      //(<any>$('#distributionSentNotice')).appendTo("body");


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

      this.retrieveSettings();

    }


    runDistribution() {
      this.distStatus = "STARTED";

      this.showModal("#distributionWaitingNotice");

      this._hds.makeDistribution(this.minedu_userName, this.minedu_userPassword)

      .then(msg => {
          //console.log("Nikos2");

          this.modalTitle.next("Κατανομή Μαθητών");
          this.modalText.next("Η κατανομή ολοκληρώθηκε με επιτυχία!");
          this.modalHeader.next("modal-header-success");
          this.showModal("#distributionNotice");

          if (this.distStatus !== "ERROR")
            this.distStatus = "FINISHED";
      })
      .catch(err => {console.log(err);
          //console.log("Nikos1");
          //console.log(err);
          this.distStatus = "ERROR";

          this.modalTitle.next("Κατανομή Μαθητών");
          this.modalText.next("Αποτυχία κατανομής. Προσπαθήστε ξανά. Σε περίπτωση που το πρόβλημα παραμένει, παρακαλώ επικοινωνήστε με το διαχειριστή του συστήματος.");
          this.modalHeader.next("modal-header-danger");
          this.showModal("#distributionNotice");
        });
    }


    retrieveSettings()  {

      //this.dataRetrieved = -1;

      this.settingsSub = this._hds.retrieveAdminSettings(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
           this.settings$.next(data);
       },
         error => {
           this.settings$.next([{}]);
           //this.dataRetrieved = 0;
           console.log("Error Getting MinisterRetrieveSettings");
         },
         () => {
           console.log("Success Getting MinisterRetrieveSettings");

           this.capacityDisabled = Boolean(Number(this.settings$.value['capacityDisabled']));
           this.directorViewDisabled = Boolean(Number(this.settings$.value['directorViewDisabled']));

           console.log("Debugging..");
           console.log(this.capacityDisabled);

           if (this.capacityDisabled == false) {
             this.modalTitle.next("Κατανομή Μαθητών");
             this.modalText.next(("ΠΡΟΣΟΧΗ: Για να μπορείτε να εκτελέσετε την κατανομή, παρακαλώ πηγαίνετε στις Ρυθμίσεις και ΑΠΕΝΕΡΓΟΠΟΙΗΣΤΕ  ") +
                                 ("τη δυνατότητα των Διευθυντών να τροποποιούν τη χωρητικότητα του σχολείου τους.") );
             this.modalHeader.next("modal-header-warning");
             this.showModal("#distributionNotice");
           }
           else if (this.directorViewDisabled == false) {
             this.modalTitle.next("Κατανομή Μαθητών");
             this.modalText.next(("ΠΡΟΣΟΧΗ: Για να μπορείτε να εκτελέσετε την κατανομή, παρακαλώ πηγαίνετε στις Ρυθμίσεις και ΑΠΕΝΕΡΓΟΠΟΙΗΣΤΕ  ") +
                                 ("τη δυνατότητα των Διευθυντών της προβολής κατανομής των μαθητών του σχολείου τους.") );
             this.modalHeader.next("modal-header-warning");
             this.showModal("#distributionNotice");
           }


           //this.dataRetrieved = 1;
         }
       )

    }



}
