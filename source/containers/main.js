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
require("./globalstyles.css");
const ng2_redux_1 = require("ng2-redux");
const store_1 = require("../store");
// import { reimmutify } from '../store';
let Main = class Main {
    constructor(router, activatedRoute, _ngRedux, _devTools) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this._ngRedux = _ngRedux;
        this._devTools = _devTools;
        this.path = '';
        router.events.subscribe((data) => {
            this.path = data.url.substr(1);
        });
        const tools = _devTools.enhancer({});
        _ngRedux.configureStore(store_1.rootReducer, {}, store_1.middleware, 
        //      tools ? [ ...enhancers, tools ] : enhancers);
        tools);
    }
};
Main = __decorate([
    core_1.Component({
        selector: 'main',
        template: `
  <div class="row">
    <div class="col-md-3">
      <ul class="nav nav-pills nav-stacked">
      <li [ngClass]="{active: path=='application-preview'}">
        <a [routerLink]="['/application-preview']">Προεπισκόπηση</a>
      </li>
      <li [ngClass]="{active: path=='class-fields-select'}">
        <a [routerLink]="['/class-fields-select']">Επιλογή Τάξης</a>
      </li>
      <li [ngClass]="{active: path=='sector-fields-select'}">
        <a [routerLink]="['/sector-fields-select']">Επιλογή Τομέα</a>
      </li>
      <li [ngClass]="{active: path=='course-fields-select'}">
        <a [routerLink]="['/course-fields-select']">Επιλογή Ειδικότητας</a>
      </li>
      <li [ngClass]="{active: path=='sectorcourses-fields-select'}">
        <a [routerLink]="['/sectorcourses-fields-select']">Επιλογή Ειδικότητας με βάση τον τομέα</a>
      </li>
      <li [ngClass]="{active: path=='region-schools-select'}">
        <a [routerLink]="['/region-schools-select']">Επιλογή Σχολείου</a>
      </li>
      <li [ngClass]="{active: path=='student-application-form-main'}">
        <a [routerLink]="['/student-application-form-main']">Αίτηση μαθητή / Καταχώρηση προσωπικών στοιχείων</a>
      </li>
      <li [ngClass]="{active: path=='students-list'}">
        <a [routerLink]="['/students-list']">Μαθητές</a>
      </li>
      <li [ngClass]="{active: path=='form3'}">
        <a [routerLink]="['/form3']">Αίτηση</a>
      </li>
      </ul>
    </div>
    <div class="col-md-9">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title">{{path || 'home' | camelcase }}</h3>
        </div>
        <div class="panel-body">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  </div>
  `
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        ng2_redux_1.NgRedux,
        ng2_redux_1.DevToolsExtension])
], Main);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHdDQUNzQjtBQUN0Qiw0Q0FJd0I7QUFDeEIsOEJBQTRCO0FBQzVCLHlDQUErRDtBQUMvRCxvQ0FLa0I7QUFDbEIseUNBQXlDO0FBbUR6QyxJQUFxQixJQUFJLEdBQXpCO0lBR0UsWUFDVSxNQUFjLEVBQ2QsY0FBOEIsRUFDOUIsUUFBNEIsRUFDNUIsU0FBNEI7UUFINUIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixjQUFTLEdBQVQsU0FBUyxDQUFtQjtRQU4vQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBUXZCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSTtZQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBR0gsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUVsQyxDQUFDLENBQUM7UUFDRCxRQUFRLENBQUMsY0FBYyxDQUNyQixtQkFBVyxFQUNYLEVBQUUsRUFDRixrQkFBVTtRQUNoQixxREFBcUQ7UUFDL0MsS0FBSyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0YsQ0FBQTtBQXhCb0IsSUFBSTtJQWhEeEIsZ0JBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q1Q7S0FDRixDQUFDO3FDQUtrQixlQUFNO1FBQ0UsdUJBQWM7UUFDcEIsbUJBQU87UUFDTiw2QkFBaUI7R0FQbkIsSUFBSSxDQXdCeEI7O2tCQXhCb0IsSUFBSSJ9