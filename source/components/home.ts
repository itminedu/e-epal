import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component} from '@angular/core';
import { LoginInfoActions } from '../actions/logininfo.actions';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import { AppSettings } from '../app.settings';
@Component({
  selector: 'home',
  template: `
  <div>
    <h4>Στοιχεία Σύνδεσης</h4>
	   <form [formGroup]="formGroup" method = "POST" action="http://eepal.dev/drupal/oauth/login" #form>
            <input type="hidden" name="X-oauth-enabled" value="true">
            <div class="row">
              <div class="col-md-2 col-md-offset-5">
                <button type="submit" class="btn-primary btn-lg pull-center" (click)="form.submit()">
                Είσοδος μέσω TaxisNet<span class="glyphicon glyphicon-menu-right"></span>
                </button>
            </div>
        </div>
     </form>
  </div>
  `
})
export default class Home implements OnInit{
	public formGroup: FormGroup;
       constructor(private fb: FormBuilder,
           private _ata: LoginInfoActions,
           private activatedRoute: ActivatedRoute) {
       this.formGroup = this.fb.group({
            Username: [],
            Paswd : []
            });
        };

    ngOnInit() {
    // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
        let authToken = params['auth_token'];
        let authRole = params['auth_role'];
        this._ata.saveLoginInfo({auth_token: authToken, auth_role: authRole});
        console.log(authToken);

      });
  }



	checkvalidation() {

        }
    }
