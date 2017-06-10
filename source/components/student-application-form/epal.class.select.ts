import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from "@angular/core";
import { EpalClassesActions } from '../../actions/epalclass.actions';
import { NgRedux, select } from 'ng2-redux';
import { IEpalClasses } from '../../store/epalclasses/epalclasses.types';
import { SectorFieldsActions } from '../../actions/sectorfields.actions';
import { RegionSchoolsActions } from '../../actions/regionschools.actions';
import { SectorCoursesActions } from '../../actions/sectorcourses.actions';
import { IAppState } from '../../store/store';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'epal-class-select',
    template: `
    <div class="row">
             <breadcrumbs></breadcrumbs>
    </div>
    <div id="epalClassNotice" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
    <h4> Επιλογή Τάξης </h4>
    <form [formGroup]="formGroup">
           <p style="margin-top: 20px; line-height: 2em;"> Παρακαλώ επιλέξτε την τάξη στην οποία θα φοιτήσει ο μαθητής στην Επαγγελματική Εκπαίδευση το νέο σχολικό έτος και έπειτα επιλέξτε <i>Συνέχεια</i>.</p>
           <div *ngFor="let epalclass$ of epalclasses$ | async;"> </div>
            <div class="form-group" style= "margin-top: 50px; margin-bottom: 100px;">
              <label for="name"></label><br/>
                    <select class="form-control" formControlName="name" (change)="initializestore()">
                        <option value="">Επιλέξτε Τάξη</option>
                        <option value="1">Α’ Λυκείου</option>
                        <option value="2">Β’ Λυκείου</option>
                        <option value="3">Γ' Λυκείου</option>
                        <option value="4">Δ' Λυκείου</option>

                    </select>

            </div>
        <div class="row" style="margin-bottom: 20px;">
        <div class="col-md-6">
            <button type="button" class="btn-primary btn-lg pull-left" (click)="navigateBack()">
                <i class="fa fa-backward"></i>
            </button>
        </div>
            <div class="col-md-6">
                <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="saveSelected()">
               <span style="font-size: 0.9em; font-weight: bold;">Συνέχεια&nbsp;&nbsp;&nbsp;</span><i class="fa fa-forward"></i>
                </button>
            </div>
        </div>

    </form>
   `
})

@Injectable() export default class EpalClassesSelect implements OnInit, OnDestroy {
    private epalclasses$: Observable<IEpalClasses>;

    public formGroup: FormGroup;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;
    public isModalShown: BehaviorSubject<boolean>;

       constructor(private fb: FormBuilder,
                private _cfa: EpalClassesActions,
                private _ngRedux: NgRedux<IAppState>,
                private _csa: SectorCoursesActions,
                private _sfa: SectorFieldsActions,
                private _rsa: RegionSchoolsActions,
                private router: Router) {
       this.formGroup = this.fb.group({
            name: []
            });
            this.modalTitle = new BehaviorSubject("");
            this.modalText = new BehaviorSubject("");
            this.modalHeader = new BehaviorSubject("");
            this.isModalShown = new BehaviorSubject(false);
        };

    ngOnInit() {
        (<any>$('#epalClassNotice')).appendTo("body");
          this.epalclasses$ = this._ngRedux.select(state => {
            if (state.epalclasses.size > 0) {
                state.epalclasses.reduce(({}, epalclass) => {
                    this.formGroup.setValue(epalclass);
                    return epalclass;
                }, {});
            } else {
                this.formGroup.controls["name"].setValue("");
            }
            return state.epalclasses;
        });

    }

    ngOnDestroy() {
        (<any>$('#epalClassNotice')).remove();
    }

    public showModal(): void {
        (<any>$('#epalClassNotice')).modal('show');
    }

    public hideModal(): void {
        (<any>$('#epalClassNotice')).modal('hide');

    }

    public onHidden(): void {
        this.isModalShown.next(false);
    }


    saveSelected() {
        if (this.formGroup.controls["name"].value === "") {
            this.modalTitle.next("Δεν επιλέχθηκε τάξη");
            this.modalText.next("Παρακαλούμε να επιλέξετε πρώτα τάξη φοίτησης του μαθητή για το νέο σχολικό έτος");
            this.modalHeader.next("modal-header-danger");
            this.showModal();
        }
        else
        {
            this._cfa.saveEpalClassesSelected(this.formGroup.value);
            if (this.formGroup.value.name === "1")
              this.router.navigate(['/region-schools-select']);
            else if (this.formGroup.value.name === "2")
                this.router.navigate(['/sector-fields-select']);
            else if (this.formGroup.value.name === "3" || this.formGroup.value.name === "4")
                this.router.navigate(['/sectorcourses-fields-select']);

        }

    }

    navigateBack() {
        this.router.navigate(['/intro-statement']);
    }


    initializestore()
    {
       this._cfa.saveEpalClassesSelected(this.formGroup.value);
       this._sfa.initSectorFields();
       this._rsa.initRegionSchools();
       this._csa.initSectorCourses();
    }

}
