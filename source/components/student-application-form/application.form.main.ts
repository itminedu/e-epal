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

    public studentDataGroup: FormGroup;
    public applicantDataGroup: FormGroup;
    public studentCriteriaGroup: FormGroup;

    private rss = new FormArray([]);
    private selectionIncomeId = <number>0;
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
            certificatetype: ['Απολυτήριο Λυκείου', checkChoice],
            relationtostudent: ['Μαθητής', checkChoice],
            telnum:  ['2610789789', [Validators.pattern(VALID_DIGITS_PATTERN),Validators.required]],
        });

        this.applicantDataGroup = this.fb.group({
          guardianfirstname: ['ΑΝΑΣΤΑΣΙΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
          guardiansurname: ['ΚΑΤΣΑΟΥΝΟΣ', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
        });

        /*
        this.studentCriteriaGroup = this.fb.group({
          orphanmono: false,
          orphantwice: false,
          threechildren: false,
          manychildren: false,
          twins: false,
          disability: false,
          studies: false,
          income: ['noincomecriterio', checkChoice ],
        });
        */
        this.studentCriteriaGroup = this.fb.group({
            formArray: this.rss,
            income: ['noincomecriterio', checkChoice ],
            incometest: ['noincomecriterio', checkChoice ],
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
                      if (criteria.selected === true && (criteria.id === "8" || criteria.id === "9" || criteria.id === "10" || criteria.id === "11" ))
                        this.selectionIncomeId = Number(criteria.id);
                      console.log("Yes");
                      console.log(this.selectionIncomeId);
                      this.rss.push( new FormControl(criteria.selected, []));
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

        this.studentCriteriaGroup.controls['formArray']['controls'][7].setValue(false);
        this.studentCriteriaGroup.controls['formArray']['controls'][8].setValue(false);
        this.studentCriteriaGroup.controls['formArray']['controls'][9].setValue(false);
        this.studentCriteriaGroup.controls['formArray']['controls'][10].setValue(false);
        this.studentCriteriaGroup.controls['formArray']['controls'][this.selectionIncomeId-1].setValue(true);
        this._sdfb.saveCriteria([this.studentCriteriaGroup.value.formArray]);

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

    checkcriteria(cb, mutual_disabled) {
      if (mutual_disabled !== "-1" && cb.checked === true) {
        this.studentCriteriaGroup.controls['formArray']['controls'][mutual_disabled-1].setValue(false);
      }
      //this._sdfb.saveCriteria([this.studentCriteriaGroup.value.formArray]);
    }



    checkstatus(cb) {
        console.log("Hey");
        console.log(this.studentCriteriaGroup.value.income);
        //this._sdfb.saveCriteria([this.studentCriteriaGroup.value.income]);


        console.log("OK");
        console.log(cb.value);

        if (cb.value === "<= 3000 Ευρώ")
          this.selectionIncomeId = 8;
        else if (cb.value === "<= 6000 Ευρώ")
          this.selectionIncomeId = 9;
        else if (cb.value === "<= 9000 Ευρώ")
          this.selectionIncomeId = 10;
        else if (cb.value === "> 9000 Ευρώ")
          this.selectionIncomeId = 11;


          //this.studentCriteriaGroup.value[9] = true;
          //this.studentCriteriaGroup.value[9] = false;
        console.log(this.studentCriteriaGroup.value.formArray);
        console.log(this.studentCriteriaGroup.value);
        //this._sdfb.saveCriteria([this.studentCriteriaGroup.value.formArray]);

    }



}


function checkChoice(c: FormControl) {
  console.log(c.value);
  if (c.value === "noincomecriterio")
    return {status: true}
  else
  // Null means valid, believe it or not
    return null;
}
