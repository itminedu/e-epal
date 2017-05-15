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
             <br>
             <br>
              <ul class="list-group main-view">
              <div *ngIf="(retrievedStudent | async)">

               <div *ngFor="let StudentDetails$  of StudentInfo$ | async; let i=index; let isOdd=odd; let isEven=even"  >
                 <li class="list-group-item isclickable" [class.oddout]="isOdd" [class.evenout]="isEven" (click)="setActiveUser(StudentDetails$.i)"
                  [class.selectedout]="userActive === StudentDetails$.i" [class.confirmed]="StudentDetails$.checkstatus === '1'"
                  [class.notconfirmed]="StudentDetails$.checkstatus === '0'" [class.notchecked]="(StudentDetails$.checkstatus !== '1') && (StudentDetails$.checkstatus !== '0')">
                  <h5> {{StudentDetails$.name}}&nbsp;{{StudentDetails$.name}} </h5>
                </li>

                    <div [hidden]="userActive !== StudentDetails$.i" >
                     <p style="margin-top: 20px; line-height: 2em;"> Παρακαλώ αφού γίνει ο έλεγχος των στοιχείων του μαθητή επιβεβαιώστε τη δυνατότητα εγγραφής του.</p>
                      <strong><label>Επιβεβαίωση Εγγραφής:</label> </strong>
                      <select #cb name="{{StudentDetails$.id}}" (change)="updateCheckedOptions(StudentDetails$.id, cb)" >
                          <option value=1>Ναι</option>
                          <option value=2>Όχι</option>
                          <option value=3 selected></option>
                      </select>
                      <button type="button" class="btn-primary btn-sm pull-right" (click)="confirmStudent()">
                           Επιβεβαίωση Εγγραφής
                       </button>

                      <table>
                        <tr><td>
                          <div class="form-group" *ngIf="StudentDetails$.relationtostudent === 'Μαθητής' ">
                            <label for="guardianfirstname">Όνομα κηδεμόνα</label><p class="form-control" id="guardianfirstname" style="border:1px solid #eceeef;">{{StudentDetails$.guardianfirstname}} </p> 
                          </div>
                        </td>
                        <td>
                         <div class="form-group" *ngIf="StudentDetails$.relationtostudent === 'Μαθητής' ">
                            <label for="guardiansurname">Επώνυμο κηδεμόνα</label><p class="form-control" id="guardiansurname" style="border:1px solid #eceeef;">{{StudentDetails$.guardiansurname}} </p> 
                          </div>
                        </td></tr>
                      </table>
                      <div class="form-group"><label for="name">Όνομα μαθητή</label> <p class="form-control" id="name" style="border:1px solid #eceeef;">    {{StudentDetails$.name}} </p> </div>
                      <div><label for="studentsurname">Επώνυμο μαθητή</label> <p class="form-control" id = "studentsurname" style="border:1px solid #eceeef;"> {{StudentDetails$.studentsurname}} </p></div>
                      <div><label for="fatherfirstname">Όνομα Πατέρα</label> <p class="form-control" id = "fatherfirstname" style="border:1px solid #eceeef;"> {{StudentDetails$.fatherfirstname}} </p></div>
                      <div><label for="fathersurname">Επώνυμο Πατέρα</label> <p class="form-control" id = "fathersurname" style="border:1px solid #eceeef;"> {{StudentDetails$.fathersurname}} </p></div>
                      <div><label for="motherfirstname">Όνομα Μητέρας</label> <p class="form-control" id = "motherfirstname" style="border:1px solid #eceeef;"> {{StudentDetails$.motherfirstname}} </p></div>
                      <div><label for="mothersurname">Επώνυμο Μητέρας</label> <p class="form-control" id = "mothersurname" style="border:1px solid #eceeef;"> {{StudentDetails$.mothersurname}} </p></div>                
                      <div><label for="birthdate">Ημερομηνία Γέννησης</label> <p class="form-control" id = "birthdate" style="border:1px solid #eceeef;"> {{StudentDetails$.birthdate}} </p></div>                


                      <table>
                              <tr>
                                  <td>
                                      <div class="form-group">
                                          <label for="regionaddress">Διεύθυνση κατοικίας</label><p class="form-control" id = "regionaddress" style="border:1px solid #eceeef;"> {{StudentDetails$.regionaddress}} </p>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="form-group">
                                          <label for="regiontk">TK </label><p class="form-control" id = "regiontk" style="border:1px solid #eceeef;"> {{StudentDetails$.regiontk}} </p>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="form-group">
                                          <label for="regionarea">Πόλη/Περιοχή</label><p class="form-control" id = "regionarea" style="border:1px solid #eceeef;"> {{StudentDetails$.regionarea}} </p>
                                      </div>
                                  </td>
                             </tr>
                      </table>
                      <div><label for="certificatetype">Τύπος απολυτηρίου</label> <p class="form-control" id = "certificatetype" style="border:1px solid #eceeef;"> {{StudentDetails$.certificatetype}} </p></div>                
                      <div><label for="telnum">Τηλέφωνο επικοινωνίας</label> <p class="form-control" id = "telnum" style="border:1px solid #eceeef;"> {{StudentDetails$.telnum}} </p></div>                
                      <div><label for="relationtostudent">Η αίτηση γίνεται από</label> <p class="form-control" id = "relationtostudent" style="border:1px solid #eceeef;"> {{StudentDetails$.relationtostudent}} </p></div>                 
                 </div>
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
    private SubmitedDetails$: BehaviorSubject<any>;
    private SubmitedDetailsSub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private SchoolId = 147;
    private currentclass: Number;
    private saved: Array<number> = new Array();
    private limitdown = 0; 
    private limitup=  25;
    private pageno = 1;
    private userActive = <number>-1;
    private type: Number;


    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.StudentSelected$ = new BehaviorSubject([{}]);
        this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
        this.StudentInfo$ = new BehaviorSubject([{}]);
        this.StudentsSize$ = new BehaviorSubject({});
        this.SubmitedDetails$ = new BehaviorSubject([{}]);
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
        if (this.SubmitedDetailsSub)
            this.SubmitedDetailsSub.unsubscribe();
        
    }

    ngOnInit() {

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

    updateCheckedOptions(id, cbvalue) {

        let i = this.saved.length;
        console.log(cbvalue.value,"aaaaa");

        if (cbvalue.value === '1') {
           this.saved[i] = id;
           this.type = 1;
           console.log("ok")
        }
        else if (cbvalue.value === '2') {
            this.saved[i] = id;
            this.type = 2;
            //var count = this.saved.length;
            //for (var j = 0; j < count; j++) {
            //    if (this.saved[j] === id) {
            //        this.saved.splice(j, 1);
            //    }
            
           console.log("not confirmed")
        }
        else if (cbvalue.value === '3') {
           
        }
    }



    confirmStudent() {
        this._hds.saveConfirmStudents(this.saved, this.type);
        
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



  setActiveUser(ind) 
  {
      ind = +ind;
      console.log(this.userActive,"RA",ind);
      if (ind === this.userActive){
        ind = -1;
      }
      ind--;
      this.userActive = ind+1 ;
      

   }


}
