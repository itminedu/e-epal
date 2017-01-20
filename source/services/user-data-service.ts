import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { IStudentDataField } from '../store/studentdatafields/studentdatafields.types';
import {AppSettings} from '../app.settings';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class UserDataService {
    constructor(private http: Http) {
    };
    getStudentDataFields() {

        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/studentList`)
            .map(response => <IStudentDataField[]>response.json())
            .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("Student Data Fields Received"));//run this code in all cases); */
        });
    };
}


/*
import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
//import { ICourseField } from '../store/coursefields/coursefields.types';
import { IStudentDataField } from '../store/studentdatafields/studentdatafields.types';
import {AppSettings} from '../app.settings';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
//export class HelperDataService {
export class UserDataService {
    constructor(private http: Http) {
    };
    getStudentDataFields() {

        return new Promise((resolve, reject) => {
            //this.http.get(`${AppSettings.API_ENDPOINT}/coursefields/list`)
            this.http.get(`${AppSettings.API_ENDPOINT}/studentList`)
            .map(response => <IStudentDataField[]>response.json())
            .subscribe(data => {
                console.log(data);
                resolve(data);
            },
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("Student Fields Received"));
        });
    };
}
*/
