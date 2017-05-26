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
              <option *ngIf="(selectiontype | async)" value="4" >Δ' Λυκείου</option>
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



      <p style="margin-top: 20px; line-height: 2em;"> Αλλάξτε παρακαλώ τον αριθμό των τμημάτων που μπορείτε να δημιουργήσετε στο σχολείο σας και πατήστε  <i>Αποθήκευση</i>.</p>
       <input  type="number" formControlName="capacity" min="1" max="10">

            <button type="button" class="btn-primary btn-sm pull-right" (click) ="saveCapacity()">
                Αποθήκευση
             </button>
       </form>
       </div>

    <div id="capacitysaved" (onHidden)="onHidden('#capacitysaved')" 
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-success">
            <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Αποθήκευση Δυναμικής</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#capacitysaved')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Η επιλογή σας έχει αποθηκευτεί.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>


   `
})

@Injectable() export default class DirectorClassCapacity implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;
    private saveCapacitySub: Subscription;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectiontype: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private School$: BehaviorSubject<any>;
    private SchoolSub: Subscription;
    private SchoolId;
    private currentclass: Number;
    private classCapacity$: BehaviorSubject<any>;
    private classCapacitySub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    



    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.StudentSelected$ = new BehaviorSubject([{}]);
        this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
        this.classCapacity$ = new BehaviorSubject([{}]);
        this.selectionBClass = new BehaviorSubject(false);
        this.selectiontype = new BehaviorSubject(true);
        this.selectionCClass = new BehaviorSubject(false);
        this.retrievedStudent = new BehaviorSubject(false);
        this.School$ = new BehaviorSubject([{}]);
        this.formGroup = this.fb.group({
            tomeas: ['', []],
            taxi: ['', []],
            specialit: ['', []],
            capacity: ['', []],
            });

    }

    public showModal(popupMsgId):void {
        console.log("about to show modal");
        //(<any>$('#distributionWaitingNotice')).modal('show');
        (<any>$(popupMsgId)).modal('show');
    }

    public hideModal(popupMsgId):void {
        //(<any>$('#distributionWaitingNotice')).modal('hide');
        (<any>$(popupMsgId)).modal('hide');
    }

    public onHidden(popupMsgId):void {

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
        (<any>$('#capacitysaved')).appendTo("body");
        this.retrievedStudent.next(false);

            this.SchoolSub = this._hds.gettypeofschool().subscribe(x => {
                  this.School$.next(x);                 
                  console.log(x[0].type, "schoolid!");
                   this.SchoolId = x[0].type;
                   if (this.SchoolId == 'ΗΜΕΡΗΣΙΟ'){
                       this.selectiontype.next(false);
                   }

                  },
                  error => {
                      this.School$.next([{}]);
                      console.log("Error Getting School");
                  },
                  () => console.log("Getting School "));

    }


    verifyclass(txop) {
        console.log(this.formGroup.value.specialit, "speciality");
        if (txop.value === "1") {
            this.selectionBClass.next(false);
            this.selectionCClass.next(false);
            this.formGroup.patchValue({
                tomeas: '',
                specialit: '',
                capacity: '',
            });
            console.log("a class");
            this.classCapacitySub = this._hds.getCapacityPerSchool(this.formGroup.value.taxi, 0, 0).subscribe(data => {
                this.classCapacity$.next(data);
                this.retrievedStudent.next(true);
                this.formGroup.patchValue({
                capacity : data[0].capacity,
            });
            
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
                capacity: '',
            });
            this.selectionBClass.next(true);
            this.selectionCClass.next(false);
            this.StudentSelected$ = new BehaviorSubject([{}]);
            this.StudentSelectedSub = this._hds.getSectorPerSchool().subscribe(this.StudentSelected$);
        }
        else if (txop.value === "3" || txop.value === "4" ) {
            this.formGroup.patchValue({
                tomeas: '',
                specialit: '',
                capacity: '',
            });

            var sectorint = +this.formGroup.value.tomeas;
            console.log(sectorint, "test");
            if (this.formGroup.value.tomeas != '') {
                var sectorint = +this.formGroup.value.tomeas;
                this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
                this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool( sectorint).subscribe(this.StudentSelectedSpecial$);
            }
            this.selectionBClass.next(true);
            this.selectionCClass.next(true);
            this.StudentSelected$ = new BehaviorSubject([{}]);
            this.StudentSelectedSub = this._hds.getSectorPerSchool().subscribe(this.StudentSelected$);
        }




    }


    checkbclass(tmop, txop) {

        
        var sectorint = +this.formGroup.value.tomeas;
        console.log(tmop, txop, "tomeas!!!!");
        if (txop.value === "2") {
            console.log("b class");
            this.classCapacitySub = this._hds.getCapacityPerSchool(this.formGroup.value.taxi, sectorint, 0).subscribe(data => {
                this.classCapacity$.next(data);
                this.retrievedStudent.next(true);
                this.formGroup.patchValue({
                capacity : data[0].capacity,
            });
            },
                error => {
                    this.classCapacity$.next([{}]);
                    console.log("Error Getting Capacity");
                },
                () => console.log("Getting Capacity"));
        }
        if (txop.value === "3" || txop.value === "4") {
            this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(sectorint).subscribe(this.StudentSelectedSpecial$);


        }

    }

    checkcclass(tmop, txop, spop) {
        
        var sectorint = +this.formGroup.value.tomeas;
        var specialint = +this.formGroup.value.specialit;

        if (txop.value === "3" || txop.value === "4") {
            console.log("c class");
            console.log(sectorint, specialint, "cclass")
            this.classCapacitySub = this._hds.getCapacityPerSchool(this.formGroup.value.taxi, sectorint, specialint).subscribe(data => {
                this.classCapacity$.next(data);
                this.retrievedStudent.next(true);
                
               this.formGroup.patchValue({
                capacity : data[0].capacity,
            });
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
        
         this.saveCapacitySub = this._hds.saveCapacity(this.formGroup.value.taxi, tomeas, specialit, this.formGroup.value.capacity).subscribe(data => {
                
                 },
                error => {
                    
                    console.log("Error Saving Capacity");
                },
                () =>{
                 console.log("Saved Capacity");
                 this.showModal("#capacitysaved");
                 });
                 

    }


}
