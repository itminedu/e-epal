import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { SECTOR_COURSES_INITIAL_STATE } from '../../store/sectorcourses/sectorcourses.initial-state';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import {RemoveSpaces} from '../../pipes/removespaces';

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
    <div class = "loading" *ngIf="(sectors$ | async).size === 0">
   </div>
      <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <ul class="list-group">
            <div *ngFor="let sector$ of sectors$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item isclickable" (click)="setActiveSector(i)"  [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="sectorActive === i">
                    <h5>{{sector$.sector_name}}</h5>
                </li>
                <div *ngFor="let course$ of sector$.courses; let j=index; let isOdd2=odd; let isEven2=even" [class.oddin]="isOdd2" [class.evenin]="isEven2" [hidden]="i !== sectorActive">
                          <div class="row">
                           <div class="col-md-2 col-md-offset-1">
                                <input #cb type="checkbox" formControlName="{{ course$.globalIndex }}"
                                (change)="updateCheckedOptions(course$.globalIndex, cb)"
                                [checked] = " course$.globalIndex === idx "
                                >
                            </div>
                            <div class="col-md-8  col-md-offset-1 isclickable">
                                {{course$.course_name | removeSpaces}}
                            </div>
                            </div>
                    </div>
              </div>
            </ul>
        </div>

        <div class="row" style="margin-top: 20px;" *ngIf="(sectors$ | async).size > 0">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left" (click)="router.navigate(['/epal-class-select']);" >
          <i class="fa fa-backward"></i>
            </button>
        </div>
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-right" (click)="navigateToSchools()" [disabled]="idx === -1">
            <i class="fa fa-forward"></i>
            </button>
        </div>
        </div>
     </form>
  `
})
@Injectable() export default class SectorCoursesSelect implements OnInit, OnDestroy {
    private sectors$: BehaviorSubject<ISectors>;
    private sectorsSub: Subscription;
    private formGroup: FormGroup;
    private rss = new FormArray([]);
    private sectorActive = <number>-1;
    private idx = <number>-1;
    private sectorsList: Array<boolean> = new Array();

    constructor(private fb: FormBuilder,
                private _sca: SectorCoursesActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {

        this.sectors$ = new BehaviorSubject(SECTOR_COURSES_INITIAL_STATE);
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    };

    ngOnInit() {
        this._sca.getSectorCourses(false);
        let ids = 0;
        this.sectorsSub = this._ngRedux.select(state => {
            state.sectors.reduce((prevSector, sector) =>{
                this.sectorsList[ids] = sector.sector_selected;
                ids++;
                //In case we want to preserve last checked option when we revisit the form
                if (sector.sector_selected === true)
                    this.sectorActive = ids-1;
                sector.courses.reduce((prevCourse, course) =>{
                    this.rss.push( new FormControl(course.selected, []));
                    //this.retrieveCheck();
                    if (course.selected === true) {
                      //In case we want to preserve last checked option when we revisit the form
                      this.idx = course.globalIndex;
                    }
                    return course;
                }, {});
                return sector;
            }, {});
            ids = 0;
            return state.sectors;
        }).subscribe(this.sectors$);

    }

    ngOnDestroy() {
        if (this.sectorsSub) this.sectorsSub.unsubscribe();
    }

    setActiveSector(ind) {
      if (ind === this.sectorActive)
        ind = -1;
      this.sectorActive = ind;
    }

    saveSelected() {
        this._sca.saveSectorCoursesSelected(this.formGroup.value.formArray, this.sectorsList);
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

}
