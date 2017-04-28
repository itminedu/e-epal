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
    selector: 'perfecture-view',
    template: `
     
            
            <ul class="list-group main-view">
              <div *ngFor="let SchoolNames$  of SchoolsPerPerf$  | async; let i=index; let isOdd=odd; let isEven=even"  >
                  <li class="list-group-item isclickable" (click)="setActiveRegion(SchoolNames$.id)" [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="regionActive === SchoolNames$.id ">
                     <h5>{{SchoolNames$.name}}</h5>
                  </li>
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
    public perfecture = 1;
    private regionActive = <number>-1;
    

    constructor(private fb: FormBuilder,
      private router: Router,
      private _hds: HelperDataService,
      ) {
        this.SchoolsPerPerf$ = new BehaviorSubject([{}]);
        this.formGroup = this.fb.group({
        });

    }

    ngOnDestroy() {
      }

    ngOnInit() {


        this.SchoolPerPerfSub = this._hds.getSchoolPerPerfecture(this.perfecture).subscribe(data => {
            this.SchoolsPerPerf$.next(data);
        },
            error => {
                this.SchoolsPerPerf$.next([{}]);
                console.log("Error Getting Schools");
            },
            () => console.log("Getting Schools"));



    }


     setActiveRegion(ind) {
      console.log(ind,"ind");
      if (ind === this.regionActive)
        ind = -1;
      this.regionActive = ind;
    }


    navigateToApplication()
    {
     
     var id: string= String(this.regionActive);
     this.router.navigate(['', {ids:id}]); 

    }

}
