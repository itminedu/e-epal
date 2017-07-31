import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "../../store/store";
import { IStudentDataFieldRecords } from "../../store/studentdatafields/studentdatafields.types";
import { IRegionRecord, IRegionRecords, IRegionSchoolRecord } from "../../store/regionschools/regionschools.types";
import { ISectorRecords } from "../../store/sectorcourses/sectorcourses.types";
import { ISectorFieldRecords } from "../../store/sectorfields/sectorfields.types";
import { IEpalClassRecords } from "../../store/epalclasses/epalclasses.types";
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from "../../store/studentdatafields/studentdatafields.initial-state";
import { REGION_SCHOOLS_INITIAL_STATE } from "../../store/regionschools/regionschools.initial-state";
import { EPALCLASSES_INITIAL_STATE } from "../../store/epalclasses/epalclasses.initial-state";
import { SECTOR_COURSES_INITIAL_STATE } from "../../store/sectorcourses/sectorcourses.initial-state";
import { SECTOR_FIELDS_INITIAL_STATE } from "../../store/sectorfields/sectorfields.initial-state";
import { StudentEpalChosen, StudentCourseChosen, StudentSectorChosen } from "../students/student";
import { AppSettings } from "../../app.settings";
import { ILoginInfo, ILoginInfoToken } from "../../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { EpalClassesActions } from "../../actions/epalclass.actions";
import { SectorFieldsActions } from "../../actions/sectorfields.actions";
import { RegionSchoolsActions } from "../../actions/regionschools.actions";
import { SectorCoursesActions } from "../../actions/sectorcourses.actions";
import { StudentDataFieldsActions } from "../../actions/studentdatafields.actions";
import { HelperDataService } from "../../services/helper-data-service";

@Component({
    selector: "application-submit",
    template: `
    <div class = "loading" *ngIf="(studentDataFields$ | async).size === 0 || (epalSelected$ | async).length === 0 || (epalclasses$ | async).size === 0 || (loginInfo$ | async).size === 0 || (showLoader | async) === true"></div>
    <div id="studentFormSentNotice" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header {{modalHeader | async}}">
              <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;{{ modalTitle | async }}</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>{{ modalText | async }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="hideModal()">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
            <breadcrumbs></breadcrumbs>
    </div>

<!-- <application-preview-select></application-preview-select> -->

    <div *ngFor="let loginInfoRow$ of loginInfo$ | async; let i=index;" >
        <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
            <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία αιτούμενου</div>
        </div>
        <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
            <div class="col-md-3" style="font-size: 0.8em;">Όνομα</div>
            <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ loginInfoRow$.cu_name }}</div>
            <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο</div>
            <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ loginInfoRow$.cu_surname }}</div>
        </div>
        <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
            <div class="col-md-3" style="font-size: 0.8em;">Όνομα πατέρα</div>
            <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ loginInfoRow$.cu_fathername }}</div>
            <div class="col-md-3" style="font-size: 0.8em;">Όνομα μητέρας</div>
            <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ loginInfoRow$.cu_mothername }}</div>
        </div>
    </div>
    <div *ngFor="let studentDataField$ of studentDataFields$ | async;">
        <div class="row oddin" style="margin: 0px 2px 20px 2px; line-height: 2em;">
            <div class="col-md-3" style="font-size: 0.8em;">Διεύθυνση</div>
            <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{studentDataField$.get("regionaddress")}}</div>
            <div class="col-md-3" style="font-size: 0.8em;">ΤΚ - Πόλη</div>
            <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{studentDataField$.get("regiontk")}} - {{studentDataField$.get("regionarea")}}</div>
        </div>

        <div class="row evenin" style="margin: 20px 2px 10px 2px; line-height: 2em;">
            <div class="col-md-12" style="font-size: 1.5em; font-weight: bold; text-align: center;">Στοιχεία μαθητή</div>
        </div>
        <div><label for="name">Όνομα μαθητή</label> <p class="form-control" style="border:1px solid #eceeef;">   {{studentDataField$.get("name")}} </p> </div>
        <div><label for="studentsurname">Επώνυμο μαθητή</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("studentsurname")}} </p></div>
        <div><label for="fatherfirstname">Όνομα Πατέρα</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("fatherfirstname")}} </p></div>
        <div><label for="motherfirstname">Όνομα Μητέρας</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("motherfirstname")}} </p></div>
        <div><label for="birthdate">Ημερομηνία Γέννησης</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("studentbirthdate")}} </p></div>

        <div><label for="lastschool_schoolname">Σχολείο τελευταίας φοίτησης</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("lastschool_schoolname").name}} </p></div>
        <div><label for="lastschool_schoolyear">Σχολικό έτος τελευταίας φοίτησης</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("lastschool_schoolyear")}} </p></div>

        <div *ngIf="studentDataField$.get('lastschool_class') === 1"><label for="lastschool_class">Τάξη τελευταίας φοίτησης</label> <p class="form-control" style="border:1px solid #eceeef;">Α'</p></div>
        <div *ngIf="studentDataField$.get('lastschool_class') === 2"><label for="lastschool_class">Τάξη τελευταίας φοίτησης</label> <p class="form-control" style="border:1px solid #eceeef;">Β'</p></div>
        <div *ngIf="studentDataField$.get('lastschool_class') === 3"><label for="lastschool_class">Τάξη τελευταίας φοίτησης</label> <p class="form-control" style="border:1px solid #eceeef;">Γ'</p></div>
        <div *ngIf="studentDataField$.get('lastschool_class') === 4"><label for="lastschool_class">Τάξη τελευταίας φοίτησης</label> <p class="form-control" style="border:1px solid #eceeef;">Δ'</p></div>

        <div><label for="relationtostudent">Η δήλωση προτίμησης γίνεται από</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("relationtostudent")}} </p></div>
        <div><label for="telnum">Τηλέφωνο επικοινωνίας</label> <p class="form-control" style="border:1px solid #eceeef;"> {{studentDataField$.get("telnum")}} </p></div>
    </div>
    <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left" (click)="navigateBack()">
                <i class="fa fa-backward"></i>
            </button>
        </div>
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="submitNow()">
                <span style="font-size: 0.9em; font-weight: bold;">Υποβολή&nbsp;&nbsp;&nbsp;</span><i class="fa fa-forward"></i>
            </button>
        </div>
    </div>
  `
})

@Injectable() export default class ApplicationSubmit implements OnInit {

    private authToken;
    private epalSelected$: BehaviorSubject<Array<number>> = new BehaviorSubject(new Array());
    private epalSelectedOrder: Array<number> = new Array();
    private courseSelected;
    private sectorSelected;
    private classSelected;
    private totalPoints = <number>0;
    private studentDataFields$: BehaviorSubject<IStudentDataFieldRecords>;
    private epalclasses$: BehaviorSubject<IEpalClassRecords>;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    private studentDataFieldsSub: Subscription;
    private regionsSub: Subscription;
    private sectorsSub: Subscription;
    private sectorFieldsSub: Subscription;
    private epalclassesSub: Subscription;
    private loginInfoSub: Subscription;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    public isModalShown: BehaviorSubject<boolean>;
    private showLoader: BehaviorSubject<boolean>;
    private currentUrl: string;
    private cu_name: string;
    private cu_surname: string;
    private cu_fathername: string;
    private cu_mothername: string;
    private disclaimer_checked: number;

    constructor(
        private _hds: HelperDataService,
        private _csa: SectorCoursesActions,
        private _sfa: SectorFieldsActions,
        private _rsa: RegionSchoolsActions,
        private _eca: EpalClassesActions,
        private _sdfa: StudentDataFieldsActions,
        private _ngRedux: NgRedux<IAppState>,
        private router: Router,
        private http: Http
    ) {

        //        this.regions$ = new BehaviorSubject(REGION_SCHOOLS_INITIAL_STATE);
        this.epalclasses$ = new BehaviorSubject(EPALCLASSES_INITIAL_STATE);
        this.studentDataFields$ = new BehaviorSubject(STUDENT_DATA_FIELDS_INITIAL_STATE);
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);

        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.isModalShown = new BehaviorSubject(false);
        this.showLoader = new BehaviorSubject(false);
    };

    ngOnInit() {

        (<any>$("#studentFormSentNotice")).appendTo("body");
        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .subscribe(loginInfo => {
                let linfo = <ILoginInfo>loginInfo;
                console.log("SELECTOR5");
                if (linfo.size > 0) {
                    linfo.reduce(({ }, loginInfoToken) => {
                        this.authToken = loginInfoToken.auth_token;

                        this.cu_name = loginInfoToken.cu_name;
                        this.cu_surname = loginInfoToken.cu_surname;
                        this.cu_fathername = loginInfoToken.cu_fathername;
                        this.cu_mothername = loginInfoToken.cu_mothername;
                        this.disclaimer_checked = loginInfoToken.disclaimer_checked;

                        return loginInfoToken;
                    }, {});
                }
                this.loginInfo$.next(linfo);
            }, error => { console.log("error selecting loginInfo"); });

        this.epalclassesSub = this._ngRedux.select("epalclasses")
            .map(epalClasses => <IEpalClassRecords>epalClasses)
            .subscribe(ecs => {
            console.log("SELECTOR4");
            ecs.reduce(({ }, epalclass) => {
                this.classSelected = epalclass.get("name");
                return epalclass;
            }, {});
            this.epalclasses$.next(ecs);
        }, error => { console.log("error selecting epalclasses"); });

        this.studentDataFieldsSub = this._ngRedux.select("studentDataFields")
            .subscribe(studentDataFields => {
                this.studentDataFields$.next(<IStudentDataFieldRecords>studentDataFields);
            }, error => { console.log("error selecting studentDataFields"); });

        this.regionsSub = this._ngRedux.select("regions").
            subscribe(regions => {
                console.log("SELECTOR: REGIONS");
                let rgns = <IRegionRecords>regions;
                let prevSelected: Array<number> = new Array();
                rgns.reduce((prevRgn, rgn) => {
                    rgn.epals.reduce((prevSchool, school) => {
                        if (school.selected === true) {
                            prevSelected = this.epalSelected$.getValue();
                            prevSelected[prevSelected.length] = <number>parseInt(school.epal_id);

                            this.epalSelected$.next(prevSelected);
                            this.epalSelectedOrder.push(school.order_id);
                        }
                        return school;
                    }, {});
                    return rgn;
                }, {});
                //                    this.regions$.next(<IRegionRecords>regions);
            },
            error => {
                console.log("Error Selecting Regions");
            }
            );


        this.sectorsSub = this._ngRedux.select("sectors")
            .map(sectors => <ISectorRecords>sectors)
            .subscribe(scs => {
                console.log("SELECTOR2");
                scs.reduce((prevSector, sector) => {
                    sector.get("courses").reduce((prevCourse, course) => {
                        if (course.get("selected") === true) {
                            this.courseSelected = course.get("course_id");
                        }
                        return course;
                    }, {});
                    return sector;
                }, {});
            });

        this.sectorFieldsSub = this._ngRedux.select("sectorFields")
            .map(sectorFields => <ISectorFieldRecords>sectorFields)
            .subscribe(sfds => {
                console.log("SELECTOR");
                sfds.reduce(({ }, sectorField) => {
                    if (sectorField.selected === true) {
                        this.sectorSelected = sectorField.id;
                    }
                    return sectorField;
                }, {});
            });

    };

    ngOnDestroy() {
        (<any>$("#studentFormSentNotice")).remove();
        if (this.studentDataFieldsSub) {
            this.studentDataFieldsSub.unsubscribe();
        }
        if (this.regionsSub) {
            this.regionsSub.unsubscribe();
        }
        if (this.sectorsSub) {
            this.sectorsSub.unsubscribe();
        }
        if (this.sectorFieldsSub) {
            this.sectorFieldsSub.unsubscribe();
        }
        if (this.epalclassesSub) {
            this.epalclassesSub.unsubscribe();
        }
        if (this.loginInfoSub) {
            this.loginInfoSub.unsubscribe();
        }
    }

    submitNow() {

        if (this.studentDataFields$.getValue().size === 0 || this.epalSelected$.getValue().length === 0 || this.epalclasses$.getValue().size === 0 || this.loginInfo$.getValue().size === 0)
            return;

        let aitisiObj: Array<any> = [];
        let epalObj: Array<StudentEpalChosen> = [];

        let std = this.studentDataFields$.getValue().get(0);

        aitisiObj[0] = <any>{};
        aitisiObj[0].name = std.get("name");
        aitisiObj[0].studentsurname = std.get("studentsurname");
        aitisiObj[0].studentbirthdate = std.get("studentbirthdate");
        aitisiObj[0].fatherfirstname = std.get("fatherfirstname");
        aitisiObj[0].motherfirstname = std.get("motherfirstname");
        aitisiObj[0].regionaddress = std.get("regionaddress");
        aitisiObj[0].regionarea = std.get("regionarea");
        aitisiObj[0].regiontk = std.get("regiontk");
        aitisiObj[0].certificatetype = "";

        aitisiObj[0].graduation_year = 0;
        aitisiObj[0].lastschool_registrynumber = std.get("lastschool_schoolname").registry_no;
        aitisiObj[0].lastschool_schoolname = std.get("lastschool_schoolname").name;
        aitisiObj[0].lastschool_schoolyear = std.get("lastschool_schoolyear");
        aitisiObj[0].lastschool_unittypeid = std.get("lastschool_schoolname").unit_type_id;
        aitisiObj[0].lastschool_class = std.get("lastschool_class");

        aitisiObj[0].relationtostudent = std.get("relationtostudent");
        aitisiObj[0].telnum = std.get("telnum");

        aitisiObj[0].cu_name = this.cu_name;
        aitisiObj[0].cu_surname = this.cu_surname;
        aitisiObj[0].cu_fathername = this.cu_fathername;
        aitisiObj[0].cu_mothername = this.cu_mothername;
        aitisiObj[0].disclaimer_checked = this.disclaimer_checked;
        aitisiObj[0].currentclass = this.classSelected;

        let epalSelected = this.epalSelected$.getValue();
        for (let i = 0; i < epalSelected.length; i++) {
            epalObj[i] = new StudentEpalChosen(null, epalSelected[i], this.epalSelectedOrder[i]);
        }
        aitisiObj["1"] = epalObj;

        if (aitisiObj[0]["currentclass"] === "2") {
            aitisiObj["3"] = new StudentSectorChosen(null, this.sectorSelected);
        } else if (aitisiObj[0]["currentclass"] === "3" || aitisiObj[0]["currentclass"] === "4") {
            aitisiObj["3"] = new StudentCourseChosen(null, this.courseSelected);
        }

        this.submitRecord(aitisiObj);
    }


    submitRecord(record) {
        let errors = {
            1004: "Όνομα μαθητή (ελάχιστο τρεις (3) χαρακτήρες)",
            1005: "Επώνυμο μαθητή (ελάχιστο τρεις (3) χαρακτήρες)",
            1006: "Όνομα Πατέρα (ελάχιστο τρεις (3) χαρακτήρες)",
            1007: "Όνομα Μητέρας (ελάχιστο τρεις (3) χαρακτήρες)",
            1008: "Διεύθυνση κατοικίας αιτούμενου",
            1009: "ΤΚ (πενταψήφιος αριθμός)",
            1010: "Πόλη/Περιοχή",
            1013: "Τάξη φοίτησης",
            1014: "Η δήλωση προτίμησης γίνεται από",
            1015: "Σταθερό Τηλέφωνο Επικοινωνίας",
            1016: "Όνομα (στοιχεία αιτούμενου)",
            1017: "Επώνυμο (στοιχεία αιτούμενου)",
            1018: "Όνομα πατέρα (στοιχεία αιτούμενου)",
            1019: "Όνομα μητέρας (στοιχεία αιτούμενου)",
            1020: "Κωδικός μονάδας σχολείου τελευταίας φοίτησης",
            1021: "Τύπος μονάδας σχολείου τελευταίας φοίτησης",
            1022: "Σχολείο τελευταίας φοίτησης",
            1023: "Τάξη τελευταίας φοίτησης"
        };
        let authTokenPost = this.authToken + ":" + this.authToken;

        let headers = new Headers({
            "Authorization": "Basic " + btoa(authTokenPost),
            "Accept": "*/*",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json",
        });

        let options = new RequestOptions({ headers: headers, method: "post", withCredentials: true });
        let connectionString = `${AppSettings.API_ENDPOINT}/epal/appsubmit`;
        this.showLoader.next(true);
        this.http.post(connectionString, record, options)
            .map((res: Response) => res.json())
            .subscribe(success => {
                (<any>$(".loading")).remove();
                this.showLoader.next(false);
                let errorCode = parseInt(success.error_code);

                let mTitle = "";
                let mText = "";
                let mHeader = "";
                switch (errorCode) {
                    case 0:
                        mTitle = "Υποβολή Δήλωσης Προτίμησης";
                        mText = "Η υποβολή της δήλωσής σας πραγματοποιήθηκε. Μπορείτε να τη δείτε και να την εκτυπώσετε από την επιλογή 'Εμφάνιση - Εκτύπωση Δήλωσης Προτίμησης'. Από την επιλογή 'Υποβληθείσες Δηλώσεις' θα μπορείτε να ενημερωθείτε όταν υπάρξει εξέλιξη σχετική με τη δήλωση σας. Επίσης, θα λάβετε και ενημερωτικό email.";
                        mHeader = "modal-header-success";
                        this._eca.initEpalClasses();
                        this._sfa.initSectorFields();
                        this._rsa.initRegionSchools();
                        this._csa.initSectorCourses();
                        this._sdfa.initStudentDataFields();
                        break;
                    case 1000:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Δεν έχετε επιλέξει σχολεία";
                        mHeader = "modal-header-danger";
                        break;
                    case 999:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Δεν έχετε επιλέξει τομέα";
                        mHeader = "modal-header-danger";
                        break;
                    case 998:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Δεν έχετε επιλέξει ειδικότητα";
                        mHeader = "modal-header-danger";
                        break;
                    case 1001:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Δεν έχετε αποδεχθεί τους όρους χρήσης";
                        mHeader = "modal-header-danger";
                        break;
                    case 1002:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Ελέξτε τη φόρμα σας. Υπάρχουν λάθη - ελλείψεις που δεν επιτρέπουν την υποβολή.";
                        mHeader = "modal-header-danger";
                        break;
                    case 1003:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Ελέξτε τη φόρμα σας. Η ημερομηνία γέννησης δεν είναι έγκυρη.";
                        mHeader = "modal-header-danger";
                        break;
                    case 1004:
                    case 1005:
                    case 1006:
                    case 1007:
                    case 1008:
                    case 1009:
                    case 1010:
                    case 1013:
                    case 1014:
                    case 1015:
                    case 1016:
                    case 1017:
                    case 1018:
                    case 1019:
                    case 1020:
                    case 1021:
                    case 1022:
                    case 1023:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Παρακαλούμε ελέγξτε τα στοιχεία που υποβάλλετε. Υπάρχουν λάθη - ελλείψεις στο πεδίο \"" + errors[errorCode] + "\"που δεν επιτρέπουν την υποβολή.";
                        mHeader = "modal-header-danger";
                        break;
                    case 3002:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Το σύστημα δεν δέχεται υποβολή δηλώσεων αυτή την περίοδο.";
                        mHeader = "modal-header-danger";
                        break;
                    case 8000:
                    case 8001:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Προέκυψε σφάλμα κατά τη διάρκεια ελέγχου των στοιχείων φοίτησης σας. Παρακαλώ δοκιμάστε ξανά ή προσπαθήστε αργότερα. Εάν το πρόβλημα συνεχίσει να υφίσταται, επικοινωνήστε με την ομάδα υποστήριξης.";
                        mHeader = "modal-header-danger";
                        break;
                    case 8002:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Τα στοιχεία φοίτησης που υποβάλλατε δεν επικυρώθηκαν. Παρακαλώ ελέγξτε τη φόρμα σας και προσπαθήστε ξανά. Εάν το θέμα συνεχίσει να υφίσταται, επικοινωνήστε με την ομάδα υποστήριξης.";
                        mHeader = "modal-header-danger";
                        break;
                    case 8003:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Τα στοιχεία φοίτησης που υποβάλλατε δεν είναι έγκυρα. Παρακαλώ ελέγξτε τη φόρμα σας και προσπαθήστε ξανά. Εάν το θέμα συνεχίσει να υφίσταται, επικοινωνήστε με την ομάδα υποστήριξης.";
                        mHeader = "modal-header-danger";
                        break;
                    case 8004:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Τα στοιχεία φοίτησης που υποβάλλατε δεν είναι έγκυρα. Παρακαλώ ελέγξτε τη φόρμα σας και προσπαθήστε ξανά. Ελέγξτε επίσης αν έχετε ήδη κάνει δήλωση για τον ίδιο μαθητή.";
                        mHeader = "modal-header-danger";
                        break;
                    default:
                        mTitle = "Αποτυχία Υποβολής Δήλωσης Προτίμησης";
                        mText = "Ελέξτε τη φόρμα σας. Υπάρχουν λάθη - ελλείψεις που δεν επιτρέπουν την υποβολή.";
                        mHeader = "modal-header-danger";
                }

                this.modalTitle.next(mTitle);
                this.modalText.next(mText);
                this.modalHeader.next(mHeader);
                this.showModal();
                (<any>$(".loading")).remove();
                this.showLoader.next(false);

            },
            error => {
                (<any>$(".loading")).remove();
                this.modalHeader.next("modal-header-danger");
                this.modalTitle.next("Υποβολή Δήλωσης Προτίμησης");
                this.modalText.next("Η υποβολή της δήλωσης προτίμησης απέτυχε. Παρακαλούμε προσπαθήστε πάλι και αν το πρόβλημα συνεχίσει να υφίσταται, επικοινωνήστε με την ομάδα υποστήριξης.");
                this.showModal();
                this.showLoader.next(false);
                console.log("Error HTTP POST Service");
            }
            );

    }

    public showModal(): void {
        (<any>$("#studentFormSentNotice")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#studentFormSentNotice")).modal("hide");
        if (this.modalHeader.getValue() === "modal-header-success") {
            this.router.navigate(["/post-submit"]);
        }

    }

    public onHidden(): void {
        this.isModalShown.next(false);
        this.router.navigate(["/post-submit"]);
    }

    navigateBack() {
        this.router.navigate(["/student-application-form-main"]);
    }

}
