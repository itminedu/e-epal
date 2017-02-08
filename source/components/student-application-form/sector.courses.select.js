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
const sectorcourses_actions_1 = require("../../actions/sectorcourses.actions");
const ng2_redux_1 = require("ng2-redux");
const forms_1 = require("@angular/forms");
let SectorCoursesSelect = class SectorCoursesSelect {
    constructor(fb, _rsa, _ngRedux, router) {
        this.fb = fb;
        this._rsa = _rsa;
        this._ngRedux = _ngRedux;
        this.router = router;
        this.rss = new forms_1.FormArray([]);
        this.sectorActive = -1;
        this.idx = -1;
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    }
    ;
    ngOnInit() {
        this._rsa.getSectorCourses();
        this.sectors$ = this._ngRedux.select(state => {
            state.sectors.reduce((prevSector, sector) => {
                sector.courses.reduce((prevCourse, course) => {
                    this.rss.push(new forms_1.FormControl(course.selected, []));
                    this.retrieveCheck();
                    return course;
                }, {});
                return sector;
            }, {});
            return state.sectors;
        });
    }
    setActiveSector(ind) {
        this.sectorActive = ind;
    }
    toggleBackgroundColor(ind) {
        return ((this.sectorActive === ind) ? "cyan" : "#eeeeee");
    }
    saveSelected() {
        this._rsa.saveSectorCoursesSelected(this.formGroup.value.formArray);
        this.router.navigate(['/region-schools-select']);
    }
    updateCheckedOptions(globalIndex, cb) {
        /*
        if (this.oneselected)
          this.oneselected = 0;
        else
          this.oneselected = 1;
        console.log(this.oneselected);
        */
        //this.idx = index;
        this.idx = globalIndex;
        for (let i = 0; i < this.formGroup.value.formArray.length; i++)
            this.formGroup.value.formArray[i] = false;
        this.formGroup.value.formArray[globalIndex] = cb.checked;
        if (cb.checked === false)
            this.idx = -1;
    }
    retrieveCheck() {
        for (let i = 0; i < this.formGroup.value.formArray.length; i++)
            if (this.formGroup.value.formArray[i] === true) {
                this.idx = i;
                return;
            }
    }
};
SectorCoursesSelect = __decorate([
    core_1.Component({
        selector: 'sectorcourses-fields-select',
        template: `
    <div class="row equal">
     <div class="col-md-8">
      <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <ul class="list-group">
            <div *ngFor="let sector$ of sectors$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveSector(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{sector$.sector_name}}</h5>
                </li>

                <div *ngFor="let course$ of sector$.courses; let j=index;" [hidden]="i !== sectorActive">
                    <li class="list-group-item" >
                        <div class="row">
                            <div class="col-md-2">
                                <input #cb type="checkbox" formControlName="{{ course$.globalIndex }}"
                                (change)="updateCheckedOptions(course$.globalIndex, cb)"
                                [checked] = " course$.globalIndex === idx ">
                            </div>
                            <div class="col-md-10">
                                {{course$.course_name}}
                            </div>
                        </div>
                    </li>
                </div>
              </div>
            </ul>
        </div>

        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()" [disabled]="idx === -1"	 >
            Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
     </form>
   </div>

   <div class="col-md-4">
     <application-preview-select></application-preview-select>
   </div>
   </div>
  `
    }),
    core_2.Injectable(),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        sectorcourses_actions_1.SectorCoursesActions,
        ng2_redux_1.NgRedux,
        router_1.Router])
], SectorCoursesSelect);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SectorCoursesSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yLmNvdXJzZXMuc2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VjdG9yLmNvdXJzZXMuc2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx3Q0FBa0Q7QUFDbEQsNENBQXlDO0FBRXpDLHdDQUEyQztBQUMzQywrRUFBMkU7QUFDM0UseUNBQTRDO0FBSTVDLDBDQUt3QjtBQWtEVixJQUFxQixtQkFBbUIsR0FBeEM7SUFPVixZQUFvQixFQUFlLEVBQ2YsSUFBMEIsRUFDMUIsUUFBNEIsRUFDNUIsTUFBYztRQUhkLE9BQUUsR0FBRixFQUFFLENBQWE7UUFDZixTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBUDFCLFFBQUcsR0FBRyxJQUFJLGlCQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsaUJBQVksR0FBVyxDQUFDLENBQUMsQ0FBQztRQUMxQixRQUFHLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFPckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUMzQixTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUc7U0FDdEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUFBLENBQUM7SUFFRixRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNO2dCQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNO29CQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxJQUFJLG1CQUFXLENB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