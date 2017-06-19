import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import {Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import {Location} from '@angular/common';

@Component({
    selector: 'submited-preview',
    template: `
    <div id="applicationDeleteConfirm" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header {{modalHeader | async}}">
              <h3 class="modal-title pull-left"><i class="fa {{modalHeaderIcon | async}}"></i>&nbsp;&nbsp;{{ modalTitle | async }}</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>{{ modalText | async }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="hideModal()">Ακύρωση</button>
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="deleteApplicationDo()">Επιβεβαίωση</button>
          </div>
        </div>
      </div>
    </div>
<div style="min-height: 500px; margin-bottom: 20px;">
    <div class = "loading" *ngIf="(showLoader$ | async) === true"></div>
         <div class="row">
             <breadcrumbs></breadcrumbs>
        </div>

            <div *ngIf="(SubmitedApplic$ | async).length > 0" class="row" style="margin: 10px 2px 10px 2px;">
                <p>Έχουν υποβληθεί οι παρακάτω δηλώσεις προτίμησης ΕΠΑΛ για το νέο σχολικό έτος.</p>
                <p>Επιλέξτε το όνομα ή το επώνυμο του μαθητή για να δείτε αναλυτικά τη δήλωσή σας και να την εκτυπώσετε σε μορφή PDF.</p>
                <p>Μπορείτε να διαγράψετε μία δήλωση επιλέγοντας το εικονίδιο δεξιά από το ονοματεπώνυμο.</p>
                <p>Επιλέξτε "Αρχική" επάνω αριστερά ή κάτω αν θέλετε να ξεκινήσετε την υποβολή νέας δήλωσης προτίμησης.</p>
            </div>
            <div *ngIf="(SubmitedApplic$ | async).length === 0" class="row" style="margin: 10px 2px 10px 2px;">
                <p>Δεν έχετε ακόμη υποβάλλει δήλωση προτίμησης ΕΠΑΛ για το νέο σχολικό έτος.</p>
                <p>Επιλέξτε "Αρχική" επάνω αριστερά ή κάτω αν θέλετε να ξεκινήσετε την υποβολή νέας δήλωσης προτίμησης.</p>
            </div>


              <div *ngIf="(SubmitedApplic$ | async).length > 0" class="row list-group-item" style="margin: 0px 2px 0px 2px; background-color: #ccc;">
                  <div class="col-md-6" style="font-size: 1em; font-weight: bold;">Επώνυμο</div>
                  <div class="col-md-5" style="font-size: 1em; font-weight: bold;">Όνομα</div>
                  <div class="col-md-1" style="font-size: 1em; font-weight: bold;">&nbsp;</div>
              </div>

              <div *ngIf="(SubmitedApplic$ | async).length > 0">
               <div class="row list-group-item isclickable"  style="margin: 0px 2px 0px 2px;"
               [class.oddout]="isOdd"
               [class.evenout]="isEven"
               [class.selectedappout]="applicationIdActive === UserData$.id"
               *ngFor="let UserData$  of SubmitedApplic$ | async; let i=index; let isOdd=odd; let isEven=even"  >
                    <div class="col-md-6" style="font-size: 0.8em; font-weight: bold;" (click)="setActiveUser(UserData$.id)">{{UserData$.studentsurname}}</div>
                    <div class="col-md-5" style="font-size: 0.8em; font-weight: bold;" (click)="setActiveUser(UserData$.id)">{{UserData$.name}}</div>
                    <div *ngIf="UserData$.candelete === 1" class="col-md-1" style="font-size: 1em; font-weight: bold;"><i class="fa fa-trash isclickable" (click)="deleteApplication(UserData$.id)"></i></div>
                    <div *ngIf="UserData$.candelete === 0" class="col-md-1" style="font-size: 1em; font-weight: bold;">&nbsp;</div>

                    <div style="width: 100%">
                  <div *ngFor="let StudentDetails$  of SubmitedDetails$ | async" [hidden]="UserData$.id !== applicationIdActive" style="margin: 10px 10px 10px 10px;">

                  <div *ngFor="let StudentResult$  of StudentResults$ | async">
                    <div *ngIf = "StudentResult$.applicantsResultsDisabled == '0'" >
                      <div *ngIf = "StudentResult$.status == '1'" >
                        <div class="col-md-12" style="font-size: 1.0em; color: #a52a2a;">
                          Η αίτησή σας ικανοποιήθηκε. Έχετε επιλεγεί για να εγγραφείτε στο {{StudentResult$.schoolName}}.
                          Παρακαλώ να προσέλθετε ΑΜΕΣΑ στο σχολείο για να προχωρήσει η διαδικασία εγγραφής σας σε αυτό, επισυνάπτοντας τα απαραίτητα δικαιολογητικά.
                          Διεύθυνση σχολείου: {{StudentResult$.schoolAddress}}, Τηλέφωνο σχολείου: {{StudentResult$.schoolTel}}<br><br>
                        </div>
                      </div>

                      <div *ngIf = "StudentResult$.status != '1'" >
                        <div class="col-md-12" style="font-size: 1.0em; color: #a52a2a;">
                          Η αίτησή σας δεν ήταν δυνατό να ικανοποιηθεί. Παρακαλώ επικοινωνήστε άμεσα τηλεφωνικά με τη Διεύθυνση Δευτεροβάθμιας Εκπαίδευσης στην οποία ανήκετε,
                          προκειμένου να διερευνηθεί εκ νέου η δυνατότητα εγγραφής σας.<br><br>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Αριθμός Δήλωσης Προτίμησης ΕΠΑΛ</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.applicationId}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Υποβλήθηκε</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.created}}</div>
                  </div>
                  <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία αιτούμενου</div>
                  </div>

                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.guardian_name}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.guardian_surname}}</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα πατέρα</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.guardian_fathername }}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα μητέρας</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.guardian_mothername }}</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Διεύθυνση</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.regionaddress}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">ΤΚ - Πόλη</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.regiontk}} - {{StudentDetails$.regionarea}}</div>
                  </div>

                  <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία μαθητή</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα μαθητή</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.name}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο μαθητή</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.studentsurname}}</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα Πατέρα</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.fatherfirstname}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα Μητέρας</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.motherfirstname}}</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Ημερομηνία Γέννησης</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.birthdate}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Τηλέφωνο Επικοινωνίας</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.telnum}}</div>
                  </div>

                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Σχολείο τελευταίας φοίτησης</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolname}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Σχολικό έτος τελευταίας φοίτησης</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolyear}}</div>
                  </div>

                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Τάξη τελευταίας φοίτησης</div>
                      <div *ngIf="StudentDetails$.lastschool_class === '1'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Α</div>
                      <div *ngIf="StudentDetails$.lastschool_class === '2'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Β</div>
                      <div *ngIf="StudentDetails$.lastschool_class === '3'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Γ</div>
                      <div *ngIf="StudentDetails$.lastschool_class === '4'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Δ</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Δήλωση από:</div>
                      <div class="col-md-9" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.relationtostudent }}</div>
                  </div>
                  <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center">Επιλεχθέντα Σχολεία</div>
                  </div>
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Τάξη φοίτησης για το νέο σχολικό έτος</div>
                      <div *ngIf="StudentDetails$.currentclass === '1'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Α</div>
                      <div *ngIf="StudentDetails$.currentclass === '2'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Β</div>
                      <div *ngIf="StudentDetails$.currentclass === '3'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Γ</div>
                      <div *ngIf="StudentDetails$.currentclass === '4'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Δ</div>
                  </div>

                  <div *ngIf="StudentDetails$.currentclass === '2'" class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Τομέας φοίτησης για το νέο σχολικό έτος</div>
                      <div class="col-md-9" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.currentsector}}</div>
                  </div>
                  <div *ngIf="StudentDetails$.currentclass === '3' || StudentDetails$.currentclass === '4'" class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Ειδικότητα φοίτησης για το νέο σχολικό έτος</div>
                      <div class="col-md-9" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.currentcourse}}</div>
                  </div>

                    <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                        <div class="col-md-6" style="font-size: 1em; font-weight: bold; text-align: center;">Σειρά Προτίμησης</div>
                        <div class="col-md-6" style="font-size: 1em; font-weight: bold;">Επιλογή ΕΠΑΛ</div>
                    </div>

                    <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;" *ngFor="let epalChoices$  of EpalChosen$ | async; let i=index; let isOdd=odd; let isEven=even" [hidden]="UserData$.id !== applicationIdActive">
                        <div class="col-md-6" style="font-size: 0.8em; font-weight: bold; text-align: center;">{{epalChoices$.choice_no}}</div>
                        <div class="col-md-6" style="font-size: 0.8em; font-weight: bold;">{{epalChoices$.epal_id}}</div>
                    </div>

                    <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
                        <!--
                        <div class="col-md-6">
                            <button type="button" class="btn-primary btn-lg pull-left isclickable" style="width: 10em;" (click)="showResults()" [hidden] = "StudentDetails$.applicantsResultsDisabled == '0'">
                                <span style="font-size: 0.9em; font-weight: bold;">Αποτελέσματα</span>
                            </button>
                        </div>
                        -->
                        <div class="col-md-12">
                            <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 10em;" (click)="createPdfServerSide()">
                                <span style="font-size: 0.9em; font-weight: bold;">Εκτύπωση(PDF)&nbsp;&nbsp;&nbsp;</span>
                            </button>
                        </div>
                    </div>

                    </div>
                </div>

              </div>
              </div>

              <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
                  <div class="col-md-6">
                      <button type="button" class="btn-primary btn-lg pull-left isclickable" style="width: 9em;" (click)="goBack()" >
                          <span style="font-size: 0.9em; font-weight: bold;">Επιστροφή</span>
                      </button>
                  </div>
                  <div class="col-md-6">
                      <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="goHome()" >
                          <span style="font-size: 0.9em; font-weight: bold;">Αρχική</span>
                      </button>
                  </div>
              </div>

              </div>

   `
})

@Injectable() export default class SubmitedPreview implements OnInit, OnDestroy {

    private SubmitedApplic$: BehaviorSubject<any>;
    private SubmitedUsersSub: Subscription;
    private SubmitedDetails$: BehaviorSubject<any>;
    private SubmitedDetailsSub: Subscription;
    private EpalChosen$: BehaviorSubject<any>;
    private EpalChosenSub: Subscription;
    private incomeChosen$: BehaviorSubject<any>;
    private incomeChosenSub: Subscription;
    private CritirioChosen$: BehaviorSubject<any>;
    private CritirioChosenSub: Subscription;
    private StudentResults$: BehaviorSubject<any>;
    private StudentResultsSub: Subscription;
    private showLoader$: BehaviorSubject<boolean>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private modalHeaderIcon: BehaviorSubject<string>;
    public isModalShown: BehaviorSubject<boolean>;
    private applicationIdActive = <number>-1;

    public StudentId;
    private applicationId = <number>0;

    @ViewChild('target') element: ElementRef;

    constructor(private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private loc: Location
    ) {
        this.SubmitedApplic$ = new BehaviorSubject([{}]);
        this.SubmitedDetails$ = new BehaviorSubject([{}]);
        this.EpalChosen$ = new BehaviorSubject([{}]);
        this.CritirioChosen$ = new BehaviorSubject([{}]);
        this.incomeChosen$ = new BehaviorSubject([{}]);
        this.showLoader$ = new BehaviorSubject(false);
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.modalHeaderIcon = new BehaviorSubject("");
        this.isModalShown = new BehaviorSubject(false);
        this.StudentResults$ = new BehaviorSubject([{}]);

    }

    ngOnDestroy() {
        (<any>$('#studentFormSentNotice')).remove();
        if (this.SubmitedUsersSub)
            this.SubmitedUsersSub.unsubscribe();
        if (this.SubmitedDetailsSub)
            this.SubmitedDetailsSub.unsubscribe();
        if (this.EpalChosenSub)
            this.EpalChosenSub.unsubscribe();
        if (this.CritirioChosenSub)
            this.CritirioChosenSub.unsubscribe();
        if (this.incomeChosenSub)
            this.incomeChosenSub.unsubscribe();
        if (this.StudentResultsSub)
            this.StudentResultsSub.unsubscribe();

        this.SubmitedDetails$.unsubscribe();
        this.EpalChosen$.unsubscribe();
        this.SubmitedApplic$.unsubscribe();
        this.StudentResults$.unsubscribe();

    }

    ngOnInit() {

        (<any>$('#applicationDeleteConfirm')).appendTo("body");
        this.showLoader$.next(true);

        this.SubmitedUsersSub = this._hds.getSubmittedPreviw().subscribe(
            data => {
                this.SubmitedApplic$.next(data);
                this.showLoader$.next(false);
            },
            error => {
                this.SubmitedApplic$.next([{}]);
                this.showLoader$.next(false);
                console.log("Error Getting Schools");
            });
    }


    setActiveUser(ind: number): void {
        if (ind === this.applicationIdActive) {
            this.applicationIdActive = 0;
            return;
        }
        this.applicationIdActive = ind;
        this.showLoader$.next(true);

        this.SubmitedDetailsSub = this._hds.getStudentDetails(this.applicationIdActive).subscribe(data => {
            this.SubmitedDetails$.next(data);
            this.showLoader$.next(false);
        },
            error => {
                this.SubmitedDetails$.next([{}]);
                console.log("Error Getting Schools");
                this.showLoader$.next(false);
            });


        this.EpalChosenSub = this._hds.getEpalchosen(this.applicationIdActive).subscribe(data => {
            this.EpalChosen$.next(data);
        },
            error => {
                this.EpalChosen$.next([{}]);
                console.log("Error Getting Schools");
            });

        this.StudentResultsSub = this._hds.showResults(this.applicationIdActive).subscribe(data => {
            this.StudentResults$.next(data);
            this.showLoader$.next(false);
        },
            error => {
                this.StudentResults$.next([{}]);
                console.log("Error Getting Results");
                this.showLoader$.next(false);
            });

    }

    createPdfServerSide() {
        this._hds.createPdfServerSide(this.applicationIdActive);
    }


    /*
    showResults() {

        this.StudentResultsSub = this._hds.showResults(this.applicationIdActive).subscribe(data => {
            this.StudentResults$.next(data);
            this.showLoader$.next(false);
        },
            error => {
                this.StudentResults$.next([{}]);
                console.log("Error Getting Results");
                this.showLoader$.next(false);
            });

    }
    */

    deleteApplication(appId: number): void {
        this.modalTitle.next("Διαγραφή Δήλωσης Προτίμησης ΕΠΑΛ");
        this.modalText.next("Επιλέξατε να διαγράψετε τη δήλωση προτίμησης ΕΠΑΛ. Παρακαλούμε επιλέξτε Επιβεβαίωση");
        this.modalHeader.next("modal-header-danger");
        this.modalHeaderIcon.next("fa-close");
        this.applicationId = appId;
        this.showModal();
    }

    deleteApplicationDo(): void {
        this.hideModal();
        this.showLoader$.next(true);
        this._hds.deleteApplication(this.applicationId).then(data => {
            this.SubmitedUsersSub.unsubscribe();

            this.SubmitedUsersSub = this._hds.getSubmittedPreviw().subscribe(
                data => {
                    this.SubmitedApplic$.next(data);
                    this.showLoader$.next(false);
                },
                error => {
                    this.SubmitedApplic$.next([{}]);
                    this.showLoader$.next(false);
                    console.log("Error Getting Schools");
                });

        }).catch(err => {
            this.showLoader$.next(false);
            this.modalTitle.next("Αποτυχία Διαγραφής Δήλωσης Προτίμησης ΕΠΑΛ");
            this.modalText.next("Η δήλωσή σας δεν διαγράφηκε. Δεν μπορείτε να διαγράψετε τη δήλωσή σας αυτή την περίοδο");
            this.modalHeader.next("modal-header-danger");
            this.modalHeaderIcon.next("fa-ban");
            this.showModal();
            console.log(err);
        });
    }

    public showModal(): void {
        (<any>$('#applicationDeleteConfirm')).modal('show');
    }

    public hideModal(): void {
        (<any>$('#applicationDeleteConfirm')).modal('hide');
    }

    public onHidden(): void {
        this.isModalShown.next(false);
    }

    public goBack(): void {
        this.loc.back();

    }

    public goHome(): void {
        this.router.navigate(['']);
    }

}
