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
import { CookieService } from 'ngx-cookie';


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
        private _ngRedux: NgRedux<IAppState>,
        private _cookieService:CookieService) {
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);


    };

    ngOnInit() {
        this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
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
            "Content-Type": "application/json",
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
            "Content-Type": "application/json",
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
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            let getConnectionString = null;

            if (classActive === 1)
                getConnectionString = `${AppSettings.API_ENDPOINT}/regions/list`;
            else if (classActive === 2)
                getConnectionString = `${AppSettings.API_ENDPOINT}/sectorsperschool/list?sector_id=${courseActive}`;
            else if (classActive === 3)
                getConnectionString = `${AppSettings.API_ENDPOINT}/coursesperschool/list?course_id=${courseActive}`;
            else if (classActive === 4)
                getConnectionString = `${AppSettings.API_ENDPOINT}/coursesperschool_night/list?course_id=${courseActive}`;

            this.http.get(getConnectionString, options)
                .map(response => response.json())
                .subscribe(data => {
                    resolve(this.transformRegionSchoolsSchema(data));
                }, // put the data returned from the server in our variable
                error => {
                    console.log("Error HTTP GET Service in getRegionsWithSchools method"); // in case of failure show this message
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
            "Content-Type": "application/json",
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

        let headers = new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": "true",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/epal/curuser`, options)
                .map(response => response.json())
                .subscribe(data => {
                    window.onbeforeunload = function (e) {
                        var confirmationMessage = "\o/";
                        e.returnValue = confirmationMessage;
                        return confirmationMessage;
                    };
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

        rsa.push(<ILoginInfoToken>{
            'auth_token': oauthtoken,
            'auth_role': oauthrole,
            'cu_name': userlogin.cu_name,
            'cu_surname': userlogin.cu_surname,
            'cu_fathername': userlogin.cu_fathername,
            'cu_mothername': userlogin.cu_mothername,
            'cu_email': userlogin.cu_email,
            'minedu_username': userlogin.minedu_username,
            'minedu_userpassword': userlogin.minedu_userpassword,
            'lock_capacity': parseInt(userlogin.lock_capacity),
            'lock_students': parseInt(userlogin.lock_students),
            'lock_application': parseInt(userlogin.lock_application),
            'disclaimer_checked': parseInt(userlogin.disclaimer_checked)
        });
        return rsa;

    }

    signOut() {
        //loginInfo$ take values only in case getCurrentUser (epal module) has been used ...WHY? TO BE CHECKED..
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });

        let headers = new Headers({
            "Content-Type": "application/json",

        });

        if (this.authRole === MINISTRY_ROLE)
          this.createMinistryAuthorizationHeader(headers, this.minedu_userName, this.minedu_userPassword);
        else
          this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        let logoutRoute = '/oauth/logout';
        if (this.authRole === SCHOOL_ROLE || this.authRole === PDE_ROLE || this.authRole === DIDE_ROLE) {
          logoutRoute = '/cas/logout';
        }
        else if (this.authRole === MINISTRY_ROLE)
          logoutRoute = '/ministry/logout';

        return new Promise((resolve, reject) => {
            this.http.post(`${AppSettings.API_ENDPOINT}${logoutRoute}${AppSettings.API_ENDPOINT_PARAMS}`, {}, options)
                .map(response => response.json())
                .subscribe(data => {
                    this._cookieService.removeAll();
                    window.onbeforeunload = function () {console.log("unloading")};
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


    getSectorPerSchool() {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/sectorperSchool/` , options)
            .map(response => response.json());
    }


    getSpecialityPerSchool( SectorId) {

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
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/specialityperSchool/` + SectorIdNew, options)
            .map(response => response.json());
    }



    getStudentPerSchool( SelectId, classId, limitdown, limitup) {

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
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/studentperSchool/` + SelectIdNew + '/' + classId + '/' + limitdown + '/' + limitup, options)
            .map(response => response.json());
    }



    saveConfirmStudents(students, type) {
        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${AppSettings.API_ENDPOINT}/epal/confirmstudent`, { students, type}, options)
            .map(response => response.json());


    }



    saveCapacity(taxi, tomeas, specialit, capacity) {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${AppSettings.API_ENDPOINT}/epal/savecapacity/` + taxi + '/' + tomeas + '/' + specialit, { capacity }, options)
            .map(response => response.json());

    }

    sendMinisrtyCredentials(username, userpassword) {

        let headers = new Headers({
            "Content-Type": "application/json",
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


    makeReport(username, userpassword, routepath, regionsel, adminsel, schsel, clsel, secsel, coursel, distribfinal) {

        let headers = new Headers({
            "Content-Type": "application/json",
        });

        this.createMinistryAuthorizationHeader(headers, username, userpassword );
        let options = new RequestOptions({ headers: headers });

        if (routepath == "/ministry/general-report/") {
            return this.http.get(`${AppSettings.API_ENDPOINT}` + routepath  , options)
                .map(response => response.json());
        }
        else if (routepath == "/ministry/report-completeness/") {
          return this.http.get(`${AppSettings.API_ENDPOINT}` + routepath + regionsel + "/" + adminsel + "/"  + schsel  , options)
                .map(response => response.json());
        }
        else if (routepath == "/ministry/report-all-stat/"){
            return this.http.get(`${AppSettings.API_ENDPOINT}` + routepath + regionsel + "/" + adminsel + "/"  + schsel + "/"  +
                                  clsel + "/"  + secsel + "/"  + coursel + "/" + distribfinal , options)
                .map(response => response.json());
          }
          else if (routepath == "/ministry/report-no-capacity/"){
              let capacityFilter = 0;
              if (regionsel)
                capacityFilter = 1;
              return this.http.get(`${AppSettings.API_ENDPOINT}` + routepath + capacityFilter, options)
                  .map(response => response.json());
            }

    }

    informUnlocatedStudents(username, userpassword, unallocated) {

      let headers = new Headers({
          "Content-Type": "application/json",
      });
      this.createMinistryAuthorizationHeader(headers, username, userpassword );
      let options = new RequestOptions({ headers: headers });

      let route="";
      if (unallocated == true)
        route = "ministry/send-unallocated-massive-mail";
      else
        route = "ministry/send-located-massive-mail";

      return this.http.get(`${AppSettings.API_ENDPOINT}/` + route , options)
          .map(response => response.json());
    }


    getSchools() {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/schools-per-perf/` , options)
            .map(response => response.json());
    }

    getCoursePerPerfecture(PerfectureId){
        let PerfectureIdNew = PerfectureId.toString();


        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });

        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/CoursesperSch/` + PerfectureIdNew , options)
            .map(response => response.json());
}

getRegions(username, userpassword)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  //return this.http.get(`${AppSettings.API_ENDPOINT}` + routepath , options)
  //    .map(response => response.json());
  return this.http.get(`${AppSettings.API_ENDPOINT}/regionfields/list`  , options)
      .map(response => response.json());

}

getAdminAreas(username, userpassword, regionid)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/adminfields/list/?region=` + regionid  , options)
      .map(response => response.json());
}

getSchoolsPerRegion(username, userpassword, regionid)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/schoolfields_per_region/list/?region=` + regionid  , options)
      .map(response => response.json());
}

getSchoolsPerAdminArea(username, userpassword, adminid)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/schoolfields_per_admin/list/?adminarea=` + adminid  , options)
      .map(response => response.json());
}


getUserRegistryNo(username, userpassword)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

    return this.http.get(`${AppSettings.API_ENDPOINT}/ministry/retrieve-registry-id`  , options)
      .map(response => response.json());
}

retrieveAdminSettings(username, userpassword)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/ministry/retrieve-settings`  , options)
      .map(response => response.json());
}

storeAdminSettings(username, userpassword, capac, dirview, applogin)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/ministry/store-settings/` + Number(capac) + "/" + Number(dirview) + "/" + Number(applogin)  , options)
      .map(response => response.json());
}



getSectors(username, userpassword, classid)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/sectorfields/list` , options)
      .map(response => response.json());
}

getCourses(username, userpassword, sectorid)  {

  let headers = new Headers({
      "Content-Type": "application/json",
  });

  this.createMinistryAuthorizationHeader(headers, username, userpassword );
  let options = new RequestOptions({ headers: headers });

  return this.http.get(`${AppSettings.API_ENDPOINT}/coursefields/list/?sector_id=` + sectorid , options)
      .map(response => response.json());
}



    getCritiria(headerid, type) {
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
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/critiriachosen/` + headerIdNew + '/' + type, options)
            .map(response => response.json());
    }


getCapacityPerSchool(taxi, tomeas, specialit) {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/findCapacity/` + taxi + '/' + tomeas + '/' + specialit, options)
            .map(response => response.json());

    }

getSchoolId() {

        this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/getschool/`, options)
            .map(response => response.json());

    }

gettypeofschool(){

    this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/gettypeofschool/`, options)
            .map(response => response.json());

}

getlimitsofcourse(classid){

    this.loginInfo$.getValue().forEach(loginInfoToken => {
            this.authToken = loginInfoToken.auth_token;
            this.authRole = loginInfoToken.auth_role;
        });
        let headers = new Headers({
            "Content-Type": "application/json",
        });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${AppSettings.API_ENDPOINT}/epal/getlimitsperCourse/`+ classid , options)
            .map(response => response.json());

}


}
