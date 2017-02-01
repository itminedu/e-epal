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
    //declarations: [
    //  ApplicationPreview,
    //] ,

    //directives:[ApplicationPreview],
    template: `
    <div class="row equal">
     <div class="col-md-8">
       <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveSector(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{sectorField$.name}}</h5>
                </li>
            </div>
        </div>
        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()" [disabled]="sectorActive === -1"	>
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
                this.retrieveCheck();
                return sectorField;
            }, {});
            return state.sectorFields;
        });

    }

    saveSelected() {
        for (let i = 0; i < this.formGroup.value.formArray.length; i++)
          this.formGroup.value.formArray[i] = false;
        if (this.sectorActive != -1)
          this.formGroup.value.formArray[this.sectorActive] = true;
        this._cfa.saveSectorFieldsSelected(this.formGroup.value.formArray);
        this.router.navigate(['/region-schools-select']);
    }

    setActiveSector(ind) {
        this.sectorActive = ind;
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
