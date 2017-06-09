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
import { VALID_CAPACITY_PATTERN} from '../../constants';
import {maxValue} from '../../constants';
import {minValue} from '../../constants';


import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
@Component({
    selector: 'director-classcapacity',
    template: `
    <div class = "loading" *ngIf="(showLoader | async) === true"></div>
    <div style="min-height: 500px;">
    <form [formGroup]="formGroup">

     
       <p style="margin-top: 20px; line-height: 2em;"> Στην παρακάτω λίστα βλέπετε τα τμήματα του σχολείου σας με την αντίστοιχη δυναμίκη τους σε αίθουσες. Παρακαλώ για να τροποποποιήσετε τη δυναμικήαυτή κάντε κλικ στον αντίστοιχο σύμβολο,
       επιλέξτε τη νέα δυναμική και πατήστε το σύμβολο <i>ok</i>. Προσοχή! Κανένα τμήμα δεν πρέπει να έχει δυναμική 0.</p>
      <div class="row" style="margin-top: 20px; line-height: 2em;" > <b> Οι δηλώσεις σας </b></div>
      <div *ngFor="let CapacityPerCourses$  of CapacityPerCourse$ | async; let i=index; let isOdd=odd; let isEven=even" >
                <li *ngIf="(!(selectiontype | async) && (CapacityPerCourses$.class < 4)) ||((selectiontype | async) && (CapacityPerCourses$.class < 5))" class="list-group-item " [class.oddout]="isOdd" [class.evenout]="isEven" >
                <div class="row">
                <div class="col-md-5">
                   <h5 [class.changelistcolor]= "CapacityPerCourses$.capacity === null" >{{CapacityPerCourses$.taxi}}&nbsp; <b></b></h5>
                 </div>
                 <div class="col-md-4" col-md-offset-1>
                  <label style="font-weight:bold!important" *ngIf="!isEdit || CapacityPerCourses$.globalindex !== courseActive" > {{CapacityPerCourses$.capacity}} </label>

                   <i *ngIf="!isEdit || CapacityPerCourses$.globalindex !== courseActive" (click)= "modifycapc(i,$event)" class="fa fa-pencil isclickable pull-right" style="font-size: 1.5em;"></i>
                 
                   <input *ngIf="isEdit && CapacityPerCourses$.globalindex === courseActive"

                     id="{{CapacityPerCourses$.globalindex}}" type="number" 
                   name="{{CapacityPerCourses$.globalindex}}" value ={{CapacityPerCourses$.capacity}}               (change)="handleChange($event)">
                   </div>
                   
                 <div class="col-md-1"> 
            <i *ngIf="isEdit && CapacityPerCourses$.globalindex === courseActive" (click)= "isEdit = false" class="fa fa-ban isclickable" style="font-size: 1.5em;"></i>
            </div>
            <div class="col-md-2"> 

            <button *ngIf="isEdit && CapacityPerCourses$.globalindex === courseActive" type="button" class="btn-primary pull-right"
             (click)="isEdit=false" (click) ="saveCapacity(CapacityPerCourses$.newspecialit, CapacityPerCourses$.newsector, CapacityPerCourses$.class, CapacityPerCourses$.capacity, CapacityPerCourses$.globalindex )">
               <i class="fa fa-check" aria-hidden="true"></i>
             </button>
             </div>
             </div>
                </li>
       </div>

      </form>
    </div>


  <div id="checksaved" (onHidden)="onHidden('#checksaved')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
            <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Πρέπει να συπληρώσετε σωστά τη δυναμική</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#checksaved')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Η αποθήκευση δε μπορεί να γίνει αν δεν συμπληρώσετε έναν αριθμό μεταξυ 1 και 10!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>

   `
})

@Injectable() export default class DirectorClassCapacity implements OnInit, OnDestroy {

    public formGroup: FormGroup;

    private CapacityPerCourse$: BehaviorSubject<any>;
    private CapacityPerCourseSub: Subscription;
    private saveCapacitySub: Subscription;
    private newvalue:number;
    private isEdit: boolean;
    private courseActive = <number>-1;
    private showLoader: BehaviorSubject<boolean>;
    private School$: BehaviorSubject<any>;
    private SchoolSub: Subscription;
    private selectiontype: BehaviorSubject<boolean>;
    private SchoolId;



    constructor(private fb: FormBuilder,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.CapacityPerCourse$ = new BehaviorSubject([{}]);
        this.showLoader = new BehaviorSubject(false);
        this.isEdit = false;
        this.School$ = new BehaviorSubject([{}]);
        this.selectiontype = new BehaviorSubject(true);
        this.formGroup = this.fb.group({

             });

    }



   public showModal(popupMsgId):void {
        console.log("about to show modal");
        //(<any>$('#distributionWaitingNotice')).modal('show');
        (<any>$(popupMsgId)).modal('show');
    }

    public hideModal(popupMsgId):void {
        //(<any>$('#distributionWaitingNotice')).modal('hide');
        (<any>$(popupMsgId)).modal('hide');
    }

    public onHidden(popupMsgId):void {

    }


    ngOnDestroy() {

    }

    ngOnInit() {
                 (<any>$('#checksaved')).appendTo("body");
                  this.SchoolSub = this._hds.gettypeofschool().subscribe(x => {
                  this.School$.next(x);
                  console.log(x[0].type, "schoolid!");
                   this.SchoolId = x[0].type;
                   if (this.SchoolId == 'ΗΜΕΡΗΣΙΟ'){
                       this.selectiontype.next(false);
                   }

                  },
                  error => {
                      this.School$.next([{}]);
                      console.log("Error Getting School");
                  },
                  () => console.log("Getting School "));



                  this.CapacityPerCourseSub = this._hds.FindCapacityPerSchool().subscribe(x => {
                  this.CapacityPerCourse$.next(x);

                  },
                  error => {
                      this.CapacityPerCourse$.next([{}]);
                      console.log("Error Getting Capacity perSchool");
                  },
                  () => console.log("Getting School "));





    }


    handleChange ( e: Event) {
        this.newvalue = e.target['value'];
    }

   saveCapacity(spec,sect,taxi,oldvalue,ind){
    

     console.log(taxi, sect, spec);
     console.log(this.newvalue,"newvalue", oldvalue);
         if (this.newvalue!= null)
         {
          if (this.newvalue <=0 || this.newvalue >10)
          {
              this.showModal("#checksaved");
          }
          else
          {
          this.showLoader.next(true);

      
          let std = this.CapacityPerCourse$.getValue();
          std[ind].capacity = this.newvalue;
          this.saveCapacitySub = this._hds.saveCapacity(taxi, sect, spec, this.newvalue).subscribe(data => {
                this.showLoader.next(false);
                this.CapacityPerCourse$.next(std);
                 
                 },
                error => {
                    std[ind].capacity = oldvalue;
                    this.CapacityPerCourse$.next(std);

                    console.log("Error Saving Capacity");
                },
                () =>{
                 console.log("Saved Capacity");
                    });


             }

           }
           else
           {
             if (oldvalue === null)
             this.showModal("#checksaved");
           }
        }


  setActive(ind) {

      this.courseActive = ind;
      console.log(this.courseActive, ind, "ind");
    }


modifycapc(ind, e:Event)
{
  this.isEdit=true;
  this.setActive(ind);
  this.handleChange(e);
}
 
}
