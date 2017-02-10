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
const coursefields_actions_1 = require("../../actions/coursefields.actions");
const ng2_redux_1 = require("ng2-redux");
const forms_1 = require("@angular/forms");
let CourseFieldsSelect = class CourseFieldsSelect {
    constructor(fb, _cfa, _ngRedux, router) {
        this.fb = fb;
        this._cfa = _cfa;
        this._ngRedux = _ngRedux;
        this.router = router;
        this.cfs = new forms_1.FormArray([]);
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    }
    ;
    ngOnInit() {
        this._cfa.getCourseFields();
        this.courseFields$ = this._ngRedux.select(state => {
            state.courseFields.reduce(({}, courseField) => {
                this.cfs.push(new forms_1.FormControl(courseField.selected, []));
                return courseField;
            }, {});
            return state.courseFields;
        });
    }
    saveSelected() {
        this._cfa.saveCourseFieldsSelected(this.formGroup.value.formArray);
        this.router.navigate(['/region-schools-select']);
    }
};
CourseFieldsSelect = __decorate([
    core_1.Component({
        selector: 'course-fields-select',
        template: `
     <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <div *ngFor="let courseField$ of courseFields$ | async; let i=index">
            <div class="row">
            <div class="col-md-1">
                <input type="checkbox" formControlName="{{i}}">
            </div>
            <div class="col-md-11 pull-left">
                {{courseField$.name}}
            </div>
            </div>
            </div>
        </div>
        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()">
            Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
            </button>
        </div>
        </div>
    </form>
<!--    <pre>{{formGroup.value | json}}</pre> -->
  `
    }),
    core_2.Injectable(),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        coursefields_actions_1.CourseFieldsActions,
        ng2_redux_1.NgRedux,
        router_1.Router])
], CourseFieldsSelect);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseFieldsSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291cnNlLmZpZWxkcy5zZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb3Vyc2UuZmllbGRzLnNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0NBQWtEO0FBQ2xELDRDQUF5QztBQUV6Qyx3Q0FBMkM7QUFDM0MsNkVBQXlFO0FBQ3pFLHlDQUE0QztBQUk1QywwQ0FLd0I7QUE4QlYsSUFBcUIsa0JBQWtCLEdBQXZDO0lBTVYsWUFBb0IsRUFBZSxFQUNmLElBQXlCLEVBQ3pCLFFBQTRCLEVBQzVCLE1BQWM7UUFIZCxPQUFFLEdBQUYsRUFBRSxDQUFhO1FBQ2YsU0FBSSxHQUFKLElBQUksQ0FBcUI7UUFDekIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFDNUIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUwzQixRQUFHLEdBQUcsSUFBSSxpQkFBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBTTNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ3RCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFBQSxDQUFDO0lBRUYsUUFBUTtRQUVKLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQzNDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVc7Z0JBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDdkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNKLENBQUE7QUFqQ2tDLGtCQUFrQjtJQTNCcEQsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxzQkFBc0I7UUFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCWDtLQUNGLENBQUM7SUFDRCxpQkFBVSxFQUFFO3FDQU1lLG1CQUFXO1FBQ1QsMENBQW1CO1FBQ2YsbUJBQU87UUFDVCxlQUFNO0dBVEgsa0JBQWtCLENBaUNwRDs7a0JBakNrQyxrQkFBa0IifQ==