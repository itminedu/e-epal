import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { SectorFieldsActions } from "../../actions/sectorfields.actions";
import { NgRedux, select } from "@angular-redux/store";
import { ISectorFieldRecord, ISectorFieldRecords } from "../../store/sectorfields/sectorfields.types";
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
       <p style="margin-top: 20px; line-height: 2em;"> Παρακαλώ επιλέξτε τον τομέα στον οποίο θα φοιτήσει ο μαθητής το νέο σχολικό έτος στην επαγγελματική εκπαίδευση. Έπειτα επιλέξτε <i>Συνέχεια</i>.</p>
            <ul class="list-group main-view">
            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item  isclickable" (click)="saveSelected(i)" [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="sectorActive === i">
                    <h5>{{sectorField$.name}}</h5>
                </li>
            </div>
            </ul>

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
`

})
@Injectable() export default class SectorFieldsSelect implements OnInit, OnDestroy {
    private sectorFields$: BehaviorSubject<ISectorFieldRecords>;
    private sectorFieldsSub: Subscription;
    private formGroup: FormGroup;
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

        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.isModalShown = new BehaviorSubject(false);
    };

    ngOnInit() {
        (<any>$("#sectorFieldsNotice")).appendTo("body");
        this._cfa.getSectorFields(false);
        this.sectorFieldsSub = this._ngRedux.select("sectorFields")
            .map(sectorFields => <ISectorFieldRecords>sectorFields)
            .subscribe(sfds => {
                sfds.reduce(({}, sectorField) => {
                    if (sectorField.get("selected") === true) {
                        this.sectorActive = sectorField.get("id") - 1;
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

    private saveSelected(ind: number): void {
        if (ind === this.sectorActive)
            return;

        this._cfa.saveSectorFieldsSelected(this.sectorActive, ind);
        this.sectorActive = ind;

        this._rsa.initRegionSchools();
    }

}
