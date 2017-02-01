import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';
import { Router } from '@angular/router';

import { NgRedux, select } from 'ng2-redux';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { ICourseFields } from '../../store/coursefields/coursefields.types';
import { IAppState } from '../../store/store';
import { VALID_NAMES_PATTERN } from '../../constants';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'application-form-main',
    templateUrl: './application.form.main.html'
})

@Injectable() export default class StudentApplicationMain implements OnInit {

    private studentDataFields$: Observable<IStudentDataFields>;
    private courseFields$: Observable<ICourseFields>;

    public studentDataGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private _sdfa: StudentDataFieldsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.studentDataGroup = this.fb.group({
            studentAmka: ['12346', Validators.required],
            studentFirstname: ['ΝΙΚΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            studentSurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            guardianFirstname: ['ΑΝΑΣΤΑΣΙΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            guardianSurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionAddress: ['ΓΙΑΝΝΙΤΣΩΝ 5', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionTK: ['26334', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionArea: ['ΠΑΤΡΑ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            certificateType: ['Απολυτήριο Λυκείου', Validators.required],
            relationToStudent: ['Μαθητής', Validators.required],
        });
    };

    ngOnInit() {
        this.studentDataFields$ = this._ngRedux.select(state => {
            if (state.studentDataFields.size > 0) {
                state.studentDataFields.reduce(({}, studentDataField) => {
                    this.studentDataGroup.setValue(studentDataField);
                    return studentDataField;
                }, {});
            }
            return state.studentDataFields;
        });

        this.courseFields$ = this._ngRedux.select(state => {
            state.courseFields.reduce(({}, courseField) =>{
                return courseField;
            }, {});
            return state.courseFields;
        });
    }

    saveSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
        this.router.navigate(['/region-schools-select']);
    }
    submitSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
        this.router.navigate(['/application-preview']);
    }
}
