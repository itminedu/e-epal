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
            <select #tmop class="form-control" *ngIf="(selectionBClass | async)" (change)="checkbclass(tmop,txoption)" formControlName="tomeas">
              <option *ngFor="let SectorSelection$  of StudentSelected$ | async; let i=index" [value] = "SectorSelection$.id"> {{SectorSelection$.sector_id}} </option>
            </select>
      </div>
      <div class="form-group">
            <select #spop class="form-control" *ngIf="(selectionCClass | async)" (change) ="checkcclass()" formControlName="specialit">
              <option *ngFor="let SpecialSelection$  of StudentSelectedSpecial$ | async; let i=index" [value] = "SpecialSelection$.id"> {{SpecialSelection$.specialty_id}} </option>
            </select>
      </div>
            <button type="button" class="btn-primary btn-sm pull-right" (click)="findstudent(txoption,1)">
                Αναζήτηση
             </button>
             <div *ngIf="(retrievedStudent | async)">
              <div *ngFor="let StudentDetails$  of StudentInfo$ | async; let i=index">
                <br>
                <br>
                 Όνομα:         {{StudentDetails$.name}} <br>
                 Επώνυμο:       {{StudentDetails$.studentsurname}}<br>
                 Όνομα Πατέρα:  {{StudentDetails$.fatherfirstname}}<br>
                 Επώνυμο Πατέρα:{{StudentDetails$.fathersurname}}<br>
                 Όνομα Μητέρας: {{StudentDetails$.motherfirstname}}<br>
                 Επώνυμο Μητέρας:{{StudentDetails$.mothersurname}}<br>
                 Ημερομηνία Γέννησης: {{StudentDetails$.birthdate}}<br>

                 <strong>Επιβεβαίωση Εγγραφής: </strong>
                 <input #cb class="pull-right" type="checkbox" name="{{ StudentDetails$.id }}" (change)="updateCheckedOptions(StudentDetails$.id, $event)" >

<!--             </div>  -->
             </div>

          <br>
          <br>
         <div class="form-group" class="row">
          Βρίσκεστε στη σελίδα:
          <div class="col-1">
           <input #pageno type="text" class="form-control" placeholder=".col-1" formControlName="pageno">
          </div> 
           απο  
           <div class="col-1">
           <input #maxpage type="text" class="form-control" placeholder=".col-1" formControlName="maxpage">
           </div>   
         </div>
 
            <button type="button" class="btn-primary btn-sm pull-right" (click)="confirmStudent()">
                 Επιβεβαίωση Εγγραφής
             </button>
             <br>
             <nav aria-label="pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item " >
                  <button class="page-link" (click)="prevpage(txoption)">Προηγούμενη</button>
                </li>
                <li class="page-item">
                  <button class="page-link" (click) ="nextpage(txoption,maxpage) ">Επόμενη</button>
                </li>
              </ul>
              
            </nav>
     
       

   `
})

@Injectable() export default class DirectorView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private StudentInfo$: BehaviorSubject<any>;
    private StudentInfoSub: Subscription;
    private StudentsSize$: BehaviorSubject<any>;
    private StudentsSizeSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private SchoolId = 147;
    private currentclass: Number;
    private saved: Array<number> = new Array();
    private limitdown = 0; 
    private limitup=  5;
    private pageno = 1;
    //private maxpage:Number;


    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.StudentSelected$ = new BehaviorSubject([{}]);
        this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
        this.StudentInfo$ = new BehaviorSubject([{}]);
        this.StudentsSize$ = new BehaviorSubject({});
        this.retrievedStudent = new BehaviorSubject(false);
        this.selectionBClass = new BehaviorSubject(false);
        this.selectionCClass = new BehaviorSubject(false);
        this.formGroup = this.fb.group({
            tomeas: ['', []],
            taxi: ['', []],
            specialit: ['', []],
            maxpage:[{value: '', disabled: true}, []],
            pageno:[{value: '', disabled: true}, []],
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
        if (this.retrievedStudent)
            this.retrievedStudent.unsubscribe();
    }

    ngOnInit()
    {
      this.activatedRoute.params.subscribe((params: Params) => {
            params => console.log('queryParams', params['ids']);
            this.SchoolId = params['ids'];
          });
        console.log(this.SchoolId);
    }      


    verifyclass(txop) {
        this.pageno = 1;
        this.retrievedStudent.next(false);
        if (txop.value === "1") {
            this.selectionBClass.next(false);
            this.selectionCClass.next(false);

        }
        else if (txop.value === "2") {
            this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(data => {
                this.selectionBClass.next(true);
                this.selectionCClass.next(false);
                this.StudentSelected$.next(data);

            },
                error => {
                    this.StudentSelected$.next([{}]);
                    console.log("Error Getting StudentSelectedSpecial");
                },
                () => console.log("Getting StudentSelectedSpecial"));
        }
        else if (txop.value === "3") {
            var sectorint = +this.formGroup.value.tomeas;
            console.log(sectorint, "test");
            if (this.formGroup.value.tomeas != '') {
                var sectorint = +this.formGroup.value.tomeas;

                this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(data => {
                    this.StudentSelectedSpecial$.next(data);
                },
                    error => {
                        this.StudentSelectedSpecial$.next([{}]);
                        console.log("Error Getting StudentSelectedSpecial");
                    },
                    () => console.log("Getting StudentSelectedSpecial"));
            }

            this.StudentSelectedSub = this._hds.getSectorPerSchool(this.SchoolId).subscribe(data => {
                this.StudentSelected$.next(data);
                this.selectionBClass.next(true);
                this.selectionCClass.next(true);
            },
                error => {
                    this.StudentSelected$.next([{}]);
                    console.log("Error Getting StudentSelected");
                },
                () => console.log("Getting StudentSelected"));
        }
    }


    checkbclass(tmop, txop) {
        this.pageno = 1;
        this.retrievedStudent.next(false);
        var sectorint = +this.formGroup.value.tomeas;
        console.log(sectorint, "tomeas");
        if (txop.value === "3") {
            //            this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(this.SchoolId, sectorint).subscribe(data => {
                this.StudentSelectedSpecial$.next(data);

            },
                error => {
                    this.StudentSelectedSpecial$.next([{}]);
                    console.log("Error Getting StudentSelectedSpecial");
                },
                () => console.log("Getting StudentSelectedSpecial"));
        }
    }

    findstudent(txop, pageno) {

        var tot_pages: Number;
        var sectorint = +this.formGroup.value.tomeas;
        if (txop.value === "1") {
            this.currentclass = 1;
        }
        else if (txop.value === "2") {
            this.currentclass = 2;
        }
        else if (txop.value === "3") {
            this.currentclass = 3;
        }

         this.formGroup.get('pageno').setValue(this.pageno); 
         if (this.pageno == 1){
            console.log(this.SchoolId, sectorint, this.currentclass,"test");            
            this.StudentsSizeSub = this._hds.getStudentPerSchool(this.SchoolId, sectorint, this.currentclass, 0, 0).subscribe(x => {
                this.StudentsSize$.next(x);
                tot_pages = x.id /5;
                if (x.id%5 >0)
                {
                    tot_pages = (x.id - (x.id%5))/5 +1;
                }  
                this.formGroup.get('maxpage').setValue(tot_pages); 
                });

        }            
     
        //            this.StudentInfo$ = new BehaviorSubject([{}]);
        //            this.StudentInfoSub = this._hds.getStudentPerSchool(this.SchoolId, sectorint, this.currentclass).subscribe(this.StudentInfo$);
        this.StudentInfoSub = this._hds.getStudentPerSchool(this.SchoolId, sectorint, this.currentclass, this.limitdown, this.limitup).subscribe(data => {
            this.StudentInfo$.next(data);
            this.retrievedStudent.next(true);
        },
            error => {
                this.StudentInfo$.next([{}]);
                console.log("Error Getting Students");
            },
            () => console.log("Getting Students"));

    }

    updateCheckedOptions(id, event) {

        let i = this.saved.length;


        if (event.target.checked === false) {
            var count = this.saved.length;
            for (var j = 0; j < count; j++) {
                if (this.saved[j] === id) {
                    this.saved.splice(j, 1);
                }
            }
        }
        else {
            this.saved[i] = id;
        }

    }

    confirmStudent() {
        this._hds.saveConfirmStudents(this.saved);
    }

    checkcclass() {
        this.pageno = 1;
        this.retrievedStudent.next(false);
    }

    nextpage(txop, maxpage){
     console.log(maxpage.value);   
     if (this.pageno < maxpage.value)
      {
           this.pageno = this.pageno+1;
           this.limitdown = (this.pageno-1) * 5 ;
           this.limitup = this.pageno * 5;
           this.findstudent(txop, this.pageno)
       }
    }

    prevpage(txop){
       console.log(this.pageno,"pageno");
       if (this.pageno > 1)
       {
           this.pageno = this.pageno-1;
           this.limitdown = (this.pageno-1) * 5 ;
           this.limitup = this.pageno * 5;
           this.findstudent(txop, this.pageno)
       }

    }


}
