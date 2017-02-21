import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { NgRedux, select } from 'ng2-redux';
import { IRegions } from '../../store/regionschools/regionschools.types';

import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
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
    selector: 'course-fields-select',
    template: `
     <div class="row equal">
      <div class="col-md-12">
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
                                <input #cb type="checkbox" formControlName="{{ epal$.globalIndex }}"
                                (change)="saveSelected(cb,j)"
                                [hidden] = "numSelected === 3 && cb.checked === false"
                                >
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
            <button type="button" class="btn-primary btn-lg pull-center" (click)="navigateToApplication()" [disabled] = "numSelected === 0" >
            Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
    </form>

   </div>

  </div>
  `
})
@Injectable() export default class RegionSchoolsSelect implements OnInit {
    private regions$: Observable<IRegions>;
    private sectors$: Observable<ISectors>;
    private formGroup: FormGroup;
    private rss = new FormArray([]);
    private classActive = "-1";
    private regionActive = <number>-1;
    private courseActive = -1;
    private numSelected = <number>0;
    //private schoolArray: Array<boolean> = new Array();


    constructor(private fb: FormBuilder,
                private _rsa: RegionSchoolsActions,
                private _rsb: SectorCoursesActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    };

    ngOnInit() {
        this.classActive = this.classActive = this.getClassActive();

        let class_id = -1;
        if (this.classActive === "Α' Λυκείου")  {
          //είναι Α' Λυκείου, οπότε courseActive = "-1" (είναι ήδη ορισμένο με αυτή την τιμή από την αρχικοποίηση)
          class_id = 1;
        }
        else if (this.classActive === "Β' Λυκείου") {
          class_id = 2;
          this.courseActive = this.getSectorActive();
        }
        else if (this.classActive === "Γ' Λυκείου")  {
          class_id = 3;
          this.courseActive = this.getCourseActive();
        }

        this._rsa.getRegionSchools(class_id,this.courseActive, false);

        this.regions$ = this._ngRedux.select(state => {
            let numsel = 0;
            state.regions.reduce((prevRegion, region) =>{
                region.epals.reduce((prevEpal, epal) =>{
                    this.rss.push( new FormControl(epal.selected, []));
                    if (epal.selected === true) {
                      numsel++;
                    }
                    return epal;
                }, {});
                return region;
            }, {});
            this.numSelected = numsel;
            return state.regions;
        });

    }

    setActiveRegion(ind) {
      if (ind === this.regionActive)
        ind = -1;
      this.regionActive = ind;
    }

    toggleBackgroundColor(ind) {
        return ((this.regionActive === ind) ? "#fd9665" : "white");
    }

    saveSelected(cb,j) {
        this._rsa.saveRegionSchoolsSelected(this.formGroup.value.formArray);
        //σε κάθε νέο check, αρχικοποίησε τη σειρά προτιμήσεων (σειρά προτίμησης:0)
        let schoolArrayOrders: Array<number> = new Array();
        for (let i=0; i < this.formGroup.value.formArray.length; i++)
          schoolArrayOrders.push(0);
        this._rsa.saveRegionSchoolsOrder(schoolArrayOrders);
    }

    navigateToApplication() {
      //if (this.numSelected > 1)
        this.router.navigate(['/schools-order-select']);
      //else
      //  this.router.navigate(['/student-application-form-main']);
    }

    getCourseActive() {
        const { sectors } = this._ngRedux.getState();
        let l,m;
        for ( l=0; l<sectors.size; l++)
          if (sectors["_tail"]["array"][l]["sector_selected"] === true)
            for ( m=0; m < sectors["_tail"]["array"][l]["courses"].length; m++)
              if (sectors["_tail"]["array"][l]["courses"][m]["selected"] === true)
                 return sectors["_tail"]["array"][l]["courses"][m]["course_id"];
        return "-1";
    }

    getClassActive()  {
      const { epalclasses } = this._ngRedux.getState();
      let l,m;
      if (epalclasses.size !== 0 && epalclasses["_tail"]["array"][0]["name"].length !==0 )
         return epalclasses["_tail"]["array"][0]["name"];
      return "-1";
    }

    getSectorActive() {
      const { sectorFields } = this._ngRedux.getState();
      let l,m;
      for ( l=0; l<sectorFields.size; l++)  {
        if (sectorFields["_tail"]["array"][l]["selected"] === true) {
            return sectorFields["_tail"]["array"][l]["id"];
          }
      }
      return "-1";
    }

}
