import { Component, OnInit, OnDestroy } from "@angular/core";
import {Location} from '@angular/common';
import { Injectable } from "@angular/core";
import { VALID_EMAIL_PATTERN, VALID_NAMES_PATTERN } from '../../constants';
import {Router} from "@angular/router";
import { BehaviorSubject, Subscription, Observable } from 'rxjs/Rx';
import { HelperDataService } from '../../services/helper-data-service';
import { ILoginInfo, ILoginInfoToken } from "../../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { NgRedux, select } from "ng2-redux";
import { IAppState } from "../../store/store";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';



@Component({
    selector: 'helpdesk',
    template: `
        <div class = "loading" *ngIf="(showLoader | async) === true"></div>
        <p align="left"><strong>Ηλεκτρονικές δηλώσεις προτίμησης ΕΠΑΛ για το νέο σχολικό έτος</strong></p>
        <p align="left">
        Σε περίπτωση που αντιμετωπίζετε οποιοδήποτε πρόβλημα με την καταχώριση της αίτησής σας, παρακαλούμε να
         συμπληρώσετε την παρακάτω φόρμα.


      <p align="left"><strong> Φόρμα Επικοινωνίας </strong></p>

    <form [formGroup]="formGroup">

    <div class="form-group">
  <div *ngFor="let loginInfoRow$ of loginInfo$ | async; let i=index;" style="margin-bottom: 20px;">
     <label for="userEmail">Email Επικοινωνίας(<span style="color: #ff0000;">*</span>)</label>
        <input #userEmail class="form-control" type="text" formControlName="userEmail" >
    </div>
    <div class="alert alert-danger" *ngIf="formGroup.get('userEmail').touched && formGroup.get('userEmail').hasError('required') ">
        Το πεδίο δεν μπορεί να αφεθεί κενό!
    </div>
    <div class="alert alert-danger" *ngIf="formGroup.get('userEmail').hasError('pattern')">
        Πληκτρολογήστε ένα σωστό συντακτικά email!
    </div>
    </div>

    <div class="form-group">
        <label for="userName">Όνομα(<span style="color: #ff0000;">*</span>)</label>
        <input class="form-control" type="text" formControlName="userName" >
        <div class="alert alert-danger" *ngIf="formGroup.get('userName').touched && formGroup.get('userName').hasError('required') ">
            Το πεδίο δεν μπορεί να αφεθεί κενό!
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('userName').hasError('pattern')">
            Πληκτρολογήστε το όνομά σας!
        </div>
    </div>
    <div class="form-group">
        <label for="userSurname">Επώνυμο(<span style="color: #ff0000;">*</span>)</label>
        <input class="form-control" type="text" formControlName="userSurname" >
        <div class="alert alert-danger" *ngIf="formGroup.get('userSurname').touched && formGroup.get('userSurname').hasError('required') ">
            Το πεδίο δεν μπορεί να αφεθεί κενό!
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('userSurname').hasError('pattern')">
            Πληκτρολογήστε το επώνυμό σας!
        </div>
    </div>

       <div class="form-group">
        <label for="userMessage">Μύνημα(<span style="color: #ff0000;">*</span>)</label>
        <textarea style="height: 150px;" class="form-control" type="text" formControlName="userMessage"></textarea>
        <div class="alert alert-danger" *ngIf="formGroup.get('userMessage').touched && formGroup.get('userMessage').hasError('required') ">
            Το πεδίο δεν μπορεί να αφεθεί κενό!
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('userMessage').hasError('pattern')">
            Πληκτρολογήστε ενα μήνυμα!
        </div>
    </div>


    <div class="row" style="margin-top: 30px; margin-bottom: 30px;">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left isclickable" style="width: 9em;" (click)="goBack()" >
                <span style="font-size: 0.9em; font-weight: bold;">Επιστροφή</span>
            </button>
        </div>
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 10em;" (click)="sendmail()" >
                <span style="font-size: 0.9em; font-weight: bold;">Αποστολή email </span>
            </button>
        </div>
    </div>

        <p style="text-align: left, font-size: 0.9em;">
      <strong>Τηλ. Επικοινωνίας:</strong> 2103443014, 2103442231, 2103443359, 2103442034, 2103443309 (ώρες: 8:00 - 16:00)</p>


  <div id="mailsent" (onHidden)="onHidden('#mailsent')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-success">
            <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Επιτυχής αποστολή μηνύματος</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#mailsent')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Το μήνυμά σας αποστάλθηκε. Θα μελετήσουμε το αίτημά σας και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="goBack()">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
<div id="dangermodal" (onHidden)="onHidden('#dangermodal')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
            <h3 class="modal-title pull-left"><i class="fa fa-ban"></i>&nbsp;&nbsp;Αποτυχία αποστολής μηνύματος</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#dangermodal')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Πρόβλημα επικοινωνίας! Παρακαλούμε προσπαθήστε πάλι αργότερα.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>

    <div id="fillfields" (onHidden)="onHidden('#fillfields')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
            <h3 class="modal-title pull-left"><i class="fa fa-ban"></i>&nbsp;&nbsp;Αποτυχία αποστολής μηνύματος</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#fillfields')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Παρακαλούμε συμπληρώστε όλα τα υποχρεωτικά πεδία!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
</form>


   `
})

@Injectable() export default class HelpDesk implements OnInit, OnDestroy {


    public formGroup: FormGroup;
    private emailSent: BehaviorSubject<boolean>;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    private showLoader: BehaviorSubject<boolean>;

    constructor(private fb: FormBuilder,
        private hds: HelperDataService,
        private _ngRedux: NgRedux<IAppState>,
        private loc: Location) {
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.showLoader = new BehaviorSubject(false);
        this.formGroup = fb.group({
            userEmail: ['', [Validators.pattern(VALID_EMAIL_PATTERN), Validators.required]],
            userName: ['', [Validators.pattern(VALID_NAMES_PATTERN), Validators.required]],
            userSurname: ['', [Validators.pattern(VALID_NAMES_PATTERN), Validators.required]],
            userMessage: ['', [Validators.required]],

        })
        this.emailSent = new BehaviorSubject(false);
    }

    public showModal(popupMsgId): void {
        (<any>$(popupMsgId)).modal('show');
    }

    public hideModal(popupMsgId): void {

        (<any>$(popupMsgId)).modal('hide');
    }

    public onHidden(popupMsgId): void {

    }

    ngOnDestroy() {
        if (this.loginInfo$) this.loginInfo$.unsubscribe();
    }

    ngOnInit() {
        (<any>$('#mailsent')).appendTo("body");
        (<any>$('#dangermodal')).appendTo("body");
        (<any>$('#fillfields')).appendTo("body");
        this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {

                    this.formGroup.controls['userEmail'].setValue(loginInfoToken.cu_email);
                    this.formGroup.controls['userName'].setValue(loginInfoToken.cu_name);
                    this.formGroup.controls['userSurname'].setValue(loginInfoToken.cu_surname);
                    return loginInfoToken;

                }, {});
            }
            return state.loginInfo;
        }).subscribe(this.loginInfo$);
    }

    sendmail() {
        if (this.formGroup.invalid) {
            this.showModal("#fillfields");
        }
        else {
            this.showLoader.next(true);
            this.hds.sendmail(this.formGroup.value.userEmail, this.formGroup.value.userName, this.formGroup.value.userSurname, this.formGroup.value.userMessage)
                .then(res => {
                    this.emailSent.next(true);
                    this.showLoader.next(false);
                    this.showModal("#mailsent");
                })
                .catch(err => {
                    console.log(err);
                    this.showLoader.next(false);
                    this.showModal("#dangermodal");
                });
        }
    }

    goBack(): void {
        this.loc.back();
    }
}
