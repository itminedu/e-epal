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
let HelperDataService = class HelperDataService {
    constructor(http) {
        this.http = http;
    }
    ;
    getCourseFields() {
        return new Promise((resolve, reject) => {
            this.http.get(`${app_settings_1.AppSettings.API_ENDPOINT}/coursefields/list`)
                .map(response => response.json())
                .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            }, () => console.log("Course Fields Received")); //run this code in all cases); */
        });
    }
    ;
    getSectorFields() {
        return new Promise((resolve, reject) => {
            this.http.get(`${app_settings_1.AppSettings.API_ENDPOINT}/sectorfields/list`)
                .map(response => response.json())
                .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            }, () => console.log("Sector Fields Received")); //run this code in all cases); */
        });
    }
    ;
    getRegionsWithSchools() {
        return new Promise((resolve, reject) => {
            this.http.get(`${app_settings_1.AppSettings.API_ENDPOINT}/regions/list`)
                .map(response => response.json())
                .subscribe(data => {
                //                console.log(data);
                resolve(this.transformRegionSchoolsSchema(data));
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            }, () => console.log("region schools service")); //run this code in all cases); */
        });
    }
    ;
    getSectorsWithCourses() {
        return new Promise((resolve, reject) => {
            this.http.get(`${app_settings_1.AppSettings.API_ENDPOINT}/coursesectorfields/list`)
                .map(response => response.json())
                .subscribe(data => {
                //                console.log(data);
                resolve(this.transformSectorCoursesSchema(data));
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            }, () => console.log("region schools service")); //run this code in all cases); */
        });
    }
    ;
    transformRegionSchoolsSchema(regionSchools) {
        let rsa = Array();
        let trackRegionId;
        let trackIndex;
        trackRegionId = "";
        trackIndex = -1;
        let j = 0;
        regionSchools.forEach(regionSchool => {
            if (trackRegionId !== regionSchool.region_id) {
                trackIndex++;
                rsa.push({ 'region_id': regionSchool.region_id, 'region_name': regionSchool.region_name, 'epals': Array() });
                trackRegionId = regionSchool.region_id;
            }
            rsa[trackIndex].epals.push({ 'epal_id': regionSchool.epal_id, 'epal_name': regionSchool.epal_name, 'globalIndex': j, 'selected': false });
            j++;
        });
        return rsa;
    }
    transformSectorCoursesSchema(sectorCourses) {
        let rsa = Array();
        let trackSectorId;
        let trackIndex;
        trackSectorId = "";
        trackIndex = -1;
        let j = 0;
        sectorCourses.forEach(sectorCourse => {
            if (trackSectorId !== sectorCourse.sector_id) {
                trackIndex++;
                rsa.push({ 'sector_id': sectorCourse.sector_id, 'sector_name': sectorCourse.sector_name, 'sector_selected': sectorCourse.sector_selected, 'courses': Array() });
                trackSectorId = sectorCourse.sector_id;
            }
            rsa[trackIndex].courses.push({ 'course_id': sectorCourse.course_id, 'course_name': sectorCourse.course_name, 'globalIndex': j, 'selected': false });
            j++;
        });
        return rsa;
    }
};
HelperDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], HelperDataService);
exports.HelperDataService = HelperDataService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWRhdGEtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHBlci1kYXRhLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHdDQUE0QztBQUM1Qyx3Q0FBeUM7QUFFekMsaUNBQStCO0FBTS9CLGtEQUE4QztBQUU5QyxNQUFNLE1BQU0sR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLGNBQU8sQ0FBQyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUdoRixJQUFhLGlCQUFpQixHQUE5QjtJQUNJLFlBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQzlCLENBQUM7SUFBQSxDQUFDO0lBQ0YsZUFBZTtRQUNYLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsMEJBQVcsQ0FBQyxZQUFZLG9CQUFvQixDQUFDO2lCQUM3RCxHQUFHLENBQUMsUUFBUSxJQUFvQixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2hELFNBQVMsQ0FBQyxJQUFJO2dCQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDLEVBQUUsd0RBQXdEO1lBQzNELEtBQUs7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsdUNBQXVDO2dCQUM5RSxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUNyQyxDQUFDLEVBQ0QsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFBLGlDQUFpQztRQUNsRixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFBQSxDQUFDO0lBRUYsZUFBZTtRQUNYLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9C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