import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component} from '@angular/core';
import { LoginInfoActions } from '../actions/logininfo.actions';
import { ILoginInfo } from '../store/logininfo/logininfo.types';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Rx';
import { IAppState } from '../store/store';
import { HelperDataService } from '../services/helper-data-service';
import { CookieService } from 'ngx-cookie';
import { STUDENT_ROLE } from '../constants';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';

import { API_ENDPOINT, API_ENDPOINT_PARAMS } from '../app.settings';
@Component({
    selector: 'home',
    template: `
  <div>
       <form [formGroup]="formGroup" method = "POST" action="{{apiEndPoint}}/oauth/login{{apiEndPointParams}}" #form>
<!--            <input type="hidden" name="X-oauth-enabled" value="true"> -->

            <div class="bg-warning" style="padding: 2em;">
            <p>
            <strong>Ανακοίνωση:</strong> Παρακαλείσθε να μην καταχωρείτε δήλωση προτίμησης επιλέγοντας τα παρακάτω:</p>
            <ul>
                <li> 9ο ΕΠΑ.Λ. Πειραιά, Β τάξη, Τομέας Ναυτιλιακών Επαγγελμάτων, Γ τάξη-Ειδικότητες Πλοίαρχος Εμπορικού Ναυτικού, Μηχανικός Εμπορικού Ναυτικού 
                </li>
                <li> 1ο ΕΠΑ.Λ. Δάφνης, Γ τάξη, Ειδικότητα Βοηθός Νοσηλευτή 
                </li>
                <li> 1ο Ημερήσιο ΕΠΑ.Λ. Σιβιτανιδείου, Γ τάξη, Ειδικότητα Βοηθός Νοσηλευτή 
                </li>
             </ul>
             <p>Τα τμήματα έχουν πληρότητα από την 1η περίοδο κατανομής.
            </p>
            </div> 




            <div *ngFor="let loginInfoToken$ of loginInfo$ | async; let i=index"></div>
            <div class="row" style="min-height: 300px; margin-top: 100px;">

            <div *ngIf="!authToken" class="col-md-8 offset-md-4">
                <button type="submit" class="btn-primary btn-lg" (click)="form.submit()">
                Είσοδος μέσω TaxisNet
                </button>
            </div>
            </div>

     </form>
  </div>
  `
})

export default class Home implements OnInit {
    public formGroup: FormGroup;
    private authToken: string;
    private authRole: string;
    private name: any;
    private xcsrftoken: any;
    private loginInfo$: Observable<ILoginInfo>;
    private apiEndPoint = API_ENDPOINT;
    private apiEndPointParams = API_ENDPOINT_PARAMS;

    constructor(private fb: FormBuilder,
        private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private activatedRoute: ActivatedRoute,
        private _hds: HelperDataService,
        private router: Router,
        private _cookieService:CookieService
    ) {
        this.authToken = '';
        this.authRole = '';
        this.name = '';
        this.formGroup = this.fb.group({
        });
    };

    ngOnInit() {

        this.loginInfo$ = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.authToken = loginInfoToken.auth_token;
                    this.authRole = loginInfoToken.auth_role;
                    if (this.authToken && this.authToken.length > 0 && this.authRole && this.authRole === STUDENT_ROLE) {
                        if (loginInfoToken.lock_application === 1)
                            this.router.navigate(['/info']);
                        else {
                            this.router.navigate(['/parent-form']);
                        }
                    }
                    return loginInfoToken;
                }, {});
            }

            return state.loginInfo;
        });

        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params) {
                this.authToken = params['auth_token'];
                this.authRole = params['auth_role'];
            }

            if (this.authToken && this.authRole)
                this._ata.getloginInfo({ auth_token: this.authToken, auth_role: this.authRole });

        });
    }

    getCookie(key: string){
        return this._cookieService.get(key);
    }

    removeCookie(key: string){
        return this._cookieService.remove(key);
    }

    checkvalidation() {

    }
}
