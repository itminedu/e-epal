import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { AmkaFillsActions } from '../../actions/amkafill.actions';
import { NgRedux, select } from 'ng2-redux';
import { IAmkaFills } from '../../store/amkafill/amkafills.types';
import { IAppState } from '../../store/store';
import { AmkaCheckService} from '../../services/amkacheck-service';
import { VALID_AMKA_PATTERN } from '../../constants';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
import {AppSettings} from '../../app.settings';


@Component({
    selector: 'amka-fill',
    template: `

    <form [formGroup]="formGroup">

        <div class="form-group">
              <label for="studentAmka">ΑΜΚΑ μαθητή</label><input class="form-control" type="text" formControlName="name">
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('name').touched && formGroup.get('name').hasError('required') ">
                Το πεδίο δεν μπορεί να αφεθεί κενό!
        </div>
        <div class="alert alert-danger" *ngIf="formGroup.get('name').dirty && formGroup.get('name').hasError('pattern')">
                Επιτρέπονται μόνο ψηφία σε αυτό το πεδίο!
        </div>

        <div class="row">
            <div class="col-md-2 col-md-offset-5">
                <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()">
                Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
                </button>
            </div>
            <div *ngIf="emptyselection==true">
                 Παρακαλώ συμπληρώστε το ΑΜΚΑ του μαθητή
            </div>
        </div>
     </form>
   `
})

@Injectable() export default class AmkaFill implements OnInit {
    private amkafills$: Observable<IAmkaFills>;

    public formGroup: FormGroup;
    private respond: any;
    emptyselection = false ;

       constructor(private fb: FormBuilder,
                private _cas: AmkaCheckService,
                private _cfa: AmkaFillsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
       this.formGroup = this.fb.group({
            name: ['', [Validators.pattern(VALID_AMKA_PATTERN),Validators.required]],
            });
        };

    ngOnInit() {
          this.amkafills$ = this._ngRedux.select(state => {
            if (state.amkafills.size > 0) {
                state.amkafills.reduce(({}, amkafill) => {
                    this.formGroup.setValue(amkafill);
                    return amkafill;
                }, {});
            }
            return state.amkafills;
        });

    }


    saveSelected() {
     if (this.formGroup.value.name == undefined) {
              this.emptyselection = true;
       }
      else
      {
        this._cfa.saveAmkaFills(this.formGroup.value);
        this.router.navigate(['/epal-class-select']);
      }
    }

}
