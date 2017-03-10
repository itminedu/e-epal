import {Component, OnInit} from '@angular/core';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo, ILoginInfoToken } from '../../store/logininfo/logininfo.types';




@Component({
  selector: 'reg-navbar',
  templateUrl: 'navbar.component.html',
})

@Injectable() export default class NavbarComponent implements OnInit{

	private loginInfo$: Observable<ILoginInfo>;
  	 
       constructor(private _ngRedux: NgRedux<IAppState>,
               
            ) {
    };

    ngOnInit() {
    

         this.loginInfo$ = this._ngRedux.select(state => {
            if (state.loginInfo.size > 0) {
                state.loginInfo.reduce(({}, loginInfoToken) => {
                    
                    return loginInfoToken;
                }, {});
            }
            return state.loginInfo;
        });

    }




}
