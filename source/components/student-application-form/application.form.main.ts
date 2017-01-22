import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Injectable, ChangeDetectionStrategy} from "@angular/core";
import {StudentDataFieldsActions} from '../../actions/studentdatafields.actions';

import { DevToolsExtension, NgRedux, select } from 'ng2-redux';
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

    constructor(private fb: FormBuilder, private _sdfa: StudentDataFieldsActions, private _ngRedux: NgRedux<IAppState>) {

        this.studentDataGroup = this.fb.group({
            studentAmka: ['12345', Validators.required],
            studentFirstname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            studentSurname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            guardianFirstname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            guardianSurname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionAddress: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionTK: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionArea: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            certificateType: ['', Validators.required],
            relationToStudent: ['', Validators.required],
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
           //console.log("test2");
            state.courseFields.reduce(({}, courseField) =>{
//                this.cfs.push(new FormControl(courseField.selected, []));
                //console.log(courseField.selected);
                return courseField;
            }, {});
            return state.courseFields;
        });
    }

    saveSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
    }
}
