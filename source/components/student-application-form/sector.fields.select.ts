import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { NgRedux, select } from 'ng2-redux';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { IAppState } from '../../store/store';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { IRegions } from '../../store/regionschools/regionschools.types';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'sector-fields-select',
    template: `

<!--    <div class="row equal">

     <div class="col-md-12"> -->
     <div class = "loading" *ngIf="(showLoader$ | async) && (showLoader2$ | async)">
    </div>
       <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <ul class="list-group main-view">
            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item  isclickable" (click)="setActiveSectorAndSave(i)" [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="sectorActive === i">
                    <h5>{{sectorField$.name}}</h5>
                </li>
            </div>
            </ul>

            <!--CHECK BOXES USING BOTSTRAP
            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index">
                <div class="[ form-group ]">
                  <input type="checkbox" name="{{i}}" id="{{i}}" autocomplete="off" />
                  <div class="[ btn-group ]">
                      <label for="{{i}}" class="[ btn btn-primary ]">
                          <span class="[ glyphicon glyphicon-ok ]"></span>
                          <span> </span>
                      </label>
                      <label for="{{i}}" class="[ btn btn-default active ]">
                          {{sectorField$.name}}
                      </label>
                  </div>
                </div>
            </div>
            -->
        </div>

        <div class="row" style="margin-top: 20px;" *ngIf="!(showLoader$ | async) || !(showLoader2$ | async)">
        <div class="col-md-6">
            <button [hidden] = "objLoaderStatus == true" type="button" class="btn-primary btn-lg pull-left" (click)="router.navigate(['/epal-class-select']);" >
          <i class="fa fa-backward"></i>
            </button>
        </div>
        <div class="col-md-6">
            <button [hidden] = "objLoaderStatus == true" type="button" class="btn-primary btn-lg pull-right" (click)="navigateToSchools()" [disabled]="sectorActive === -1"  >
          <i class="fa fa-forward"></i>
            </button>
        </div>
        </div>

      </form>
<!--    </div>

  </div>  -->
  `

})
@Injectable() export default class SectorFieldsSelect implements OnInit {
    private sectorFields$: Observable<ISectorFields>;
    private regions$: Observable<IRegions>;
    private showLoader$: Observable<boolean>;
    private showLoader2$: Observable<boolean>;
    public formGroup: FormGroup;
    public cfs = new FormArray([]);
    private sectorActive = <number>-1;

    constructor(private fb: FormBuilder,
                private _cfa: SectorFieldsActions,
                private _rsr: RegionSchoolsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    };

    ngOnInit() {
        //re-initialize schools-redux-state
        this.getAllSchools();

        this._cfa.getSectorFields(true);
        this.sectorFields$ = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) =>{
                this.cfs.push(new FormControl(sectorField.selected, []));
                //in case we want to retrieve last check when we return to the form
                /*
                if (sectorField.selected === true) {
                  this.sectorActive = sectorField.id - 1;
                }
                */
                return sectorField;
            }, {});
            return state.sectorFields;
        });
        this.showLoader$ = this.sectorFields$.map(sectorFields => sectorFields.size === 0);

    }

    navigateToSchools() {
        //this.saveSelected();
        this.router.navigate(['/region-schools-select']);
    }

    saveSelected() {
      for (let i = 0; i < this.formGroup.value.formArray.length; i++)
        this.formGroup.value.formArray[i] = false;
      if (this.sectorActive != -1)
        this.formGroup.value.formArray[this.sectorActive] = true;

      this._cfa.saveSectorFieldsSelected(this.formGroup.value.formArray);
    }

    setActiveSectorAndSave(ind) {
        if (ind === this.sectorActive)
          ind = -1;
        this.sectorActive = ind;
        this.saveSelected();
    }

    getAllSchools() {
      //store in Redux the whole schools
      this._rsr.getRegionSchools(3,"-1", true);
      this.regions$ = this._ngRedux.select(state => {
          let numsel = 0;
          state.regions.reduce((prevRegion, region) =>{
              region.epals.reduce((prevEpal, epal) =>{
                  this.cfs.push( new FormControl(epal.selected, []));
                  return epal;
              }, {});
              return region;
          }, {});
          return state.regions;
      });
      this.showLoader2$ = this.regions$.map(regions => regions.size === 0);

    }

}
