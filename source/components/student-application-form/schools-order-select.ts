import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { IRegions, IRegionSchool } from '../../store/regionschools/regionschools.types';
import { REGION_SCHOOLS_INITIAL_STATE } from '../../store/regionschools/regionschools.initial-state';
import { IAppState } from '../../store/store';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'schools-order-select',
    template: `
    <div class="row">
             <breadcrumbs></breadcrumbs>
    </div>
    <div class = "loading" *ngIf="(selectedSchools$ | async).length === 0 || (regions$ | async).size === 0">
    </div>

    <p style="margin-top: 20px; line-height: 2em;" *ngIf = "(selectedSchools$ | async).length === 1" >Έχετε επιλέξει το παρακάτω σχολείο. Εάν συμφωνείτε με την επιλογή σας
    πατήστε Συνέχεια, διαφορετικά μπορείτε να τροποποιήστε τις επιλογές σας επιστρέφοντας στην προηγούμενη οθόνη από το αριστερό βέλος κάτω αριστερά.</p>
    <p style="margin-top: 20px; line-height: 2em;" *ngIf = "(selectedSchools$ | async).length > 1" >Έχετε επιλέξει {{(selectedSchools$ | async).length}} σχολεία.
    Καθορίστε εδώ την επιθυμητή σειρά προτίμησης των σχολείων πατώντας τα αντίστοιχα βέλη δεξιά από τα ονόματα των σχολείων.
    Αν συμφωνείτε με την υπάρχουσα σειρά προτίμησης, πατήστε <i>Συνέχεια</i>.</p>

            <ul class="list-group main-view" style="margin-top: 50px; margin-bottom: 50px;">
            <div *ngFor="let selectedSchool$ of selectedSchools$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item "  [class.oddout]="isOdd" [class.evenout]="isEven">
                <span class="roundedNumber">{{(i+1)}}</span>&nbsp;&nbsp;{{selectedSchool$.epal_name}}
                <i (click)="changeOrder(i)" *ngIf = "i !== 0" class="fa fa-arrow-circle-up isclickable pull-right" style="font-size: 1.5em;"></i>
                </li>
            </div>
            </ul>
              <div class="row" style="margin-top: 20px;">
              <div class="col-md-6">
                  <button type="button" class="btn-primary btn-lg pull-left" (click)="navigateBack();" >
                <i class="fa fa-backward"></i>
                  </button>
              </div>
              <div class="col-md-6">
                  <button type="button" class="btn-primary btn-lg pull-right" (click)="navigateToStudentForm()" [disabled] = "numSelected === 0"  >
                <i class="fa fa-forward"></i>
                  </button>
              </div>
              </div>

  `

})
@Injectable() export default class SchoolsOrderSelect implements OnInit, OnDestroy {
    //    public formGroup: FormGroup;
    private regions$: BehaviorSubject<IRegions>;
    private regionsSub: Subscription;
    private selectedSchools$: BehaviorSubject<Array<IRegionSchool>> = new BehaviorSubject(Array());

    constructor(private _cfa: RegionSchoolsActions,
        private _ngRedux: NgRedux<IAppState>,
        private router: Router) {
        this.regions$ = new BehaviorSubject(REGION_SCHOOLS_INITIAL_STATE);
    };

    ngOnInit() {
        this.regionsSub = this._ngRedux.select(state => {
            let selectedSchools = Array<IRegionSchool>();

            state.regions.reduce((prevRegion, region) => {
                region.epals.reduce((prevEpal, epal) => {
                    if (epal.selected === true) {
                        selectedSchools.push(epal);
                    }

                    return epal;
                }, {});

                return region;
            }, {});

            selectedSchools.sort(this.compareSchools);
            for (let i=0; i < selectedSchools.length; i++)
              selectedSchools[i].order_id = i+1;
            //selectedSchools[0].order_id = 1;
            //selectedSchools[1].order_id = 2;
            //selectedSchools[2].order_id = 3;

            this.selectedSchools$.next(selectedSchools);

            return state.regions;
        }).subscribe(this.regions$);

    }

    ngOnDestroy() {
        if (this.regionsSub) {
            this.regionsSub.unsubscribe();
        }
        if (this.regions$) this.regions$.unsubscribe();
    }

    compareSchools(a: IRegionSchool, b: IRegionSchool) {
        if (a.order_id < b.order_id)
            return -1;
        if (a.order_id > b.order_id)
            return 1;
        return 0;
    }

    changeOrder(i) {
        let selectedSchools = Array<IRegionSchool>();
        selectedSchools = this.selectedSchools$.getValue();

        if (i === 1) {
          //selectedSchools[0].order_id = 2;
          //selectedSchools[1].order_id = 1;
          //selectedSchools[2].order_id = 3;

          //swap selectedSchools[0].order_id <-> selectedSchools[1].order_id
          [ selectedSchools[0].order_id, selectedSchools[1].order_id ] = [ selectedSchools[1].order_id, selectedSchools[0].order_id ];
        }
        else if (i === 2) {
          //selectedSchools[0].order_id = 1;
          //selectedSchools[1].order_id = 3;
          //selectedSchools[2].order_id = 2;

          //swap selectedSchools[1].order_id <-> selectedSchools[2].order_id
          [ selectedSchools[1].order_id, selectedSchools[2].order_id ] = [ selectedSchools[2].order_id, selectedSchools[1].order_id ];
        }

        this._cfa.saveRegionSchoolsOrder(selectedSchools);
    }

    navigateToStudentForm() {
        this._cfa.saveRegionSchoolsOrder(this.selectedSchools$.getValue());
        this.router.navigate(['/student-application-form-main']);
    }

    navigateBack() {
        this._cfa.saveRegionSchoolsOrder(this.selectedSchools$.getValue());
        this.router.navigate(['/region-schools-select']);
    }
}
