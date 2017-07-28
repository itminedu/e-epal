import { Component, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription, Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgRedux, select } from "@angular-redux/store";
import { StudentDataFieldsActions } from "../../actions/studentdatafields.actions";
import { IStudentDataFields } from "../../store/studentdatafields/studentdatafields.types";
import { IAppState } from "../../store/store";
import { VALID_NAMES_PATTERN, VALID_UCASE_NAMES_PATTERN, VALID_ADDRESS_PATTERN, VALID_ADDRESSTK_PATTERN, VALID_DIGITS_PATTERN,
    VALID_DATE_PATTERN, FIRST_SCHOOL_YEAR, VALID_YEAR_PATTERN, VALID_TELEPHONE_PATTERN } from "../../constants";
import { STUDENT_DATA_FIELDS_INITIAL_STATE } from "../../store/studentdatafields/studentdatafields.initial-state";
import { ILoginInfo, ILoginInfoToken } from "../../store/logininfo/logininfo.types";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import {IMyDpOptions} from "mydatepicker";
import {Http, RequestOptions} from "@angular/http";

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from "@angular/forms";

@Component({
    selector: "application-form-main",
    templateUrl: "./application.form.main.html"
})

@Injectable() export default class StudentApplicationMain implements OnInit {

    private loginInfo$: BehaviorSubject<ILoginInfo>;
    private studentDataFields$: BehaviorSubject<IStudentDataFields>;

    private studentDataFieldsSub: Subscription;
    private loginInfoSub: Subscription;
    private criteriaSub: Subscription;

    private studentDataGroup: FormGroup;
    private studentCriteriaGroup: FormGroup;

    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    private schoolyears: string[];

    private rss = new FormArray([]);

    private myDatePickerOptions: IMyDpOptions = {
        // other options...
        sunHighlight: false,
        editableDateField: false,
        dateFormat: "dd/mm/yyyy",
    };

    private observableSource = (keyword: any): Observable<any[]> => {
        let url: string = "https://mm.sch.gr/api/units?name=" + keyword;
        if (keyword) {
            return this.http.get(url)
                .map(res => {
                    let json = res.json();
                    let retArr = <any>Array();
                    for (let i = 0; i < json.data.length; i++) {
                        retArr[i] = {};
                        retArr[i].registry_no = json.data[i].registry_no;
                        retArr[i].name = json.data[i].name;
                        retArr[i].unit_type_id = json.data[i].unit_type_id;
                    }
                    return retArr;
                });
        } else {
            return Observable.of([]);
        }
    };

    constructor(private fb: FormBuilder,
        private _sdfa: StudentDataFieldsActions,
        private _ngRedux: NgRedux<IAppState>,
        private router: Router,
        private http: Http) {
        this.populateSchoolyears();
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.studentDataFields$ = new BehaviorSubject(STUDENT_DATA_FIELDS_INITIAL_STATE);
        this.studentDataGroup = this.fb.group({
            name: ["", [Validators.pattern(VALID_UCASE_NAMES_PATTERN), Validators.required]],
            studentsurname: ["", [Validators.pattern(VALID_UCASE_NAMES_PATTERN), Validators.required]],
            studentbirthdate: ["", [Validators.required]],
            fatherfirstname: ["", [Validators.pattern(VALID_UCASE_NAMES_PATTERN), Validators.required]],
            motherfirstname: ["", [Validators.pattern(VALID_UCASE_NAMES_PATTERN), Validators.required]],
            regionaddress: ["", [Validators.pattern(VALID_ADDRESS_PATTERN), Validators.required]],
            regiontk: ["", [Validators.pattern(VALID_ADDRESSTK_PATTERN), Validators.required]],
            regionarea: ["", [Validators.pattern(VALID_NAMES_PATTERN), Validators.required]],
            relationtostudent: ["", this.checkChoice],
            telnum: ["", [Validators.pattern(VALID_TELEPHONE_PATTERN), Validators.required]],
            lastschool_schoolname: ["", [Validators.required]],
            lastschool_schoolyear: ["", this.checkChoice],
            lastschool_class: ["", this.checkChoice],
        });
    };

    ngOnInit() {
        (<any>$("#applicationFormNotice")).appendTo("body");

        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .subscribe(loginInfo => {
                this.loginInfo$.next(<ILoginInfo>loginInfo);
            }, error => { console.log("error selecting loginInfo"); });

        this.studentDataFieldsSub = this._ngRedux.select("studentDataFields")
            .subscribe(studentDataFields => {
                let sdfds = <IStudentDataFields>studentDataFields;
                if (sdfds.size > 0) {
                    sdfds.reduce(({}, studentDataField) => {

                        this.studentDataGroup.controls["name"].setValue(studentDataField.name);
                        this.studentDataGroup.controls["studentsurname"].setValue(studentDataField.studentsurname);
                        this.studentDataGroup.controls["fatherfirstname"].setValue(studentDataField.fatherfirstname);
                        this.studentDataGroup.controls["motherfirstname"].setValue(studentDataField.motherfirstname);
                        this.studentDataGroup.controls["regionaddress"].setValue(studentDataField.regionaddress);
                        this.studentDataGroup.controls["regiontk"].setValue(studentDataField.regiontk);
                        this.studentDataGroup.controls["regionarea"].setValue(studentDataField.regionarea);
                        this.studentDataGroup.controls["lastschool_schoolname"].setValue(studentDataField.lastschool_schoolname);
                        this.studentDataGroup.controls["lastschool_schoolyear"].setValue(studentDataField.lastschool_schoolyear);
                        this.studentDataGroup.controls["lastschool_class"].setValue(studentDataField.lastschool_class);
                        this.studentDataGroup.controls["relationtostudent"].setValue(studentDataField.relationtostudent);
                        this.studentDataGroup.controls["telnum"].setValue(studentDataField.telnum);
                        this.studentDataGroup.controls["studentbirthdate"].setValue(this.populateDate(studentDataField.studentbirthdate));
                        return studentDataField;
                    }, {});
                }
                this.studentDataFields$.next(sdfds);
            }, error => { console.log("error selecting studentDataFields"); });

    };

    ngOnDestroy() {
        (<any>$("#applicationFormNotice")).remove();
        if (this.studentDataFieldsSub) this.studentDataFieldsSub.unsubscribe();
    }

    navigateBack() {
        this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
        this.router.navigate(["/schools-order-select"]);
    }

    submitSelected() {
        let invalidFlag = 0;
        if (this.studentDataGroup.invalid || (invalidFlag = this.invalidFormData()) > 0) {
            this.modalHeader.next("modal-header-danger");
            this.modalTitle.next("Η δήλωση προτίμησης δεν είναι πλήρης");
            if (invalidFlag === 1 || invalidFlag === 2)
                this.modalText.next("Πρέπει να συμπληρώσετε όλα τα πεδία που συνοδεύονται από (*). Η ημερομηνία γέννησης του μαθητή δεν είναι επιτρεπόμενη για μαθητή ΕΠΑΛ.");
            else if (invalidFlag === 3)
                this.modalText.next("Πρέπει να συμπληρώσετε όλα τα πεδία που συνοδεύονται από (*). Το σχολείο τελευταίας φοίτησης πρέπει να αναζητηθεί και να επιλεχθεί από τα αποτελέσματα της αναζήτησης.");
            else if (invalidFlag === 4)
                this.modalText.next("Πρέπει να συμπληρώσετε όλα τα πεδία που συνοδεύονται από (*). Το τηλέφωνο επικοινωνίας πρέπει να είναι σταθερό τηλέφωνο και να αποτελείται από 10 ψηφία.");
            else
                this.modalText.next("Πρέπει να συμπληρώσετε όλα τα πεδία που συνοδεύονται από (*)");

            this.showModal();
        } else {
            this._sdfa.saveStudentDataFields([this.studentDataGroup.value]);
            this.router.navigate(["/application-submit"]);
        }
    }

    private invalidFormData(): number {

        let d = this.studentDataGroup.controls["studentbirthdate"].value;
        if (!d || !d.date || !d.date.year)
            return 1;
        else if ((new Date().getFullYear()) - d.date.year < 14)
            return 2;
        if (!this.studentDataGroup.controls["lastschool_schoolname"].value.registry_no &&
            this.studentDataGroup.controls["lastschool_schoolname"].value.unit_type_id !== 38)
            return 3;
        else if (this.studentDataGroup.controls["lastschool_schoolname"].value.unit_type_id === 38)
            this.studentDataGroup.controls["lastschool_schoolname"].value.registry_no = "0000000";
        if (this.studentDataGroup.controls["telnum"].value.length !== 10)
            return 4;

        return 0;
    }

    checkcriteria(cb, mutual_disabled) {
        if (mutual_disabled !== "-1" && cb.checked === true) {
            // this.studentCriteriaGroup.controls["formArray"]["controls"][mutual_disabled-1].setValue(false);
            let mutual_ids = mutual_disabled.split(",");
            for (let i = 0; i < mutual_ids.length; i++) {
                this.studentCriteriaGroup.controls["formArray"]["controls"][mutual_ids[i] - 1].setValue(false);
            }

        }
    }

    checkChoice(c: FormControl) {
        return (c.value === "") ? { status: true } : null;
    }

    populateDate(d) {
        if (d && d.length > 0) {
            return {
                date: {
                    year: d ? parseInt(d.substr(0, 4)) : 0,
                    month: d ? parseInt(d.substr(5, 7)) : 0,
                    day: d ? parseInt(d.substr(8, 10)) : 0
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
        for (let i = endYear; i > FIRST_SCHOOL_YEAR; i--) {
            this.schoolyears.push((i - 1) + "-" + i);
        }
    };

    setDate() {
        let date = new Date();
        return {
            date: {
                year: date.getFullYear() - 14,
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        };
    }

    clearDate() {
        return null;
    }

    public showModal(): void {
        (<any>$("#applicationFormNotice")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#applicationFormNotice")).modal("hide");
    }

    lastSchoolListFormatter(data: any): string {
        return data.name;
    };

    lastSchoolValueFormatter(data: any): string {
        return data.name;
    };

    lastSchoolValueChanged(e: any): void {
    };

}
