import {Http, Headers, RequestOptions} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { ICourseField } from '../store/coursefields/coursefields.types';
import { ISectorField } from '../store/sectorfields/sectorfields.types';
import { IRegion, IRegions, IRegionSchool } from '../store/regionschools/regionschools.types';
import { ISector, ISectors, ISectorCourse } from '../store/sectorcourses/sectorcourses.types';
//import { IClassField } from '../store/classfields/classfields.types';
import { AppSettings } from '../app.settings';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../store/store';
import { ILoginInfo, ILoginInfoToken } from '../store/logininfo/logininfo.types';


const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class HelperDataService {

    private authToken: string;
    private loginInfo$: Observable<ILoginInfo>;

    constructor(
        private http: Http,
        private _ngRedux: NgRedux<IAppState>) {
            this.loginInfo$ = this._ngRedux.select(state => {
                if (state.loginInfo.size > 0) {
                    state.loginInfo.reduce(({}, loginInfoToken) => {
                        this.authToken = loginInfoToken.auth_token;
                        return loginInfoToken;
                    }, {});
                }
                return state.loginInfo;
            });

    };

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Basic ' + btoa(this.authToken + ':' + this.authToken));
    }

    getEpalUserData() {
        this.loginInfo$.forEach(loginInfoToken => {
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/userdata`, options)
            .map(response => response.json());
    };

    getCourseFields() {

        this.loginInfo$.forEach(loginInfoToken => {
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",

            "Content-Type": "application/json",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "EHu964c7gN7M399UfHiHHv06x1Tx5cl-P-9ZyMdmGbw",
//            "X-oauth-enabled": "true",
//            "X-Auth-Token": this.authToken
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/coursefields/list`, options)
            .map(response => <ICourseField[]>response.json())
            .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("Course Fields Received"));//run this code in all cases); */
        });
    };

    getSectorFields() {
        this.loginInfo$.forEach(loginInfoToken => {
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
            "Content-Type": "application/json",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
//            "X-oauth-enabled": "true",
//            "X-Auth-Token": this.authToken
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/sectorfields/list`, options)
            .map(response => <ISectorField[]>response.json())
            .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("Sector Fields Received"));//run this code in all cases); */
        });
    };

    getRegionsWithSchools(classActive,courseActive) {
        this.loginInfo$.forEach(loginInfoToken => {
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
            "Content-Type": "application/json",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
//            "X-oauth-enabled": "true",
//            "X-Auth-Token": this.authToken
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            let getConnectionString = null;

            //if (courseActive === -1)
            if (classActive === 1)
              getConnectionString = `${AppSettings.API_ENDPOINT}/regions/list`;
              else if (classActive === 2)
                  getConnectionString = `${AppSettings.API_ENDPOINT}/sectorsperschool/list?sector_id=${courseActive}`;
            else if (classActive === 3)
              getConnectionString = `${AppSettings.API_ENDPOINT}/coursesperschool/list?course_id=${courseActive}`;

            this.http.get(getConnectionString, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(this.transformRegionSchoolsSchema(data));
                }, // put the data returned from the server in our variable
                error => {
                    console.log("Error HTTP GET Service"); // in case of failure show this message
                    reject("Error HTTP GET Service");
                },
                () => console.log("region schools service"));//run this code in all cases); */
        });
    };

    getSectorsWithCourses() {
        this.loginInfo$.forEach(loginInfoToken => {
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
            "Content-Type": "application/json",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
//            "X-oauth-enabled": "true",
//            "X-Auth-Token": this.authToken
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/coursesectorfields/list`, options)
            .map(response => response.json())
            .subscribe(data => {
                resolve(this.transformSectorCoursesSchema(data));
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("region schools service"));//run this code in all cases); */
        });
    };

    transformRegionSchoolsSchema(regionSchools: any) {
        let rsa = Array<IRegion>();
        let trackRegionId: string;
        let trackIndex: number;

        trackRegionId = "";
        trackIndex = -1;

        let j=0;
        regionSchools.forEach(regionSchool => {
            if (trackRegionId !== regionSchool.region_id) {
                trackIndex++;
                rsa.push(<IRegion>{'region_id': regionSchool.region_id, 'region_name': regionSchool.region_name, 'epals': Array<IRegionSchool>()});
                trackRegionId = regionSchool.region_id;
            }
            rsa[trackIndex].epals.push(<IRegionSchool>{'epal_id': regionSchool.epal_id, 'epal_name': regionSchool.epal_name, 'globalIndex': j, 'selected': false, 'order_id': 0});
            j++;
        });
        return rsa;
    }

    transformSectorCoursesSchema(sectorCourses: any) {
        let rsa = Array<ISector>();
        let trackSectorId: string;
        let trackIndex: number;

        trackSectorId = "";
        trackIndex = -1;

        let j=0;
        sectorCourses.forEach(sectorCourse => {
            if (trackSectorId !== sectorCourse.sector_id) {
                trackIndex++;
                rsa.push(<ISector>{'sector_id': sectorCourse.sector_id, 'sector_name': sectorCourse.sector_name, 'sector_selected': false, 'courses': Array<ISectorCourse>()});
                trackSectorId = sectorCourse.sector_id;
            }
            rsa[trackIndex].courses.push(<ISectorCourse>{'course_id': sectorCourse.course_id, 'course_name': sectorCourse.course_name, 'globalIndex': j, 'selected': false});
            j++;
        });
        return rsa;
    }

    getCriteria() {
        this.loginInfo$.forEach(loginInfoToken => {
            console.log(loginInfoToken.get(0));
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/criteria/list`, options)
            .map(response => <ISectorField[]>response.json())
            .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("Sector Fields Received"));//run this code in all cases); */
        });
    };

    getCurrentUser(oauthtoken, oauthrole) {

        this.authToken = oauthtoken;
        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
            "Content-Type": "application/json",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
//            "X-oauth-enabled": "true",
//            "X-Auth-Token": this.authToken
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
           return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/epal/curuser`, options)
            .map(response => response.json())
            .subscribe(data => {
                resolve(this.transformUserSchema(data, oauthtoken, oauthrole));
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("UserName Received"));
        });
}


transformUserSchema(userlogin:any,oauthtoken:string, oauthrole:string){
        let rsa = Array<ILoginInfoToken>();

            rsa.push(<ILoginInfoToken>{'auth_token': oauthtoken, 'auth_role': oauthrole, 'cu_name':userlogin.name});
        return rsa;

        }

    signOut() {
        this.loginInfo$.forEach(loginInfoToken => {
            this.authToken = loginInfoToken.get(0).auth_token;
        });
        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",


           "Content-Type": "application/json",
            "Accept": "*/*",
            "Access-Control-Allow-Credentials": "true",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "EoAZ0APpIbbewK5MNzRrCFkvEeZZoGQsBslWFTrZ8bI",
//            "X-oauth-enabled": "true",
//            "X-Auth-Token": this.authToken
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/oauth/logout`, {}, options)
            .map(response => response)
            .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error Logout"); // in case of failure show this message
                reject("Error Logout");
            },
            () => console.log("Logging out"));//run this code in all cases); */
        });
    }


}
