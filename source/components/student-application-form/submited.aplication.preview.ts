import { Component, OnInit, OnDestroy,ElementRef, ViewChild} from "@angular/core";
let jsPDF = require('jspdf');
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import {Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';

import { API_ENDPOINT, API_ENDPOINT_PARAMS } from '../../app.settings';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';


@Component({
    selector: 'submited-preview',
    template: `



    <div class = "loading" *ngIf="(showLoader$ | async) === true"></div>
         <div class="row">
             <breadcrumbs></breadcrumbs>
        </div>
            Έχει υποβληθεί αίτηση για εγγραφή στην Επαγγελματική Εκπαίδευση των παρακάτω ατόμων:

              <!-- <ul class="list-group main-view"> -->

              <div class="row" style="margin: 0px 2px 0px 2px; line-height: 2em; background-color: #ccc;">
                  <div class="col-md-6" style="font-size: 1em; font-weight: bold;">Επώνυμο</div>
                  <div class="col-md-6" style="font-size: 1em; font-weight: bold; text-align: center;">Όνομα</div>
              </div>

               <div class="row isclickable"  style="margin: 0px 2px 0px 2px; line-height: 2em;"
               [class.oddout]="isOdd"
               [class.evenout]="isEven"
               (click)="setActiveUser(UserData$.id)"
               [class.selectedout]="userActive === UserData$.id"
               *ngFor="let UserData$  of SubmitedApplic$ | async; let i=index; let isOdd=odd; let isEven=even"  >
                    <div class="col-md-6" style="font-size: 0.8em; font-weight: bold;">{{UserData$.studentsurname}}</div>
                    <div class="col-md-6" style="font-size: 0.8em; font-weight: bold; text-align: center;">{{UserData$.name}}</div>


<!--                 <li class="list-group-item isclickable" [class.oddout]="isOdd"
                 [class.evenout]="isEven" (click)="setActiveUser(UserData$.id)" [class.selectedout]="userActive === UserData$.id" >
                  <h5> {{UserData$.name}}&nbsp;{{UserData$.studentsurname}} </h5>
                 </li>  -->
<!--                 <div style="margin 5px 50px 5px 50px;"> -->

                  <div *ngFor="let StudentDetails$  of SubmitedDetails$ | async" [hidden]="UserData$.id !== userActive" style="margin: 30px 30px 30px 30px;">
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
                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Όνομα μαθητή</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.name}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο μαθητή</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.studentsurname}}</div>
                  </div>
                  <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία μαθητή</div>
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
                      <div class="col-md-3" style="font-size: 0.8em;">Τύπος απολυτηρίου</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.certificatetype}}</div>
                  </div>

                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Έτος κτήσης απολυτηρίου</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.graduation_year}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Σχολείο τελευταίας φοίτησης</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolname}}</div>
                  </div>

                  <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                      <div class="col-md-3" style="font-size: 0.8em;">Σχολικό έτος τελευταίας φοίτησης</div>
                      <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolyear}}</div>
                      <div class="col-md-3" style="font-size: 0.8em;">Τάξη τελευταίας φοίτησης</div>
                      <div *ngIf="StudentDetails$.lastschool_class === 1" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Α'</div>
                      <div *ngIf="StudentDetails$.lastschool_class === 2" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Β'</div>
                      <div *ngIf="StudentDetails$.lastschool_class === 3" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Γ'</div>
                      <div *ngIf="StudentDetails$.lastschool_class === 4" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Δ'</div>
                  </div>

                    <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                        <div class="col-md-6" style="font-size: 1em; font-weight: bold;">Επιλογή ΕΠΑΛ</div>
                        <div class="col-md-6" style="font-size: 1em; font-weight: bold; text-align: center;">Σειρά Προτίμησης</div>
                    </div>

                    <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;" *ngFor="let epalChoices$  of EpalChosen$ | async; let i=index; let isOdd=odd; let isEven=even" [hidden]="UserData$.id !== userActive">
                        <div class="col-md-6" style="font-size: 0.8em; font-weight: bold;">{{epalChoices$.epal_id}}</div>
                        <div class="col-md-6" style="font-size: 0.8em; font-weight: bold; text-align: center;">{{epalChoices$.choice_no}}</div>
                    </div>

                    </div>
              </div>
<!--              </div>  -->


            <button type="button" (click)="createPdfServerSide()">Εξαγωγή σε PDF</button>

   `
})

@Injectable() export default class SubmitedPreview implements OnInit , OnDestroy{

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
    private showLoader$: BehaviorSubject<boolean>;

    private data;
    private authToken: string;
    private role: string;


    public StudentId;
    private userActive = <number>-1;

  @ViewChild('target') element: ElementRef;

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _hds: HelperDataService,
                private activatedRoute: ActivatedRoute,
                private router: Router ,
                private fb: FormBuilder,
              )
    {
       this.SubmitedApplic$ = new BehaviorSubject([{}]);
       this.SubmitedDetails$ = new BehaviorSubject([{}]);
       this.EpalChosen$ = new BehaviorSubject([{}]);
       this.CritirioChosen$ = new BehaviorSubject([{}]);
       this.incomeChosen$ = new BehaviorSubject([{}]);
       this.showLoader$ = new BehaviorSubject(false);

    }

    ngOnDestroy()
    {
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

        this.SubmitedDetails$.unsubscribe();
        this.EpalChosen$.unsubscribe();
        this.SubmitedApplic$.unsubscribe();

    }

    ngOnInit() {


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
            },
            () => {
                console.log("Getting Schools")
                this.showLoader$.next(false);
            });

    }


  setActiveUser(ind: number): void
  {
      ind = +ind;
      if (ind === this.userActive){
        ind = -1;
        return;
      }
      ind--;
      this.userActive = ind+1 ;
      this.showLoader$.next(true);
      this.SubmitedDetailsSub = this._hds.getStudentDetails(this.userActive+1).subscribe(data => {
          this.SubmitedDetails$.next(data);
          this.showLoader$.next(false);
    },
            error => {
                this.SubmitedDetails$.next([{}]);
                console.log("Error Getting Schools");
                this.showLoader$.next(false);
            },
             () => {
                 console.log("Getting Schools");
                 this.showLoader$.next(false);
             });
      this.EpalChosenSub = this._hds.getEpalchosen(this.userActive+1).subscribe(data => {
        this.EpalChosen$.next(data)},
            error => {
                this.EpalChosen$.next([{}]);
                console.log("Error Getting Schools");
            },
             () => console.log("Getting Schools"));
   }

createPdfServerSide()
{


    this._hds.createPdfServerSide(this.authToken, this.role);


    /*
    this._hds.createPdfServerSide(this.authToken, this.role)
    .then(msg => {
        //console.log("Nikos2");
    })
    .catch(err => {console.log(err);
        //console.log("Nikos1");
        console.log(err);
      });
      */


}



}
