import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Injectable} from "@angular/core";
import { AppSettings } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import {Observable} from "rxjs/Observable";
import {Http, Headers, RequestOptions} from "@angular/http";
import { NgRedux, select } from "ng2-redux";
import { IAppState } from "../../store/store";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { ILoginInfo } from "../../store/logininfo/logininfo.types";

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from "@angular/forms";
@Component({
    selector: "perfecture-view",
    template: `
      <div class="loading" *ngIf="(showLoader | async) === true"></div>
      <div id="informationfeedback" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header {{modalHeader | async}}">
                    <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;{{ modalTitle | async }}</h3>
                    <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
                        <span aria-hidden="true"><i class="fa fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body"><p>{{ modalText | async }}</p></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="hideModal()">Κλείσιμο</button>
                </div>
            </div>
        </div>
      </div>
      <div style="min-height: 500px;">
        <form [formGroup]="formGroup">
            <p style="margin-top: 20px; line-height: 2em;">Στην παρακάτω λίστα βλέπετε τα σχολεία ευθύνης σας.
            <br/>Επιλέξτε σχολείο για να εμφανιστούν τα τμήματα του σχολείου.</p>
            <div class="row" style="margin-top: 20px; line-height: 2em;"><p><strong>Τα τμήματα</strong></p></div>
            <div *ngFor="let SchoolNames$  of SchoolsPerPerf$  | async; let i=index; let isOdd=odd; let isEven=even" style="font-size: 0.8em; font-weight: bold;">
                <li class="list-group-item isclickable" (click)="setActiveRegion(SchoolNames$.id)"
                     [class.oddout]="isOdd"
                    [class.evenout]="isEven" [class.selectedout]="regionActive === SchoolNames$.id" >
                    <div [class.changelistcolor]= "SchoolNames$.status === false" class="col-md-12">{{SchoolNames$.name}}</div>
                    <div class = "row" *ngFor="let CoursesNames$  of CoursesPerPerf$  | async; let j=index; let isOdd2=odd; let isEven2=even"
                        [class.oddin]="isOdd2" [class.evenin]="isEven2" [class.changecolor]="calccolor(CoursesNames$.size,CoursesNames$.limitdown)"
                        [class.selectedappout]="regionActive === j"
                        [hidden]="SchoolNames$.id !== regionActive" style="margin: 0px 2px 0px 2px;">
                        <div class="col-md-9">{{CoursesNames$.name}}</div>
                        <div class="col-md-3">{{CoursesNames$.size}}</div>
                    </div>
                </li>
            </div>
        </form>
     </div>

   `
})

@Injectable() export default class EduadminView implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    private SchoolsPerPerf$: BehaviorSubject<any>;
    private SchoolPerPerfSub: Subscription;
    private LimitPerCateg$: BehaviorSubject<any>;
    private LimitPerCategSub: Subscription;
    private CoursesPerPerf$: BehaviorSubject<any>;
    private CoursesPerPerfSub: Subscription;
    private StudentsSize$: BehaviorSubject<any>;
    private StudentsSizeSub: Subscription;
    private showLoader: BehaviorSubject<boolean>;
    public perfecture;
    private regionActive = <number>-1;
    private School$: BehaviorSubject<any>;
    private SchoolSub: Subscription;
    private modalTitle: BehaviorSubject<string>;
    private modalText: BehaviorSubject<string>;
    private modalHeader: BehaviorSubject<string>;

    constructor(private fb: FormBuilder,
        private router: Router,
        private _hds: HelperDataService,
    ) {
        this.SchoolsPerPerf$ = new BehaviorSubject([{}]);
        this.LimitPerCateg$ = new BehaviorSubject([{}]);
        this.CoursesPerPerf$ = new BehaviorSubject([{}]);
        this.StudentsSize$ = new BehaviorSubject({});
        this.School$ = new BehaviorSubject([{}]);
        this.showLoader = new BehaviorSubject(false);
        this.formGroup = this.fb.group({
        });
        this.modalTitle = new BehaviorSubject("");
        this.modalText = new BehaviorSubject("");
        this.modalHeader = new BehaviorSubject("");
    }

    ngOnDestroy() {
        (<any>$("#informationfeedback")).remove();
    }

    ngOnInit() {
        (<any>$("#informationfeedback")).appendTo("body");
        this.showLoader.next(true);
        this.SchoolPerPerfSub = this._hds.getSchools()
            .subscribe(data => {
                this.SchoolsPerPerf$.next(data);
                this.showLoader.next(false);
            },
            error => {
                this.SchoolsPerPerf$.next([{}]);
                console.log("Error Getting Schools");
                this.modalHeader.next("modal-header-danger");
                this.modalTitle.next("Αδυναμία άντλησης στοιχείων");
                this.modalText.next("Προέκυψε σφάλμα κατά την άντληση των στοιχείων. Παρακαλώ δοκιμάστε ξανά. Εφόσον το πρόβλημα συνεχίσει να υφίσταται, επικοινωνήστε με την ομάδα υποστήριξης.");
                this.showModal();
                this.showLoader.next(false);
            });

    }

    calccolor(size, limit) {
        if (size < limit)
            return true;
        else
            return false;
    }

    setActiveRegion(ind) {
        this.CoursesPerPerf$.next([{}]);
        if (ind === this.regionActive) {
            ind = -1;
            this.regionActive = ind;
        }
        else {
            this.regionActive = ind;
            this.showLoader.next(true);
            this.CoursesPerPerfSub = this._hds.getCoursePerPerfecture(this.regionActive)
                .subscribe(data => {
                    this.CoursesPerPerf$.next(data);
                    this.showLoader.next(false);
                },
                error => {
                    console.log("Error Getting Courses");
                    this.modalHeader.next("modal-header-danger");
                    this.modalTitle.next("Αδυναμία άντλησης στοιχείων");
                    this.modalText.next("Προέκυψε σφάλμα κατά την άντληση των στοιχείων. Παρακαλώ δοκιμάστε ξανά. Εφόσον το πρόβλημα συνεχίσει να υφίσταται, επικοινωνήστε με την ομάδα υποστήριξης.");
                    this.showModal();
                    this.showLoader.next(false);
                });
        }
    }

    public showModal(): void {
        (<any>$("#informationfeedback")).modal("show");
    }

    public hideModal(): void {
        (<any>$("#informationfeedback")).modal("hide");
    }

}
