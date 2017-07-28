import { Component, Inject, OnInit, OnDestroy }
from "@angular/core";
import {
    Router,
    ActivatedRoute,
    NavigationStart
}
from "@angular/router";
import "./globalstyles.css";
import { DevToolsExtension, NgRedux, select } from "@angular-redux/store";

import {
    IAppState,
    rootReducer,
    middleware,
    //  enhancers,
} from "../store";

import {
    applyMiddleware,
    Store,
    combineReducers,
    compose,
    createStore
} from "redux";

@Component({
    selector: "main",
    template: `
  <reg-header></reg-header>
  <reg-navbar></reg-navbar>
  <reg-main></reg-main>
  <reg-footer></reg-footer>
  `
})
export default class Main {
    private path: string = "";
    private pathSchool: string = "school";

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _ngRedux: NgRedux<IAppState>,
        private _devTools: DevToolsExtension
    ) {

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
