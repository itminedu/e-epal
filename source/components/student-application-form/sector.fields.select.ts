import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { NgRedux, select } from 'ng2-redux';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { IAppState } from '../../store/store';

//import ApplicationPreview from './application.preview';

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

    <div class="row equal">

     <div class="col-md-8">
       <form [formGroup]="formGroup">
        <div formArrayName="formArray">

            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveSectorAndSave(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{sectorField$.name}}</h5>
                </li>
            </div>


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

        <!--[disabled]="sectorActive === -1-->
        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="navigateToSchools()" [disabled]="true"	>
            Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
      </form>
    </div>

   <div class="col-md-4">
     <application-preview-select></application-preview-select>
   </div>
  </div>
  `

})
@Injectable() export default class SectorFieldsSelect implements OnInit {
    private sectorFields$: Observable<ISectorFields>;

    public formGroup: FormGroup;
    public cfs = new FormArray([]);

    private sectorActive = <number>-1;

    constructor(private fb: FormBuilder,
                private _cfa: SectorFieldsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    };

    ngOnInit() {
        this._cfa.getSectorFields();

        this.sectorFields$ = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) =>{
                this.cfs.push(new FormControl(sectorField.selected, []));
                if (sectorField.selected === true) {
                  this.sectorActive = sectorField.id - 1;
                }
                return sectorField;
            }, {});
            return state.sectorFields;
        });

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

    toggleBackgroundColor(ind) {
        return ((this.sectorActive === ind) ? "cyan" : "#eeeeee");
    }

    retrieveCheck()  {
      for (let i = 0; i < this.formGroup.value.formArray.length; i++)
        if (this.formGroup.value.formArray[i] === true) {
          this.sectorActive = i;
          return i;
        }
        return -1;
    }

}
