import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import { Injectable } from "@angular/core";

import { BehaviorSubject } from 'rxjs/Rx';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo, ILoginInfoToken } from '../../store/logininfo/logininfo.types';
import { HelperDataService } from '../../services/helper-data-service';
import { LoginInfoActions } from '../../actions/logininfo.actions';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import { SCHOOL_ROLE, STUDENT_ROLE, PDE_ROLE, DIDE_ROLE, MINISTRY_ROLE } from '../../constants';
import { EpalClassesActions } from '../../actions/epalclass.actions';
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { CriteriaActions } from '../../actions/criteria.actions';
import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';

@Component({
  selector: 'reg-header',
  templateUrl: 'header.component.html'
})
export default class HeaderComponent implements OnInit, OnDestroy {
    private authToken: string;
    private authRole: string;
    private cuName: string;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    public cuser :any;
    private showLoader$: BehaviorSubject<boolean>;

    constructor( private _ata: LoginInfoActions,
                private _hds: HelperDataService,
                private _csa: SectorCoursesActions,
                private _sfa: SectorFieldsActions,
                private _rsa: RegionSchoolsActions,
                private _eca: EpalClassesActions,
                private _sdfa: StudentDataFieldsActions,
                private _cria: CriteriaActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
                ) {

                        this.authToken = '';
                        this.authRole = '';
                        this.cuName = '';
                        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
                        this.showLoader$ = new BehaviorSubject(false);

        };

    ngOnInit() {
        this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    this.cuName = loginInfoToken.cu_name;
                    return loginInfoToken;
                }, {})
            }

            return state.loginInfo;
        }).subscribe(this.loginInfo$);

    }

    ngOnDestroy() {
        this.loginInfo$.unsubscribe();

    }

    signOut() {
        this.showLoader$.next(true);
        this._hds.signOut().then(data => {
            this._ata.initLoginInfo();
            if (this.authRole === SCHOOL_ROLE) {
                this.router.navigate(['/school']);
            }
            else if (this.authRole === PDE_ROLE) {
                this.router.navigate(['/school']);
            }
            else if (this.authRole === DIDE_ROLE) {
                this.router.navigate(['/school']);
            }
            else if (this.authRole === STUDENT_ROLE) {
                this._eca.initEpalClasses();
                this._sfa.initSectorFields();
                this._rsa.initRegionSchools();
                this._csa.initSectorCourses();
                this._sdfa.initStudentDataFields();
                this._cria.initCriteria();
                this.router.navigate(['']);
            }
            else if (this.authRole === MINISTRY_ROLE) {
                this.router.navigate(['/ministry']);
            }
            this.authToken = '';
            this.authRole = '';
            this.showLoader$.next(false);
        }).catch(err => {
            this.showLoader$.next(false);
            console.log(err)
        });
    }

}
