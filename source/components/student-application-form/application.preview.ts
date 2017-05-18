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
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from '../../store/studentdatafields/studentdatafields.initial-state';
import { ICriteria, ICriter } from '../../store/criteria/criteria.types';
import { CRITERIA_INITIAL_STATE } from '../../store/criteria/criteria.initial-state';


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

        <div *ngIf="currentUrl === '/application-submit'">
              <div *ngFor="let studentDataField$ of studentDataFields$ | async;">
              <ul class="list-group left-side-view" style="margin-bottom: 20px;">
              <li class="list-group-item active">
                  Στοιχεία μαθητή
              </li>
              </ul>
              <div><label for="name">Όνομα μαθητή</label> <p class="form-control" id="name" style="border:1px solid #eceeef;">   {{studentDataField$.name}} </p> </div>
              <div><label for="studentsurname">Επώνυμο μαθητή</label> <p class="form-control" id = "studentsurname" style="border:1px solid #eceeef;"> {{studentDataField$.studentsurname}} </p></div>
              <div><label for="fatherfirstname">Όνομα Πατέρα</label> <p class="form-control" id = "fatherfirstname" style="border:1px solid #eceeef;"> {{studentDataField$.fatherfirstname}} </p></div>
              <div><label for="fathersurname">Επώνυμο Πατέρα</label> <p class="form-control" id = "fathersurname" style="border:1px solid #eceeef;"> {{studentDataField$.fathersurname}} </p></div>
              <div><label for="motherfirstname">Όνομα Μητέρας</label> <p class="form-control" id = "motherfirstname" style="border:1px solid #eceeef;"> {{studentDataField$.motherfirstname}} </p></div>
              <div><label for="mothersurname">Επώνυμο Μητέρας</label> <p class="form-control" id = "mothersurname" style="border:1px solid #eceeef;"> {{studentDataField$.mothersurname}} </p></div>
              <div><label for="birthdate">Ημερομηνία Γέννησης</label> <p class="form-control" id = "birthdate" style="border:1px solid #eceeef;"> {{studentDataField$.studentbirthdate}} </p></div>
                      <table>
                              <tr>
                                  <td>
                                      <div class="form-group">
                                          <label for="regionaddress">Διεύθυνση κατοικίας</label><p class="form-control" id = "regionaddress" style="border:1px solid #eceeef;"> {{studentDataField$.regionaddress}} </p>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="form-group">
                                          <label for="regiontk">TK </label><p class="form-control" id = "regiontk" style="border:1px solid #eceeef;"> {{studentDataField$.regiontk}} </p>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="form-group">
                                          <label for="regionarea">Πόλη/Περιοχή</label><p class="form-control" id = "regionarea" style="border:1px solid #eceeef;"> {{studentDataField$.regionarea}} </p>
                                      </div>
                                  </td>
                             </tr>
                      </table>
                      <div><label for="certificatetype">Τύπος απολυτηρίου</label> <p class="form-control" id = "certificatetype" style="border:1px solid #eceeef;"> {{studentDataField$.certificatetype}} </p></div>
                      <div><label for="telnum">Τηλέφωνο επικοινωνίας</label> <p class="form-control" id = "telnum" style="border:1px solid #eceeef;"> {{studentDataField$.telnum}} </p></div>
                      <div><label for="relationtostudent">Η αίτηση γίνεται από</label> <p class="form-control" id = "relationtostudent" style="border:1px solid #eceeef;"> {{studentDataField$.relationtostudent}} </p></div>

                      <ul class="list-group left-side-view" style="margin-bottom: 20px;">
                      <li class="list-group-item active">
                                  <div *ngIf="currentUrl === '/application-submit'">
                                         Κοινωνικά/Εισοδηματικά Κριτήρια
                                  </div>
                      </li>
                      </ul>
              </div>

            </div>
            <div *ngIf="currentUrl === '/application-submit'">
                  <div *ngFor="let criteriaField$ of criteriaFields$ | async;">
                  <div *ngIf="criteriaField$.selected === true">
                        {{criteriaField$.name}}
                  </div>
                  </div>
             </div>

  `
})

@Injectable() export default class ApplicationPreview implements OnInit {
    private sectors$: BehaviorSubject<ISectors>;
    private regions$: BehaviorSubject<IRegions>;
    private selectedSchools$: BehaviorSubject<Array<IRegionSchool>> = new BehaviorSubject(Array());
    private sectorFields$: BehaviorSubject<ISectorFields>;
    private criteriaFields$: BehaviorSubject<ICriter>;
    private studentDataFields$: BehaviorSubject<IStudentDataFields>;
    private epalclasses$: BehaviorSubject<IEpalClasses>;
    private sectorsSub: Subscription;
    private regionsSub: Subscription;
    private sectorFieldsSub: Subscription;
    private criteriaFieldsSub: Subscription;
    private studentDataFieldsSub: Subscription;
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
        this.criteriaFields$ = new BehaviorSubject(CRITERIA_INITIAL_STATE);
        this.studentDataFields$ = new BehaviorSubject(STUDENT_DATA_FIELDS_INITIAL_STATE);
    };

    ngOnInit() {
        this.currentUrl = this.router.url;
        console.log(this.currentUrl,"url");
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

        this.studentDataFieldsSub = this._ngRedux.select(state => {
            state.studentDataFields.reduce(({}, studentDataField) => {
                return studentDataField;
            }, {});
            return state.studentDataFields;
        }).subscribe(this.studentDataFields$);


        this.criteriaFieldsSub = this._ngRedux.select(state => {
            state.criter.reduce(({}, criteriaField) => {
                return criteriaField;
            }, {});
            return state.criter;
        }).subscribe(this.criteriaFields$);

        this._ngRedux.select(state => {
            state.epalclasses.reduce(({}, epalclass) => {
                if (epalclass.name === "Α' Λυκείου")
                    this.classSelected = 1;
                else if (epalclass.name === "Β' Λυκείου")
                    this.classSelected = 2;
                else if (epalclass.name === "Γ' Λυκείου")
                    this.classSelected = 3;
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
