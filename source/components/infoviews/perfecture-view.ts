import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Injectable} from "@angular/core";
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
    selector: 'perfecture-view',
    template: `
            <h3> Αριθμός Μαθητών ανα τμήμα σχολείου </h3>

            <ul class="list-group main-view">
              <div *ngFor="let SchoolNames$  of SchoolsPerPerf$  | async; let i=index; let isOdd=odd; let isEven=even"  >
                  <li class="list-group-item isclickable" (click)="setActiveRegion(SchoolNames$.id)" [class.changelistcolor]= "SchoolNames$.status === true" [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="regionActive === SchoolNames$.id" >
                     <h5> {{SchoolNames$.name}}</h5>
                  </li>
                 <div *ngFor="let CoursesNames$  of CoursesPerPerf$  | async; let j=index; let isOdd2=odd; let isEven2=even" [class.oddin]="isOdd2" [class.evenin]="isEven2" [class.changecolor]="calccolor(CoursesNames$.size,CoursesNames$.limitdown)" [hidden]="SchoolNames$.id !== regionActive" >
                    <div> {{CoursesNames$.name}}</div> <div class= "aastyle"><strong>Αριθμός Μαθητών:</strong>{{CoursesNames$.size}} </div>

                 </div>
             </div>

             </ul>

             <div class="col-md-6">
                <button type="button" class="btn-primary btn-lg pull-right" (click)="navigateToApplication()" >
                <i class="fa fa-forward"></i>
                </button>
            </div>


   `
})

@Injectable() export default class PerfectureView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private SchoolsPerPerf$: BehaviorSubject<any>;
    private SchoolPerPerfSub: Subscription;
    private LimitPerCateg$: BehaviorSubject<any>;
    private LimitPerCategSub: Subscription;
    private CoursesPerPerf$: BehaviorSubject<any>;
    private CoursesPerPerfSub: Subscription;
    private StudentsSize$: BehaviorSubject<any>;
    private StudentsSizeSub: Subscription;
    public perfecture ;
    private regionActive = <number>-1;
    private School$: BehaviorSubject<any>;
    private SchoolSub: Subscription;



    constructor(private fb: FormBuilder,
      private router: Router,
      private _hds: HelperDataService,
      ) {
        this.SchoolsPerPerf$ = new BehaviorSubject([{}]);
        this.LimitPerCateg$ = new BehaviorSubject([{}]);
        this.CoursesPerPerf$ = new BehaviorSubject([{}]);
        this.StudentsSize$ = new BehaviorSubject({});
        this.School$ = new BehaviorSubject([{}]);
        this.formGroup = this.fb.group({
        });

    }

    ngOnDestroy() {
      }

    ngOnInit() {

      this.SchoolSub = this._hds.getSchoolId().subscribe(x => {
                  this.School$.next(x);
                  console.log(x[0].id, "perfectureID");
                   this.perfecture = x[0].id;


                  },
                  error => {
                      this.School$.next([{}]);
                      console.log("Error Getting School");
                  },
                  () => {
                          console.log("Getting School ");

                          this.SchoolPerPerfSub = this._hds.getSchoolPerPerfecture(this.perfecture).subscribe(data => {
                              this.SchoolsPerPerf$.next(data);
                          },
                              error => {
                                  this.SchoolsPerPerf$.next([{}]);
                                  console.log("Error Getting Schools");
                              },
                              () => console.log("Getting Schools"));
                }

                );


        /*
        this.SchoolPerPerfSub = this._hds.getSchoolPerPerfecture(this.perfecture).subscribe(data => {
            this.SchoolsPerPerf$.next(data);
        },
            error => {
                this.SchoolsPerPerf$.next([{}]);
                console.log("Error Getting Schools");
            },
            () => console.log("Getting Schools"));
        */



    }


     setActiveRegion(ind) {

      if (ind === this.regionActive)
        ind = -1;

      this.regionActive = ind;
      this.CoursesPerPerfSub = this._hds.getCoursePerPerfecture(this.regionActive).subscribe(data => {
            this.CoursesPerPerf$.next(data);
        },
            error => {
                this.CoursesPerPerf$.next([{}]);
                console.log("Error Getting Courses");
            },
            () => console.log("Getting Courses Per Perf"));



    }


    navigateToApplication()
    {

     var id: string= String(this.regionActive);
     this.router.navigate(['', {ids:id}]);

    }

    calccolor(size, limit)
    {

      if (size < limit)
        return true;
      else
        return false;
    }

}
