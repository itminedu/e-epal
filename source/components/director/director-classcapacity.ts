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
import { ILoginInfo } from '../../store/logininfo/logininfo.types';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
@Component({
    selector: 'director-classcapacity',
    template: `
  <form [formGroup]="formGroup">
      <label for="taxi">Τάξη</label><br/>
      <div class="form-group">
            <select #txoption  class="form-control" (change)="verifyclass(txoption)" formControlName="taxi">
              <option value="1" >Α' Λυκείου</option>
              <option value="2" >Β' Λυκείου</option>
              <option value="3" >Γ' Λυκείου</option>
            </select>
      </div>      
      <div class="form-group">

            <select #tmop class="form-control" *ngIf="(selectionBClass | async)" (change)="checkbclass(tmop,txoption)" formControlName="tomeas">
              <option *ngFor="let SectorSelection$  of StudentSelected$ | async; let i=index" [value] = "SectorSelection$.id"> {{SectorSelection$.sector_id}} </option>
            </select>
      </div>
      <div class="form-group">
            <select #spop class="form-control" *ngIf="(selectionCClass | async)"  formControlName="specialit">
              <option *ngFor="let SpecialSelection$  of StudentSelectedSpecial$ | async; let i=index" [value] = "SpecialSelection$.id"> {{SpecialSelection$.specialty_id}} </option>
            </select>
      </div>
      <strong>Δυναμική σε τμήματα:</strong>
      <input  type="number" formControlName="capacity" min="1" max="10">
      
            <button type="button" class="btn-primary btn-sm pull-right" (click) ="saveCapacity()">
                Αποθήκευση
             </button>
   `
})

@Injectable() export default class DirectorClassCapacity implements OnInit , OnDestroy{

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private SchoolId = 147 ;
    private currentclass: Number;
    


    constructor(  private fb: FormBuilder,
                  private _hds: HelperDataService, 
                  private activatedRoute: ActivatedRoute,
                  private router: Router )
    {
       this.StudentSelected$ = new BehaviorSubject([{}]);
       this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
       this.selectionBClass = new BehaviorSubject(false);
       this.selectionCClass = new BehaviorSubject(false);
       this.formGroup = this.fb.group({
         tomeas: ['', []],
         taxi: ['', []],
         specialit: ['', []],
         capacity: ['', []],
       });
       
    }

    ngOnDestroy()
    {
        if (this.StudentSelectedSub)
            this.StudentSelectedSub.unsubscribe();
        if (this.StudentSelectedSpecialSub)
            this.StudentSelectedSpecialSub.unsubscribe();
        if (this.selectionBClass)
            this.selectionBClass.unsubscribe();
        if (this.selectionCClass)
            this.selectionCClass.unsubscribe();  
         
    }
 
    ngOnInit() {

    }


    verifyclass(txop)
    {
            
            if (txop.value === "1")
            {
                this.selectionBClass.next(false);
                this.selectionCClass.next(false);
                this.formGroup.patchValue({
                  tomeas: '',
                  specialit: '',
                 });

            }
            else if (txop.value === "2")
            {
                this.formGroup.patchValue({
                  specialit: '',
                 });
                this.selectionBClass.next(true);
                this.selectionCClass.next(false);
                this.StudentSelected$ = new BehaviorSubject([{}]);
                this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(this.StudentSelected$);
            }
            else if (txop.value === "3")
            {  
              var sectorint = +this.formGroup.value.tomeas;
              console.log(sectorint,"test");
              if (this.formGroup.value.tomeas != '')
              {
                  var sectorint = +this.formGroup.value.tomeas;
                  this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
                  this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(this.StudentSelectedSpecial$);        
              }
              this.selectionBClass.next(true);
              this.selectionCClass.next(true);              
              this.StudentSelected$ = new BehaviorSubject([{}]);
              this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(this.StudentSelected$);
            }            
    }


    checkbclass(tmop,txop)
    {
       
        var sectorint = +this.formGroup.value.tomeas;
        console.log(sectorint,"tomeas");
        if (txop.value === "3")
        {
            this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(this.StudentSelectedSpecial$);        
        }
    }




saveCapacity()
{

  var tomeas = +this.formGroup.value.tomeas;
  var specialit = +this.formGroup.value.specialit;
  console.log(tomeas, specialit);
  this._hds.saveCapacity(this.formGroup.value.taxi,tomeas,specialit, this.formGroup.value.capacity, this.SchoolId );

}

}