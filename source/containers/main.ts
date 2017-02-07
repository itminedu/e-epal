import { Component, Inject, OnInit, OnDestroy }
 from '@angular/core';
import {
  Router,
  ActivatedRoute,
}
 from '@angular/router';
import './globalstyles.css';
import { DevToolsExtension, NgRedux, select } from 'ng2-redux';
import {
  IAppState,
  rootReducer,
  middleware,
//  enhancers,
} from '../store';
// import { reimmutify } from '../store';


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
