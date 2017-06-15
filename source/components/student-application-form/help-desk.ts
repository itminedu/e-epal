import { Component, OnInit, OnDestroy } from "@angular/core";
import { Injectable } from "@angular/core";
import { VALID_EMAIL_PATTERN, VALID_NAMES_PATTERN } from '../../constants';
import {Router} from "@angular/router";
import { BehaviorSubject, Subscription, Observable } from 'rxjs/Rx';
import { HelperDataService } from '../../services/helper-data-service';
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

        <p align="left"><strong>Ηλεκτρονικές δηλώσεις προτίμησης ΕΠΑΛ για το νέο σχολικό έτος</strong></p>
        <p align="left">
        Σε περίπτωση που αντιμετωπίζετε οποιοδήποτε πρόβλημα με την καταχώριση της αίτησής σας, παρακαλούμε να 
         συμπληρώσετε την παρακάτω φόρμα.


      <p align="left"><strong> Φόρμα Επικοινωνίας </strong></p>

    <form [formGroup]="formGroup">

    <div class="form-group">
        <label for="userEmail">Email Επικοινωνίας(<span style="color: #ff0000;">*</span>)</label>
        <input #userEmail class="form-control" type="text" formControlName="userEmail">
    </div>
    <div class="alert alert-danger" *ngIf="formGroup.get('userEmail').touched && formGroup.get('userEmail').hasError('required') ">
        Το πεδίο δεν μπορεί να αφεθεί κενό!
    </div>
    <div class="alert alert-danger" *ngIf="formGroup.get('userEmail').hasError('pattern')">
        Πληκτρολογήστε ένα σωστό συντακτικά email!
    </div>

    <div class="form-group">
        <label for="userName">Όνομα(<span style="color: #ff0000;">*</span>)</label>
        <input class="form-control" type="text" formControlName="userName">
        <div class="alert alert-danger" *ngIf="formGroup.get('userName').touched && formGroup.get('userName').hasError('required') ">
            Το πεδίο δεν μπορεί να αφεθεί κενό!
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('userName').hasError('pattern')">
            Πληκτρολογήστε το όνομά σας!
        </div>
    </div>
    <div class="form-group">
        <label for="userSurname">Επώνυμο(<span style="color: #ff0000;">*</span>)</label><input class="form-control" type="text" formControlName="userSurname">
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

    <div class="row">
        <div class="col-md-12">
            <button type="button" class="btn-primary btn-lg  isclickable" style="width: 9em;" (click)="sendmail()" >
                <span style="font-size: 0.9em; font-weight: bold;">Αποστολή email &nbsp;&nbsp;&nbsp;</span>
            </button>
        </div>
    </div>
        <br>
        <br>
      Τηλ. Επικοινωνίας: 2103443014, 2103442231, 2103443359, 2103442034, 2103443309 (ώρες: 8:00 - 16:00)

   `
})

@Injectable() export default class HelpDesk implements OnInit, OnDestroy {

 
  public formGroup: FormGroup;
   private emailSent: BehaviorSubject<boolean>;

  constructor(private fb: FormBuilder,
              private hds: HelperDataService,)
      {
          this.formGroup = fb.group({
          userEmail: ['', [Validators.pattern(VALID_EMAIL_PATTERN),Validators.required]],
          userName: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
          userSurname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
          userMessage: ['', [Validators.required]],
      
     })
     this.emailSent = new BehaviorSubject(false);
  }

    ngOnDestroy() {

    }

    ngOnInit() {
    }



     sendmail() {
        this.hds.sendmail(this.formGroup.value.userEmail, this.formGroup.value.userName, this.formGroup.value.userSurname,this.formGroup.value.userMessage)
            .then(res => {
                this.emailSent.next(true);
            })
            .catch(err => {
                console.log(err);
            });
    }
}
