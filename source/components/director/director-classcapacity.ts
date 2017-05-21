import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from "@angular/core";
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
    <div style="min-height: 500px;">
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
            <select #spop class="form-control" *ngIf="(selectionCClass | async)" (change)="checkcclass(tmop,txoption,spop)"  formControlName="specialit">
              <option *ngFor="let SpecialSelection$  of StudentSelectedSpecial$ | async; let i=index" [value] = "SpecialSelection$.id"> {{SpecialSelection$.specialty_id}} </option>
            </select>
      </div>


      <div *ngIf="(retrievedStudent | async) && (modify === false)">
      <strong>Δυναμική σε τμήματα:</strong>
      <div *ngFor="let classCapac$  of classCapacity$ | async;"  >
          <div><label for="capc">Τρέχουσα Δυναμική:</label> <p class="form-control" id = "capc" style="border:1px solid #eceeef;"> {{classCapac$.capacity}} </p></div>
        </div>

      <p style="margin-top: 20px; line-height: 2em;"> Αν θέλετε να αλλάξετε τη δυναμική σε τμήματα για τη συγκεκριμένή επιλογή συνέχεια επιλέξτε <i>Τροποποίηση</i>.</p>
              <button type="button" class="btn-primary btn-sm pull-right" (click) ="modifyCapacity()">
                Τροποποίηση
               </button>
       </div>
       <input  type="number" formControlName="capacity" min="1" max="10">

            <button type="button" class="btn-primary btn-sm pull-right" (click) ="saveCapacity()">
                Αποθήκευση
             </button>
       </form>
       </div>
   `
})

@Injectable() export default class DirectorClassCapacity implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private School$: BehaviorSubject<any>;
    private SchoolSub: Subscription;
    private SchoolId;
    private currentclass: Number;
    private classCapacity$: BehaviorSubject<any>;
    private classCapacitySub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    private modify = false;



    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.StudentSelected$ = new BehaviorSubject([{}]);
        this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
        this.classCapacity$ = new BehaviorSubject([{}]);
        this.selectionBClass = new BehaviorSubject(false);
        this.selectionCClass = new BehaviorSubject(false);
        this.retrievedStudent = new BehaviorSubject(false);
        this.School$ = new BehaviorSubject([{}]);
        this.formGroup = this.fb.group({
            tomeas: ['', []],
            taxi: ['', []],
            specialit: ['', []],
            capacity: ['', []],
            capc: ['', []],
        });

    }

    ngOnDestroy() {
        if (this.StudentSelectedSub)
            this.StudentSelectedSub.unsubscribe();
        if (this.StudentSelectedSpecialSub)
            this.StudentSelectedSpecialSub.unsubscribe();
        if (this.selectionBClass)
            this.selectionBClass.unsubscribe();
        if (this.selectionCClass)
            this.selectionCClass.unsubscribe();
        if (this.classCapacitySub)
            this.classCapacitySub.unsubscribe();
        if (this.retrievedStudent)
            this.retrievedStudent.unsubscribe();
    }

    ngOnInit() {
        this.retrievedStudent.next(false);

            this.SchoolSub = this._hds.getSchoolId().subscribe(x => {
                  this.School$.next(x);                 
                  console.log(x[0].id, "schoolid!");
                   this.SchoolId = x[0].id;
                   

                  },
                  error => {
                      this.School$.next([{}]);
                      console.log("Error Getting School");
                  },
                  () => console.log("Getting School "));

    }


    verifyclass(txop) {
        this.modify = false;
        console.log(this.formGroup.value.specialit, "speciality");
        if (txop.value === "1") {
            this.selectionBClass.next(false);
            this.selectionCClass.next(false);
            this.formGroup.patchValue({
                tomeas: '',
                specialit: '',
            });
            console.log("a class");
            this.classCapacitySub = this._hds.getCapacityPerSchool(this.formGroup.value.taxi, 0, 0, this.SchoolId).subscribe(data => {
                this.classCapacity$.next(data);
                this.retrievedStudent.next(true);
            },
                error => {
                    this.classCapacity$.next([{}]);
                    console.log("Error Getting Capacity");
                },
                () => console.log("Getting Capacity"));

        }
        else if (txop.value === "2") {
            this.formGroup.patchValue({
                tomeas: '',
                specialit: '',
            });
            this.selectionBClass.next(true);
            this.selectionCClass.next(false);
            this.StudentSelected$ = new BehaviorSubject([{}]);
            this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(this.StudentSelected$);
        }
        else if (txop.value === "3") {
            var sectorint = +this.formGroup.value.tomeas;
            console.log(sectorint, "test");
            if (this.formGroup.value.tomeas != '') {
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


    checkbclass(tmop, txop) {
        this.modify = false;
        var sectorint = +this.formGroup.value.tomeas;
        console.log(sectorint, "tomeas");
        if (txop.value === "2") {
            console.log("b class");
            this.classCapacitySub = this._hds.getCapacityPerSchool(this.formGroup.value.taxi, sectorint, 0, this.SchoolId).subscribe(data => {
                this.classCapacity$.next(data);
                this.retrievedStudent.next(true);
            },
                error => {
                    this.classCapacity$.next([{}]);
                    console.log("Error Getting Capacity");
                },
                () => console.log("Getting Capacity"));
        }
        if (txop.value === "3") {
            this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(this.StudentSelectedSpecial$);


        }

    }

    checkcclass(tmop, txop, spop) {
        this.modify = false;
        var sectorint = +this.formGroup.value.tomeas;
        var specialint = +this.formGroup.value.specialit;

        if (txop.value === "3") {
            console.log("c class");
            console.log(sectorint, specialint, "cclass")
            this.classCapacitySub = this._hds.getCapacityPerSchool(this.formGroup.value.taxi, sectorint, specialint, this.SchoolId).subscribe(data => {
                this.classCapacity$.next(data);
                this.retrievedStudent.next(true);
                
               // this.formGroup.get('capc').setValue(this.formGroup.value.capacity);
                console.log(this.formGroup.value.capacity,"capc");
            },
                error => {
                    this.classCapacity$.next([{}]);
                    console.log("Error Getting Capacity");
                },
                () => console.log("Getting Capacity"));

        }

    }




    saveCapacity() {

        var tomeas = +this.formGroup.value.tomeas;
        var specialit = +this.formGroup.value.specialit;
        console.log(tomeas, specialit);
        this._hds.saveCapacity(this.formGroup.value.taxi, tomeas, specialit, this.formGroup.value.capacity, this.SchoolId);

    }

    modifyCapacity() {

        this.modify = true;
    }

}
