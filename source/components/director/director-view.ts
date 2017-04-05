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
      <label for="taxi">Τάξη</label><br/>
      <div class="form-group">
            <select #txoption  class="form-control" (change)="verifyclass(txoption)" formControlName="taxi">
              <option value="1" >Α' Λυκείου</option>
              <option value="2" >Β' Λυκείου</option>
              <option value="3" >Γ' Λυκείου</option>
            </select>
      </div>      
      <div class="form-group">
        <div *ngIf="(selectionBClass | async)"  >
            <select #tmop class="form-control" (change)="checkbclass(tmop,txoption,i)" formControlName="tomeas">
              <option *ngFor="let SectorSelection$  of StudentSelected$ | async; let i=index">    {{SectorSelection$.sector_id}} </option>
            </select>
        </div>
      </div>
      <div class="form-group">
      <div *ngIf="(selectionCClass | async)">
            <select #spop class="form-control" formControlName="specialit">
              <option *ngFor="let SpecialSelection$  of StudentSelectedSpecial$ | async; let i=index">    {{SpecialSelection$.specialty_id}} </option>
            </select>
       </div>     
      </div>
         

            
             
             <button type="button" class="btn-primary btn-sm pull-right" (click)="findstudent(tmop,txoption)">
                Αναζήτηση
             </button>
             <div *ngIf="StudentInfo$ != {} || (retrievedStudent | async)">
              <div *ngFor="let StudentDetails$  of StudentInfo$ | async">
                 Όνομα:         {{StudentDetails$.name}} <br>
                 Επώνυμο:       {{StudentDetails$.studentsurname}}<br>
                 Όνομα Πατέρα:  {{StudentDetails$.fatherfirstname}}<br>
                 Επώνυμο Πατέρα:{{StudentDetails$.fathersurname}}<br>
                 Όνομα Μητέρας: {{StudentDetails$.motherfirstname}}<br>
                 Επώνυμο Μητέρας:{{StudentDetails$.mothersurname}}<br>
                 Ημερομηνία Γέννησης: {{StudentDetails$.birthdate}}<br>
                 <br>
                 <input #cb type="checkbox" name="{{ StudentDetails$.id }}" (change)="updateCheckedOptions(StudentDetails$.id, $event)" >
                 
             </div>
             </div>
            <button type="button" class="btn-primary btn-sm pull-right" (click)="confirmStudent()">
                 Επιβεβαίωση Εγγραφής
             </button>
         
              
   `
})

@Injectable() export default class DirectorView implements OnInit , OnDestroy{

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private StudentInfo$: BehaviorSubject<any>;
    private StudentInfoSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private SchoolId = 147 ;
    private saved :Array<number> = new Array();


    constructor(  private fb: FormBuilder,
                  private _hds: HelperDataService, 
                  private activatedRoute: ActivatedRoute,
                  private router: Router )
    {
       this.StudentSelected$ = new BehaviorSubject([{}]);
       this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
       this.StudentInfo$ = new BehaviorSubject([{}]);
       this.retrievedStudent = new BehaviorSubject(false);
       this.selectionBClass = new BehaviorSubject(false);
       this.selectionCClass = new BehaviorSubject(false);
       this.formGroup = this.fb.group({
         tomeas: ['', []],
         taxi: ['', []],
         specialit: ['', []],
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
            console.log(txop.value,"aaaaa");
            if (txop.value === "1")
            {
                this.selectionBClass.next(false);
                this.selectionCClass.next(false);
            }
            else if (txop.value === "2")
            {
                console.log(this.SchoolId, "school_id");
                this.selectionBClass.next(true);
                this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(this.StudentSelected$);
                
            }
            else if (txop.value === "3")
            {   
              this.selectionBClass.next(true);
              this.selectionCClass.next(true);              
              this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(this.StudentSelected$);
            }            
    }


    checkbclass(tmop,txop,id)
    {


        console.log(id, "aaaaaaa!!!");
        var sectorint = +id ;
        if (txop.value === "3")
        {
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(this.StudentSelectedSpecial$);        
        }
    }

    findstudent(tmop,txop)
    {
       
            const [id, sector] = tmop.value.split(': ');
            var sectorint = +sector; 
            console.log(sectorint,"aaaaaa");
            this.StudentInfoSub = this._hds.getStudentPerSchool(this.SchoolId, sectorint).subscribe(this.StudentInfo$);        
            this.retrievedStudent.next(true);
        
    }

updateCheckedOptions(id, event)
{

    let i = this.saved.length;

       
    if (event.target.checked === false) 
    {
      var count=this.saved.length;
      for(var j=0;j<count;j++)
      {
        if(this.saved[j]===id)
        {
         this.saved.splice(j, 1);
        }
      }
    }
    else
    {
      this.saved[i] = id ;
    }

}

confirmStudent()
{
      
     this._hds.saveConfirmStudents(this.saved);
}


}