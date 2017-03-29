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
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
@Component({
    selector: 'director-view',
    template: `
          
    <form [formGroup]="formGroup">
         
            <div class="form-group" style= "margin-top: 50px; margin-bottom: 100px;">
              <label for="name">Τάξη</label><br/>
                    <select class="form-control" formControlName="name" (change)="verifyclass()">
                        <option value="Α' Λυκείου">Α' Λυκείου</option>
                        <option value="Β' Λυκείου">Β' Λυκείου</option>
                        <option value="Γ' Λυκείου">Γ' Λυκείου</option>
                    </select>

           <div>
    
        <div class="form-group" style= "margin-top: 50px; margin-bottom: 100px;">
              <label for="name1">Τάξη1</label><br/>
                    <select class="form-control" formControlName="name1" (change)="verifyclass()">
                        <option value="Α' Λυκείου">Α' Λυκείου</option>
                        <option value="Β' Λυκείου">Β' Λυκείου</option>
                        <option value="Γ' Λυκείου">Γ' Λυκείου</option>
                    </select>

         <div>
    
               
   `
})

@Injectable() export default class DirectorView implements OnInit , OnDestroy{

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    public bClassEnabled: boolean;

    constructor(private fb: FormBuilder,
                private _hds: HelperDataService, 
                private activatedRoute: ActivatedRoute,
                private router: Router )
    {
       this.StudentSelected$ = new BehaviorSubject([{}]);
       this.formGroup = this.fb.group({
                name:[],
                name1 :[]
                 });
    }

    ngOnDestroy()
    {
        if (this.StudentSelectedSub)
            this.StudentSelectedSub.unsubscribe();

    }
 
    ngOnInit() {
     
       this.bClassEnabled = false;
               

    }


    verifyclass()
    {
       this.bClassEnabled = true;
    }


}