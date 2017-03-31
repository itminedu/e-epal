import { Component, OnInit, OnDestroy, Injectable, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { VALID_EMAIL_PATTERN, VALID_NAMES_PATTERN } from '../../constants';
import { HelperDataService } from '../../services/helper-data-service';
import { ModalDirective } from 'ng2-bootstrap/modal';

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
    private userEmailSub: Subscription;
    private verificationCodeSent: BehaviorSubject<boolean>;
    private verificationCodeVerified: BehaviorSubject<boolean>;
    private userEmailEnabled: BehaviorSubject<boolean>;
    @ViewChild('userEmail') userEmail: ElementRef;
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    public isModalShown: BehaviorSubject<boolean>;

       constructor(private fb: FormBuilder,
                private router: Router,
                private hds: HelperDataService,
                private rd: Renderer) {
            this.verificationCodeSent = new BehaviorSubject(false);
            this.verificationCodeVerified = new BehaviorSubject(false);

            this.userEmailEnabled = new BehaviorSubject(false);
            this.isModalShown = new BehaviorSubject(false);
            this.formGroup = this.fb.group({
                 userName: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userSurname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userFathername: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userMothername: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userEmail: [{value: '', disabled: true}, [Validators.pattern(VALID_EMAIL_PATTERN),Validators.required]],
                 verificationCode: ['', []]
                 });
            this.epalUserData$ = new BehaviorSubject({});
        }

    public showModal():void {
        console.log("about to show modal");
        this.isModalShown.next(true);
    }

    public hideModal():void {
        this.autoShownModal.hide();
    }

    public onHidden():void {
        this.isModalShown.next(false);
    }

    ngOnInit() {
        this.epalUserDataSub = this.hds.getEpalUserData().subscribe(
            x => {
                this.epalUserData$.next(x);
                this.formGroup.get('userEmail').setValue(x.userEmail);
                this.formGroup.get('userName').setValue(x.userName);
                this.formGroup.get('userSurname').setValue(x.userSurname);
                this.formGroup.get('userFathername').setValue(x.userFathername);
                this.formGroup.get('userMothername').setValue(x.userMothername);

                if (typeof(x.verificationCodeVerified) !== 'undefined' && x.verificationCodeVerified === "1") {
                    this.verificationCodeVerified.next(true);
                } else {
                    this.verificationCodeVerified.next(false);
                }

                if (typeof(x.userEmail) !== 'undefined' && x.userEmail.length > 0)
                    this.userEmailEnabled.next(false);
                else {
                    this.enableUserEmail();
                    this.userEmailEnabled.next(true);
                }

            }
        );

        this.userEmailSub = this.formGroup.get('userEmail').valueChanges.subscribe(
            x => {
                if (this.formGroup.get('userEmail').value === '') {
                    this.enableUserEmail();
                }
            }
        );
    }

    ngOnDestroy() {
        if (this.epalUserDataSub) this.epalUserDataSub.unsubscribe();
        if (this.userEmailSub) this.epalUserDataSub.unsubscribe();
    }

    sendVerificationCode() {
        this.hds.sendVerificationCode(this.formGroup.value.userEmail)
            .then(res => {
                this.verificationCodeSent.next(true);
                this.verificationCodeVerified.next(false);
                this.disableUserEmail();
//                this.showModal();
            })
            .catch(err => {console.log(err)});
    }

    verifyVerificationCode() {
        this.hds.verifyVerificationCode(this.formGroup.value.verificationCode)
            .then(res => {
                this.verificationCodeVerified.next((<any>res).verificationCodeVerified);
                this.formGroup.value.userEmail=(<any>res).userEmail;
//                this.showModal();
            })
            .catch(err => {console.log(err)});
    }

    saveProfileAndContinue() {
        this.hds.saveProfile(this.formGroup.value)
            .then(res => {
                this.router.navigate(['/epal-class-select']);})
            .catch(err => {console.log(err)});
    }

    enableUserEmail() {
        this.userEmailEnabled.next(true);
        this.formGroup.get("userEmail").enable({emitEvent: false});
        this.rd.invokeElementMethod(this.userEmail.nativeElement,'focus');
    }

    disableUserEmail() {
        this.userEmailEnabled.next(false);
        this.formGroup.get("userEmail").disable({emitEvent: false});
    }

    resetUserEmail() {
        this.userEmailEnabled.next(false);
        this.formGroup.get("userEmail").setValue(this.epalUserData$.getValue().userEmail);
        this.formGroup.get("userEmail").disable({emitEvent: false});
    }
}
