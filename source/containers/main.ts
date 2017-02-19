import { Component, Inject, OnInit, OnDestroy }
 from '@angular/core';
import {
  Router,
  ActivatedRoute,
}
 from '@angular/router';
import './globalstyles.css';
//import '../../myschool/main.scss';
import { DevToolsExtension, NgRedux, select } from 'ng2-redux';
import {
  IAppState,
  rootReducer,
  middleware,
//  enhancers,
} from '../store';
// import { reimmutify } from '../store';

/*
<div class="row">
  <div class="col-md-3">
    <ul class="nav nav-pills nav-stacked">
    <li [ngClass]="{active: path=='course-fields-select'}">
      <a [routerLink]="['/course-fields-select']">Επιλογή Ειδικότητας</a>
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
*/

@Component({
  selector: 'main',
  template: `
  <reg-header></reg-header>
  <reg-navbar></reg-navbar>
  <reg-main></reg-main>
  <reg-footer></reg-footer>
  `
})
export default class Main {
  public path: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _ngRedux: NgRedux<IAppState>,
    private _devTools: DevToolsExtension
  ) {
    router.events.subscribe((data) => {
      this.path = data.url.substr(1);
    });


    const tools = _devTools.enhancer({
//      deserializeState: reimmutify,
  });
    _ngRedux.configureStore(
      rootReducer,
      {},
      middleware,
//      tools ? [ ...enhancers, tools ] : enhancers);
      tools);
  }
}
