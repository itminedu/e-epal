import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { NgRedux, select } from 'ng2-redux';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { IRegions } from '../../store/regionschools/regionschools.types';
import { IAppState } from '../../store/store';

import {
    FormBuilder,
    FormGroup,
    FormControl
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'schools-order-select',
    template: `
    <p style="margin-top: 20px; line-height: 2em;" *ngIf = "numSelected === 1" >Έχετε επιλέξει το παρακάτω σχολείο. Εάν συμφωνείτε με την επιλογή σας
    πατήστε Συνέχεια, διαφορετικά μπορείτε να τροποποιήστε τις επιλογές σας πατώντας <i>Τα σχολεία μου</i> από τον κατάλογο επιλογών.</p>
    <p style="margin-top: 20px; line-height: 2em;" *ngIf = "numSelected > 1" >Έχετε επιλέξει {{numSelected}} σχολεία.
    Καθορίστε εδώ την επιθυμητή σειρά προτίμησης των σχολείων πατώντας τα αντίστοιχα κουμπάκια δίπλα στα ονόματα των σχολείων.
    Αν συμφωνείτε με την υπάρχουσα σειρά προτίμησης, πατήστε <i>Συνέχεια</i>.</p>

<!--    <div class="row equal">
     <div class="col-md-12"> -->
       <form [formGroup]="formGroup">
            <div *ngFor="let schoolField$ of schoolNames; let i=index; let isOdd=odd; let isEven=even" [class.odd]="isOdd" [class.even]="isEven">
                <button type="button" class="btn btn-info btn-sm  pull-right" style="width:120px;margin-bottom:4px;white-space: normal;word-wrap:break-word;"
                (click)="changeOrder(i,'up')" *ngIf = "i !== 0">Ανέβασέ με</button>
                  <!--
                  <button type="button" class="btn btn-info btn-sm  pull-right" (click)="changeOrder(i,'down')" style="width:120px;margin-bottom:4px;white-space: normal;word-wrap:break-word;"
                   *ngIf = "i !== numSelected-1">Κατέβασέ με</button>
                   -->
                <li class="list-group-item" >
                <!--
                <button type="button" class="btn btn-info btn-sm  pull-left" style="width:120px;" [disabled] = "true" >Προτίμηση {{i+1}}</button>
                -->
                Προτίμηση {{i+1}}:  {{schoolField$}}
                </li>
            </div>
              <div class="row" style="margin-top: 20px;">
              <div class="col-md-6">
                  <button [hidden] = "objLoaderStatus == true" type="button" class="btn-primary btn-lg pull-left" (click)="navigateBack();" >
                <i class="fa fa-backward"></i>
                  </button>
              </div>
              <div class="col-md-6">
                  <button [hidden] = "objLoaderStatus == true" type="button" class="btn-primary btn-lg pull-right" (click)="navigateToStudentForm()" [disabled] = "numSelected === 0"  >
                <i class="fa fa-forward"></i>
                  </button>
              </div>
              </div>
      </form>
<!--    </div>

  </div>  -->
  `

})
@Injectable() export default class SchoolsOrderSelect implements OnInit {
    //private sectorFields$: Observable<ISectorFields>;
    private regions$: Observable<IRegions>;
    public formGroup: FormGroup;
    private numSelected = <number>0;
    private schoolNames: Array<string> = new Array();
    private schoolSelectedIds: Array<number> = new Array();
    private schoolArrayOrders: Array<number> = new Array();

    constructor(private fb: FormBuilder,
                private _cfa: RegionSchoolsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router) {
        this.formGroup = this.fb.group({
        });
    };

    ngOnInit() {
        const { regions } = this._ngRedux.getState();
        let idx = -1;
        let nm = 1;
        for (let l=0; l<regions.size; l++) {
            for (let m=0; m < regions["_tail"]["array"][l]["epals"].length; m++) {
              ++idx;
              if (regions["_tail"]["array"][l]["epals"][m]["selected"] === true)  {
                 this.numSelected++;
                 this.schoolNames.push(regions["_tail"]["array"][l]["epals"][m]["epal_name"]);
                 this.schoolSelectedIds.push(idx);
                 this.schoolArrayOrders.push(nm++);
               }
               else
                this.schoolArrayOrders.push(0);
             }
          }
          this.saveSelected();
    }

    changeOrder(i, orient) {
      let ind = 1;
      if (orient === "up")
        ind = -1;
      //αλλιώς (αν orient = "down") είναι ind = 1

      //classic swap!
      /*
      let tempSchoolName = this.schoolNames[i] ;
      this.schoolNames[i] = this.schoolNames[i+ind];
      this.schoolNames[i+ind] = tempSchoolName;
      */
      //another way of swap..
      //this.schoolNames[i] = [this.schoolNames[i+ind],this.schoolNames[i+ind]=this.schoolNames[i]][0];

      //smart way of swap!
      [ this.schoolNames[i], this.schoolNames[i+ind] ] = [ this.schoolNames[i+ind], this.schoolNames[i] ];
      [ this.schoolSelectedIds[i], this.schoolSelectedIds[i+ind] ] = [ this.schoolSelectedIds[i+ind], this.schoolSelectedIds[i] ];

      this.saveSelected();
    }

    saveSelected() {
      for (let i=0; i < this.schoolSelectedIds.length; i++)
        this.schoolArrayOrders[this.schoolSelectedIds[i]] = i+1;
      this._cfa.saveRegionSchoolsOrder(this.schoolArrayOrders);
    }

    navigateToStudentForm() {
        this.router.navigate(['/student-application-form-main']);
    }

    navigateBack() {
/*        this._ngRedux.select(state => {
            state.epalclasses.reduce(({}, epalclass) =>{
              if (epalclass.name === "Α' Λυκείου")
                this.router.navigate(['/region-schools-select']);
              else if (epalclass.name === "Β' Λυκείου")
                  this.router.navigate(['/region-schools-select']);
              else if (epalclass.name === "Γ' Λυκείου")
                    this.router.navigate(['/region-schools-select']);
              return epalclass;
            }, {});
            return state.epalclasses;
        }); */
        this.router.navigate(['/region-schools-select']);

    }

}
