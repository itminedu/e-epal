import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { ICriter } from '../../store/criteria/criteria.types';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { ISectorFields } from '../../store/sectorfields/sectorfields.types';
import { IEpalClasses } from '../../store/epalclasses/epalclasses.types';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from '../../store/studentdatafields/studentdatafields.initial-state';
import { CRITERIA_INITIAL_STATE } from '../../store/criteria/criteria.initial-state';
import { REGION_SCHOOLS_INITIAL_STATE } from '../../store/regionschools/regionschools.initial-state';
import { EPALCLASSES_INITIAL_STATE } from '../../store/epalclasses/epalclasses.initial-state';
import { SECTOR_COURSES_INITIAL_STATE } from '../../store/sectorcourses/sectorcourses.initial-state';
import { SECTOR_FIELDS_INITIAL_STATE } from '../../store/sectorfields/sectorfields.initial-state';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import { Student, StudentEpalChosen, StudentCourseChosen, StudentSectorChosen, StudentCriteriaChosen } from '../students/student';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'application-submit',
    template: `
        <div class = "loading" *ngIf="(studentDataFields$ | async).size === 0 || (criteria$ | async).size === 0 || (regions$ | async).size === 0 || (epalclasses$ | async).size === 0 || (loginInfo$ | async).size === 0"></div>
        <application-preview-select></application-preview-select>
        <button type="button button-lg pull-right" *ngIf="(studentDataFields$ | async).size > 0 && (criteria$ | async).size > 0 && (regions$ | async).size > 0 && (epalclasses$ | async).size > 0 && (loginInfo$ | async).size > 0" class="btn-primary btn-lg pull-center" (click)="submitNow()">Υποβολή</button>
  `
})

@Injectable() export default class ApplicationSubmit implements OnInit {

    private authToken;
    private student;
    private epalSelected: Array<number> = new Array();
    private epalSelectedOrder: Array<number> = new Array();
    private studentCriteria: Array<number> = new Array();
    private courseSelected;
    private sectorSelected;
    private classSelected;
    private studentDataFields$: BehaviorSubject<IStudentDataFields>;
    private regions$: BehaviorSubject<IRegions>;
    private criteria$: BehaviorSubject<ICriter>;
    private sectors$: BehaviorSubject<ISectors>;
    private sectorFields$: BehaviorSubject<ISectorFields>;
    private epalclasses$: BehaviorSubject<IEpalClasses>;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    private studentDataFieldsSub: Subscription;
    private regionsSub: Subscription;
    private criteriaSub: Subscription;
    private sectorsSub: Subscription;
    private sectorFieldsSub: Subscription;
    private epalclassesSub: Subscription;
    private loginInfoSub: Subscription;

    constructor(private _ngRedux: NgRedux<IAppState>,
                private router: Router,
                private http: Http
            ) {

                this.regions$ = new BehaviorSubject(REGION_SCHOOLS_INITIAL_STATE);
                this.epalclasses$ = new BehaviorSubject(EPALCLASSES_INITIAL_STATE);
                this.sectors$ = new BehaviorSubject(SECTOR_COURSES_INITIAL_STATE);
                this.sectorFields$ = new BehaviorSubject(SECTOR_FIELDS_INITIAL_STATE);
                this.studentDataFields$ = new BehaviorSubject(STUDENT_DATA_FIELDS_INITIAL_STATE);
                this.criteria$ = new BehaviorSubject(CRITERIA_INITIAL_STATE);
                this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

    };

    ngOnInit() {
      this.loginInfoSub = this._ngRedux.select(state => {
          if (state.loginInfo.size > 0) {
              state.loginInfo.reduce(({}, loginInfoToken) => {
                  this.authToken = loginInfoToken.auth_token;
                  return loginInfoToken;
              }, {});
          }
          return state.loginInfo;
      }).subscribe(this.loginInfo$);

      this.epalclassesSub = this._ngRedux.select(state => {
        if (state.epalclasses.size > 0) {
            state.epalclasses.reduce(({}, epalclass) => {
                this.classSelected = epalclass.name;
                return epalclass;
            }, {});
        }
        return state.epalclasses;
      }).subscribe(this.epalclasses$);

      this.studentDataFieldsSub = this._ngRedux.select(state => {
          if (state.studentDataFields.size > 0) {
              state.studentDataFields.reduce(({}, studentDataField) => {
                  this.student = studentDataField;
                  return studentDataField;
              }, {});
          }
          return state.studentDataFields;
      }).subscribe(this.studentDataFields$);

      this.regionsSub = this._ngRedux.select(state => {
          state.regions.reduce((prevRegion, region) =>{
              region.epals.reduce((prevEpal, epal) =>{
                  if (epal.selected === true) {
                    this.epalSelected.push(Number(epal.epal_id));
                    this.epalSelectedOrder.push(epal.order_id);
                  }
                  return epal;
              }, {});
              return region;
          }, {});
          return state.regions;
      }).subscribe(this.regions$);

      this.criteriaSub = this._ngRedux.select(state => {
          if (state.criter.size > 0) {
              state.criter.reduce(({}, criteria) => {
                //code to be replaced in next version
                  if (criteria.selected === true && Number(criteria.id) !== 11)
                      this.studentCriteria.push(Number(criteria.id));

                  return criteria;
              }, {});
          }
          return state.criter;
      }).subscribe(this.criteria$);


      this.sectorsSub = this._ngRedux.select(state => {
          state.sectors.reduce((prevSector, sector) =>{
              sector.courses.reduce((prevCourse, course) =>{
                  if (course.selected === true) {
                    this.courseSelected = course.course_id
                  }
                  return course;
              }, {});
              return sector;
          }, {});
          return state.sectors;
      }).subscribe(this.sectors$);

      this.sectorFieldsSub = this._ngRedux.select(state => {
          state.sectorFields.reduce(({}, sectorField) =>{
            if (sectorField.selected === true) {
              this.sectorSelected = sectorField.id
            }
            return sectorField;
          }, {});
          return state.sectorFields;
      }).subscribe(this.sectorFields$);

    };

    ngOnDestroy() {
        if (this.studentDataFieldsSub) this.studentDataFieldsSub.unsubscribe();
        if (this.criteriaSub) this.criteriaSub.unsubscribe();
        if (this.regionsSub) this.regionsSub.unsubscribe();
        if (this.sectorsSub) this.sectorsSub.unsubscribe();
        if (this.sectorFieldsSub) this.sectorFieldsSub.unsubscribe();
        if (this.epalclassesSub) this.epalclassesSub.unsubscribe();
        if (this.loginInfoSub) this.loginInfoSub.unsubscribe();
    }

    submitNow() {
          //αποστολή στοιχείων μαθητή στο entity: epal_student
          let aitisiObj: Array<Student | StudentEpalChosen[] | StudentCriteriaChosen[] | StudentCourseChosen | StudentSectorChosen > = [];
          let epalObj: Array<StudentEpalChosen> = [];
          let criteriaObj: Array<StudentCriteriaChosen> = [];

          //aitisiObj[0] = studentDataFields["_tail"]["array"][0];
          aitisiObj[0] = this.student;
          aitisiObj[0]['currentclass'] = this.classSelected;
          //aitisiObj[0]['studentamka'] = ...;

          for (let i=0; i < this.epalSelected.length; i++)
            epalObj[i] =new StudentEpalChosen(null, this.epalSelected[i] , this.epalSelectedOrder[i]);
          aitisiObj['1'] =   epalObj;

          for (let i=0; i < this.studentCriteria.length; i++)
            criteriaObj[i] =new StudentCriteriaChosen(null, null, this.studentCriteria[i]);
          aitisiObj['2'] = criteriaObj;

          if (aitisiObj[0]['currentclass'] === "Β' Λυκείου" )
            aitisiObj['3'] =  new StudentSectorChosen(null, this.sectorSelected);
          else if (aitisiObj[0]['currentclass'] === "Γ' Λυκείου" )
            aitisiObj['3'] =  new StudentCourseChosen(null, this.courseSelected);

          //console.log(aitisiObj);

          this.submitRecord(aitisiObj);
  }

  submitRecord_ver1(entityName, record)  {
      let headers = new Headers({
         "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
        "Accept": "*/*",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
        // "Content-Type": "text/plain",  // try to skip preflight
        "X-CSRF-Token": "Me9oRh6jrAOAJ2rsnu_3lOLxqA_WMoJLeJ7dhe4HTBA"
      });

      let options = new RequestOptions({ headers: headers, withCredentials: true });
      let connectionString = `${AppSettings.API_ENDPOINT}/entity/` + entityName;
      //this.http.post(`${AppSettings.API_ENDPOINT}/entity/epal_student`, this.student, options)
      this.http.post(connectionString, record, options)
        // Call map on the response observable to get the parsed people object
        .map((res: Response) => res.json())
        .subscribe(success => {alert("Επιτυχής αποστολή στοιχείων στο entity: " + entityName); console.log("success post")}, // put the data returned from the server in our variable
        error => {alert("Αποτυχία αποστολής στοιχείων στο entity: " + entityName); console.log("Error HTTP POST Service")}, // in case of failure show this message
        () => console.log("write this message anyway"));//run this code in all cases);
  }


  submitRecord(record) {
    let auth_str = this.authToken + ":" + this.authToken;
    //let authTokenPost = "nkatsaounos" + ":" + "...";
    let authTokenPost = this.authToken + ":" + this.authToken;

    let headers = new Headers({
       "Authorization": "Basic " + btoa(authTokenPost),
       "Accept": "*/*",
       "Access-Control-Allow-Credentials": "true",
       "Content-Type": "application/json",
      // "X-CSRF-Token": "Pz3psGTGpc-EGNLm3tgzCpqEMg3HW0fCKf8xOnQLAsc"
    });

    //let headers = new Headers({
    //   "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
    //  "Accept": "*/*",
    //  "Access-Control-Allow-Credentials": "true",
    //  "Content-Type": "application/json",
    //  "X-CSRF-Token": "Pz3psGTGpc-EGNLm3tgzCpqEMg3HW0fCKf8xOnQLAsc"
    //});


    let options = new RequestOptions({ headers: headers,  method: "post", withCredentials: true });
    let connectionString = `${AppSettings.API_ENDPOINT}/epal/appsubmit`;

    this.http.post(connectionString, record, options)
      // Call map on the response observable to get the parsed people object
      .map((res: Response) => res.json())
      .subscribe(
      success => {alert("Επιτυχές post στο route υποβολής " ); console.log("success post"); }, // put the data returned from the server in our variable
      error => {alert("Αποτυχές post στο route υποβολής " ); console.log("Error HTTP POST Service")}, // in case of failure show this message
      () => console.log("write this message anyway"),

      );//run this code in all cases);

  //});

  }

}


//Get Data - sync methods
/*
const { studentDataFields } = this._ngRedux.getState();
const { epalclasses } = this._ngRedux.getState();
const { regions } = this._ngRedux.getState();
const { amkafills } = this._ngRedux.getState();
const { sectors } = this._ngRedux.getState();
*/
