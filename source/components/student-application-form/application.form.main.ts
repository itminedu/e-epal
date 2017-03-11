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
    Validators,
} from '@angular/forms';

@Component({
    selector: 'application-form-main',
    templateUrl: './application.form.main.html'
})

@Injectable() export default class StudentApplicationMain implements OnInit {

    private studentDataFields$: Observable<IStudentDataFields>;
    private criteria$: Observable<ICriter>;

    public studentDataGroup: FormGroup;
    public applicantDataGroup: FormGroup;
    public studentCriteriaGroup: FormGroup;
    //public orphanmode = <number>0;
    //public childrenmode = <number>0;

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
          orphanmono: false,
          orphantwice: false,
          threechildren: false,
          manychildren: false,
          twins: false,
          disability: false,
          studies: false,
          income: ['noincomecriterio', this.checkChoice ],
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

        this.criteria$ = this._ngRedux.select(state => {
            if (state.criter.size > 0) {
                state.criter.reduce(({}, criteria) => {
                    this.studentCriteriaGroup.setValue(criteria);
                    return criteria;
                }, {});
            }
            return state.criter;
        });

    }

    navigateBack() {
/*        this._ngRedux.select(state => {
            state.epalclasses.reduce(({}, epalclass) =>{
              if (epalclass.name === "Α' Λυκείου")
                this.router.navigate(['/region-schools-select']);
              else if (epalclass.name === "Β' Λυκείου")
                  this.router.navigate(['/region-schools-select']);
              else if (epalclass.name === "Γ' Λυκείου")
                    this.router.navigate(['/region-schools-select']);
              return epalclass;
            }, {});
            return state.epalclasses;
        }); */
        this.router.navigate(['/schools-order-select']);

    }

    submitSelected() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);

        this.router.navigate(['/application-submit']);
    }

    checkorphan(orphanModeName,cb) {
      if (orphanModeName === "mono" && cb.checked === true)
        this.studentCriteriaGroup.controls['orphantwice'].setValue(false);
      else if (orphanModeName === "twice" && cb.checked === true)
        this.studentCriteriaGroup.controls['orphanmono'].setValue(false);

      this._sdfb.saveCriteria([this.studentCriteriaGroup.value]);

      //console.log("after check");
      //console.log(this.studentCriteriaGroup.value);
    }

    checkchildren(childrenModeName, cb) {
      if (childrenModeName === "three" && cb.checked === true)
        this.studentCriteriaGroup.controls['manychildren'].setValue(false);
      else if (childrenModeName === "many" && cb.checked === true)
        this.studentCriteriaGroup.controls['threechildren'].setValue(false);

      this._sdfb.saveCriteria([this.studentCriteriaGroup.value]);

      //console.log("after check");
      //console.log(this.studentCriteriaGroup.value);
    }

    checkstatus() {
        //this.studentCriteriaGroup.controls[name].setValue(cb.checked);
        //console.log("after check");
        //console.log(this.studentCriteriaGroup.value);
        this._sdfb.saveCriteria([this.studentCriteriaGroup.value]);
    }

     checkChoice(c: FormControl) {
      console.log(c.value);
      if (c.value === "noincomecriterio")
        return {status: true}
      else
      // Null means valid, believe it or not
        return null;
    }

}
