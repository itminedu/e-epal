import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { NgRedux, select } from 'ng2-redux';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { IAppState } from '../../store/store';
import { SECTOR_FIELDS_INITIAL_STATE } from '../../store/sectorfields/sectorfields.initial-state';

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
     <div class = "loading" *ngIf="(sectorFields$ | async).size === 0">
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

        </div>

        <div class="row" style="margin-top: 20px;" *ngIf="(sectorFields$ | async).size > 0">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left" (click)="router.navigate(['/epal-class-select']);" >
          <i class="fa fa-backward"></i>
            </button>
        </div>
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-right" (click)="navigateToSchools()" [disabled]="sectorActive === -1"  >
          <i class="fa fa-forward"></i>
            </button>
        </div>
        </div>

      </form>
  `

})
@Injectable() export default class SectorFieldsSelect implements OnInit {
    private sectorFields$: BehaviorSubject<ISectorFields>;
    private sectorFieldsSub: Subscription;
    public formGroup: FormGroup;
    public cfs = new FormArray([]);
    private sectorActive = <number>-1;

    constructor(private fb: FormBuilder,
                private _cfa: SectorFieldsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.sectorFields$ = new BehaviorSubject(SECTOR_FIELDS_INITIAL_STATE);

        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    };

    ngOnInit() {
        this._cfa.getSectorFields(false);
        this.sectorFieldsSub = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) =>{
                this.cfs.push(new FormControl(sectorField.selected, []));
                //in case we want to retrieve last check when we return to the form

                if (sectorField.selected === true) {
                  this.sectorActive = sectorField.id - 1;
                }

                return sectorField;
            }, {});
            return state.sectorFields;
        }).subscribe(this.sectorFields$);

    }

    ngOnDestroy() {
        if (this.sectorFieldsSub) this.sectorFieldsSub.unsubscribe();
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

}
