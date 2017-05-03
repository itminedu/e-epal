import {Http, Headers, RequestOptions} from '@angular/http';
import {Injectable, OnInit, OnDestroy} from '@angular/core';
import {BehaviorSubject} from "rxjs/Rx";
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
import { LOGININFO_INITIAL_STATE } from '../store/logininfo/logininfo.initial-state';
import { SCHOOL_ROLE, STUDENT_ROLE, PDE_ROLE, DIDE_ROLE, MINISTRY_ROLE } from '../constants';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class HelperDataService implements OnInit, OnDestroy {

    private authToken: string;
    private authRole: string;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private loginInfo$: BehaviorSubject<ILoginInfo>;

    constructor(
        private http: Http,
        private _ngRedux: NgRedux<IAppState>) {
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

    };

    ngOnInit() {
        this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    //this.minedu_userName = loginInfoToken.minedu_username;
                    //this.minedu_userPassword = loginInfoToken.minedu_userpassword;
                    return loginInfoToken;
                }, {});
            }
            return state.loginInfo;
        }).subscribe(this.loginInfo$);

    }

    ngOnDestroy() {
        this.loginInfo$.unsubscribe();
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Basic ' + btoa(this.authToken + ':' + this.authToken));
    }

    createMinistryAuthorizationHeader(headers: Headers, username: string, passwd: string) {
        headers.append('Authorization', 'Basic ' + btoa(username + ':' + passwd));
    }

    getEpalUserData() {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/userdata`, options)
            .map(response => response.json());
    };

    sendVerificationCode(email) {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
            //            "Accept": "*/*",
            //            "Access-Control-Allow-Credentials": "true",
        });
        this.createAuthorizationHeader(headers);
        //        let options = new RequestOptions({ headers: headers, withCredentials: true });
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/epal/user/sendvercode`, { userEmail: email }, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(data);
                }, // put the data returned from the server in our variable
                error => {
                    console.log("Error Sending Verification Code"); // in case of failure show this message
                    reject("Error Sending Verification Code");
                },
                () => console.log("Sending Verification Code"));//run this code in all cases); */
        });
    }

    verifyVerificationCode(verificationCode) {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
            //            "Accept": "*/*",
            //            "Access-Control-Allow-Credentials": "true",
        });
        this.createAuthorizationHeader(headers);
        //        let options = new RequestOptions({ headers: headers, withCredentials: true });
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/epal/user/verifyvercode`, { verificationCode: verificationCode }, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(<any>data);
                }, // put the data returned from the server in our variable
                error => {
                    console.log("Error Verifying Verification Code"); // in case of failure show this message
                    reject("Error Verifying Verification Code");
                },
                () => console.log("Verifying Verification Code"));//run this code in all cases); */
        });
    }

    saveProfile(userProfile) {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/epal/user/save`, { userProfile: userProfile }, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(data);
                },
                error => {
                    console.log("Error Saving Profile");
                    reject("Error Saving Profile");
                },
                () => console.log("Saving Profile"));
        });
    }

    getCourseFields() {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
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
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
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

    getRegionsWithSchools(classActive, courseActive) {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
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
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
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

        let j = 0;
        regionSchools.forEach(regionSchool => {
            if (trackRegionId !== regionSchool.region_id) {
                trackIndex++;
                rsa.push(<IRegion>{ 'region_id': regionSchool.region_id, 'region_name': regionSchool.region_name, 'epals': Array<IRegionSchool>() });
                trackRegionId = regionSchool.region_id;
            }
            rsa[trackIndex].epals.push(<IRegionSchool>{ 'epal_id': regionSchool.epal_id, 'epal_name': regionSchool.epal_name, 'epal_special_case': regionSchool.epal_special_case, 'globalIndex': j, 'selected': false, 'order_id': 0 });
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

        let j = 0;
        sectorCourses.forEach(sectorCourse => {
            if (trackSectorId !== sectorCourse.sector_id) {
                trackIndex++;
                rsa.push(<ISector>{ 'sector_id': sectorCourse.sector_id, 'sector_name': sectorCourse.sector_name, 'sector_selected': false, 'courses': Array<ISectorCourse>() });
                trackSectorId = sectorCourse.sector_id;
            }
            rsa[trackIndex].courses.push(<ISectorCourse>{ 'course_id': sectorCourse.course_id, 'course_name': sectorCourse.course_name, 'globalIndex': j, 'selected': false });
            j++;
        });
        return rsa;
    }

    getCriteria() {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/criteria/list`, options)
                //this.http.get(`${AppSettings.API_ENDPOINT}/criteria/list?category=${category}`, options)
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
        this.authRole = oauthrole;

        //console.log("MIPOS");

        let headers = new Headers({
//             "Authorization": "Basic " + btoa(this.authToken + ':' + this.authToken),
    //        "Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            // "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
//            "Authorization": "Basic " + "aGFyaXNwOmhhcmlzcGFzcw==",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
        //    "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc",
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

    setMineduCurrentUser(minedu_username, minedu_pwd, role) {
        this.minedu_userName = minedu_username;
        this.minedu_userPassword = minedu_pwd;
        this.authRole = role;
      }


    transformUserSchema(userlogin: any, oauthtoken: string, oauthrole: string) {
        let rsa = Array<ILoginInfoToken>();

        rsa.push(<ILoginInfoToken>{ 'auth_token': oauthtoken, 'auth_role': oauthrole, 'cu_name': userlogin.name });
        return rsa;

    }

    signOut() {
        //loginInfo$ take values only in case getCurrentUser (epal module) has been used ...WHY? TO BE CHECKED..
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });

        let headers = new Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            "Content-Type": "application/json",
//            "Accept": "*/*",
//            "Access-Control-Allow-Credentials": "true",
//            "Access-Control-Allow-Origin": "*",
            //"X-CSRF-Token": "EoAZ0APpIbbewK5MNzRrCFkvEeZZoGQsBslWFTrZ8bI",
            //            "X-oauth-enabled": "true",
            //            "X-Auth-Token": this.authToken
        });

        if (this.authRole === MINISTRY_ROLE)
          this.createMinistryAuthorizationHeader(headers, this.minedu_userName, this.minedu_userPassword);
        else
          this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        let logoutRoute = '/oauth/logout';
        if (this.authRole === SCHOOL_ROLE || this.authRole === PDE_ROLE || this.authRole === DIDE_ROLE)
          logoutRoute = '/cas/logout';
        else if (this.authRole === MINISTRY_ROLE)
          logoutRoute = '/ministry/logout';

        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}${logoutRoute}${AppSettings.API_ENDPOINT_PARAMS}`, {}, options)
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




    getSubmittedPreviw() {


        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/subapplic`, options)
            .map(response => response.json());
    }


    getStudentDetails(headerid) {
        let headerIdNew = headerid.toString();
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/student/` + headerIdNew, options)
            .map(response => response.json());
    }


    getEpalchosen(headerid) {
        let headerIdNew = headerid.toString();
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/epalchosen/` + headerIdNew, options)
            .map(response => response.json());
    }


    getSectorPerSchool(SchoolId) {
        let SchoolIdNew = SchoolId.toString();
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/sectorperSchool/` + SchoolIdNew, options)
            .map(response => response.json());
    }

    getSpecialityPerSchool(SchoolId, SectorId) {
        let SchoolIdNew = SchoolId.toString();
        let SectorIdNew = SectorId.toString();
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/specialityperSchool/` + SchoolIdNew + '/' + SectorIdNew, options)
            .map(response => response.json());
    }



    getStudentPerSchool(SchoolId, SelectId, classId, limitdown, limitup) {
        let SchoolIdNew = SchoolId.toString();
        let SelectIdNew = SelectId.toString();


        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });

        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/studentperSchool/` + SchoolIdNew + '/' + SelectIdNew + '/' + classId + '/' + limitdown + '/' + limitup, options)
            .map(response => response.json());
    }



    saveConfirmStudents(students) {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/epal/confirmstudent`, { students }, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(data);
                },
                error => {
                    console.log("Error Saving Profile");
                    reject("Error Saving Profile");
                },
                () => console.log("Saving Profile"));
        });

    }



    saveCapacity(taxi, tomeas, specialit, capacity, schoolid) {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/epal/savecapacity/` + taxi + '/' + tomeas + '/' + specialit + '/' + schoolid, { capacity }, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(data);
                },
                error => {
                    console.log("Error Saving Capacity");
                    reject("Error Saving Capacity");
                },
                () => console.log("Saving Capacity"));
        });

    }

    sendMinisrtyCredentials(username, userpassword) {

        let headers = new Headers({
            "Content-Type": "application/json",
            //"Accept": "*/*",
            //"Access-Control-Allow-Credentials": "true",
            //"X-CSRF-Token": "..."
            //"Authorization": "Basic " + btoa("..."),
        });
        this.createMinistryAuthorizationHeader(headers, username, userpassword);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/ministry/login`,  {username: username, userpassword: userpassword}, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(data);
                },
                error => {
                    reject("Error Sending Ministry Credentials");
                },
                () => console.log(""));
        });

    }

    makeDistribution(username, userpassword) {

        let headers = new Headers({
            "Content-Type": "application/json",
        });

        this.createMinistryAuthorizationHeader(headers, username, userpassword );
        let options = new RequestOptions({ headers: headers });

        //return this.http.get(`${AppSettings.API_ENDPOINT}/epal/distribution/` , options)
        //    .map(response => response.json());

        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}/epal/distribution`, {username: username, userpassword: userpassword}, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(data);
                },
                error => {
                    reject("Error POST in makeDistribution");
                },
                () => console.log(""));
        });

    }


    makeReport(username, userpassword, routepath) {

        let headers = new Headers({
            "Content-Type": "application/json",
        });

        this.createMinistryAuthorizationHeader(headers, username, userpassword );
        let options = new RequestOptions({ headers: headers });

        return this.http.get(`${AppSettings.API_ENDPOINT}` + routepath , options)
            .map(response => response.json());

    }


    getSchoolPerPerfecture(PerfectureId) {
        console.log(PerfectureId,"a");
        let PerfectureIdNew = PerfectureId.toString();


        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        console.log("authToken=" + this.authToken);
        console.log("authRole=" + this.authRole);


        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/ScoolperPerf/` + PerfectureIdNew , options)
            .map(response => response.json());
    }

    getCoursePerPerfecture(PerfectureId){
        console.log(PerfectureId,"a");
        let PerfectureIdNew = PerfectureId.toString();


        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        console.log("authToken=" + this.authToken);
        console.log("authRole=" + this.authRole);


        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/CoursesperSch/` + PerfectureIdNew , options)
            .map(response => response.json());
}




}
