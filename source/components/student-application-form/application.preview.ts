import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { EpalClassesActions } from '../../actions/epalclass.actions';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { IRegions, IRegionSchool } from '../../store/regionschools/regionschools.types';
import { IEpalClasses } from '../../store/epalclasses/epalclasses.types';
import {AppSettings} from '../../app.settings';
import { REGION_SCHOOLS_INITIAL_STATE } from '../../store/regionschools/regionschools.initial-state';
import { EPALCLASSES_INITIAL_STATE } from '../../store/epalclasses/epalclasses.initial-state';
import { SECTOR_COURSES_INITIAL_STATE } from '../../store/sectorcourses/sectorcourses.initial-state';
import { SECTOR_FIELDS_INITIAL_STATE } from '../../store/sectorfields/sectorfields.initial-state';

@Component({
    selector: 'application-preview-select',
    template: `
        <div *ngFor="let epalclass$ of epalclasses$ | async;">
        <h4 style="margin-top: 20px; line-height: 2em; ">Οι επιλογές μου</h4>
        <ul class="list-group left-side-view" style="margin-bottom: 20px;">
                <li class="list-group-item active">
                    Τάξη εισαγωγής
                </li>
                <li class="list-group-item" *ngIf="epalclass$.name === '1'">
                    Α’ Λυκείου
                </li>
                <li class="list-group-item" *ngIf="epalclass$.name === '2'">
                    Β’ Λυκείου
                </li>
                <li class="list-group-item" *ngIf="epalclass$.name === '3'">
                    Γ’ Λυκείου
                </li>
                <li class="list-group-item" *ngIf="epalclass$.name === '4'">
                    Δ’ Λυκείου
                </li>

        </ul>
        </div>

        <div *ngFor="let sectorField$ of sectorFields$ | async">
        <ul class="list-group left-side-view">
            <li class="list-group-item active" *ngIf="sectorField$.selected === true" >
                {{sectorField$.name}}
            </li>
            </ul>
        </div>

    <div *ngFor="let sector$ of sectors$  | async;">
            <ul class="list-group left-side-view" style="margin-bottom: 20px;" *ngIf="sector$.sector_selected === true">
                <li class="list-group-item active" *ngIf="sector$.sector_selected === true" >
                    {{sector$.sector_name }}
                </li>
        <div *ngFor="let course$ of sector$.courses;" >

                <li class="list-group-item" *ngIf="course$.selected === true">
                    {{course$.course_name   }}
                </li>

        </div>
            </ul>
        </div>

        <ul *ngIf="(regions$ | async).size > 0" class="list-group left-side-view" style="margin-bottom: 20px;">

                <div *ngFor="let epal$ of selectedSchools$ | async; let i=index; let isOdd=odd; let isEven=even" >

                <li class="list-group-item" [class.oddout]="isOdd" [class.evenout]="isEven">
                    <span class="roundedNumber">{{(i+1)}}</span>&nbsp;&nbsp;{{epal$.epal_name}}
                </li>
              </div>
        </ul>
  `
})

@Injectable() export default class ApplicationPreview implements OnInit {
    private sectors$: BehaviorSubject<ISectors>;
    private regions$: BehaviorSubject<IRegions>;
    private selectedSchools$: BehaviorSubject<Array<IRegionSchool>> = new BehaviorSubject(Array());
    private sectorFields$: BehaviorSubject<ISectorFields>;
    private epalclasses$: BehaviorSubject<IEpalClasses>;
    private sectorsSub: Subscription;
    private regionsSub: Subscription;
    private sectorFieldsSub: Subscription;
    private courseActive = "-1";
    private numSelectedSchools = <number>0;
    private numSelectedOrder = <number>0;
    private classSelected = 0;
    public currentUrl: string;

    constructor(private _ngRedux: NgRedux<IAppState>,
        private router: Router
    ) {

        this.regions$ = new BehaviorSubject(REGION_SCHOOLS_INITIAL_STATE);
        this.epalclasses$ = new BehaviorSubject(EPALCLASSES_INITIAL_STATE);

        this.sectors$ = new BehaviorSubject(SECTOR_COURSES_INITIAL_STATE);
        this.sectorFields$ = new BehaviorSubject(SECTOR_FIELDS_INITIAL_STATE);
    };

    ngOnInit() {
        this.currentUrl = this.router.url;
        this.sectorsSub = this._ngRedux.select(state => {
            state.sectors.reduce((prevSector, sector) => {
                sector.courses.reduce((prevCourse, course) => {
                    if (course.selected === true) {
                        this.courseActive = course.course_id;
                    }

                    return course;
                }, {});
                return sector;
            }, {});
            //this.numSelectedCourses = numsel;
            return state.sectors;
        }).subscribe(this.sectors$);

        this.regionsSub = this._ngRedux.select(state => {
            let numsel = 0, numsel2 = 0;
            let selectedSchools = Array<IRegionSchool>();
            state.regions.reduce((prevRegion, region) => {
                region.epals.reduce((prevEpal, epal) => {
                    if (epal.selected === true) {
                        numsel++;
                        selectedSchools.push(epal);
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
            this.selectedSchools$.next(selectedSchools.sort(this.compareSchools));
//            this.selectedSchools$.next(selectedSchools);
            return state.regions;
        }).subscribe(this.regions$);

        this.sectorFieldsSub = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) => {
                return sectorField;
            }, {});
            return state.sectorFields;
        }).subscribe(this.sectorFields$);

        this._ngRedux.select(state => {
            state.epalclasses.reduce(({}, epalclass) => {
                if (epalclass.name === "Α' Λυκείου")
                    this.classSelected = 1;
                else if (epalclass.name === "Β' Λυκείου")
                    this.classSelected = 2;
                else if (epalclass.name === "Γ' Λυκείου")
                    this.classSelected = 3;
                else if (epalclass.name === "Δ' Λυκείου")
                    this.classSelected = 4;
                return epalclass;
            }, {});
            return state.epalclasses;
        }).subscribe(this.epalclasses$);

    }

    compareSchools(a: IRegionSchool,b: IRegionSchool) {
        if (a.order_id < b.order_id)
            return -1;
        if (a.order_id > b.order_id)
            return 1;
        return 0;
    }

    ngOnDestroy() {
        if (this.regionsSub)
            this.regionsSub.unsubscribe();
        if (this.sectorsSub)
            this.sectorsSub.unsubscribe();
        if (this.sectorFieldsSub)
            this.sectorFieldsSub.unsubscribe();
        this.regions$.unsubscribe();
        this.epalclasses$.unsubscribe();
        this.sectors$.unsubscribe();
        this.sectorFields$.unsubscribe();
    }

}
