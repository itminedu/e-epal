import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
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

import { Student, StudentEpalChosen, StudentCourseChosen, StudentSectorChosen, StudentCriteriaChosen } from '../students/student';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'application-submit',
    template: `
      <application-preview-select></application-preview-select>

      <div class = "loading" *ngIf="showLoaderLogin$ | async"></div>
      <div class = "loading" *ngIf="showLoaderClasses$ | async"></div>
      <div class = "loading" *ngIf="showLoaderStudent$ | async"></div>
      <div class = "loading" *ngIf="showLoaderSchools$ | async"></div>
      <div class = "loading" *ngIf="showLoaderCriteria$ | async"></div>
      <div class = "loading" *ngIf="showLoaderCourses$ | async"></div>
      <div class = "loading" *ngIf="showLoaderSectors$ | async"></div>

      <!--
      <div *ngFor="let loginInfoToken$ of loginInfo$ | async;"> </div>
      <div *ngFor="let epalclass$ of epalclasses$ | async;"> </div>
      <div *ngFor="let studentDataField$ of studentDataFields$ | async; "> </div>
      <div *ngFor="let region$ of regions$ | async;">
        <div *ngFor="let epal$ of region$.epals "> </div> </div>
      <div *ngFor="let sector$ of sectors$ | async;">
        <div *ngFor="let course$ of sector$.courses;"> </div> </div>
      <div *ngFor="let sectorField$ of sectorFields$ | async;"></div>
      <div *ngFor="let criter$ of criteria$ | async;"> </div>
      -->

      <button type="button" class="btn-primary btn-lg pull-center" (click)="submitNow()">Υποβολή</button>
      
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

    private showLoaderLogin$: Observable<boolean>;
    private showLoaderClasses$: Observable<boolean>;
    private showLoaderStudent$: Observable<boolean>;
    private showLoaderSchools$: Observable<boolean>;
    private showLoaderCriteria$: Observable<boolean>;
    private showLoaderCourses$: Observable<boolean>;
    private showLoaderSectors$: Observable<boolean>;

    private studentDataFields$: Observable<IStudentDataFields>;
    private regions$: Observable<IRegions>;
    private criteria$: Observable<ICriter>;
    private sectors$: Observable<ISectors>;
    private sectorFields$: Observable<ISectorFields>;
    private epalclasses$: Observable<IEpalClasses>;
    private loginInfo$: Observable<ILoginInfo>;

    constructor(private _ngRedux: NgRedux<IAppState>,
                private router: Router,
                private http: Http
            ) {
    };

    ngOnInit() {
      this.loginInfo$ = this._ngRedux.select(state => {
          if (state.loginInfo.size > 0) {
              state.loginInfo.reduce(({}, loginInfoToken) => {
                  this.authToken = loginInfoToken.auth_token;
                  return loginInfoToken;
              }, {});
          }
          return state.loginInfo;
      });
      this.showLoaderLogin$ = this.loginInfo$.map(loginInfo => loginInfo.size === 0);

      this.epalclasses$ = this._ngRedux.select(state => {
        if (state.epalclasses.size > 0) {
            state.epalclasses.reduce(({}, epalclass) => {
                this.classSelected = epalclass.name;
                return epalclass;
            }, {});
        }
        return state.epalclasses;
      });
      this.showLoaderClasses$ = this.epalclasses$.map(epalclasses => epalclasses.size === 0);

      this.studentDataFields$ = this._ngRedux.select(state => {
          if (state.studentDataFields.size > 0) {
              state.studentDataFields.reduce(({}, studentDataField) => {
                  this.student = studentDataField;
                  return studentDataField;
              }, {});
          }
          return state.studentDataFields;
      });
      this.showLoaderStudent$ = this.studentDataFields$.map(studentDataFields => studentDataFields.size === 0);

      this.regions$ = this._ngRedux.select(state => {
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
      });
      this.showLoaderSchools$ = this.regions$.map(regions => regions.size === 0);

      this.criteria$ = this._ngRedux.select(state => {
          if (state.criter.size > 0) {
              state.criter.reduce(({}, criteria) => {
                //code to be replaced in next version
                  if (criteria.selected === true && Number(criteria.id) !== 11)
                      this.studentCriteria.push(Number(criteria.id));

                  return criteria;
              }, {});
          }
          return state.criter;
      });
      this.showLoaderCriteria$ = this.criteria$.map(criter => criter.size === 0);

      /*
      this.criteria$ = this._ngRedux.select(state => {
          if (state.criter.size > 0) {
              state.criter.reduce(({}, criteria) => {
                //code to be replaced in next version
                  if (criteria.orphanmono === true)
                    this.studentCriteria.push(6);
                  else if (criteria.orphantwice === true)
                    this.studentCriteria.push(1);
                  if (criteria.threechildren === true)
                    this.studentCriteria.push(11);
                  else if (criteria.manychildren === true)
                    this.studentCriteria.push(2);
                  if (criteria.twins === true)
                    this.studentCriteria.push(3);
                  if (criteria.disability === true)
                    this.studentCriteria.push(5);
                  if (criteria.studies === true)
                    this.studentCriteria.push(4);
                  if (criteria.income === '<= 3000 Ευρώ')
                    this.studentCriteria.push(7);
                  else if (criteria.income === '<= 6000 Ευρώ')
                    this.studentCriteria.push(8);
                  else if (criteria.income === '<= 9000 Ευρώ')
                    this.studentCriteria.push(9);

                  return criteria;
              }, {});
          }
          return state.criter;
      });
      this.showLoaderCriteria$ = this.criteria$.map(criter => criter.size === 0);
      */

      this.sectors$ = this._ngRedux.select(state => {
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
      });
      this.showLoaderCourses$ = this.sectors$.map(sectors => sectors.size === 0 && this.classSelected === "Γ' Λυκείου");

      this.sectorFields$ = this._ngRedux.select(state => {
          state.sectorFields.reduce(({}, sectorField) =>{
            if (sectorField.selected === true) {
              this.sectorSelected = sectorField.id
            }
            return sectorField;
          }, {});
          return state.sectorFields;
      });

      this.showLoaderSectors$ = this.sectorFields$.map(sectorFields => sectorFields.size === 0 && this.classSelected === "Β' Λυκείου");


    };

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
