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



@Component({
    selector: 'submited-preview',
    template: `
        <div id = "target">
            Έχετε ολοκληρώσει την αίτηση για εγγραφή στην επαγγελπατική εκπαίδευση των παρακάτω ατόμων:
            <div *ngFor="let userdata$ of submitedusers$ | async; ">
                <br>
                <br>
                 <strong>Στοιχεία υποψηφίου μαθητή: </strong>    <br>     
                 <br>
                

                
            </div>        
        </div>     
        <button type="button" (click)="createPdf()">Εξαγωγή σε PDF</button>
                  
   `
})

@Injectable() export default class SubmitedPreview implements OnInit {

    public submitedapplic$: any;
    public submitedusers$:any;
    
    public html2canvas: any;
    private loginInfo$: Observable<ILoginInfo>;
    private user :string;
    
    constructor(private _hds: HelperDataService, 
              public http: Http,
              private _ngRedux: NgRedux<IAppState>,) 
    {
      
    }



    ngOnInit() {

     

     

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