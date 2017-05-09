import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { Router } from '@angular/router';


@Component({
    selector: 'breadcrubs',
    template: ` <div [hidden]="currentUrl !== '/epal-class-select'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Επιλογή Τάξης </p></div>
    			<div [hidden]="currentUrl !== '/sector-fields-select'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Επιλογή Τoμέα</p></div>
    			<div [hidden]="currentUrl !== '/region-schools-select'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Επιλογή Σχολείου ανα Περιφερειακή Διεύθυνση</p></div>
    			<div [hidden]="currentUrl !== '/sectorcourses-fields-select'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Επιλογή Ειδικότητας ανα τoμέα</p></div>
    			<div [hidden]="currentUrl !== '/schools-order-select'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Σειρά Προτίμησης Επιλεχθέντων Σχολείων</p></div>
    			<div [hidden]="currentUrl !== '/student-application-form-main'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Προσωπικά Στοιχεία</p></div>
	 			   <div [hidden]="currentUrl !== '/application-submit'" class="col-sm-12"><p class="crumb" >Νέα Αίτηση -> Προεπισκόπη αίτησης</p></div>
	 			<div [hidden]="currentUrl !== '/submited-preview'" class="col-sm-12"><p class="crumb" > Υποβληθείσες αιτήσεις</p></div>
      
  `
})

@Injectable() export default class Breadcrubs implements OnInit {
public currentUrl: string;

constructor(private _router:Router) {}
   ngOnInit() {

   			this.currentUrl = this._router.url;
   			
 			}

}
