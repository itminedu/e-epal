import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { ISectors } from '../../store/sectorcourses/sectorcourses.types';
import { SECTOR_COURSES_INITIAL_STATE } from '../../store/sectorcourses/sectorcourses.initial-state';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../store/store';
import {RemoveSpaces} from '../../pipes/removespaces';

import { RegionSchoolsActions } from '../../actions/regionschools.actions';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'sectorcourses-fields-select',
    template: `
    <div id="sectorCourseNotice" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header {{modalHeader | async}}">
              <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;{{ modalTitle | async }}</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>{{ modalText | async }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="hideModal()">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
             <breadcrumbs></breadcrumbs>
    </div>
    <div class = "loading" *ngIf="(sectors$ | async).size === 0">
   </div>
       <h4> Επιλογή Ειδικότητας</h4>
      <form [formGroup]="formGroup">
        <div formArrayName="formArray">
        <p style="margin-top: 20px; line-height: 2em;"> Παρακαλώ επιλέξτε την ειδικότητα στην οποία θα φοιτήσει ο μαθητής στην Επαγγελματική Εκπαίδευση. Έπειτα επιλέξτε <i>Συνέχεια</i>.</p>
            <ul class="list-group">
            <div *ngFor="let sector$ of sectors$ | async; let i=index; let isOdd=odd; let isEven=even">
                <li class="list-group-item isclickable" (click)="setActiveSector(i)"  [class.oddout]="isOdd" [class.evenout]="isEven" [class.selectedout]="sectorActive === i">
                    <h5>{{sector$.sector_name}}</h5>
                </li>
                <div *ngFor="let course$ of sector$.courses; let j=index; let isOdd2=odd; let isEven2=even" [class.oddin]="isOdd2" [class.evenin]="isEven2" [hidden]="i !== sectorActive">
                          <div class="row">
                           <div class="col-md-2 col-md-offset-1">
                                <input #cb type="checkbox" formControlName="{{ course$.globalIndex }}"
                                (change)="updateCheckedOptions(course$.globalIndex, cb)"
                                [checked] = " course$.globalIndex === idx "
                                >
                            </div>
                            <div class="col-md-8  col-md-offset-1 isclickable">
                                {{course$.course_name | removeSpaces}}
                            </div>
                            </div>
                    </div>
              </div>
            </ul>
        </div>

        <div class="row" style="margin-top: 20px; margin-bottom: 20px;" *ngIf="(sectors$ | async).size > 0">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left" (click)="router.navigate(['/epal-class-select']);" >
          <i class="fa fa-backward"></i>
            </button>
        </div>
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="navigateToSchools()" >
                <span style="font-size: 0.9em; font-weight: bold;">Συνέχεια&nbsp;&nbsp;&nbsp;</span><i class="fa fa-forward"></i>
            </button>
        </div>
        </div>
     </form>
  `
})
@Injectable() export default class SectorCoursesSelect implements OnInit, OnDestroy {
    private sectors$: BehaviorSubject<ISectors>;
    private sectorsSub: Subscription;
    private formGroup: FormGroup;
    private rss = new FormArray([]);
    private sectorActive = <number>-1;
    private idx = <number>-1;
    private sectorsList: Array<boolean> = new Array();
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    public isModalShown: BehaviorSubject<boolean>;

    constructor(private fb: FormBuilder,
                private _sca: SectorCoursesActions,
                private _rsa: RegionSchoolsActions,
                private _ngRedux: NgRedux<IAppState>,
                private router: Router
            ) {

        this.sectors$ = new BehaviorSubject(SECTOR_COURSES_INITIAL_STATE);
        this.formGroup = this.fb.group({
            formArray: this.rss
        });
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
        this.isModalShown = new BehaviorSubject(false);
    };

    ngOnInit() {
        (<any>$('#sectorCourseNotice')).appendTo("body");
        this._sca.getSectorCourses(false);
        let ids = 0;
        this.sectorsSub = this._ngRedux.select('sectors').subscribe(sectors => {
            let scs = <ISectors>sectors;
            scs.reduce((prevSector, sector) =>{
                this.sectorsList[ids] = sector.sector_selected;
                ids++;
                //In case we want to preserve last checked option when we revisit the form
                if (sector.sector_selected === true)
                    this.sectorActive = ids-1;
                sector.courses.reduce((prevCourse, course) =>{
                    this.rss.push( new FormControl(course.selected, []));
                    //this.retrieveCheck();
                    if (course.selected === true) {
                      //In case we want to preserve last checked option when we revisit the form
                      this.idx = course.globalIndex;
                    }
                    return course;
                }, {});
                return sector;
            }, {});
            ids = 0;
            this.sectors$.next(scs);
        }, error => {console.log("error selecting sectors");});

    }

    ngOnDestroy() {
        (<any>$('#sectorCourseNotice')).remove();
        if (this.sectorsSub) this.sectorsSub.unsubscribe();
    }

    public showModal(): void {
        (<any>$('#sectorCourseNotice')).modal('show');
    }

    public hideModal(): void {
        (<any>$('#sectorCourseNotice')).modal('hide');

    }

    public onHidden(): void {
        this.isModalShown.next(false);
    }

    setActiveSector(ind) {
      if (ind === this.sectorActive)
        ind = -1;
      this.sectorActive = ind;
    }

    saveSelected() {
        this._sca.saveSectorCoursesSelected(this.formGroup.value.formArray, this.sectorsList);

        this._rsa.initRegionSchools();
    }

    navigateToSchools() {

        if (this.idx === -1) {
            this.modalTitle.next("Δεν επιλέχθηκε ειδικότητα");
            this.modalText.next("Παρακαλούμε να επιλέξετε πρώτα ειδικότητα φοίτησης του μαθητή για το νέο σχολικό έτος");
            this.modalHeader.next("modal-header-danger");
            this.showModal();
        } else {
            this.router.navigate(['/region-schools-select']);
        }
    }

    updateCheckedOptions(globalIndex, cb){
      this.idx = globalIndex;
      for (let i = 0; i < this.formGroup.value.formArray.length; i++)
        this.formGroup.value.formArray[i] = false;
      this.formGroup.value.formArray[globalIndex] = cb.checked;
      if (cb.checked === false)
        this.idx = -1;

      for (let i = 0; i < this.sectorsList.length; i++)
          this.sectorsList[i] = false;
      this.sectorsList[this.sectorActive] = true;

      this.saveSelected();
  }

}
