import { Component, OnDestroy, OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { HelperDataService } from "../../services/helper-data-service";

@Component({
    selector: "director-classcapacity",
    template: `
    <div class = "loading" *ngIf="(showLoader | async) === true"></div>
    <div style="min-height: 500px;">
    <form>


       <p style="margin-top: 20px; line-height: 2em;"> Στην παρακάτω λίστα βλέπετε τα τμήματα του σχολείου σας με την αντίστοιχη δυναμίκη τους σε αίθουσες. Παρακαλώ για να τροποποποιήσετε τη δυναμικήαυτή κάντε κλικ στον αντίστοιχο σύμβολο,
       επιλέξτε τη νέα δυναμική και πατήστε το σύμβολο <i>ok</i>. Προσοχή! Κανένα τμήμα δεν πρέπει να έχει δυναμική 0.</p>
      <div class="row" style="margin-top: 20px; line-height: 2em;" > <b> Οι δηλώσεις σας </b></div>
      <div *ngFor="let CapacityPerCourses$  of CapacityPerCourse$ | async; let i=index; let isOdd=odd; let isEven=even" >
                <li class="list-group-item " [class.oddout]="isOdd" [class.evenout]="isEven" >
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

  <div id="checksaved1" (onHidden)="onHidden('#checksaved1')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
            <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Πρέπει να συπληρώσετε σωστά τη δυναμική</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#checksaved1')">
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

    private CapacityPerCourse$: BehaviorSubject<any>;
    private CapacityPerCourseSub: Subscription;
    private saveCapacitySub: Subscription;
    private newvalue: number;
    private isEdit: boolean;
    private courseActive = <number>-1;
    private showLoader: BehaviorSubject<boolean>;

    constructor(
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.CapacityPerCourse$ = new BehaviorSubject([{}]);
        this.showLoader = new BehaviorSubject(false);
        this.isEdit = false;
    }

    public showModal(popupMsgId): void {
        (<any>$(popupMsgId)).modal("show");
    }

    public hideModal(popupMsgId): void {
        (<any>$(popupMsgId)).modal("hide");
    }

    public onHidden(popupMsgId): void {

    }

    ngOnDestroy() {

    }

    ngOnInit() {
        (<any>$("#checksaved1")).appendTo("body");

        this.CapacityPerCourseSub = this._hds.FindCapacityPerSchool().subscribe(x => {
            this.CapacityPerCourse$.next(x);

        },
            error => {
                this.CapacityPerCourse$.next([{}]);
                console.log("Error Getting Capacity perSchool");
            });
    }

    handleChange(e: Event) {
        this.newvalue = e.target["value"];
    }

    saveCapacity(spec, sect, taxi, oldvalue, ind) {
        if (this.newvalue != null) {
            if (this.newvalue <= 0 || this.newvalue > 10) {
                this.showModal("#checksaved1");
            }
            else {
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
                        this.showLoader.next(false);
                        console.log("Error Saving Capacity");
                    });
            }
        }
        else {
            if (oldvalue === null)
                this.showModal("#checksaved1");
        }
    }

    setActive(ind) {
        this.courseActive = ind;
    }


    modifycapc(ind, e: Event) {
        this.isEdit = true;
        this.setActive(ind);
        this.handleChange(e);
    }

}
