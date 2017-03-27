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
    selector: 'submited-student',
    template: `
            <div id = "target">
            <div *ngFor="let StudentDetails$  of SubmitedDetails$ | async">
                 {{StudentDetails$.name}}
            </div>
            </div>
            <button type="button" (click)="createPdf()">Εξαγωγή σε PDF</button>                       
   `
})

@Injectable() export default class SubmitedStudentDetails implements OnInit , OnDestroy{

   
    private SubmitedDetails$: BehaviorSubject<any>;
    private SubmitedDetailsSub: Subscription;
    public StudentId: Number;
    
    constructor(private _hds: HelperDataService, 
                private route: ActivatedRoute,
                private router: Router )
    {
       this.SubmitedDetails$ = new BehaviorSubject([{}]);
    }

    ngOnDestroy()
    {
        if (this.SubmitedDetailsSub)
            this.SubmitedDetailsSub.unsubscribe();

    }

    ngOnInit() {
         

        this.getApplicationId();
        this.SubmitedDetailsSub = this._hds.getStudentDetails(this.StudentId).subscribe(this.SubmitedDetails$);
        
           

    }

    getApplicationId()
    {
            this.route.params.subscribe(params => {this.StudentId = params['id'];});
    }

    createPdf()
    {
        
        html2canvas(document.getElementById("target")).then(function(canvas)
        {
            var img = canvas.toDataURL();
            var doc = new jsPDF('p', 'mm');
            doc.addImage(img, 'PNG', 10, 10);
            doc.save('applications.pdf');
        });
    }

    
}