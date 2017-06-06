import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer} from "@angular/core";
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

                    <div [hidden]="userActive !== StudentDetails$.i"  style="margin: 30px 30px 30px 30px;">

                     <p style="margin-top: 20px; line-height: 2em;"> Παρακαλούμε, αφού γίνει ο έλεγχος των στοιχείων του μαθητή επιβεβαιώστε τη δυνατότητα εγγραφής του.</p>

                     <div class="row" style="margin-bottom: 20px;">
                     <div class="col-md-6">
                      <strong><label>Επιβεβαίωση Εγγραφής:</label> </strong>
                      <select #cb name="{{StudentDetails$.id}}" (change)="updateCheckedOptions(StudentDetails$.id, cb)" >
                          <option value="1" [selected]="StudentDetails$.checkstatus === '1' ">Ναι</option>
                          <option value="2" [selected]="StudentDetails$.checkstatus === '0' ">Όχι</option>
                          <option value="3" [selected]="StudentDetails$.checkstatus != '0' && StudentDetails$.checkstatus != '1'"></option>
                      </select>
                      </div>
                      <div class="col-md-6">
                      <button type="button" class="btn-primary btn-sm pull-right" (click)="confirmStudent(txoption)">
                           Επιβεβαίωση Εγγραφής
                       </button>
                     </div>
                     </div>


                       <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία αιτούμενου</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.guardian_name}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.guardian_surname}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα πατέρα</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.guardian_fathername }}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα μητέρας</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.guardian_mothername }}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Διεύθυνση</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.regionaddress}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">ΤΚ - Πόλη</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.regiontk}} - {{StudentDetails$.regionarea}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα μαθητή</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.name}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο μαθητή</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.studentsurname}}</div>
                       </div>
                       <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία μαθητή</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα Πατέρα</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.fatherfirstname}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα Μητέρας</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.motherfirstname}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Ημερομηνία Γέννησης</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.birthdate}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Τύπος απολυτηρίου</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.certificatetype}}</div>
                       </div>

                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Έτος κτήσης απολυτηρίου</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.graduation_year}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Σχολείο τελευταίας φοίτησης</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolname}}</div>
                       </div>

                       <div class="row oddin" style="margin: 0px 2px 20px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Σχολικό έτος τελευταίας φοίτησης</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolyear}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Τάξη τελευταίας φοίτησης</div>
                           <div *ngIf="StudentDetails$.lastschool_class === 1" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Α'</div>
                           <div *ngIf="StudentDetails$.lastschool_class === 2" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Β'</div>
                           <div *ngIf="StudentDetails$.lastschool_class === 3" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Γ'</div>
                           <div *ngIf="StudentDetails$.lastschool_class === 4" class="col-md-3" style="font-size: 0.8em; font-weight: bold">Δ'</div>
                       </div>

                 </div>
             </div>
             </div>
             </ul>

          <br>
          <br>
          <div *ngIf="(retrievedStudent | async)">
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
            </div>

            </form>
            </div>


   `
})


@Injectable() export default class DirectorView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private StudentSelected$: BehaviorSubject<any>;
    private StudentSelectedSub: Subscription;
    private School$: BehaviorSubject<any>;
    private SchoolSub: Subscription;
    private StudentInfo$: BehaviorSubject<any>;
    private StudentInfoSub: Subscription;
    private StudentsSize$: BehaviorSubject<any>;
    private SavedStudentsSub: Subscription;
    private SavedStudents$: BehaviorSubject<any>;
    private StudentsSizeSub: Subscription;
    private StudentSelectedSpecial$: BehaviorSubject<any>;
    private StudentSelectedSpecialSub: Subscription;
    private SubmitedDetails$: BehaviorSubject<any>;
    private SubmitedDetailsSub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    private selectionBClass: BehaviorSubject<boolean>;
    private selectiontype: BehaviorSubject<boolean>;
    private selectionCClass: BehaviorSubject<boolean>;
    private limitsSub: Subscription;
    private limits$: BehaviorSubject<any>;
    private SchoolId ;
    private currentclass: Number;
    private saved: Array<number> = new Array();
    private limitdown = 0;
    private limitup = 5;
    private pageno = 1;
    public totallimit;
    private userActive = <number>-1;
    private type: Number;
    public tot_pages: number;


    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private renderer: Renderer) {
        this.StudentSelected$ = new BehaviorSubject([{}]);
        this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
        this.StudentInfo$ = new BehaviorSubject([{}]);
        this.StudentsSize$ = new BehaviorSubject({});
        this.SavedStudents$ = new BehaviorSubject({});
        this.SubmitedDetails$ = new BehaviorSubject([{}]);
        this.limits$ = new BehaviorSubject([{}]);
        this.retrievedStudent = new BehaviorSubject(false);
        this.selectionBClass = new BehaviorSubject(false);
        this.selectionCClass = new BehaviorSubject(false);
        //this.outoflimits = new BehaviorSubject(false);
        this.School$ = new BehaviorSubject([{}]);
        this.selectiontype = new BehaviorSubject(true);


        this.formGroup = this.fb.group({
            tomeas: ['', []],
            taxi: ['', []],
            specialit: ['', []],
            maxpage: [{ value: '', disabled: true }, []],
            pageno: [{ value: '', disabled: true }, []],
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
      this.limitdown = 0;
      this.limitup = 5;
      console.log(this.SchoolId,"schoolida");
        this.pageno = 1;
        this.retrievedStudent.next(false);
        if (txop.value === "1") {
            this.selectionBClass.next(false);
            this.selectionCClass.next(false);

        }
        else if (txop.value === "2") {
            this.StudentSelectedSub = this._hds.getSectorPerSchool().subscribe(data => {
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
        else if (txop.value === "3" || txop.value === "4") {
            var sectorint = +this.formGroup.value.tomeas;
           if (this.formGroup.value.tomeas != '') {
                var sectorint = +this.formGroup.value.tomeas;

                this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(sectorint).subscribe(data => {
                    this.StudentSelectedSpecial$.next(data);
                },
                    error => {
                        this.StudentSelectedSpecial$.next([{}]);
                        console.log("Error Getting StudentSelectedSpecial");
                    },
                    () => console.log("Getting StudentSelectedSpecial"));
            }

            this.StudentSelectedSub = this._hds.getSectorPerSchool().subscribe(data => {
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
      console.log(this.SchoolId,"schoolidn");
        this.pageno = 1;
        this.retrievedStudent.next(false);
        var sectorint = +this.formGroup.value.tomeas;
        console.log(sectorint, "tomeas");
        if (txop.value === "3" || txop.value === "4") {
            //            this.StudentSelectedSpecial$ = new BehaviorSubject([{}]);
            this.StudentSelectedSpecialSub = this._hds.getSpecialityPerSchool(sectorint).subscribe(data => {
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


        var sectorint = +this.formGroup.value.tomeas;
        this.currentclass = +txop.value;

        this.formGroup.get('pageno').setValue(this.pageno);
        if (this.pageno == 1) {

            console.log("mphkepage = 1");
            this.StudentsSizeSub = this._hds.getStudentPerSchool(sectorint, this.currentclass, 0, 0).subscribe(x => {
                this.StudentsSize$.next(x);
                this.totallimit = x.id;

            this.limitsSub = this._hds.getlimitsofcourse(this.currentclass).subscribe(data => {
            this.limits$.next(data);
            console.log(this.totallimit, data[0].limitdown, "oria");
             this.tot_pages = x.id / 5;
                if (x.id % 5 > 0) {
                    this.tot_pages = (x.id - (x.id % 5)) / 5 + 1;
                }
                console.log(this.tot_pages,"totpages")
                if (isNaN(this.tot_pages)){
                  this.retrievedStudent.next(false);
                  this.tot_pages = 0;
                }
            if ( (x.id < data[0].limitdown) || (isNaN(this.tot_pages)))
            {
              console.log("mphkeprwto!")
                  this.retrievedStudent.next(false);
                  this.tot_pages = 0;
                  this.formGroup.get('maxpage').setValue(this.tot_pages);
                  //this.outoflimits.next(true);
            }
            else
            {
               // this.outoflimits.next(false);

                this.formGroup.get('maxpage').setValue(this.tot_pages);
                console.log(this.tot_pages,"mazeuw mathites");
                this.StudentInfoSub = this._hds.getStudentPerSchool(sectorint, this.currentclass, this.limitdown, this.limitup).subscribe(data => {
                this.StudentInfo$.next(data);

                console.log("tot.pages", this.formGroup.value.maxpage, "max1", this.tot_pages);
                this.retrievedStudent.next(true);

            },
            error => {
                this.StudentInfo$.next([{}]);
                console.log("Error Getting Students");
            },
            () => console.log("Getting Students"));



            }

              },
            error => {
                this.limits$.next([{}]);
                console.log("Error Getting limits");
            },
            () => console.log("Getting limits"));

            });

        }
        else{
              console.log("eisai edw", this.tot_pages);


              if (this.tot_pages == 0 ){
                  console.log("mphke1", this.formGroup.value.maxpage, this.tot_pages);
                  this.retrievedStudent.next(false);
                }
             else
              {
                console.log(this.tot_pages,"mazeuw mathites");
                this.StudentInfoSub = this._hds.getStudentPerSchool(sectorint, this.currentclass, this.limitdown, this.limitup).subscribe(data => {
                this.StudentInfo$.next(data);

                console.log("tot.pages", this.formGroup.value.maxpage, "max1", this.tot_pages);
                this.retrievedStudent.next(true);

            },
            error => {
                this.StudentInfo$.next([{}]);
                console.log("Error Getting Students");
            },
            () => console.log("Getting Students"));
          }
        }

    }

    updateCheckedOptions(id, cbvalue) {
        let i = 0;

        if (cbvalue.value === '1') {
            this.saved[i] = id;
            this.type = 1;

        }
        else if (cbvalue.value === '2') {
            this.saved[i] = id;
            this.type = 2;

            console.log("not confirmed")
        }
        else if (cbvalue.value === '3') {

        }
    }



    confirmStudent(txop) {

      this.SavedStudentsSub = this._hds.saveConfirmStudents(this.saved, this.type).subscribe(data => {
            this.SavedStudents$.next(data);

        },
            error => {
                this.SavedStudents$.next([{}]);
                console.log("Error saving Students");
            },
            () => {
              console.log("saved Students");
            this.findstudent(txop, this.pageno);
          });



    }

    checkcclass() {
        this.pageno = 1;
        this.retrievedStudent.next(false);
    }

    nextpage(txop, maxpage) {
        console.log(maxpage.value);
        if (this.pageno < maxpage.value) {
            this.pageno = this.pageno + 1;
            this.limitdown = (this.pageno - 1) * 5;
            this.limitup = this.pageno * 5;
            this.findstudent(txop, this.pageno)
        }
    }

    prevpage(txop) {
        console.log(this.pageno, "pageno");
        if (this.pageno > 1) {
            this.pageno = this.pageno - 1;
            this.limitdown = (this.pageno - 1) * 5;
            this.limitup = this.pageno * 5;
            this.findstudent(txop, this.pageno)
        }

    }



    setActiveUser(ind) {
        ind = +ind;
        console.log(this.userActive, "RA", ind);
        if (ind === this.userActive) {
            ind = -1;
        }
        ind--;
        this.userActive = ind + 1;


    }


}
