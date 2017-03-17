import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { NgRedux, select } from 'ng2-redux';
import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { CriteriaActions } from '../../actions/criteria.actions';
import { ICriter } from '../../store/criteria/criteria.types';
import { IAppState } from '../../store/store';
import { VALID_NAMES_PATTERN, VALID_ADDRESS_PATTERN, VALID_ADDRESSTK_PATTERN, VALID_DIGITS_PATTERN } from '../../constants';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'application-form-main',
    templateUrl: './application.form.main.html'
})

@Injectable() export default class StudentApplicationMain implements OnInit {

    private studentDataFields$: Observable<IStudentDataFields>;
    private criteria$: Observable<ICriter>;
    private showLoader$: Observable<boolean>;

    public studentDataGroup: FormGroup;
    public applicantDataGroup: FormGroup;
    public studentCriteriaGroup: FormGroup;

    private rss = new FormArray([]);
    private selectionIncomeId = <number>0;

    constructor(private fb: FormBuilder,
                private _sdfa: StudentDataFieldsActions,
                private _sdfb: CriteriaActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.studentDataGroup = this.fb.group({
            epaluser_id: [,[]],
            name: ['ΝΙΚΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            studentsurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionaddress: ['ΓΙΑΝΝΙΤΣΩΝ 5', [Validators.pattern(VALID_ADDRESS_PATTERN),Validators.required]],
            regiontk: ['26334', [Validators.pattern(VALID_ADDRESSTK_PATTERN),Validators.required]],
            regionarea: ['ΠΑΤΡΑ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            certificatetype: ['Απολυτήριο Λυκείου', this.checkChoice],
            relationtostudent: ['Μαθητής', this.checkChoice],
            telnum:  ['2610789789', [Validators.pattern(VALID_DIGITS_PATTERN),Validators.required]],
        });

        this.applicantDataGroup = this.fb.group({
          guardianfirstname: ['ΑΝΑΣΤΑΣΙΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
          guardiansurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
        });

        this.studentCriteriaGroup = this.fb.group({
            formArray: this.rss,
            income: ['', this.checkChoice ],
            //income: ['noincomecriterio', Validators.required ],
            //income: [this.selectionIncomeId, this.checkChoice ],
            //incometest: ['noincomecriterio', checkChoice ],
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

        this._sdfb.getCriteria(true);
        this.criteria$ = this._ngRedux.select(state => {
            if (state.criter.size > 0) {
                state.criter.reduce(({}, criteria) => {
                    //this.studentCriteriaGroup.setValue(criteria);
                      if (criteria.selected === true && (criteria.name === "Εισόδημα" ))  {
                        this.selectionIncomeId = Number(criteria.id);
                      }
                      this.rss.push( new FormControl(criteria.selected, []));
                    return criteria;
                }, {});
            }
            return state.criter;
        });
        this.showLoader$ = this.criteria$.map(criter => criter.size === 0);

    }

    navigateBack() {
        this.router.navigate(['/schools-order-select']);
    }

    submitSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);

        for (let i=7; i < 11; i++)
          this.studentCriteriaGroup.controls['formArray']['controls'][i].setValue(false);
        this.studentCriteriaGroup.controls['formArray']['controls'][this.selectionIncomeId-1].setValue(true);

        this._sdfb.saveCriteria([this.studentCriteriaGroup.value.formArray]);

        this.router.navigate(['/application-submit']);
    }

    checkcriteria(cb, mutual_disabled) {
      if (mutual_disabled !== "-1" && cb.checked === true) {
        this.studentCriteriaGroup.controls['formArray']['controls'][mutual_disabled-1].setValue(false);
      }
    }

    checkstatus(cb) {
        if (cb.value === "<= 3000 Ευρώ")
          this.selectionIncomeId = 8;
        else if (cb.value === "<= 6000 Ευρώ")
          this.selectionIncomeId = 9;
        else if (cb.value === "<= 9000 Ευρώ")
          this.selectionIncomeId = 10;
        else if (cb.value === "> 9000 Ευρώ")
          this.selectionIncomeId = 11;
    }

    //checkChoice(c: FormControl) {
    checkChoice(c: FormControl) {
      if (c.value === "noincomecriterio" ) {
        return {status: true}
      }
      else
      // Null means valid, believe it or not
        return null;


}


}
