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

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'minister-view',
    template: `

    <div>
      <form [formGroup]="formGroup" method = "POST" action="{{apiEndPoint}}/epal/distribution" #form>
        <button type="submit" class="btn-primary btn-md" (click)="form.submit()" [disabled]="true">
            Εκτέλεση Κατανομής Μαθητών
        </button>
      </form>
    </div>

   `
})

@Injectable() export default class MinisterView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private apiEndPoint = API_ENDPOINT;

    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          this.formGroup = this.fb.group({

          });

    }

    ngOnDestroy() {

    }

    ngOnInit() {

    }




    runDistribution() {

    }



}
