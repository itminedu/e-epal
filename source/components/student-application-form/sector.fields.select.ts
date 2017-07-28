import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { SectorFieldsActions } from "../../actions/sectorfields.actions";
import { NgRedux, select } from "@angular-redux/store";
import { ISectorFields } from "../../store/sectorfields/sectorfields.types";
import { IAppState } from "../../store/store";
import { SECTOR_FIELDS_INITIAL_STATE } from "../../store/sectorfields/sectorfields.initial-state";

import { RegionSchoolsActions } from "../../actions/regionschools.actions";

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from "@angular/forms";
import {AppSettings} from "../../app.settings";

@Component({
    selector: "sector-fields-select",
    template: `
    <div id="sectorFieldsNotice" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header {{modalHeader | async}}">
              <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;{{ modalTitle | async }}</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>{{ modalText | async }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="hideModal()">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
             <breadcrumbs></breadcrumbs>
    </div>
    <h4> Επιλογή Τομέα </h4>
     <div class = "loading" *ngIf="(sectorFields$ | async).size === 0">
    </div>
       <form [formGroup]="formGroup">
       <p style="margin-top: 20px; line-height: 2em;"> Παρακαλώ επιλέξτε τον τομέα στον οποίο θα φοιτήσει ο μαθητής το νέο σχολικό έτος στην επαγγελματική εκπαίδευση. Έπειτα επιλέξτε <i>Συνέχεια</i>.</p>
        <div formArrayName="formArray">
            <ul class="list-group main-view">
            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item  isclickable" (click)="setActiveSectorAndSave(i)" [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="sectorActive === i">
                    <h5>{{sectorField$.name}}</h5>
                </li>
            </div>
            </ul>

        </div>

        <div class="row" style="margin-top: 20px; margin-bottom: 20px;" *ngIf="(sectorFields$ | async).size > 0">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left" (click)="router.navigate(['/epal-class-select']);" >
          <i class="fa fa-backward"></i>
            </button>
        </div>
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="navigateToSchools()" >
                <span style="font-size: 0.9em; font-weight: bold;">Συνέχεια&nbsp;&nbsp;&nbsp;</span><i class="fa fa-forward"></i>
            </button>
        </div>
        </div>

      </form>
  `

})
@Injectable() export default class SectorFieldsSelect implements OnInit, OnDestroy {
    private sectorFields$: BehaviorSubject<ISectorFields>;
    private sectorFieldsSub: Subscription;
    private formGroup: FormGroup;
    private cfs = new FormArray([]);
    private sectorActive = <number>-1;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    public isModalShown: BehaviorSubject<boolean>;

    constructor(private fb: FormBuilder,
        private _cfa: SectorFieldsActions,
        private _rsa: RegionSchoolsActions,
        private _ngRedux: NgRedux<IAppState>,
        private router: Router) {
        this.sectorFields$ = new BehaviorSubject(SECTOR_FIELDS_INITIAL_STATE);

        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.isModalShown = new BehaviorSubject(false);
    };

    ngOnInit() {
        (<any>$("#sectorFieldsNotice")).appendTo("body");
        this._cfa.getSectorFields(false);
        this.sectorFieldsSub = this._ngRedux.select("sectorFields")
            .subscribe(sectorFields => {
                let sfds = <ISectorFields>sectorFields;
                sfds.reduce(({}, sectorField) => {
                    this.cfs.push(new FormControl(sectorField.selected, []));
                    // in case we want to retrieve last check when we return to the form

                    if (sectorField.selected === true) {
                        this.sectorActive = sectorField.id - 1;
                    }

                    return sectorField;
                }, {});
                this.sectorFields$.next(sfds);
            }, error => { console.log("error selecting sectorFields"); });
    }

    ngOnDestroy() {
        (<any>$("#sectorFieldsNotice")).remove();
        if (this.sectorFieldsSub) this.sectorFieldsSub.unsubscribe();
    }

    public showModal(): void {
        (<any>$("#sectorFieldsNotice")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#sectorFieldsNotice")).modal("hide");
    }

    public onHidden(): void {
        this.isModalShown.next(false);
    }

    navigateToSchools() {
        if (this.sectorActive === -1) {
            this.modalTitle.next("Δεν επιλέχθηκε τομέας");
            this.modalText.next("Παρακαλούμε να επιλέξετε πρώτα έναν τομέα");
            this.modalHeader.next("modal-header-danger");
            this.showModal();
        }
        else {
            this.router.navigate(["/region-schools-select"]);
        }
    }

    saveSelected() {
        for (let i = 0; i < this.formGroup.value.formArray.length; i++)
            this.formGroup.value.formArray[i] = false;
        if (this.sectorActive !== -1)
            this.formGroup.value.formArray[this.sectorActive] = true;

        this._cfa.saveSectorFieldsSelected(this.formGroup.value.formArray);

        this._rsa.initRegionSchools();
    }

    setActiveSectorAndSave(ind) {
        if (ind === this.sectorActive)
            ind = -1;
        this.sectorActive = ind;
        this.saveSelected();
    }

}
