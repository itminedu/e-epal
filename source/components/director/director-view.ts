import { Component, OnInit, OnDestroy,ElementRef, ViewChild} from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import {Observable} from "rxjs/Observable";
import {Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';

@Component({
    selector: 'director-view',
    template: `
          
    
    
              <label for="name">Παρακαλώ επιλέξτε τάξη </label><br/>
                    <select>
                        <option value=1>Α' Λυκείου</option>
                        <option value=2>Β' Λυκείου</option>
                        <option value=3>Γ' Λυκείου</option>
                    </select>

           
   `
})

@Injectable() export default class DirectorView implements OnInit , OnDestroy{

   
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
       
    constructor(private _hds: HelperDataService, 
                private activatedRoute: ActivatedRoute,
                private router: Router )
    {
       this.StudentSelected$ = new BehaviorSubject([{}]);
    }

    ngOnDestroy()
    {
        if (this.StudentSelectedSub)
            this.StudentSelectedSub.unsubscribe();

    }
 
    ngOnInit() {
     
   
           

    }



}