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
const regionschools_actions_1 = require("../../actions/regionschools.actions");
const ng2_redux_1 = require("ng2-redux");
const forms_1 = require("@angular/forms");
let RegionSchoolsSelect = class RegionSchoolsSelect {
    constructor(fb, _rsa, _ngRedux, router) {
        this.fb = fb;
        this._rsa = _rsa;
        this._ngRedux = _ngRedux;
        this.router = router;
        this.rss = new forms_1.FormArray([]);
        this.regionActive = -1;
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
    }
    ;
    ngOnInit() {
        this._rsa.getRegionSchools();
        this.regions$ = this._ngRedux.select(state => {
            state.regions.reduce((prevRegion, region) => {
                region.epals.reduce((prevEpal, epal) => {
                    this.rss.push(new forms_1.FormControl(epal.selected, []));
                    return epal;
                }, {});
                return region;
            }, {});
            return state.regions;
        });
    }
    setActiveRegion(ind) {
        this.regionActive = ind;
    }
    toggleBackgroundColor(ind) {
        return ((this.regionActive === ind) ? "cyan" : "#eeeeee");
    }
    saveSelected() {
        this._rsa.saveRegionSchoolsSelected(this.formGroup.value.formArray);
        this.router.navigate(['/student-application-form-main']);
    }
};
RegionSchoolsSelect = __decorate([
    core_1.Component({
        selector: 'course-fields-select',
        template: `
     <div class="row equal">
      <div class="col-md-8">
       <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <ul class="list-group">
            <div *ngFor="let region$ of regions$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveRegion(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{region$.region_name}}</h5>
                </li>

                <div *ngFor="let epal$ of region$.epals; let j=index;" [hidden]="i !== regionActive">
                    <li class="list-group-item" >
                        <div class="row">
                            <div class="col-md-2">
                                <input type="checkbox" formControlName="{{ epal$.globalIndex }}">
                            </div>
                            <div class="col-md-10">
                                {{epal$.epal_name}}
                            </div>
                        </div>
                    </li>
                </div>
            </div>
            </ul>
        </div>
        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()">
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
        regionschools_actions_1.RegionSchoolsActions,
        ng2_redux_1.NgRedux,
        router_1.Router])
], RegionSchoolsSelect);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegionSchoolsSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaW9uLnNjaG9vbHMuc2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVnaW9uLnNjaG9vbHMuc2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx3Q0FBa0Q7QUFDbEQsNENBQXlDO0FBRXpDLHdDQUEyQztBQUMzQywrRUFBMkU7QUFDM0UseUNBQTRDO0FBSTVDLDBDQUt3QjtBQStDVixJQUFxQixtQkFBbUIsR0FBeEM7SUFNVixZQUFvQixFQUFlLEVBQ2YsSUFBMEIsRUFDMUIsUUFBNEIsRUFDNUIsTUFBYztRQUhkLE9BQUUsR0FBRixFQUFFLENBQWE7UUFDZixTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBTjFCLFFBQUcsR0FBRyxJQUFJLGlCQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsaUJBQVksR0FBVyxDQUFDLENBQUMsQ0FBQztRQU85QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQzNCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRztTQUN0QixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQUEsQ0FBQztJQUVGLFFBQVE7UUFFSixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3RDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLE1BQU07Z0JBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUk7b0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLElBQUksbUJBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVELGVBQWUsQ0FBQyxHQUFHO1FBQ2YsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDNUIsQ0FBQztJQUVELHFCQUFxQixDQUFDLEdBQUc7UUFDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLEdBQUcsQ0FBQyxHQUFHLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNKLENBQUE7QUE3Q2tDLG1CQUFtQjtJQTVDckQsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxzQkFBc0I7UUFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0NYO0tBQ0YsQ0FBQztJQUNELGlCQUFVLEVBQUU7cUNBTWUsbUJBQVc7UUFDVCw0Q0FBb0I7UUFDaEIsbUJBQU87UUFDVCxlQUFNO0dBVEgsbUJBQW1CLENBNkNyRDs7a0JBN0NrQyxtQkFBbUIifQ==