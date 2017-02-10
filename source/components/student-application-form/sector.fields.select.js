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
const sectorfields_actions_1 = require("../../actions/sectorfields.actions");
const ng2_redux_1 = require("ng2-redux");
//import ApplicationPreview from './application.preview';
const forms_1 = require("@angular/forms");
let SectorFieldsSelect = class SectorFieldsSelect {
    constructor(fb, _cfa, _ngRedux, router) {
        this.fb = fb;
        this._cfa = _cfa;
        this._ngRedux = _ngRedux;
        this.router = router;
        this.cfs = new forms_1.FormArray([]);
        this.sectorActive = -1;
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });
    }
    ;
    ngOnInit() {
        this._cfa.getSectorFields();
        this.sectorFields$ = this._ngRedux.select(state => {
            state.sectorFields.reduce(({}, sectorField) => {
                this.cfs.push(new forms_1.FormControl(sectorField.selected, []));
                this.retrieveCheck();
                return sectorField;
            }, {});
            return state.sectorFields;
        });
    }
    saveSelected() {
        for (let i = 0; i < this.formGroup.value.formArray.length; i++)
            this.formGroup.value.formArray[i] = false;
        if (this.sectorActive != -1)
            this.formGroup.value.formArray[this.sectorActive] = true;
        this._cfa.saveSectorFieldsSelected(this.formGroup.value.formArray);
        this.router.navigate(['/region-schools-select']);
    }
    setActiveSector(ind) {
        this.sectorActive = ind;
    }
    toggleBackgroundColor(ind) {
        return ((this.sectorActive === ind) ? "cyan" : "#eeeeee");
    }
    retrieveCheck() {
        for (let i = 0; i < this.formGroup.value.formArray.length; i++)
            if (this.formGroup.value.formArray[i] === true) {
                this.sectorActive = i;
                return i;
            }
        return -1;
    }
};
SectorFieldsSelect = __decorate([
    core_1.Component({
        selector: 'sector-fields-select',
        //declarations: [
        //  ApplicationPreview,
        //] ,
        //directives:[ApplicationPreview],
        template: `
    <div class="row equal">
     <div class="col-md-8">
       <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <div *ngFor="let sectorField$ of sectorFields$ | async; let i=index">
                <li class="list-group-item" (click)="setActiveSector(i)" [style.background-color]="toggleBackgroundColor(i)">
                    <h5>{{sectorField$.name}}</h5>
                </li>
            </div>
        </div>
        <div class="row">
        <div class="col-md-2 col-md-offset-5">
            <button type="button" class="btn-primary btn-lg pull-center" (click)="saveSelected()" [disabled]="sectorActive === -1"	>
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
        sectorfields_actions_1.SectorFieldsActions,
        ng2_redux_1.NgRedux,
        router_1.Router])
], SectorFieldsSelect);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SectorFieldsSelect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdG9yLmZpZWxkcy5zZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN0b3IuZmllbGRzLnNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0NBQWtEO0FBQ2xELDRDQUF5QztBQUV6Qyx3Q0FBMkM7QUFDM0MsNkVBQXlFO0FBQ3pFLHlDQUE0QztBQUk1Qyx5REFBeUQ7QUFFekQsMENBS3dCO0FBc0NWLElBQXFCLGtCQUFrQixHQUF2QztJQVFWLFlBQW9CLEVBQWUsRUFDZixJQUF5QixFQUN6QixRQUE0QixFQUM1QixNQUFjO1FBSGQsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUNmLFNBQUksR0FBSixJQUFJLENBQXFCO1FBQ3pCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBQzVCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFQM0IsUUFBRyxHQUFHLElBQUksaUJBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2QixpQkFBWSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBTTlCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDM0IsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ3RCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFBQSxDQUFDO0lBRUYsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQzNDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVc7Z0JBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFRCxZQUFZO1FBQ1IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsZUFBZSxDQUFDLEdBQUc7UUFDZixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztJQUM1QixDQUFDO0lBRUQscUJBQXFCLENBQUMsR0FBRztRQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxhQUFhO1FBQ1gsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUM1RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztDQUVKLENBQUE7QUF6RGtDLGtCQUFrQjtJQW5DcEQsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxzQkFBc0I7UUFDaEMsaUJBQWlCO1FBQ2pCLHVCQUF1QjtRQUN2QixLQUFLO1FBRUwsa0NBQWtDO1FBQ2xDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlCWDtLQUVGLENBQUM7SUFDRCxpQkFBVSxFQUFFO3FDQVFlLG1CQUFXO1FBQ1QsMENBQW1CO1FBQ2YsbUJBQU87UUFDVCxlQUFNO0dBWEgsa0JBQWtCLENBeURwRDs7a0JBekRrQyxrQkFBa0IifQ==