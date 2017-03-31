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
    selector: 'director-view',
    template: `

        <form [formGroup]="formGroup">
            <div class="form-group" >
              <label for="name">Τάξη</label><br/>
                    <select #txoption [(ngModel)]="taxi" [ngModelOptions]="{standalone: true}" (change)="verifyclass(txoption)" >
                        <option value="1" >Α' Λυκείου</option>
                        <option value="2" >Β' Λυκείου</option>
                        <option value="3" >Γ' Λυκείου</option>
                    </select>

            <div>
            <div class="form-group" *ngIf="StudentSelected$ != {}"  >
                    <label for="tomeas">Τομέας</label><br/>
                     <select #tmop [(ngModel)]="tomeas" [ngModelOptions]="{standalone: true}"  (change) ="checkbclass(tmop,txoption)" >
                      <option *ngFor="let SectorSelection$  of StudentSelected$ | async" [ngValue]="SectorSelection$.id">{{SectorSelection$.sector_id}}</option>
                    </select>
             <div>

            <div class="form-group" *ngIf="StudentSelectedSpecial$ != {}">
                    <label for="special">Ειδικότητα</label><br/>
                     <select #spop [(ngModel)]="specialit" [ngModelOptions]="{standalone: true}"  >
                      <option *ngFor="let SpecialSelection$  of StudentSelectedSpecial$ | async" [ngValue]="SpecialSelection$.id">{{SpecialSelection$.specialty_id}}</option>
                    </select>
             <div>
             <button type="button" class="btn-primary btn-sm pull-right" (click)="findstudent()">
                Αναζήτηση
             </button>

              
   `
})

@Injectable() export default class DirectorView implements OnInit , OnDestroy{

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;

    public bClassEnabled: boolean;
    public gClassEnabled: boolean;
    private SchoolId = 147 ;


    constructor(private fb: FormBuilder,
                private _hds: HelperDataService, 
                private activatedRoute: ActivatedRoute,
                private router: Router )
    {
       this.StudentSelected$ = new BehaviorSubject([{}]);
       this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
       this.formGroup = this.fb.group({
                taxi:[],
                tomeas: [],
                specialit :[]
                 });
    }

    ngOnDestroy()
    {
        if (this.StudentSelectedSub)
            this.StudentSelectedSub.unsubscribe();
        if (this.StudentSelectedSpecialSub)
            this.StudentSelectedSpecialSub.unsubscribe();


    }
 
    ngOnInit() {
     
       this.bClassEnabled = false;    
       this.gClassEnabled = false;   
       this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(this.StudentSelected$);


           
       console.log(this.StudentSelected$);        

    }


    verifyclass(txop)
    {
            console.log(txop.value);
            if (txop.value === "1")
            {     this.bClassEnabled = false;
                  this.gClassEnabled = false;
            }
            else if (txop.value === "2")
            {
                console.log(txop.value,"aaaaaa");
                this.bClassEnabled = true;
                this.gClassEnabled = false;
            }
            else if (txop.value === "3")
            {   this.bClassEnabled = true;
                this.gClassEnabled = true;
            }            
    }


    checkbclass(tmop,txop)
    {
        const [id, sector] = tmop.value.split(': ');
        var sectorint = +sector; 
        if (txop.value === "3")
        {
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(this.StudentSelectedSpecial$);        
        }
    }

    findstudent(tmop,txop)
    {
        let sectorint = 8;
        {
            this.StudentSelectedSpecialSub = this._hds.getStudentPerSchool(this.SchoolId, sectorint).subscribe(this.StudentSelectedSpecial$);        
        }
    }




}