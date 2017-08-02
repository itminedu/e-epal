import { NgRedux } from "@angular-redux/store";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { LoginInfoActions } from "../../actions/logininfo.actions";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { ILoginInfoRecords } from "../../store/logininfo/logininfo.types";
import { IAppState } from "../../store/store";

@Component({
    selector: "intro-statement",
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
      <p align="left"><strong> Νομοθεσία  </strong></p>
      <ul class="list-group">
      <li class="list-group-item isclickable evenout"  >
          <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/ypourgikh.pdf" target="_blank">Υπουργική Απόφαση - αριθμ. Φ1α/98933/Δ4</a>
      </li>
      <li class="list-group-item isclickable oddout" >
          <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/egkyklios.pdf" target="_blank">Εγκύκλιος του Υ.Π.Π.Ε.Θ.- αρ.πρωτ. 89047/ΓΔ4/26-05-2017 </a>
      </li>
      </ul>

  <br>
  <br>
  <p align="left"><strong> Χρήσιμες Πληροφορίες  </strong></p>
      <ul class="list-group">
      <li class="list-group-item isclickable evenout"  >
          <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/infos.pdf" target="_blank">Ενημερωτικά Στοιχεία</a>
      </li>
      <li class="list-group-item isclickable oddout"  >
          <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/diptixo.pdf" target="_blank">Η Επαγγελματική Εκπαίδευση αναβαθμίζεται</a>
      </li>
      <li class="list-group-item isclickable evenout"  >
          <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="http://www.minedu.gov.gr/texniki-ekpaideusi-2/odigos-spoudon-gia-to-epal" target="_blank">Οδηγός Σπουδών για το ΕΠΑΛ </a>
      </li>
      </ul>

      <br>
    <br>
    <p align="left"><strong> Οδηγίες Ενημέρωσης  </strong></p>
        <ul class="list-group">
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/odigiessxoleio.pdf" target="_blank">Οδηγίες προς Διευθυντές ΕΠΑ.Λ. σχετικά με τα αποτελέσματα των Ηλεκτρονικών Δηλώσεων Προτίμησης</a>
        </li>
        <li class="list-group-item isclickable oddout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/odigiesstudent.pdf" target="_blank">Οδηγίες ενημέρωσης μαθητών/μαθητριών σχετικά με το αποτέλεσμα της
Ηλεκτρονικής τους Δήλωσης Προτίμησης
για τα ΕΠΑ.Λ.</a>
        </li>
        </ul>

          <div class="row" style="margin-top: 20px;">
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

    private formGroup: FormGroup;
    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private disclaimerChecked: BehaviorSubject<number>;
    private loginInfoSub: Subscription;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _lia: LoginInfoActions,
        private router: Router) {

        this.formGroup = this.fb.group({
            disclaimerChecked: ["", []],
        });

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.disclaimerChecked = new BehaviorSubject(0);

    }

    public showModal(): void {
        (<any>$("#disclaimerNotice")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#disclaimerNotice")).modal("hide");
    }

    public onHidden(): void {
        // this.isModalShown.next(false);
    }


    ngOnDestroy() {

        (<any>$("#disclaimerNotice")).remove();

        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
    }

    ngOnInit() {

        (<any>$("#disclaimerNotice")).appendTo("body");

        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(linfo => {
                if (linfo.size > 0) {
                    linfo.reduce(({}, loginInfoObj) => {
                        this.formGroup.controls["disclaimerChecked"].setValue(loginInfoObj.disclaimer_checked);
                        this.disclaimerChecked.next(loginInfoObj.disclaimer_checked);
                        return loginInfoObj;
                    }, {});
                }
                this.loginInfo$.next(linfo);
            }, error => { console.log("error selecting loginInfo"); });
    }

    navigateBack() {
        this.router.navigate(["/parent-form"]);
    }

    saveStatementAgree() {
        if (!this.formGroup.controls["disclaimerChecked"].value) {
            this.modalHeader.next("modal-header-danger");
            this.modalTitle.next("Αποδοχή όρων χρήσης");
            this.modalText.next("Πρέπει να αποδεχθείτε πρώτα τους όρους χρήσης για να συνεχίσετε");
            this.showModal();
        } else {
            this._lia.saveStatementAgree(this.formGroup.controls["disclaimerChecked"].value);
            this.router.navigate(["epal-class-select"]);
        }
    }
}
