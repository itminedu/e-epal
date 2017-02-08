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
const router_1 = require("@angular/router");
const core_2 = require("@angular/core");
const ng2_redux_1 = require("ng2-redux");
const sectorfields_actions_1 = require("../../actions/sectorfields.actions");
const sectorcourses_actions_1 = require("../../actions/sectorcourses.actions");
const regionschools_actions_1 = require("../../actions/regionschools.actions");
const studentdatafields_actions_1 = require("../../actions/studentdatafields.actions");
const classfields_actions_1 = require("../../actions/classfields.actions");
let ApplicationPreview = class ApplicationPreview {
    constructor(_rsa, _rsb, _rsc, _rsd, _rcd, _ngRedux, router) {
        this._rsa = _rsa;
        this._rsb = _rsb;
        this._rsc = _rsc;
        this._rsd = _rsd;
        this._rcd = _rcd;
        this._ngRedux = _ngRedux;
        this.router = router;
    }
    ;
    ngOnInit() {
        this._rsa.getSectorCourses();
        this.sectors$ = this._ngRedux.select(state => {
            state.sectors.reduce((prevSector, sector) => {
                sector.courses.reduce((prevCourse, course) => {
                    return course;
                }, {});
                return sector;
            }, {});
            return state.sectors;
        });
        this._rsb.getRegionSchools();
        this.regions$ = this._ngRedux.select(state => {
            state.regions.reduce((prevRegion, region) => {
                region.epals.reduce((prevSchool, school) => {
                    return school;
                }, {});
                return region;
            }, {});
            return state.regions;
        });
        this._rsc.getSectorFields();
        this.sectorFields$ = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) => {
                return sectorField;
            }, {});
            return state.sectorFields;
        });
        this.studentDataFields$ = this._ngRedux.select(state => {
            state.studentDataFields.reduce(({}, studentDataField) => {
                return studentDataField;
            }, {});
            return state.studentDataFields;
        });
        this.classFields$ = this._ngRedux.select(state => {
            state.classFields.reduce(({}, classField) => {
                return classField;
            }, {});
            return state.classFields;
        });
    }
    defineSector() {
        this.router.navigate(['/sector-fields-select']);
    }
    defineCourse() {
        this.router.navigate(['/sectorcourses-fields-select']);
    }
    defineSchools() {
        this.router.navigate(['/region-schools-select']);
    }
    definePersonalData() {
        this.router.navigate(['/student-application-form-main']);
    }
    defineClass() {
        this.router.navigate(['/class-fields-select']);
    }
};
ApplicationPreview = __decorate([
    core_1.Component({
        selector: 'application-preview-select',
        template: `
        <h4 style="margin-top: 20px; line-height: 2em; ">Οι επιλογές μου</h4>



       <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineClass()">
            Η τάξη μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
            <div *ngFor="let classField$ of classFields$ | async;">
                <li class="list-group-item">
                    Τάξη εισαγωγής: {{classField$.name}}
                </li>
            </div>
        </ul>


        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineSector()">
            O τομέας μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
            <div *ngFor="let sectorField$ of sectorFields$ | async;">
                <li class="list-group-item" *ngIf="sectorField$.selected === true" >
                    {{sectorField$.name}}
                </li>
            </div>
        </ul>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineCourse()">
            Η ειδικότητά μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let sector$ of sectors$ | async;">
                <div *ngFor="let course$ of sector$.courses;" >
                <li class="list-group-item" *ngIf="course$.selected === true">
                    {{course$.course_name}}
                </li>
            </div>
            </div>
        </ul>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="defineSchools()">
            Τα σχολεία μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let region$ of regions$ | async;">
                <div *ngFor="let epal$ of region$.epals; " >
                <li class="list-group-item" *ngIf="epal$.selected === true">
                    {{epal$.epal_name}}
                </li>
            </div>
            </div>
        </ul>

        <div class="row">
        <div class="btn-group inline pull-center">
            <button type="button" class="btn-primary btn-md pull-center" (click)="definePersonalData()">
            Τα στοιχεία μου<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
        <ul class="list-group" style="margin-bottom: 20px;">
              <div *ngFor="let studentDataField$ of studentDataFields$ | async;">
                <li class="list-group-item">
                    Όνομα μαθητή: {{studentDataField$.studentFirstname}}
                </li>
                <li class="list-group-item">
                    Επώνυμο μαθητή: {{studentDataField$.studentSurname}}
                </li>
                <li class="list-group-item">
                    AMKA μαθητή: {{studentDataField$.studentAmka}}
                </li>
            </div>
        </ul>
  `
    }),
    core_2.Injectable(),
    __metadata("design:paramtypes", [sectorcourses_actions_1.SectorCoursesActions,
        regionschools_actions_1.RegionSchoolsActions,
        sectorfields_actions_1.SectorFieldsActions,
        studentdatafields_actions_1.StudentDataFieldsActions, typeof (_a = typeof classfields_actions_1.ClassFieldsActions !== "undefined" && classfields_actions_1.ClassFieldsActions) === "function" && _a || Object, ng2_redux_1.NgRedux,
        router_1.Router])
], ApplicationPreview);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationPreview;
var _a;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24ucHJldmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLnByZXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHdDQUFrRDtBQUNsRCw0Q0FBeUM7QUFFekMsd0NBQTJDO0FBQzNDLHlDQUE0QztBQUU1Qyw2RUFBeUU7QUFDekUsK0VBQTJFO0FBQzNFLCtFQUEyRTtBQUMzRSx1RkFBbUY7QUFDbkYsMkVBQXVFO0FBdUd6RCxJQUFxQixrQkFBa0IsR0FBdkM7SUFRVixZQUFvQixJQUEwQixFQUMxQixJQUEwQixFQUMxQixJQUF5QixFQUN6QixJQUE4QixFQUM5QixJQUF3QixFQUN4QixRQUE0QixFQUM1QixNQUFjO1FBTmQsU0FBSSxHQUFKLElBQUksQ0FBc0I7UUFDMUIsU0FBSSxHQUFKLElBQUksQ0FBc0I7UUFDMUIsU0FBSSxHQUFKLElBQUksQ0FBcUI7UUFDekIsU0FBSSxHQUFKLElBQUksQ0FBMEI7UUFDOUIsU0FBSSxHQUFKLElBQUksQ0FBb0I7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUVsQyxDQUFDO0lBQUEsQ0FBQztJQUVGLFFBQVE7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3RDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLE1BQU07Z0JBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLE1BQU07b0JBQ3JDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxFQUFF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