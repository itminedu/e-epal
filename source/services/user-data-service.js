"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const http_1 = require("@angular/http");
const core_1 = require("@angular/core");
require("rxjs/add/operator/map");
const app_settings_1 = require("../app.settings");
const HEADER = { headers: new http_1.Headers({ 'Content-Type': 'application/json' }) };
let UserDataService = class UserDataService {
    constructor(http) {
        this.http = http;
    }
    ;
    getStudentDataFields() {
        return new Promise((resolve, reject) => {
            this.http.get(`${app_settings_1.AppSettings.API_ENDPOINT}/studentList`)
                .map(response => response.json())
                .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            }, () => console.log("Student Data Fields Received")); //run this code in all cases); */
        });
    }
    ;
};
UserDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserDataService);
exports.UserDataService = UserDataService;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLWRhdGEtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0NBQTRDO0FBQzVDLHdDQUF5QztBQUV6QyxpQ0FBK0I7QUFFL0Isa0RBQTRDO0FBRTVDLE1BQU0sTUFBTSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksY0FBTyxDQUFDLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBRSxDQUFDO0FBR2hGLElBQWEsZUFBZSxHQUE1QjtJQUNJLFlBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQzlCLENBQUM7SUFBQSxDQUFDO0lBQ0Ysb0JBQW9CO1FBRWhCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsMEJBQVcsQ0FBQyxZQUFZLGNBQWMsQ0FBQztpQkFDdkQsR0FBRyxDQUFDLFFBQVEsSUFBeUIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNyRCxTQUFTLENBQUMsSUFBSTtnQkFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxFQUFFLHdEQUF3RDtZQUMzRCxLQUFLO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztnQkFDOUUsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDckMsQ0FBQyxFQUNELE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQSxpQ0FBaUM7UUFDeEYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQUEsQ0FBQztDQUNMLENBQUE7QUFsQlksZUFBZTtJQUQzQixpQkFBVSxFQUFFO3FDQUVpQixXQUFJO0dBRHJCLGVBQWUsQ0FrQjNCO0FBbEJZLDBDQUFlO0FBcUI1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWtDRSJ9