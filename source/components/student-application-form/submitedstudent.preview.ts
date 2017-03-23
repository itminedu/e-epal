import { Component, OnInit, ElementRef, ViewChild} from "@angular/core";
let jsPDF = require('jspdf');
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import {Observable} from "rxjs/Observable";
import {IStudentDataFields, IStudentDataField} from '../../store/studentdatafields';
import {Http, Headers, RequestOptions} from '@angular/http';
import * as html2canvas from "html2canvas"
import {Removetags} from '../../pipes/removehtmltags';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';



@Component({
    selector: 'submited-person',
    template: `

    <h5 style="margin-top: 20px; line-height: 2em; ">Στοιχεία Μαθητή</h5>

        <div *ngFor="let userdata$ of submitedapplic$ | async; ">
        
            <ul class="list-group left-side-view" style="margin-bottom: 20px;">
                <li class="list-group-item active">
                    Μαθητής: {{userdata$.name}}
               </li>
            </ul>
        </div>
                  
   `
})

@Injectable() export default class SubmitedPerson implements OnInit {


    
    public html2canvas: any;
   
    private submitedapplic$: BehaviorSubject<any>;
    private submitedusers$: Subscription;
    public userid: number;
    public authToken : string ;
    
    constructor(private _hds: HelperDataService, 
                public http: Http,
                private _ngRedux: NgRedux<IAppState>,
                private activatedRoute: ActivatedRoute )
    {
       this.submitedapplic$ = new BehaviorSubject({});
    }



    ngOnInit() {
    

           
         this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params) {
                this.userid = 1;
                console.log("userid", this.userid, this.authToken);
            }
        });

        this.submitedusers$ = this._hds.getSubmittedPreviw(this.userid).subscribe(this.submitedapplic$);
        console.log("subscription", this.submitedusers$, "behavior", this.submitedapplic$);
        



    }


    createPdf()
    {

        html2canvas(document.getElementById("target")).then(function(canvas)
         {
        var img = canvas.toDataURL();
        var doc = new jsPDF('p', 'mm');
        doc.addImage(img, 'PNG', 10, 10);
        doc.save('applications.pdf');
     }
   
    );
    }
}