import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { REGION_SCHOOLS_INITIAL_STATE } from '../../store/regionschools/regionschools.initial-state';
import { IAppState } from '../../store/store';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'schools-order-select',
    template: `
    <div class = "loading" *ngIf="(regions$ | async).size === 0">
    </div>
    <p style="margin-top: 20px; line-height: 2em;" *ngIf = "(numSelected$ | async) === 1" >Έχετε επιλέξει το παρακάτω σχολείο. Εάν συμφωνείτε με την επιλογή σας
    πατήστε Συνέχεια, διαφορετικά μπορείτε να τροποποιήστε τις επιλογές σας επιστρέφοντας στην προηγούμενη οθόνη από το αριστερό βέλος κάτω αριστερά.</p>
    <p style="margin-top: 20px; line-height: 2em;" *ngIf = "(numSelected$ | async) > 1" >Έχετε επιλέξει {{numSelected}} σχολεία.
    Καθορίστε εδώ την επιθυμητή σειρά προτίμησης των σχολείων πατώντας τα αντίστοιχα βέλη δεξιά από τα ονόματα των σχολείων.
    Αν συμφωνείτε με την υπάρχουσα σειρά προτίμησης, πατήστε <i>Συνέχεια</i>.</p>

            <ul class="list-group main-view" style="margin-top: 50px; margin-bottom: 50px;">
            <div *ngFor="let schoolField$ of schoolNames$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item"  [class.oddout]="isOdd" [class.evenout]="isEven">
                <b>({{(i+1)}}):</b> {{schoolField$}}
                <i (click)="changeOrder(i,'up')" *ngIf = "i !== 0" class="fa fa-arrow-circle-up isclickable pull-right" style="font-size: 2em;"></i>
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
    private numSelected$: BehaviorSubject<number> = new BehaviorSubject(0);
    private schoolNames$: BehaviorSubject<Array<string>> = new BehaviorSubject(Array());
    private schoolSelectedIds$: BehaviorSubject<Array<number>> = new BehaviorSubject(Array());
    private schoolArrayOrders$: BehaviorSubject<Array<number>> = new BehaviorSubject(Array());
    private regions$: BehaviorSubject<IRegions>;
    private regionsSub: Subscription;

    constructor(private _cfa: RegionSchoolsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.regions$ = new BehaviorSubject(REGION_SCHOOLS_INITIAL_STATE);
    };

    ngOnInit() {
          this.regionsSub = this._ngRedux.select(state => {
              let numSelected = 0;
              let idx = -1;
              let nm = 0;
              let schoolNames = new Array();
              let schoolSelectedIds = new Array();
              let schoolArrayOrders = new Array();
              let maxOrderId = 3;

              state.regions.reduce((prevRegion, region) =>{
                  region.epals.reduce((prevEpal, epal) =>{
                      ++idx;
                      if (epal.selected === true) {
                            numSelected++;


                            if (epal.order_id === 0) {
                                schoolArrayOrders[idx] = maxOrderId;
                                maxOrderId--;
                                schoolNames[nm] = epal.epal_name;
                                schoolSelectedIds[nm] = idx;
                            }
                            else {
                                schoolArrayOrders[nm] = epal.order_id;
                                schoolNames[epal.order_id - 1] = epal.epal_name;
                                schoolSelectedIds[epal.order_id - 1] = idx;
                            }

                            nm++;


                        } else {
                            schoolArrayOrders[idx] = 0;
                        }
                        return epal;
                    }, {});

                    return region;
                }, {});
                this.numSelected$.next(numSelected);
                this.schoolNames$.next(schoolNames);
                this.schoolSelectedIds$.next(schoolSelectedIds);
                this.schoolArrayOrders$.next(schoolArrayOrders);

              return state.regions;
          }).subscribe(this.regions$);

    }

    ngOnDestroy() {
        if (this.regionsSub) {
            this.regionsSub.unsubscribe();
        }
        if (this.regions$) this.regions$.unsubscribe();
    }

    changeOrder(i, orient) {
      let sn = this.schoolNames$.getValue();
      let ssi = this.schoolSelectedIds$.getValue();
      let sao = this.schoolArrayOrders$.getValue();
      let ind = 1;
      if (orient === "up")
        ind = -1;

      [ sn[i], sn[i+ind] ] = [ sn[i+ind], sn[i] ];
      [ ssi[i], ssi[i+ind] ] = [ ssi[i+ind], ssi[i] ];

      this.saveSelected(ssi, sao);
    }

    saveSelected(ssi, sao) {
      for (let i=0; i < ssi.length; i++)
        sao[ssi[i]] = i+1;
      this._cfa.saveRegionSchoolsOrder(sao);
    }

    navigateToStudentForm() {
        this.router.navigate(['/student-application-form-main']);
    }

    navigateBack() {

        this.router.navigate(['/region-schools-select']);
    }
}
