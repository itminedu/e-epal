import {Router} from '@angular/router';
import {OnInit, OnDestroy, Component, Injectable} from '@angular/core';
import { HelperDataService } from '../../services/helper-data-service';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import { ILoginInfo, ILoginInfoToken } from '../../store/logininfo/logininfo.types';
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
    selector: 'post-submit',
    template: `
        <div class = "loading" *ngIf="(showLoader$ | async) === true"></div>
           <div class="row" style="margin-top: 130px; margin-bottom: 200px;">
               <div class="col-md-3 offset-md-3">
                <button type="submit" class="btn-primary btn-lg btn-block isclickable" style="margin: 0px; font-size: 1em; padding: 5px; height: 8em;" (click)="submittedView()">
                Εμφάνιση<br />Εκτύπωση<br />Δήλωσης<br />Προτίμησης
                </button>
                </div>
                <div class="col-md-6">
                 <button type="submit" class="btn-primary btn-lg btn-block isclickable" style="margin: 0px; font-size: 1em; padding: 5px; height: 8em;" (click)="signOut()">
                Αποσύνδεση
                </button>
               </div>
            </div>
  `
})

@Injectable() export default class AfterSubmit implements OnInit, OnDestroy {
    private authToken: string;
    private authRole: string;
    private cuName: string;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
    public cuser: any;
    private showLoader$: BehaviorSubject<boolean>;
    private loginInfoSub: Subscription;

    constructor(
        private _ata: LoginInfoActions,
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
        this.showLoader$ = new BehaviorSubject(false);
    };

    ngOnInit() {
        this.loginInfoSub = this._ngRedux.select(state => {
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
        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();

    }

    signOut() {
        this.showLoader$.next(true);
        this._hds.signOut().then(data => {
            this._ata.initLoginInfo();
            this._eca.initEpalClasses();
            this._sfa.initSectorFields();
            this._rsa.initRegionSchools();
            this._csa.initSectorCourses();
            this._sdfa.initStudentDataFields();
            this._cria.initCriteria();
            this.router.navigate(['']);
            this.authToken = '';
            this.authRole = '';
            this.showLoader$.next(false);
        }).catch(err => {
            this.showLoader$.next(false);
            console.log(err)
        });

    }

    submittedView() {
        this.router.navigate(['/submited-preview']);
    }

}
