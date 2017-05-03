import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';


@Component({
    selector: 'breadcrubs',
    template: ` <div class="col-sm-12"><p class="crumb">Αρχική σελίδα!!!!!!!!</p></div>
      
  `
})

@Injectable() export default class Breadcrubs implements OnInit {

   ngOnInit() {
 			}
 
}
