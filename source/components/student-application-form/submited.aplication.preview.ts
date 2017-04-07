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
            Έχει υποβληθεί αίτηση για εγγραφή στην Επαγγελματική Εκπαίδευση των παρακάτω ατόμων:
            <table class = "submited">
              <tr>
                <th>Όνομα</th>
                <th>Επώνυμο</th>
                <th></th>
              </tr>

               <tr *ngFor="let UserData$  of SubmitedApplic$ | async">
                <td>{{UserData$.name}} </td>
                <td>{{UserData$.studentsurname}} </td>
                <td> <button type="button" (click)="studentpreview(UserData$.id)"> <i class="fa fa-eye" aria-hidden="true"></i> </button> </td>
              </tr>


   `
})

@Injectable() export default class SubmitedPreview implements OnInit , OnDestroy{


    private SubmitedApplic$: BehaviorSubject<any>;
    private SubmitedUsersSub: Subscription;
    public StudentId;

    constructor(private _hds: HelperDataService,
                private activatedRoute: ActivatedRoute,
                private router: Router )
    {
       this.SubmitedApplic$ = new BehaviorSubject([{}]);
    }

    ngOnDestroy()
    {
        if (this.SubmitedUsersSub)
            this.SubmitedUsersSub.unsubscribe();
        this.SubmitedApplic$.unsubscribe();

    }
 
    ngOnInit() {


        this.SubmitedUsersSub = this._hds.getSubmittedPreviw().subscribe(this.SubmitedApplic$);
        console.log(this.SubmitedApplic$);



    }

    studentpreview(StudentId)
    {
      this.router.navigate(['/submited-person', {'id':StudentId}]);
    }


}
