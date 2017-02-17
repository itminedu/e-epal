import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
//import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';
//import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { StudentEpalChosen, StudentCourseChosen } from '../students/student';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'application-submit',
    template: `
      <application-preview-select></application-preview-select>
      <button type="button" class="btn-primary btn-lg pull-center" (click)="submitNow()">Υποβολή</button>
  `
})

@Injectable() export default class ApplicationSubmit implements OnInit {
    //private student;
    private studentepalchosen;
    private studentcoursechosen;

    constructor(private _ngRedux: NgRedux<IAppState>,
                private router: Router,
                private http: Http
            ) {
        //this.student = new Student(1, '', '', '', '', '', '', '','');
        this.studentepalchosen = new StudentEpalChosen(-1 ,-1 ,-1);
        this.studentcoursechosen = new StudentCourseChosen(-1 ,-1);
    };

    ngOnInit() {

    };

    submitNow() {
          //Get Student Data - use Observable ???
          /*
          this.studentDataFields$ = this._ngRedux.select(state => {
              state.studentDataFields.reduce(({}, studentDataField) =>{
                  return studentDataField;
              }, {});
              return state.studentDataFields;
          });
          */

          //Get Data - sync methods
          const { studentDataFields } = this._ngRedux.getState();
          const { epalclasses } = this._ngRedux.getState();
          const { regions } = this._ngRedux.getState();
          const { amkafills } = this._ngRedux.getState();
          const { sectors } = this._ngRedux.getState();

          //αποστολή στοιχείων μαθητή στο entity: epal_student
          let studentObj = studentDataFields["_tail"]["array"][0];
          studentObj.studentamka = amkafills["_tail"]["array"][0]["name"];
          studentObj.currentclass = epalclasses["_tail"]["array"][0]["name"];
          this.submitRecord("epal_student", studentObj);

          /*Τα επόμενα να πρχωρήσουν προς εκτέλεση, αφού γυρίσει ΕΠΙΤΥΧΩΣ η (ασύγχρονη) subitRecord για το entity: epalstudent
          //αποστολή επιλογών για σχολεία στο entity: epal_student_epal_chosen
          for (let l=0; l<regions.size; l++) {
              for (let m=0; m < regions["_tail"]["array"][l]["epals"].length; m++) {
                if (regions["_tail"]["array"][l]["epals"][m]["selected"] === true)  {
                  this.studentepalchosen.student_id = studentObj.epaluser_id;
                  this.studentepalchosen.epal_id = regions["_tail"]["array"][l]["epals"][m]["epal_id"];
                  this.studentepalchosen.choice_no = regions["_tail"]["array"][l]["epals"][m]["order_id"];
                  this.submitRecord("epal_student_epal_chosen", this.studentepalchosen);
                 }
               }
          }

          //αποστολή επιλογής για ειδικότητα στο entity: epal_student_course_field
          //αφορά μόνο τους μαθητές της Γ' Λυκείου
          if (studentObj.currentclass === "Γ' Λυκείου") {
            this.studentcoursechosen.student_id = studentObj.epaluser_id;
            for (let l=0; l<sectors.size; l++) {
                for (let m=0; m < sectors["_tail"]["array"][l]["courses"].length; m++) {
                  if (sectors["_tail"]["array"][l]["courses"][m]["selected"] === true)  {
                    this.studentcoursechosen.coursefield_id = sectors["_tail"]["array"][l]["courses"][m]["course_id"];
                    this.submitRecord("epal_student_course_field", this.studentcoursechosen);
                    //μοναδική επιλογή: φύγε από το loop
                    break;
                   }
                 }
            }
         }

         //αποστολή επιλογής για τομέα στο entity: epal_student_sector_field <-- ΔΕΝ ΤΟ ΕΧΩ ΦΤΙΑΞΕΙ ΑΚΟΜΑ!
         //αφορά μόνο τους μαθητές της B' Λυκείου
         */

  }

  submitRecord(entityName, record)  {
      let headers = new Headers({
         "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
        "Accept": "*/*",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
        // "Content-Type": "text/plain",  // try to skip preflight
        "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc"
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


}
