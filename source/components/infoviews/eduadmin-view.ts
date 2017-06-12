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
    selector: 'eduadmin-view',
    template: `
      <div class = "loading" *ngIf="(showLoader | async) === true"></div>
      <div style="min-height: 500px;">
        <form [formGroup]="formGroup">
         <p style="margin-top: 20px; line-height: 2em;">Στην παρακάτω λίστα βλέπετε τα σχολεία ευθύνης σας.
         </p>
            <div class="row" style="margin-top: 20px; line-height: 2em;" > <b> Τα τμήματα. </b>
            </div>
                <div *ngFor="let SchoolNames$  of SchoolsPerPerf$  | async; let i=index; let isOdd=odd; let isEven=even"  >
                      <li class="list-group-item isclickable" (click)="setActiveRegion(SchoolNames$.id)"
                       [class.changelistcolor]= "SchoolNames$.status === false" [class.oddout]="isOdd"
                        [class.evenout]="isEven" [class.selectedout]="regionActive === SchoolNames$.id" >
                            <div class="col-md-12" style="font-size: 0.8em; font-weight: bold;" >{{SchoolNames$.name}}</div>
                      </li>
                    
                      <div class = "row" *ngFor="let CoursesNames$  of CoursesPerPerf$  | async; let j=index; let isOdd2=odd; let isEven2=even"  
                       [class.oddin]="isOdd2" [class.evenin]="isEven2" [class.changecolor]="calccolor(CoursesNames$.size,CoursesNames$.limitdown)"
                       [class.selectedappout]="regionActive === j"  
                       [hidden]="SchoolNames$.id !== regionActive" style="margin: 0px 2px 0px 2px;">
                          <div class="col-md-6" style="font-size: 0.8em; font-weight: bold;" >{{CoursesNames$.name}}</div>
                          <div class="col-md-6" style="font-size: 0.8em; font-weight: bold;" >{{CoursesNames$.size}}</div>
                       </div>
              
                    
                </div>
        </form>
     </div>

   `
})

@Injectable() export default class EduadminView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private SchoolsPerPerf$: BehaviorSubject<any>;
    private SchoolPerPerfSub: Subscription;
    private LimitPerCateg$: BehaviorSubject<any>;
    private LimitPerCategSub: Subscription;
    private CoursesPerPerf$: BehaviorSubject<any>;
    private CoursesPerPerfSub: Subscription;
    private StudentsSize$: BehaviorSubject<any>;
    private StudentsSizeSub: Subscription;
    private showLoader: BehaviorSubject<boolean>;
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
        this.showLoader = new BehaviorSubject(false);
        this.formGroup = this.fb.group({
        });

    }

    ngOnDestroy() {
      }

    ngOnInit() {

                
                   this.showLoader.next(true);
                   this.SchoolPerPerfSub = this._hds.getSchools().subscribe(data => {
                       this.SchoolsPerPerf$.next(data);
                       this.showLoader.next(false);
                   },
                       error => {
                           this.SchoolsPerPerf$.next([{}]);
                           console.log("Error Getting Schools");
                       },
                       () => console.log("Getting Schools"));

                 



    }



    calccolor(size, limit)
    {

      if (size < limit)
        return true;
      else
        return false;
    }




    setActiveRegion(ind) {
      console.log(ind, this.regionActive,"ind");
      if (ind === this.regionActive){
        ind = -1;
        this.regionActive = ind; 
      }
      
    else
      {
       this.regionActive = ind; 
      this.showLoader.next(true);
      this.CoursesPerPerfSub = this._hds.getCoursePerPerfecture(this.regionActive).subscribe(data => {
            this.CoursesPerPerf$.next(data);
            this.showLoader.next(false);
        },
            error => {
                this.CoursesPerPerf$.next([{}]);
                console.log("Error Getting Courses");
                this.showLoader.next(false);
            },
            () => console.log("Getting Courses Per Perf"));
      }
      this.regionActive = ind;  


    }


}
