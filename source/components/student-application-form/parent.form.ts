import { Component, OnInit, OnDestroy, Injectable, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { VALID_EMAIL_PATTERN, VALID_NAMES_PATTERN } from '../../constants';
import { HelperDataService } from '../../services/helper-data-service';

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
    private showSendVerification: BehaviorSubject<boolean>;
    private verificationCodeSent: BehaviorSubject<boolean>;
    private verificationCodeVerified: BehaviorSubject<boolean>;
    private userEmailEnabled: BehaviorSubject<boolean>;
    @ViewChild('userEmail') userEmail: ElementRef;

       constructor(private fb: FormBuilder,
                private router: Router,
                private hds: HelperDataService,
                private rd: Renderer) {
            this.showSendVerification = new BehaviorSubject(false);
            this.verificationCodeSent = new BehaviorSubject(false);
            this.verificationCodeVerified = new BehaviorSubject(false);

            this.userEmailEnabled = new BehaviorSubject(false);
            this.formGroup = this.fb.group({
                 userName: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userSurname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userFathername: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userMothername: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
                 userEmail: [{value: '', disabled: true}, [Validators.pattern(VALID_EMAIL_PATTERN),Validators.required]],
                 verificationCode: ['', [Validators.required]]
                 });
            this.epalUserData$ = new BehaviorSubject({});
        }
    ngOnInit() {
        // this.epalUserDataSub = this.hds.getEpalUserData().subscribe(this.epalUserData$);

        this.epalUserDataSub = this.hds.getEpalUserData().subscribe(
            x => {
                this.epalUserData$.next(x);

                if (typeof(x.verificationCodeVerified) !== 'undefined' && x.verificationCodeVerified === "1") {
                    this.verificationCodeVerified.next(true);
                }

                if (typeof(x.userEmail) !== 'undefined' && x.userEmail.length > 0)
                    this.userEmailEnabled.next(false);
                else
                    this.userEmailEnabled.next(true);
            }
        );


        this.userEmailSub = this.formGroup.controls['userEmail'].valueChanges.subscribe(
            x => {
                if (this.formGroup.controls['userEmail'].value === '') {
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
            .then(res => {this.verificationCodeSent.next(true); this.showSendVerification.next(false);})
            .catch(err => {console.log(err)});
    }


    verifyVerificationCode() {
        this.hds.verifyVerificationCode(this.formGroup.value.verificationCode)
            .then(res => {this.verificationCodeSent.next(true); this.showSendVerification.next(false); this.verificationCodeVerified.next((<any>res).verificationCodeVerified === "1" ? true : false); this.formGroup.value.userEmail=(<any>res).userEmail;})
            .catch(err => {console.log(err)});
    }

    verifyCodeAndContinue() {
        this.router.navigate(['/epal-class-select']);
    }

    enableUserEmail() {
        this.userEmailEnabled.next(true);
        this.formGroup.controls["userEmail"].enable({emitEvent: false});
        this.rd.invokeElementMethod(this.userEmail.nativeElement,'focus');
    }

    disableUserEmail() {
        this.userEmailEnabled.next(false);
        this.formGroup.controls["userEmail"].setValue(this.epalUserData$.getValue().userEmail);
        this.formGroup.controls["userEmail"].disable({emitEvent: false});
    }
}
