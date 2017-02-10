import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { AmkaFillsActions } from '../../actions/amkafill.actions';
import { NgRedux, select } from 'ng2-redux';
import { IAmkaFills } from '../../store/amkafill/amkafills.types';
import { IAppState } from '../../store/store';
import { AmkaCheckService} from '../../services/amkacheck-service';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';


@Component({
    selector: 'amka-fill',
    template: `
    
    <form [formGroup]="formGroup">
           <div *ngFor="let amkafill$ of amkafills$ | async;"> </div>
            <div class="form-group">
              <label for="studentAmka">ΑΜΚΑ μαθητή</label><input class="form-control" type="text" formControlName="name">
            </div>  
        <div class="row">
            <div class="col-md-2 col-md-offset-5">
                <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()">
                Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
                </button>
            </div>
        </div>
     </form>
   `
})

@Injectable() export default class AmkaFill implements OnInit {
    private amkafills$: Observable<IAmkaFills>;

    public formGroup: FormGroup;
    private respond: any;

       constructor(private fb: FormBuilder,
                private _cas: AmkaCheckService,   
                private _cfa: AmkaFillsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
       this.formGroup = this.fb.group({
            name: []
            });
        };

    ngOnInit() {

       // this._cfa.getEpalClasses()
        console.log(this.formGroup.value);

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
        this._cfa.saveAmkaFills(this.formGroup.value);  
        this.router.navigate(['/epal-class-select']);
    }

}