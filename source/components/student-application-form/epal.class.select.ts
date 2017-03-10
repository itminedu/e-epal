import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { EpalClassesActions } from '../../actions/epalclass.actions';
import { NgRedux, select } from 'ng2-redux';
import { IEpalClasses } from '../../store/epalclasses/epalclasses.types';
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { IAppState } from '../../store/store';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'epal-class-select',
    template: `

    <form [formGroup]="formGroup">
           <div *ngFor="let epalclass$ of epalclasses$ | async;"> </div>
            <div class="form-group" style= "margin-top: 50px; margin-bottom: 100px;">
              <label for="name">Παρακαλώ επιλέξτε την τάξη εισαγωγής του μαθητή στην Επαγγελματική Εκπαίδευση</label><br/>
                    <select class="form-control" formControlName="name" (change)="initializestore()">
                        <option value="Α' Λυκείου">Α' Λυκείου</option>
                        <option value="Β' Λυκείου">Β' Λυκείου</option>
                        <option value="Γ' Λυκείου">Γ' Λυκείου</option>
                    </select>

            </div>
        <div class="row">
            <div class="col-md-12 col-md-offset-5">
                <button type="button" class="btn-primary btn-lg pull-right" (click)="saveSelected()">
               <i class="fa fa-forward"></i>
                </button>
            </div>
        </div>

        <div *ngIf="emptyselection==true">
             Παρακαλώ επιλέξτε μια τάξη
        </div>

    </form>
   `
})

@Injectable() export default class EpalClassesSelect implements OnInit {
    private epalclasses$: Observable<IEpalClasses>;

    public formGroup: FormGroup;

       emptyselection = false;
       constructor(private fb: FormBuilder,
                private _cfa: EpalClassesActions,
                private _ngRedux: NgRedux<IAppState>,
                private _csa: SectorCoursesActions,
                private _sfa: SectorFieldsActions,
                private _rsa: RegionSchoolsActions,
                private router: Router) {
       this.formGroup = this.fb.group({
            name: []
            });
        };

    ngOnInit() {

          this.epalclasses$ = this._ngRedux.select(state => {
            if (state.epalclasses.size > 0) {
                state.epalclasses.reduce(({}, epalclass) => {
                    this.formGroup.setValue(epalclass);
                    return epalclass;
                }, {});
            }
            return state.epalclasses;
        });

    }

    saveSelected() {

        if (this.formGroup.value.name == undefined) {
                   this.emptyselection = true;
        }
        else
        {
            this._cfa.saveEpalClassesSelected(this.formGroup.value);
            if (this.formGroup.value.name === "Α' Λυκείου")
              this.router.navigate(['/region-schools-select']);
            else if (this.formGroup.value.name === "Β' Λυκείου")
                this.router.navigate(['/sector-fields-select']);
            else if (this.formGroup.value.name === "Γ' Λυκείου")
                this.router.navigate(['/sectorcourses-fields-select']);

        }

    }


    initializestore()
    {
       this._cfa.saveEpalClassesSelected(this.formGroup.value);
       this._sfa.initSectorFields();
       this._rsa.initRegionSchools();
       this._csa.initSectorCourses();
/*       this._sfa.getSectorFields(true);
       this._rsa.getRegionSchools(1,"-1", true);
       console.log("Here I am!");

       //this._rsa.saveRegionSchoolsOrder(true);

       this._csa.getSectorCourses(true);
       this._csa.getSectorCourses(true); */

    }

}
