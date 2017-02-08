"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const core_2 = require("@angular/core");
const studentdatafields_actions_1 = require("../../actions/studentdatafields.actions");
const router_1 = require("@angular/router");
const ng2_redux_1 = require("ng2-redux");
const constants_1 = require("../../constants");
const forms_1 = require("@angular/forms");
let StudentApplicationMain = class StudentApplicationMain {
    constructor(fb, _sdfa, _ngRedux, router) {
        this.fb = fb;
        this._sdfa = _sdfa;
        this._ngRedux = _ngRedux;
        this.router = router;
        this.studentDataGroup = this.fb.group({
            studentAmka: ['12346', forms_1.Validators.required],
            studentFirstname: ['ΝΙΚΟΣ', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            studentSurname: ['ΚΑΤΣΑΟΥΝΟΣ', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            guardianFirstname: ['ΑΝΑΣΤΑΣΙΟΣ', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            guardianSurname: ['ΚΑΤΣΑΟΥΝΟΣ', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            regionAddress: ['ΓΙΑΝΝΙΤΣΩΝ 5', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            regionTK: ['26334', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            regionArea: ['ΠΑΤΡΑ', [forms_1.Validators.pattern(constants_1.VALID_NAMES_PATTERN), forms_1.Validators.required]],
            certificateType: ['Απολυτήριο Λυκείου', forms_1.Validators.required],
            relationToStudent: ['Μαθητής', forms_1.Validators.required],
        });
    }
    ;
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
            state.courseFields.reduce(({}, courseField) => {
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
};
StudentApplicationMain = __decorate([
    core_1.Component({
        selector: 'application-form-main',
        templateUrl: './application.form.main.html'
    }),
    core_2.Injectable(),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        studentdatafields_actions_1.StudentDataFieldsActions,
        ng2_redux_1.NgRedux,
        router_1.Router])
], StudentApplicationMain);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudentApplicationMain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uZm9ybS5tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwbGljYXRpb24uZm9ybS5tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx3Q0FBa0Q7QUFFbEQsd0NBQTJDO0FBQzNDLHVGQUFtRjtBQUNuRiw0Q0FBeUM7QUFFekMseUNBQTRDO0FBSTVDLCtDQUFzRDtBQUV0RCwwQ0FLd0I7QUFPVixJQUFxQixzQkFBc0IsR0FBM0M7SUFPVixZQUFvQixFQUFlLEVBQ2YsS0FBK0IsRUFDL0IsUUFBNEIsRUFDNUIsTUFBYztRQUhkLE9BQUUsR0FBRixFQUFFLENBQWE7UUFDZixVQUFLLEdBQUwsS0FBSyxDQUEwQjtRQUMvQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQzlCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNsQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7WUFDM0MsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxrQkFBVSxDQUFDLE9BQU8sQ0FBQywrQkFBbUIsQ0FBQyxFQUFDLGtCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUYsY0FBYyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsa0JBQVUsQ0FBQyxPQUFPLENBQUMsK0JBQW1CLENBQUMsRUFBQyxrQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdGLGlCQUFpQixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsa0JBQVUsQ0FBQyxPQUFPLENBQUMsK0JBQW1CLENBQUMsRUFBQyxrQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hHLGVBQWUsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLGtCQUFVLENBQUMsT0FBTyxDQUFDLCtCQUFtQixDQUFDLEVBQUMsa0JBQVUsQ0FB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