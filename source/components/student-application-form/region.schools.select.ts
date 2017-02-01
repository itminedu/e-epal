import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { NgRedux, select } from 'ng2-redux';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { IAppState } from '../../store/store';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'course-fields-select',
    template: `
     <div class="row equal">
      <div class="col-md-8">
       <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <ul class="list-group">
            <div *ngFor="let region$ of regions$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveRegion(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{region$.region_name}}</h5>
                </li>

                <div *ngFor="let epal$ of region$.epals; let j=index;" [hidden]="i !== regionActive">
                    <li class="list-group-item" >
                        <div class="row">
                            <div class="col-md-2">
                                <input type="checkbox" formControlName="{{ epal$.globalIndex }}">
                            </div>
                            <div class="col-md-10">
                                {{epal$.epal_name}}
                            </div>
                        </div>
                    </li>
                </div>
            </div>
            </ul>
        </div>
        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()">
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
@Injectable() export default class RegionSchoolsSelect implements OnInit {
    private regions$: Observable<IRegions>;
    private formGroup: FormGroup;
    private rss = new FormArray([]);
    private regionActive = <number>-1;

    constructor(private fb: FormBuilder,
                private _rsa: RegionSchoolsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    };

    ngOnInit() {

        this._rsa.getRegionSchools();

        this.regions$ = this._ngRedux.select(state => {
            state.regions.reduce((prevRegion, region) =>{
                region.epals.reduce((prevEpal, epal) =>{
                    this.rss.push( new FormControl(epal.selected, []));
                    return epal;
                }, {});
                return region;
            }, {});
            return state.regions;
        });

    }

    setActiveRegion(ind) {
        this.regionActive = ind;
    }

    toggleBackgroundColor(ind) {
        return ((this.regionActive === ind) ? "cyan" : "#eeeeee");
    }

    saveSelected() {
        this._rsa.saveRegionSchoolsSelected(this.formGroup.value.formArray);
        this.router.navigate(['/student-application-form-main']);
    }
}
