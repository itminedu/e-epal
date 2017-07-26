import { Component, OnInit, OnDestroy, Injectable, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs/Rx';
import { VALID_EMAIL_PATTERN, VALID_UCASE_NAMES_PATTERN } from '../../constants';
import { HelperDataService } from '../../services/helper-data-service';
import { LoginInfoActions } from '../../actions/logininfo.actions'

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'parent-form',
    templateUrl: 'parent.form.html'
})

@Injectable() export default class ParentForm implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private respond: any;
    private epalUserData$: BehaviorSubject<any>;
    private epalUserDataSub: Subscription;
    private showLoader: BehaviorSubject<boolean>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    public isModalShown: BehaviorSubject<boolean>;

       constructor(private fb: FormBuilder,
                private router: Router,
                private hds: HelperDataService,
                private _prfa: LoginInfoActions,
                private rd: Renderer) {
            this.isModalShown = new BehaviorSubject(false);
            this.formGroup = this.fb.group({
                 userName: ['', [Validators.pattern(VALID_UCASE_NAMES_PATTERN),Validators.required]],
                 userSurname: ['', [Validators.pattern(VALID_UCASE_NAMES_PATTERN),Validators.required]],
                 userFathername: ['', [Validators.pattern(VALID_UCASE_NAMES_PATTERN),Validators.required]],
                 userMothername: ['', [Validators.pattern(VALID_UCASE_NAMES_PATTERN),Validators.required]],
                 userEmail: ['', [Validators.pattern(VALID_EMAIL_PATTERN),Validators.required]],
                 });
            this.epalUserData$ = new BehaviorSubject(<any>{userEmail: '', userName: '', userSurname: '', userFathername: '', userMothername: ''});
            this.showLoader = new BehaviorSubject(false);
            this.modalTitle =  new BehaviorSubject("");
            this.modalText =  new BehaviorSubject("");
        }

    public showModal():void {
        (<any>$('#emailSentNotice')).modal('show');
    }

    public hideModal():void {
        (<any>$('#emailSentNotice')).modal('hide');
    }

    public onHidden():void {
        this.isModalShown.next(false);
    }

    ngOnInit() {
        (<any>$('#emailSentNotice')).appendTo("body");
        this.showLoader.next(true);
        this.epalUserDataSub = this.hds.getEpalUserData().subscribe(x => {
            this.showLoader.next(false);
            this.epalUserData$.next(x);
            this.formGroup.get('userEmail').setValue(x.userEmail);
            this.formGroup.get('userName').setValue(x.userName);
            this.formGroup.get('userSurname').setValue(x.userSurname);
            this.formGroup.get('userFathername').setValue(x.userFathername);
            this.formGroup.get('userMothername').setValue(x.userMothername);
        });
    }

    ngOnDestroy() {
        (<any>$('#emailSentNotice')).remove();
        if (this.epalUserDataSub) this.epalUserDataSub.unsubscribe();
    }

    saveProfileAndContinue() : void {
        if (!this.formGroup.valid) {
            this.modalTitle.next("Αποτυχία αποθήκευσης");
            this.modalText.next("Δεν συμπληρώσατε κάποιο πεδίο");
            this.showModal();
        } else {
            this.showLoader.next(true);
            this.hds.saveProfile(this.formGroup.value)
                .then(res => {
                    this._prfa.saveProfile(this.formGroup.value);
                    this.showLoader.next(false);
                    this.router.navigate(['/intro-statement']);})
                .catch(err => {
                    this.showLoader.next(false);
                    console.log(err)
                });
        }
    }

}
