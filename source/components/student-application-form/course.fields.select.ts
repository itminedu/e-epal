import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { CourseFieldsActions } from '../../actions/coursefields.actions';
import { NgRedux, select } from 'ng2-redux';
import { ICourseFields } from '../../store/coursefields/coursefields.types';
import { IAppState } from '../../store/store';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'course-fields-select',
    template: `
     <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <div *ngFor="let courseField$ of courseFields$ | async; let i=index">
            <div class="row">
            <div class="col-md-1">
                <input type="checkbox" formControlName="{{i}}">
            </div>
            <div class="col-md-11 pull-left">
                {{courseField$.name}}
            </div>
            </div>
            </div>
        </div>
        <div class="row">
        <div class="col-md-12 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-right" (click)="saveSelected()">
            <i class="fa fa-forward"></i>
            </button>
        </div>
        </div>
    </form>
<!--    <pre>{{formGroup.value | json}}</pre> -->
  `
})
@Injectable() export default class CourseFieldsSelect implements OnInit {
    private courseFields$: Observable<ICourseFields>;

    public formGroup: FormGroup;
    public cfs = new FormArray([]);

    constructor(private fb: FormBuilder,
                private _cfa: CourseFieldsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    };

    ngOnInit() {

        this._cfa.getCourseFields();

        this.courseFields$ = this._ngRedux.select(state => {
            state.courseFields.reduce(({}, courseField) =>{
                this.cfs.push(new FormControl(courseField.selected, []));
                return courseField;
            }, {});
            return state.courseFields;
        });

    }

    saveSelected() {
        this._cfa.saveCourseFieldsSelected(this.formGroup.value.formArray);
        this.router.navigate(['/region-schools-select']);
    }
}
