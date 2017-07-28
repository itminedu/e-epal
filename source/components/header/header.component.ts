import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "../../store/store";
import { ILoginInfo, ILoginInfoToken } from "../../store/logininfo/logininfo.types";
import { HelperDataService } from "../../services/helper-data-service";
import { LoginInfoActions } from "../../actions/logininfo.actions";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { SCHOOL_ROLE, STUDENT_ROLE, PDE_ROLE, DIDE_ROLE, MINISTRY_ROLE } from "../../constants";
import { EpalClassesActions } from "../../actions/epalclass.actions";
import { SectorFieldsActions } from "../../actions/sectorfields.actions";
import { RegionSchoolsActions } from "../../actions/regionschools.actions";
import { SectorCoursesActions } from "../../actions/sectorcourses.actions";
import { StudentDataFieldsActions } from "../../actions/studentdatafields.actions";

@Component({
    selector: "reg-header",
    templateUrl: "header.component.html"
})
export default class HeaderComponent implements OnInit, OnDestroy {
    private authToken: string;
    private studentRole = STUDENT_ROLE;
    private authRole: string;
    private cuName: string;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    private cuser: any;
    private showLoader$: BehaviorSubject<boolean>;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;

    private TotalStudents$: BehaviorSubject<any>;
    private TotalStudentsSub: Subscription;
    private showLoader: BehaviorSubject<boolean>;
    private hasvalue: boolean;
    private loginInfoSub: Subscription;

    constructor(private _ata: LoginInfoActions,
        private _hds: HelperDataService,
        private _csa: SectorCoursesActions,
        private _sfa: SectorFieldsActions,
        private _rsa: RegionSchoolsActions,
        private _eca: EpalClassesActions,
        private _sdfa: StudentDataFieldsActions,
        private _ngRedux: NgRedux<IAppState>,
        private router: Router
    ) {

        this.authToken = "";
        this.authRole = "";
        this.cuName = "";
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.showLoader$ = new BehaviorSubject(false);
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.TotalStudents$ = new BehaviorSubject([{}]);
        this.showLoader = new BehaviorSubject(false);
        this.hasvalue = false;

    };

    ngOnInit() {
        (<any>$("#headerNotice")).appendTo("body");
        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfo>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        this.authToken = loginInfoToken.auth_token;
                        this.authRole = loginInfoToken.auth_role;
                        this.cuName = loginInfoToken.cu_name;
                        return loginInfoToken;
                    }, {});

                    if (this.hasvalue === false) {
                        this.showLoader.next(true);
                        this.TotalStudentsSub = this._hds.findTotalStudents().subscribe(x => {
                            this.TotalStudents$.next(x);
                            this.showLoader.next(false);
                            this.hasvalue = true;
                        },
                            error => {
                                this.TotalStudents$.next([{}]);
                                console.log("Error Getting courses perSchool");
                                this.showLoader.next(false);
                            });

                    }

                }

                this.loginInfo$.next(loginInfo);
            });




    }

    ngOnDestroy() {
        (<any>$("#headerNotice")).remove();
        if (this.loginInfoSub) {
            this.loginInfoSub.unsubscribe();
        }

    }

    signOut() {
        this.showLoader$.next(true);
        this._hds.signOut().then(data => {
            this._ata.initLoginInfo();
            if (this.authRole === SCHOOL_ROLE) {
                this.authToken = "";
                this.authRole = "";
                window.location.assign((<any>data).next);
            }
            else if (this.authRole === PDE_ROLE) {
                this.authToken = "";
                this.authRole = "";
                window.location.assign((<any>data).next);
            }
            else if (this.authRole === DIDE_ROLE) {
                this.authToken = "";
                this.authRole = "";
                window.location.assign((<any>data).next);
            }
            else if (this.authRole === STUDENT_ROLE) {
                this._eca.initEpalClasses();
                this._sfa.initSectorFields();
                this._rsa.initRegionSchools();
                this._csa.initSectorCourses();
                this._sdfa.initStudentDataFields();
                this.router.navigate([""]);
            }
            else if (this.authRole === MINISTRY_ROLE) {
                this.router.navigate(["/ministry"]);
            }
            this.authToken = "";
            this.authRole = "";
            this.showLoader$.next(false);
        }).catch(err => {
            this.showLoader$.next(false);
            console.log(err);
        });
    }

    goHome() {
        if (this.authRole === SCHOOL_ROLE) {
            this.router.navigate(["/school"]);
        }
        else if (this.authRole === PDE_ROLE) {
            this.router.navigate(["/school"]);
        }
        else if (this.authRole === DIDE_ROLE) {
            this.router.navigate(["/school"]);
        }
        else if (this.authRole === STUDENT_ROLE) {
            this.router.navigate([""]);
        }
        else if (this.authRole === MINISTRY_ROLE) {
            this.router.navigate(["/ministry"]);
        }
    }

    gohelpDesk() {
        this.router.navigate(["/help-desk"]);
    }

    public showModal(): void {
        (<any>$("#headerNotice")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#headerNotice")).modal("hide");
    }

}
