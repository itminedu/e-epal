import { Component, OnInit, OnDestroy } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import { LoginInfoActions } from '../../actions/logininfo.actions';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'intro-statement',
    template: `

    <div id="disclaimerNotice" (onHidden)="onHidden()" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
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

    <div *ngIf="(loginInfo$ | async).size !== 0">


    <p align="left"><strong>Όροι και Προϋποθέσεις Συμμετοχής στην Ηλεκτρονική Υπηρεσία</strong></p>
    

<p>Παρακαλώ, πριν προχωρήσετε στην υποβολή της Ηλεκτρονικής Δήλωσης Προτίμησης για την εγγραφή στα ΕΠΑΛ, διαβάστε με προσοχή και ενημερωθείτε
για τις προϋποθέσεις και τις επιλογές που έχετε προκειμένου να αποκτήσετε απολυτήριο τίτλο και πτυχίο ή μόνο πτυχίο της ειδικότητας που επιθυμείτε.</p>

<p>Επίσης πρέπει να γνωρίζετε ότι η Ηλεκτρονική Δήλωση Προτίμησης υπέχει θέση Υπ. Δήλωσης του ν. 1599/1986 (Α ́ 75) και οφείλετε τα στοιχεία που καταχωρίζετε σε αυτή να είναι αληθή.</p>


      <form novalidate [formGroup]="formGroup" #form>  
        <p align="left"><strong> Διάφορα Έγγραφα  </strong></p>        
        <li class="list-group-item isclickable oddout" >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/egkyklios.pdf" target="_blank">Η με αρ.πρωτ. 89047/ΓΔ4/26-05-2017 Εγκύκλιος του Υ.Π.Π.Ε.Θ.</a>
        </li>
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/infos.pdf" target="_blank">Ενημερωτικά Στοιχεία</a>
        </li>



        <br>
        <br>
          <div class="row">
            <div class="col-md-1 ">
              <input type="checkbox" [checked]="disclaimerChecked | async"  formControlName="disclaimerChecked" >
            </div>
            <div class="col-md-9">
              <label for="disclaimerChecked">Συμφωνώ με τα παραπάνω</label>
            </div>
          </div>

         </form>
         <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
             <div class="col-md-6">
                 <button type="button" class="btn-primary btn-lg pull-left" (click)="navigateBack()">
                     <i class="fa fa-backward"></i>
                 </button>
             </div>
             <div class="col-md-6">
                 <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="saveStatementAgree()">
                     <span style="font-size: 0.9em; font-weight: bold;">Συνέχεια&nbsp;&nbsp;&nbsp;</span><i class="fa fa-forward"></i>
                 </button>
             </div>

         </div>


      </div>



   `
})

@Injectable() export default class Disclaimer implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private disclaimerChecked: BehaviorSubject<number>;
    loginInfoSub: Subscription;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _lia: LoginInfoActions,
        private router: Router) {

          this.formGroup = this.fb.group({
              disclaimerChecked: ['', []],
          });

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          this.modalTitle =  new BehaviorSubject("");
          this.modalText =  new BehaviorSubject("");
          this.modalHeader =  new BehaviorSubject("");
          this.disclaimerChecked = new BehaviorSubject(0);

    }

    public showModal():void {
        (<any>$('#disclaimerNotice')).modal('show');
    }

    public hideModal():void {
        (<any>$('#disclaimerNotice')).modal('hide');
    }

    public onHidden():void {
        //this.isModalShown.next(false);
    }


    ngOnDestroy() {

      (<any>$('#disclaimerNotice')).remove();

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();

      if (this.loginInfo$)
        this.loginInfo$.unsubscribe();
    }

    ngOnInit() {

      (<any>$('#disclaimerNotice')).appendTo("body");

      this.loginInfoSub = this._ngRedux.select(state => {
          if (state.loginInfo.size > 0) {
              state.loginInfo.reduce(({}, loginInfoToken) => {
                  this.formGroup.controls['disclaimerChecked'].setValue(loginInfoToken.disclaimer_checked);
                  this.disclaimerChecked.next(loginInfoToken.disclaimer_checked);
                  return loginInfoToken;
              }, {});
          }
          return state.loginInfo;
      }).subscribe(this.loginInfo$);
  }

  navigateBack() {
      this.router.navigate(['/parent-form']);
  }

  saveStatementAgree() {
      if (!this.formGroup.controls['disclaimerChecked'].value) {
          this.modalHeader.next("modal-header-danger");
          this.modalTitle.next("Αποδοχή όρων χρήσης");
          this.modalText.next("Πρέπει να αποδεχθείτε πρώτα τους όρους χρήσης για να συνεχίσετε");
          this.showModal();
      } else {
          this._lia.saveStatementAgree(this.formGroup.controls['disclaimerChecked'].value);
          this.router.navigate(['epal-class-select']);
      }
  }
}
