import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'application-preview-select',
    template: `
        <h4 style="margin-top: 20px; line-height: 2em; ">Οι επιλογές μου</h4>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineSector()">
            O τομέας μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
            <div *ngFor="let sectorField$ of sectorFields$ | async;">
                <li class="list-group-item" *ngIf="sectorField$.selected === true" >
                    {{sectorField$.name}}
                </li>
            </div>
        </ul>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" [disabled] = true>
            Η ειδικότητά μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let sector$ of sectors$ | async;">
                <div *ngFor="let course$ of sector$.courses;" >
                <li class="list-group-item" *ngIf="course$.selected === true">
                    {{course$.course_name}}
                </li>
            </div>
            </div>
        </ul>

        <div class="row">
        <div class="btn-group inline pull-right">
            <button class="btn-primary btn-md pull-center my-btn"  type="button" (click)="defineCourse()" [hidden] = "numSelectedSchools === 0" >
            Επαναφορά<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" id = "butsch" class="btn-primary btn-md pull-center" (click)="defineSchools()" [disabled] = "numSelectedSchools === 0 ">
            Τα σχολεία μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let region$ of regions$ | async;">
                <div *ngFor="let epal$ of region$.epals; " >
                <li class="list-group-item" *ngIf="epal$.selected === true">
                    {{epal$.epal_name}}
                </li>
            </div>
            </div>
        </ul>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="definePersonalData()">
            Τα στοιχεία μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let studentDataField$ of studentDataFields$ | async;">
                <li class="list-group-item">
                    Όνομα μαθητή: {{studentDataField$.studentFirstname}}
                </li>
                <li class="list-group-item">
                    Επώνυμο μαθητή: {{studentDataField$.studentSurname}}
                </li>
                <li class="list-group-item">
                    AMKA μαθητή: {{studentDataField$.studentAmka}}
                </li>
            </div>
        </ul>
  `
})

@Injectable() export default class ApplicationPreview implements OnInit {
    private sectors$: Observable<ISectors>;
    private regions$: Observable<IRegions>;
    private sectorFields$: Observable<ISectorFields>;
    private studentDataFields$: Observable<IStudentDataFields>;
    private courseActive = "-1";
    private numSelectedSchools = <number>0;
    private numSelectedCourses = <number>0;


    constructor(private _rsa: SectorCoursesActions,
                private _rsb: RegionSchoolsActions,
                private _rsc: SectorFieldsActions,
                private _rsd: StudentDataFieldsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
    };

    ngOnInit() {
        this.courseActive = this.getCourseActive();

        this._rsa.getSectorCourses(false);
        this.sectors$ = this._ngRedux.select(state => {
            let numsel = 0;
            state.sectors.reduce((prevSector, sector) =>{
                sector.courses.reduce((prevCourse, course) =>{
                  if (course.selected === true)  {
                    numsel++;
                    //this.numSelectedCourses
                  }
                    return course;
                }, {});
                return sector;
            }, {});
            this.numSelectedCourses = numsel;
            return state.sectors;
        });

        //WORKED STRANGELY BEFORE..
        /*
        this.courseActive = this.getCourseActive();
        this._rsb.getRegionSchools(this.courseActive);
        */

        this._rsb.getRegionSchools(this.courseActive, false);
        this.regions$ = this._ngRedux.select(state => {
              let numsel = 0;
              state.regions.reduce((prevRegion, region) =>{
                  region.epals.reduce((prevSchool, school) =>{
                    if (school.selected === true)
                        numsel++;
                    return school;
                  }, {});
                  return region;
              }, {});
              this.numSelectedSchools = numsel;
              return state.regions;
          });

        this._rsc.getSectorFields();
        this.sectorFields$ = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) =>{
                return sectorField;
            }, {});
            return state.sectorFields;
        });

        this.studentDataFields$ = this._ngRedux.select(state => {
            state.studentDataFields.reduce(({}, studentDataField) =>{
                return studentDataField;
            }, {});
            return state.studentDataFields;
        });

    }

    defineSector() {
        this.router.navigate(['/sector-fields-select']);
    }

    defineCourse() {
      //this._rsb.getRegionSchools_Reload("-1");
      this._rsb.getRegionSchools("-1", true);
      this.regions$ = this._ngRedux.select(state => {
          let numsel = 0;
          state.regions.reduce((prevRegion, region) =>{
              region.epals.reduce((prevSchool, school) =>{
                if (school.selected === true)
                    numsel++;
                return school;
              }, {});
              return region;
          }, {});
          this.numSelectedSchools = numsel;
          return state.regions;
      });


      //this._rsa.getSectorCourses_Reload();
      this._rsa.getSectorCourses(true);
      this.sectors$ = this._ngRedux.select(state => {
          state.sectors.reduce((prevSector, sector) =>{
              sector.courses.reduce((prevCourse, course) =>{
                  return course;
              }, {});
              return sector;
          }, {});
          return state.sectors;
      });

      this.router.navigate(['/sectorcourses-fields-select']);

    }

    defineSchools() {
        this.router.navigate(['/region-schools-select']);
    }
    definePersonalData() {
        this.router.navigate(['/student-application-form-main']);
    }


    getCourseActive() {
        const { sectors } = this._ngRedux.getState();
        let l,m;
        for ( l=0; l<sectors.size; l++)
          if (sectors["_tail"]["array"][l]["sector_selected"] === true)
            for ( m=0; m < sectors["_tail"]["array"][l]["courses"].length; m++)
              if (sectors["_tail"]["array"][l]["courses"][m]["selected"] === true)
                 return sectors["_tail"]["array"][l]["courses"][m]["course_id"];
    }




}
