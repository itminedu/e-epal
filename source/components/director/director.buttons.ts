import {Router, ActivatedRoute, Params} from '@angular/router';
import {OnInit, Component} from '@angular/core';
import { LoginInfoActions } from '../../actions/logininfo.actions';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import { NgRedux, select } from 'ng2-redux';
import { Observable } from 'rxjs/Rx';
import { IAppState } from '../../store/store';
import { HelperDataService } from '../../services/helper-data-service';
import { CookieService } from 'ngx-cookie';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';

import { API_ENDPOINT, API_ENDPOINT_PARAMS } from '../../app.settings';
@Component({
    selector: 'director-buttons',
    template: `
   <div>
           <form>
               <div class="col-md-8 offset-md-4">
                <button type="submit" class="btn-primary btn-lg" (click)="navigatedirector()">
                Επιλεχθέντες Μαθητές<span class="glyphicon glyphicon-menu-right"></span>
                </button>
               <br>
               <br>
                 <button type="submit" class="btn-primary btn-lg"  (click)="navigatecapacity()">
                Δυναμική Τμημάτων<span class="glyphicon glyphicon-menu-right"></span>
                </button>
               </div>
               <br>
               <br>
               <br>
               <br>
               <br>
          
               
           </form>
   </div>
  `
})

export default class DirectorButtom implements OnInit {

    constructor(
        private router: Router,
    )
    {
    };

    ngOnInit() {

    }


    navigatedirector(){
        this.router.navigate(['/school/director-view']);

    }

    navigatecapacity(){
        this.router.navigate(['/school/director-classcapacity']);
    }



}
