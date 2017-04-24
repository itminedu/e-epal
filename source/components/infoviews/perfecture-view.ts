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
     
       <div *ngFor="let SchoolNames$  of SchoolsPerPerf$ | async; let i=index">
                 {{SchoolNames$.name}} <br>
       </div>

   `
})

@Injectable() export default class PerfectureView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private SchoolsPerPerf$: BehaviorSubject<any>;
    private SchoolPerPerfSub: Subscription;
    public perfecture = 1;
    

    constructor(private fb: FormBuilder,
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



}
