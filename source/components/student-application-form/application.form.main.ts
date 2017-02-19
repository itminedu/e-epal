import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';
import { Router } from '@angular/router';
import { NgRedux, select } from 'ng2-redux';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
//import { ICourseFields } from '../../store/coursefields/coursefields.types';
import { IAppState } from '../../store/store';
import { VALID_NAMES_PATTERN, VALID_ADDRESS_PATTERN, VALID_ADDRESSTK_PATTERN, VALID_DIGITS_PATTERN } from '../../constants';

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
    //private courseFields$: Observable<ICourseFields>;

    public studentDataGroup: FormGroup;

    constructor(private fb: FormBuilder,
                private _sdfa: StudentDataFieldsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.studentDataGroup = this.fb.group({
            epaluser_id: [1,[]],
            name: ['ΝΙΚΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            studentsurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            //guardianfirstname: ['ΑΝΑΣΤΑΣΙΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            //guardiansurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionaddress: ['ΓΙΑΝΝΙΤΣΩΝ 5', [Validators.pattern(VALID_ADDRESS_PATTERN),Validators.required]],
            regiontk: ['26334', [Validators.pattern(VALID_ADDRESSTK_PATTERN),Validators.required]],
            regionarea: ['ΠΑΤΡΑ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            certificatetype: ['Απολυτήριο Λυκείου', Validators.required],
            relationtostudent: ['Μαθητής', Validators.required],
            telnum:  ['2610789789', [Validators.pattern(VALID_DIGITS_PATTERN),Validators.required]],
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
    }


    saveSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
        this.router.navigate(['/region-schools-select']);
    }


    submitSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
        this.router.navigate(['/application-submit']);
    }
}
