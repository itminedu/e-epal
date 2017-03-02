import {Component, OnInit} from '@angular/core';
import { Injectable } from "@angular/core";
import { HelperDataService } from '../../services/helper-data-service';

@Component({
  selector: 'reg-navbar',
  templateUrl: 'navbar.component.html',
})

@Injectable() export default class NavbarComponent implements OnInit{

  	 	public cuser :any;

       constructor( private _hds: HelperDataService) {
       
        };

    ngOnInit() {


    	this._hds.getCurrentUser().then( cuser => this.cuser= cuser );
    }







}
