import { Component, Inject, OnInit, OnDestroy }
 from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationStart
}
 from '@angular/router';
import './globalstyles.css';
//import '../../myschool/main.scss';
import { DevToolsExtension, NgRedux, select } from '@angular-redux/store';
// import createLogger from 'redux-logger';

import {
  IAppState,
  rootReducer,
  middleware,
//  enhancers,
} from '../store';

import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore
} from 'redux';

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
  public pathSchool: string = 'school';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _ngRedux: NgRedux<IAppState>,
    private _devTools: DevToolsExtension
  ) {
/*      router.events
      .filter((e: Event) => e instanceof NavigationStart)
      .subscribe((e: NavigationStart) => {
            console.log(e.url);
            console.log(e.toString());
            this.path = e.url.substr(1);
            this.pathSchool = e.url.substr(1);
        }); */
/*    router.events.subscribe((data) => {
      this.path = data.url.substr(1);
      this.pathSchool = data.url.substr(1);
  }); */



    const tools = _devTools.enhancer({
//      deserializeState: reimmutify,
  });
    _ngRedux.configureStore(
      rootReducer,
      {},
      middleware,
//      tools ? [ ...enhancers, tools ] : enhancers);
      tools);
//      );
  }
}
