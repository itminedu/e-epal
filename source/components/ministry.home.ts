import { Router, Params} from '@angular/router';
import { OnInit, Component} from '@angular/core';
import { LoginInfoActions } from '../actions/logininfo.actions';
import { ILoginInfo } from '../store/logininfo/logininfo.types';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Rx';
import { IAppState } from '../store/store';
import { HelperDataService } from '../services/helper-data-service';
import {Http, Response, RequestOptions} from '@angular/http';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators
} from '@angular/forms';

import { API_ENDPOINT } from '../app.settings';

@Component({
    selector: 'ministry-home',
    template: `
  <div>
       <form novalidate [formGroup]="userDataGroup"  #form>

            <div class="form-group">
                <label for="minedu_username">Όνομα διαχειριστή</label><input class="form-control" type="text" formControlName="minedu_username">
            </div>
            <div class="alert alert-danger" *ngIf="userDataGroup.get('minedu_username').touched && userDataGroup.get('minedu_username').hasError('required')">
                Το πεδίο δεν μπορεί να αφεθεί κενό!
            </div>

            <div class="form-group">
                <label for="minedu_userpassword">Κωδικός πρόσβασης</label><input class="form-control" type="password" formControlName="minedu_userpassword">
            </div>
            <div class="alert alert-danger" *ngIf="userDataGroup.get('minedu_userpassword').touched && userDataGroup.get('minedu_userpassword').hasError('required')">
                Το πεδίο δεν μπορεί να αφεθεί κενό!
            </div>
            <div class="alert alert-danger" *ngIf="!validLogin">
                Λάθος όνομα χρήστη / κωδικός. Παρακαλώ προσπαθήστε ξανά.
            </div>

            <div *ngFor="let loginInfoToken$ of loginInfo$ | async; let i=index"></div>
              <div class="row" style="min-height: 300px; margin-top: 100px;">
              <!--<div *ngIf="!mineduUsername" class="col-md-8 offset-md-4">-->
              <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn-primary btn-lg" (click)="submitCredentials()" [disabled]="userDataGroup.invalid">
                    Είσοδος<span class="glyphicon glyphicon-menu-right"></span>
                    </button>
                </div>
            </div>

     </form>
  </div>
  `
})

export default class MinistryHome implements OnInit {
    public userDataGroup: FormGroup;
    private authRole: string;
    private mineduUsername: string;
    //private mineduPassword: string;
    //private cuName: string;
    private validLogin: boolean;
    private loginInfo$: Observable<ILoginInfo>;
    private apiEndPoint = API_ENDPOINT;

    constructor(private fb: FormBuilder,
        private _ata: LoginInfoActions,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private http: Http,
        private router: Router
    ) {

        this.mineduUsername = '';
        //this.mineduPassword = '';
        this.authRole = '';
        //this.cuName = '';
        this.validLogin = true;

        this.userDataGroup = this.fb.group({
          minedu_username: ['minedu01', [Validators.required]],
          minedu_userpassword: ['12345678', [Validators.required]],
          cu_name: [''],
          auth_role: [''],
        });
    };

    ngOnInit() {
        this.loginInfo$ = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    this.mineduUsername = loginInfoToken.minedu_username;
                    //this.mineduPassword = loginInfoToken.minedu_userpassword;
                    if (this.mineduUsername && this.mineduUsername.length > 0)
                        this.router.navigate(['/ministry/minister-view']);
                    return loginInfoToken;
                }, {});
            }
            return state.loginInfo;
        });

    }

    submitCredentials() {
        let success = true;
        this._hds.sendMinisrtyCredentials(this.userDataGroup.value['minedu_username'],this.userDataGroup.value['minedu_userpassword'])
          .catch(err => {console.log(err); success = false; this.validLogin = false; })
          .then(msg => {
            if (success)  {
              this.authRole = 'supervisor';
              this._hds.setMineduCurrentUser(this.userDataGroup.value['minedu_username'], this.userDataGroup.value['minedu_userpassword'],   this.authRole);
              console.log("MPHKA");
              this.validLogin = true;
              this.userDataGroup.value['cu_name'] = this.userDataGroup.value['minedu_username'];
              this.userDataGroup.value['auth_role'] = 'supervisor';
              this._ata.saveMinEduloginInfo([this.userDataGroup.value]);
          }
          });
        }



}
