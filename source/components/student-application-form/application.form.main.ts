import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { NgRedux, select } from 'ng2-redux';
import { StudentDataFieldsActions } from '../../actions/studentdatafields.actions';
import { IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { CriteriaActions } from '../../actions/criteria.actions';
import { ICriter } from '../../store/criteria/criteria.types';
import { IAppState } from '../../store/store';
import { VALID_NAMES_PATTERN, VALID_ADDRESS_PATTERN, VALID_ADDRESSTK_PATTERN, VALID_DIGITS_PATTERN,
    VALID_DATE_PATTERN, FIRST_SCHOOL_YEAR, VALID_YEAR_PATTERN, VALID_TELEPHONE_PATTERN } from '../../constants';
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from '../../store/studentdatafields/studentdatafields.initial-state';
import { CRITERIA_INITIAL_STATE } from '../../store/criteria/criteria.initial-state';
import { ILoginInfo, ILoginInfoToken } from '../../store/logininfo/logininfo.types';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import {IMyDpOptions} from 'mydatepicker';
import {Http, RequestOptions} from '@angular/http';

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

    private studentDataFields$: BehaviorSubject<IStudentDataFields>;
    private criteria$: BehaviorSubject<ICriter>;

    private studentDataFieldsSub: Subscription;
    private criteriaSub: Subscription;

    public studentDataGroup: FormGroup;
    public studentCriteriaGroup: FormGroup;

    private loginInfo$: BehaviorSubject<ILoginInfo>;

    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private schoolyears: string[];
    private graduationyears: string[];

    private rss = new FormArray([]);

    private myDatePickerOptions: IMyDpOptions = {
        // other options...
        sunHighlight: false,
        editableDateField: false,
        dateFormat: 'dd/mm/yyyy',
    };

    private observableSource = (keyword: any): Observable<any[]> => {
    let url: string = 'https://mm.sch.gr/api/units?name='+keyword;
    if (keyword) {
      return this.http.get(url)
        .map(res => {
          let json = res.json();
          return json.data;
        })
    } else {
      return Observable.of([]);
    }
    }

    constructor(private fb: FormBuilder,
                private _sdfa: StudentDataFieldsActions,
                private _sdfb: CriteriaActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router,
                private http: Http) {
        this.populateSchoolyears();
        this.populateGraduationyears();
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.modalTitle =  new BehaviorSubject("");
        this.modalText =  new BehaviorSubject("");
        this.modalHeader =  new BehaviorSubject("");

        this.studentDataFields$ = new BehaviorSubject(STUDENT_DATA_FIELDS_INITIAL_STATE);
        this.criteria$ = new BehaviorSubject(CRITERIA_INITIAL_STATE);
        this.studentDataGroup = this.fb.group({
//            epaluser_id: [,[]],

            name: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            studentsurname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            studentbirthdate: ['', [Validators.required]],
            //studentbirthdate: ['', [Validators.pattern(VALID_DATE_PATTERN),Validators.required]],
            fatherfirstname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            motherfirstname: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            regionaddress: ['', [Validators.pattern(VALID_ADDRESS_PATTERN),Validators.required]],
            regiontk: ['', [Validators.pattern(VALID_ADDRESSTK_PATTERN),Validators.required]],
            regionarea: ['', [Validators.pattern(VALID_NAMES_PATTERN),Validators.required]],
            certificatetype: ['', this.checkChoice],
            relationtostudent: ['', this.checkChoice],
            telnum:  ['', [Validators.pattern(VALID_TELEPHONE_PATTERN),Validators.required]],
            graduation_year: ['', this.checkChoice],
            lastschool_schoolname: ['', [Validators.pattern(VALID_ADDRESS_PATTERN),Validators.required]],
            lastschool_schoolyear: ['', this.checkChoice],
            lastschool_class: ['', this.checkChoice],
        });


/*        this.studentCriteriaGroup = this.fb.group({
            formArray: this.rss,
        }); */

    };

    ngOnInit() {
        (<any>$('#applicationFormNotice')).appendTo("body");

        this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    console.log(loginInfoToken.cu_name);
                    return loginInfoToken;
                }, {});
            }
            return state.loginInfo;
        }).subscribe(this.loginInfo$);

        this.studentDataFieldsSub = this._ngRedux.select(state => {
            if (state.studentDataFields.size > 0) {
                state.studentDataFields.reduce(({}, studentDataField) => {

                    this.studentDataGroup.controls['name'].setValue(studentDataField.name);
                    this.studentDataGroup.controls['studentsurname'].setValue(studentDataField.studentsurname);
                    this.studentDataGroup.controls['fatherfirstname'].setValue(studentDataField.fatherfirstname);
                    this.studentDataGroup.controls['motherfirstname'].setValue(studentDataField.motherfirstname);
                    this.studentDataGroup.controls['regionaddress'].setValue(studentDataField.regionaddress);
                    this.studentDataGroup.controls['regiontk'].setValue(studentDataField.regiontk);
                    this.studentDataGroup.controls['regionarea'].setValue(studentDataField.regionarea);
                    this.studentDataGroup.controls['certificatetype'].setValue(studentDataField.certificatetype);
                    this.studentDataGroup.controls['graduation_year'].setValue(studentDataField.graduation_year);
                    this.studentDataGroup.controls['lastschool_schoolname'].setValue(studentDataField.lastschool_schoolname);
                    this.studentDataGroup.controls['lastschool_schoolyear'].setValue(studentDataField.lastschool_schoolyear);
                    this.studentDataGroup.controls['lastschool_class'].setValue(studentDataField.lastschool_class);
                    this.studentDataGroup.controls['relationtostudent'].setValue(studentDataField.relationtostudent);
                    this.studentDataGroup.controls['telnum'].setValue(studentDataField.telnum);
                    this.studentDataGroup.controls['studentbirthdate'].setValue(this.populateDate(studentDataField.studentbirthdate));
                    return studentDataField;
                }, {});
            }
            return state.studentDataFields;
        }).subscribe(this.studentDataFields$);



/*        this._sdfb.getCriteria(true);
        this.criteriaSub = this._ngRedux.select(state => {
            if (state.criter.size > 0) {
                state.criter.reduce(({}, criteria) => {
                    //this.studentCriteriaGroup.setValue(criteria);

                      //if (criteria.selected === true && (criteria.name === "Εισόδημα" ))  {
                      //  this.selectionIncomeId = Number(criteria.id);
                      //}
                      this.rss.push( new FormControl(criteria.selected, []));
                    return criteria;
                }, {});
            }
            return state.criter;
        }).subscribe(this.criteria$); */

    };

    ngOnDestroy() {
        (<any>$('#applicationFormNotice')).remove();
        if (this.studentDataFieldsSub) this.studentDataFieldsSub.unsubscribe();
//        if (this.criteriaSub) this.criteriaSub.unsubscribe();
        if (this.studentDataFields$) this.studentDataFields$.unsubscribe();
//        if (this.criteria$) this.criteria$.unsubscribe();
        if (this.loginInfo$) this.loginInfo$.unsubscribe();
    }

    navigateBack() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
//        this._sdfb.saveCriteria([this.studentCriteriaGroup.value.formArray]);
        this.router.navigate(['/schools-order-select']);
    }

    submitSelected() {
        // if (this.studentDataGroup.invalid || this.studentCriteriaGroup.invalid) {
        if (this.studentDataGroup.invalid) {
            this.modalHeader.next("modal-header-danger");
            this.modalTitle.next("Η αίτηση δεν είναι πλήρης");
            this.modalText.next("Πρέπει να συμπληρώσετε όλα τα πεδία που συνοδεύονται από (*)");
            this.showModal();
        } else {
            this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
//            this._sdfb.saveCriteria([this.studentCriteriaGroup.value.formArray]);
            this.router.navigate(['/application-submit']);
        }
    }

    checkcriteria(cb, mutual_disabled) {
      if (mutual_disabled !== "-1" && cb.checked === true) {
        //this.studentCriteriaGroup.controls['formArray']['controls'][mutual_disabled-1].setValue(false);
        let  mutual_ids = mutual_disabled.split(",");
        for (let i=0; i<mutual_ids.length; i++) {
          this.studentCriteriaGroup.controls['formArray']['controls'][mutual_ids[i]-1].setValue(false);
        }

      }
    }

    checkChoice(c: FormControl) {
      return (c.value === "" ) ? {status: true} : null;
    }

    populateDate(d) {
        if (d && d.length > 0) {
            return {
                date: {
                    year: d ? parseInt(d.substr(0,4)) : 0,
                    month: d ? parseInt(d.substr(6,8)) : 0,
                    day: d ? parseInt(d.substr(8,10)) : 0
                }
            };
        } else {
            return {
                date: null
            };
        }
    }

    private populateSchoolyears(): void {
        let endYear = new Date().getFullYear();
        this.schoolyears = new Array();
        for (let i=endYear; i>FIRST_SCHOOL_YEAR; i--) {
            this.schoolyears.push((i-1) + "-" + i);
        }
    };

    private populateGraduationyears(): void {
        let endYear = new Date().getFullYear();
        this.graduationyears = new Array();
        for (let i=endYear; i>FIRST_SCHOOL_YEAR; i--) {
            this.graduationyears.push(i + "");
        }
    };

    setDate() {
        let date = new Date();
        return { date: {
            year: date.getFullYear() - 14,
            month: date.getMonth() + 1,
            day: date.getDate()}
        };
    }

    clearDate() {
        return null;
    }

    public showModal():void {
        (<any>$('#applicationFormNotice')).modal('show');
    }

    public hideModal():void {
        (<any>$('#applicationFormNotice')).modal('hide');
    }

    lastSchoolListFormatter(data: any): string {
      return data.name;
    };

    lastSchoolValueFormatter(data: any): string {
      return data.name;
    };

    lastSchoolValueChanged(e: any): void {
//        console.log(this.studentDataGroup.controls['lastschool_schoolname'].value);
    };

}
