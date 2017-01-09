import {Component, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from "@angular/core";
import {CourseFieldsActions} from '../../actions/coursefields.actions';
import { DevToolsExtension, NgRedux, select } from 'ng2-redux';
import { ICourseField, ICourseFields } from '../../store/coursefields/coursefields.types';
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
            <div *ngIf="courseFields$.length === 0" class="loading">Loading&#8230;</div>
            <div *ngFor="let courseField$ of courseFields$ | async; let i=index">
            <div class="row">
            <div class="col-md-2 pull-right">
                <input type="checkbox" formControlName="{{i}}">
            </div>
            <div class="col-md-10 pull-left">
                {{courseField$.name}}
            </div>
            </div>
            </div>
        </div>
<!--        <button (click)="addInput()">Add Input</button>  -->
    </form>
    <pre>{{formGroup.value | json}}</pre>
  `
})
@Injectable() export default class CourseFieldsSelect implements OnInit {
    private courseFields$: Observable<ICourseFields>;

    public formGroup: FormGroup;
    public cfs = new FormArray([]);

    constructor(private http: Http, private fb: FormBuilder, private _cfa: CourseFieldsActions, private _ngRedux: NgRedux<IAppState>) {
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    };

    ngOnInit() {
        this._cfa.getCourseFields({});

        this.courseFields$ = this._ngRedux.select(state => {
            console.log("in select");
            for (let courseField in state.courseFields) {
                this.cfs.push(new FormControl('', []));
            }
            return state.courseFields;
        })
    }
}
