import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { EPALCLASSES_INITIAL_STATE } from "../../store/epalclasses/epalclasses.initial-state";
import { IEpalClassRecords } from "../../store/epalclasses/epalclasses.types";
import { REGION_SCHOOLS_INITIAL_STATE } from "../../store/regionschools/regionschools.initial-state";
import { IRegionRecords, IRegionSchoolRecord } from "../../store/regionschools/regionschools.types";
import { SECTOR_COURSES_INITIAL_STATE } from "../../store/sectorcourses/sectorcourses.initial-state";
import { ISectorRecords } from "../../store/sectorcourses/sectorcourses.types";
import { SECTOR_FIELDS_INITIAL_STATE } from "../../store/sectorfields/sectorfields.initial-state";
import { ISectorFieldRecords } from "../../store/sectorfields/sectorfields.types";
import { IAppState } from "../../store/store";

@Component({
    selector: "application-preview-select",
    template: `
        <div *ngFor="let epalclass$ of epalclasses$ | async;">
        <h4 style="margin-top: 20px; line-height: 2em; ">Οι επιλογές μου</h4>
        <ul class="list-group left-side-view" style="margin-bottom: 20px;">
                <li class="list-group-item active">
                    Τάξη φοίτησης στο νέο σχολικό έτος
                </li>
                <li class="list-group-item" *ngIf="epalclass$.get('name') === '1'">
                    Α’ Λυκείου
                </li>
                <li class="list-group-item" *ngIf="epalclass$.get('name') === '2'">
                    Β’ Λυκείου
                </li>
                <li class="list-group-item" *ngIf="epalclass$.get('name') === '3'">
                    Γ’ Λυκείου
                </li>
                <li class="list-group-item" *ngIf="epalclass$.get('name') === '4'">
                    Δ’ Λυκείου
                </li>

        </ul>
        </div>

        <div *ngFor="let sectorField$ of sectorFields$ | async">
        <ul class="list-group left-side-view">
            <li class="list-group-item active" *ngIf="sectorField$.get('selected') === true" >
                {{sectorField$.get("name")}}
            </li>
            </ul>
        </div>

    <div *ngFor="let sector$ of sectors$  | async;">
            <ul class="list-group left-side-view" style="margin-bottom: 20px;" *ngIf="sector$.get('sector_selected') === true">
                <li class="list-group-item active" *ngIf="sector$.get('sector_selected') === true" >
                    {{sector$.get("sector_name") }}
                </li>
        <div *ngFor="let course$ of sector$.courses;" >

                <li class="list-group-item" *ngIf="course$.selected === true">
                    {{course$.get("course_name")   }}
                </li>

        </div>
            </ul>
        </div>

        <ul *ngIf="(selectedSchools$ | async)" class="list-group left-side-view" style="margin-bottom: 20px;">

                <div *ngFor="let epal$ of selectedSchools$ | async; let i=index; let isOdd=odd; let isEven=even" >

                <li class="list-group-item" [class.oddout]="isOdd" [class.evenout]="isEven">
                    <span class="roundedNumber">{{(i+1)}}</span>&nbsp;&nbsp;{{epal$.get("epal_name")}}
                </li>
              </div>
        </ul>
  `
})

@Injectable() export default class ApplicationPreview implements OnInit {
    private sectors$: BehaviorSubject<ISectorRecords>;
    private regions$: BehaviorSubject<IRegionRecords>;
    private selectedSchools$: BehaviorSubject<Array<IRegionSchoolRecord>> = new BehaviorSubject(Array());
    private sectorFields$: BehaviorSubject<ISectorFieldRecords>;
    private epalclasses$: BehaviorSubject<IEpalClassRecords>;
    private epalclassesSub: Subscription;
    private sectorsSub: Subscription;
    private regionsSub: Subscription;
    private sectorFieldsSub: Subscription;
    private courseActive = "-1";
    private numSelectedSchools = <number>0;
    private numSelectedOrder = <number>0;
    private classSelected = 0;
    private currentUrl: string;

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
        this.sectorsSub = this._ngRedux.select("sectors")
            .map(sectors => <ISectorRecords>sectors)
            .subscribe(scs => {
                scs.reduce((prevSector, sector) => {
                    sector.get("courses").reduce((prevCourse, course) => {
                        if (course.get("selected") === true) {
                            this.courseActive = course.get("course_id");
                        }

                        return course;
                    }, {});
                    return sector;
                }, {});
                this.sectors$.next(scs);
            });

        this.regionsSub = this._ngRedux.select("regions")
            .subscribe(regions => {
                let rgns = <IRegionRecords>regions;
                let numsel = 0, numsel2 = 0;
                let selectedSchools = Array<IRegionSchoolRecord>();
                rgns.reduce((prevRegion, region) => {
                    region.get("epals").reduce((prevEpal, epal) => {
                        if (epal.get("selected") === true) {
                            numsel++;
                            selectedSchools.push(epal);
                        }
                        if (epal.get("order_id") !== 0) {
                            numsel2++;
                        }
                        return epal;
                    }, {});
                    return region;
                }, {});
                this.numSelectedSchools = numsel;
                this.numSelectedOrder = numsel2;
                this.selectedSchools$.next(selectedSchools.sort(this.compareSchools));
            });

        this.sectorFieldsSub = this._ngRedux.select("sectorFields")
            .subscribe(sectorFields => {
                this.sectorFields$.next(<ISectorFieldRecords>sectorFields);
            }, error => { console.log("error selecting sectorFields"); });

        this.epalclassesSub = this._ngRedux.select("epalclasses")
            .subscribe(epalclasses => {
                let ecs = <IEpalClassRecords>epalclasses;
                ecs.reduce(({}, epalclass) => {
                    if (epalclass.get("name") === "Α' Λυκείου")
                        this.classSelected = 1;
                    else if (epalclass.get("name") === "Β' Λυκείου")
                        this.classSelected = 2;
                    else if (epalclass.get("name") === "Γ' Λυκείου")
                        this.classSelected = 3;
                    else if (epalclass.get("name") === "Δ' Λυκείου")
                        this.classSelected = 4;
                    return epalclass;
                }, {});
                this.epalclasses$.next(ecs);
            }, error => { console.log("error selecting epalclasses"); });

    }

    compareSchools(a: IRegionSchoolRecord, b: IRegionSchoolRecord) {
        if (a.order_id < b.order_id)
            return -1;
        if (a.order_id > b.order_id)
            return 1;
        return 0;
    }

    ngOnDestroy() {
        if (this.regionsSub) {
            this.regionsSub.unsubscribe();
        }
        if (this.sectorsSub) {
            this.sectorsSub.unsubscribe();
        }
        if (this.sectorFieldsSub) {
            this.sectorFieldsSub.unsubscribe();
        }
        if (this.epalclassesSub) {
            this.epalclassesSub.unsubscribe();
        }

    }

}
