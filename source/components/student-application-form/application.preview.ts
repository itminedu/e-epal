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
import { AmkaFillsActions } from '../../actions/amkafill.actions';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { IEpalClasses } from '../../store/epalclasses/epalclasses.types';
import { IAmkaFills } from '../../store/amkafill/amkafills.types';
import {AppSettings} from '../../app.settings';


@Component({
    selector: 'application-preview-select',
    template: `
        <div *ngFor="let epalclass$ of epalclasses$ | async;">
        <h4 style="margin-top: 20px; line-height: 2em; ">Οι επιλογές μου</h4>
       <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineClass()">
            Η τάξη μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">

                <li class="list-group-item">
                    Τάξη εισαγωγής: {{epalclass$.name  }}
                </li>

        </ul>
        </div>

    <div *ngFor="let sector$ of sectors$  | async;">
        <div *ngFor="let sectorField$ of sectorFields$ | async;">
        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" [hidden] = "classSelected === 1" [disabled] = "classSelected === 3">
            O τομέας μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
                <li class="list-group-item" *ngIf="sectorField$.selected === true" >
                    {{sectorField$.name   }}
                </li>
                <li class="list-group-item" *ngIf="sector$.sector_selected === true" >
                    {{sector$.sector_name }}
                </li>
        </ul>
        </div>


        <div *ngFor="let course$ of sector$.courses;" >
        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" [hidden] = "classSelected !== 3">
            Η ειδικότητά μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
                <li class="list-group-item" *ngIf="course$.selected === true">
                    {{course$.course_name   }}
                </li>

        </ul>
        </div>
        </div>

        <div *ngIf="regions$.size > 0 | async">
        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" id = "butsch" class="btn-primary btn-md pull-center" [disabled] = "numSelectedSchools === 0 ">
            Τα σχολεία μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let region$ of regions$ | async;">
                <div *ngFor="let epal$ of region$.epals; " >
                <li class="list-group-item" *ngIf="epal$.selected === true && epal$.order_id === 1">
                    Προτίμηση {{epal$.order_id}}: {{epal$.epal_name}}
                </li>
                  <li class="list-group-item" *ngIf="epal$.selected === true && epal$.order_id === 0">
                      {{epal$.epal_name   }}
                  </li>

                <li class="list-group-item" *ngIf="epal$.selected === true && epal$.order_id === 2">
                    Προτίμηση {{epal$.order_id}}: {{epal$.epal_name   }}
                </li>

                <li class="list-group-item" *ngIf="epal$.selected === true && epal$.order_id === 3">
                    Προτίμηση {{epal$.order_id}}: {{epal$.epal_name   }}
                </li>
              </div>
            </div>
            <div class="btn-group inline pull-right">
              <button type="button" class="btn-primary btn-sm pull-right" (click)="defineOrder()"
              [hidden] = "numSelectedSchools <= 1 ">> Σειρά προτίμησης</button>
            </div>
        </ul>
        </div>

        <div *ngIf="studentDataFields$.size > 0 | async">
        <div class="row">
          <div class="btn-group inline pull-center">
              <button type="button" class="btn-primary btn-md pull-center"
              [disabled] = "numSelectedOrder === 0">
              Τα στοιχεία μου<span class="glyphicon glyphicon-menu-right"></span>
              </button>
          </div>
         </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let studentDataField$ of studentDataFields$ | async;">
                <li class="list-group-item">
                    Όνομα μαθητή: {{studentDataField$.name   }}
                </li>
                <li class="list-group-item">
                    Επώνυμο μαθητή: {{studentDataField$.studentsurname   }}
                </li>
            </div>
<!--            <div *ngFor="let selectedAmkaFill$ of selectedAmkaFills$ | async;">
              <li class="list-group-item">
                  AMKA μαθητή: {{selectedAmkaFill$.name}}
              </li>
          </div>  -->
        </ul>
        </div>
  `
})

@Injectable() export default class ApplicationPreview implements OnInit {
    private sectors$: Observable<ISectors>;
    private regions$: Observable<IRegions>;
    private sectorFields$: Observable<ISectorFields>;
    private studentDataFields$: Observable<IStudentDataFields>;
    private selectedAmkaFills$: Observable<IAmkaFills>;
    private epalclasses$: Observable<IEpalClasses>;
    private courseActive = "-1";
    private numSelectedSchools = <number>0;
    private numSelectedOrder = <number>0;
    private classSelected = 0;

    constructor(private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {
    };

    ngOnInit() {
        this.courseActive = this.getCourseActive();
        this.sectors$ = this._ngRedux.select(state => {
            //let numsel = 0;
            state.sectors.reduce((prevSector, sector) =>{
                //if (sector.sector_selected)
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
              let numsel = 0, numsel2 = 0;
              state.regions.reduce((prevRegion, region) =>{
                  region.epals.reduce((prevEpal, epal) =>{
                    if (epal.selected === true) {
                        numsel++;
                    }
                    if (epal.order_id !== 0) {
                        numsel2++;
                    }
                    return epal;
                  }, {});
                  return region;
              }, {});
              this.numSelectedSchools = numsel;
              this.numSelectedOrder = numsel2;
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

        this.selectedAmkaFills$ = this._ngRedux.select(state => {
            state.amkafills.reduce(({}, selectedAmkaFill) =>{
                return selectedAmkaFill;
            }, {});
            return state.amkafills;
        });

       this.epalclasses$ = this._ngRedux.select(state => {
            state.epalclasses.reduce(({}, epalclass) =>{
              if (epalclass.name === "Α' Λυκείου")
                this.classSelected = 1;
              else if (epalclass.name === "Β' Λυκείου")
                  this.classSelected = 2;
              else if (epalclass.name === "Γ' Λυκείου")
                    this.classSelected = 3;
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

    defineCourse() {
        this.router.navigate(['/sectorcourses-fields-select']);
    }

    defineOrder() {
      this.router.navigate(['/schools-order-select']);
    }

}
