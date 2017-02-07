import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { NgRedux, select } from 'ng2-redux';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
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
                                [checked] = " course$.globalIndex === idx ">
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
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()" [disabled]="idx === -1"	 >
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
    private formGroup: FormGroup;
    private rss = new FormArray([]);
    private sectorActive = <number>-1;
    private idx = <number>-1;

    constructor(private fb: FormBuilder,
                private _rsa: SectorCoursesActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    };

    ngOnInit() {
        this._rsa.getSectorCourses();

        this.sectors$ = this._ngRedux.select(state => {
            state.sectors.reduce((prevSector, sector) =>{
                sector.courses.reduce((prevCourse, course) =>{
                    this.rss.push( new FormControl(course.selected, []));
                    this.retrieveCheck();
                    return course;
                }, {});
                return sector;
            }, {});
            return state.sectors;
        });

    }

    setActiveSector(ind) {
        this.sectorActive = ind;
    }

    toggleBackgroundColor(ind) {
        return ((this.sectorActive === ind) ? "cyan" : "#eeeeee");
    }

    saveSelected() {
        this._rsa.saveSectorCoursesSelected(this.formGroup.value.formArray);
        this.router.navigate(['/region-schools-select']);
    }

    updateCheckedOptions(globalIndex, cb){
      /*
      if (this.oneselected)
        this.oneselected = 0;
      else
        this.oneselected = 1;
      console.log(this.oneselected);
      */
      //this.idx = index;
      this.idx = globalIndex;

      for (let i = 0; i < this.formGroup.value.formArray.length; i++)
        this.formGroup.value.formArray[i] = false;
      this.formGroup.value.formArray[globalIndex] = cb.checked;
      if (cb.checked === false)
        this.idx = -1;
}

retrieveCheck()  {
  for (let i = 0; i < this.formGroup.value.formArray.length; i++)
    if (this.formGroup.value.formArray[i] === true) {
      this.idx = i;
      return;
    }
}

}
