import { Component, OnInit, OnDestroy,ElementRef, ViewChild} from "@angular/core";
let jsPDF = require('jspdf');
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import {Observable} from "rxjs/Observable";
import {IStudentDataFields, IStudentDataField} from '../../store/studentdatafields';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Removetags} from '../../pipes/removehtmltags';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';


@Component({
    selector: 'submited-preview',
    template: `
            <div *ngFor="let userdata$  of submitedapplic$ | async">
               {{userdata$.name}}
            </div>
                    
                        
   `
})

@Injectable() export default class SubmitedPreview implements OnInit , OnDestroy{


    
   
   
    private submitedapplic$: BehaviorSubject<any>;
    private submitedusersSub: Subscription;
    public studentid = 1 ;
    
    constructor(private _hds: HelperDataService, 
                private activatedRoute: ActivatedRoute,
                private router: Router )
    {
       this.submitedapplic$ = new BehaviorSubject([{}]);
    }

    ngOnDestroy()
    {
        if (this.submitedusersSub)
            this.submitedusersSub.unsubscribe();

    }

    ngOnInit() {
     

        this.submitedusersSub = this._hds.getSubmittedPreviw().subscribe(this.submitedapplic$);
              this.submitedapplic$.subscribe( function (x) { console.log("I am in next"); console.log(x); }, function (err) { console.log('Error: ' + err); }, function () { console.log('Completed='); } );
           

    }


    

    studentpreview()
    {
     console.log(this.studentid);       
     this.router.navigate(['/submited-person', { id: this.studentid}]);
    }


}