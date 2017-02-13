import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'sectorcourses-fields-select',
    template: `
    <div class="row equal">
     <div class="col-md-8">
      <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <ul class="list-group">
            <div *ngFor="let sector$ of sectors$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveSector(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{sector$.sector_name}}</h5>
                </li>
                <div *ngFor="let course$ of sector$.courses; let j=index;" [hidden]="i !== sectorActive">
                    <li class="list-group-item" >
                        <div class="row">
                            <div class="col-md-2">
                                <input #cb type="checkbox" formControlName="{{ course$.globalIndex }}"
                                (change)="updateCheckedOptions(course$.globalIndex, cb)"
                                [checked] = " course$.globalIndex === idx "
                                >
                            </div>
                            <div class="col-md-10">
                                {{course$.course_name}}
                            </div>
                        </div>
                    </li>
                </div>
              </div>
            </ul>
        </div>

        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="navigateToSchools()" [disabled]="idx === -1"	 >
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
@Injectable() export default class SectorCoursesSelect implements OnInit {
    private sectors$: Observable<ISectors>;
    private regions$: Observable<IRegions>;
    private formGroup: FormGroup;
    private rss = new FormArray([]);
    private sectorActive = <number>-1;
    private idx = <number>-1;
    private sectorsList: Array<boolean> = new Array();

    constructor(private fb: FormBuilder,
                private _rsa: SectorCoursesActions,
                private _rsr: RegionSchoolsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    };

    ngOnInit() {
        //re-initialize schools-redux-state
        this.getAllSchools();

        this._rsa.getSectorCourses(true);
        let ids = 0;
        this.sectors$ = this._ngRedux.select(state => {
            state.sectors.reduce((prevSector, sector) =>{
                this.sectorsList[ids] = sector.sector_selected;
                ids++;
                //In case we want to preserve last checked option when we revisit the form
                //if (sector.sector_selected === true)
                  //this.sectorActive = ids-1;
                sector.courses.reduce((prevCourse, course) =>{
                    this.rss.push( new FormControl(course.selected, []));
                    //this.retrieveCheck();
                    if (course.selected === true) {
                      //In case we want to preserve last checked option when we revisit the form
                      //this.idx = course.globalIndex;
                    }
                    return course;
                }, {});
                return sector;
            }, {});
            ids = 0;
            return state.sectors;
        });

    }

    setActiveSector(ind) {
      if (ind === this.sectorActive)
        ind = -1;
      this.sectorActive = ind;
    }

    toggleBackgroundColor(ind) {
        return ((this.sectorActive === ind) ? "cyan" : "#eeeeee");
    }

    saveSelected() {
        this._rsa.saveSectorCoursesSelected(this.formGroup.value.formArray, this.sectorsList);
    }

    navigateToSchools() {
        this.router.navigate(['/region-schools-select']);
    }

    updateCheckedOptions(globalIndex, cb){
      this.idx = globalIndex;
      for (let i = 0; i < this.formGroup.value.formArray.length; i++)
        this.formGroup.value.formArray[i] = false;
      this.formGroup.value.formArray[globalIndex] = cb.checked;
      if (cb.checked === false)
        this.idx = -1;

      for (let i = 0; i < this.sectorsList.length; i++)
          this.sectorsList[i] = false;
      this.sectorsList[this.sectorActive] = true;

      this.saveSelected();
}

getAllSchools() {
  //store in Redux the whole schools
  this._rsr.getRegionSchools(3,"-1", true);
  this.regions$ = this._ngRedux.select(state => {
      let numsel = 0;
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


}
