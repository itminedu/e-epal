import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { Router } from '@angular/router';


@Component({
    selector: 'breadcrubs',
    template: ` <div class="col-sm-12"><p class="crumb" [hidden]="currentUrl != '/epal-class-select'">Αρχική σελίδα!!!!!!!!</p></div>
    			<div class="col-sm-12"><p class="crumb" [hidden]="currentUrl != '/sector-fields-select'">Αρχική σελίδα</p></div>
      
  `
})

@Injectable() export default class Breadcrubs implements OnInit {
constructor(private _router:Router) {}
   ngOnInit() {

   			let currentUrl = this._router.url;
   			console.log(currentUrl,"lala");
 			}
 
}
