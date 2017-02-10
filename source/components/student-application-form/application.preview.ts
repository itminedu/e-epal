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
import { EpalClassesActions } from '../../actions/epalclass.actions';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { IEpalClasses } from '../../store/epalclasses/epalclasses.types';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'application-preview-select',
    template: `
        <h4 style="margin-top: 20px; line-height: 2em; ">Οι επιλογές μου</h4>



       <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineClass()">
            Η τάξη μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
            <div *ngFor="let epalclass$ of epalclasses$ | async;">
                <li class="list-group-item">
                    Τάξη εισαγωγής: {{epalclass$.name}}
                </li>
            </div>
        </ul>


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
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineCourse()" >
            Η ειδικότητά μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>

        <!--
        <div class="row">
        <div class="btn-group inline pull-right">
            <button class="btn-primary btn-md pull-right my-btn"  type="button" (click)="defineCourse()" [hidden] = "numSelectedCourses === 0" >
            Επαναφορά<span class="glyphicon glyphicon-menu-right"></span>
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
    private epalclasses$: Observable<IEpalClasses>;


    private courseActive = "-1";
    private numSelectedSchools = <number>0;
    //private numSelectedCourses = <number>0;

    constructor(private _rsa: SectorCoursesActions,
                private _rsb: RegionSchoolsActions,
                private _rsc: SectorFieldsActions,
                private _rsd: StudentDataFieldsActions,
                private _rcd: EpalClassesActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
    };

    ngOnInit() {
        this.courseActive = this.getCourseActive();
        this.sectors$ = this._ngRedux.select(state => {
            //let numsel = 0;
            state.sectors.reduce((prevSector, sector) =>{
                sector.courses.reduce((prevCourse, course) =>{
                  //if (course.selected === true)  {
                  //  numsel++;
                  //}
                    return course;
                }, {});
                return sector;
            }, {});
            //this.numSelectedCourses = numsel;
            return state.sectors;
        });

        this.regions$ = this._ngRedux.select(state => {
              let numsel = 0;
              state.regions.reduce((prevRegion, region) =>{
                  region.epals.reduce((prevEpal, epal) =>{
                    if (epal.selected === true)
                        numsel++;
                    return epal;
                  }, {});
                  return region;
              }, {});
              this.numSelectedSchools = numsel;
              return state.regions;
          });

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


        this.epalclasses$ = this._ngRedux.select(state => {
            state.epalclasses.reduce(({}, epalclass) =>{
                return epalclass;
            }, {});
            return state.epalclasses;
        });


    }

    defineSector() {
        this.router.navigate(['/sector-fields-select']);
    }

    defineSchools() {
        this.router.navigate(['/region-schools-select']);
    }
    definePersonalData() {
        this.router.navigate(['/student-application-form-main']);
    }
    defineClass() {
        this.router.navigate(['/epal-class-select']);
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

/*
    defineCourse() {
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
  */

  defineCourse() {
      this.router.navigate(['/sectorcourses-fields-select']);
  }

}
