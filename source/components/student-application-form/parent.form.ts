import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { VALID_EMAIL_PATTERN } from '../../constants';
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
    template: `
    <div class = "loading" *ngIf="(epalUserData$ | async) === {}"></div>
    <form [formGroup]="formGroup">

        <div class="form-group">
              <label for="email">Email Επικοινωνίας</label><input class="form-control" type="text" formControlName="email">
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('email').touched && formGroup.get('email').hasError('required') ">
                Το πεδίο δεν μπορεί να αφεθεί κενό!
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('email').dirty && formGroup.get('email').hasError('pattern')">
                Πληκτρολογήστε ένα σωστό συντακτικά email!
        </div>
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn-primary btn-lg pull-right" (click)="sendVerificationCode()">
                Αποστολή Κωδικού Επαλήθευσης  </button>
            </div>
        </div>
        <div class="form-group">
              <label for="verification_code">Κωδικός επαλήθευσης</label><input class="form-control" type="text" formControlName="verification_code">
        </div>

        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn-primary btn-lg pull-right" (click)="verifyCodeAndContinue()">
                <i class="fa fa-forward"></i>  </button>
            </div>
        </div>
     </form>
   `
})

@Injectable() export default class ParentForm implements OnInit {

    public formGroup: FormGroup;
    private respond: any;
    private epalUserData$: BehaviorSubject<any>;
    private epalUserDataSub: Subscription;

       constructor(private fb: FormBuilder,
                private router: Router,
                private hds: HelperDataService) {
            this.epalUserData$ = new BehaviorSubject({});
       this.formGroup = this.fb.group({
            name: ['', [Validators.pattern(VALID_EMAIL_PATTERN),Validators.required]],
            });
        };

    ngOnInit() {
        this.epalUserDataSub = this.hds.getEpalUserData().subscribe(this.epalUserData$);
    }

    verifyCodeAndContinue() {
        this.router.navigate(['/epal-class-select']);
    }
}
