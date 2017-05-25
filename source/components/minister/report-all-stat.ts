import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import { Observable} from "rxjs/Observable";
import { Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import {reportsSchema, TableColumn} from './reports-schema';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import { PDE_ROLE, DIDE_ROLE } from '../../constants';
import {csvCreator} from './csv-creator';
import {chartCreator} from './chart-creator';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';


import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'report-all-stat',
    template: `

  <div>


        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <form [formGroup]="formGroup"  #form>

          <!--<h5> >Επιλογή Φίλτρων <br><br></h5>-->
          <br>
          <button type="button" class="btn-link" (click)="toggleRegionFilter()" >
              > Φίλτρο Επιλογής Περιφ/κής Δ/νσης - Δ/νσης Εκπ/σης - Σχολείου
          </button>
          <div  class="col-md-11 offset-md-1">
                <label *ngIf = "enableRegionFilter && userLoggedIn == 'supervisor'"> Περιφερειακή Διεύθυνση </label>
                <select #regsel class="form-control" (change)="checkregion(regsel)" *ngIf = "enableRegionFilter" [value] = "regionSelected" [hidden] = "userLoggedIn != 'supervisor'" formControlName="region">
                  <option value="0"></option>
                  <option *ngFor="let RegionSelection$  of RegionSelections$ | async; let i=index" [value] = "RegionSelection$.id"> {{RegionSelection$.name}} </option>
                </select>
          </div>
          <div class="col-md-11 offset-md-1">
                <label *ngIf="(showAdminList | async) && enableRegionFilter && userLoggedIn != 'dide'">Διεύθυνση Εκπαίδευσης</label>
                <select #admsel class="form-control"  *ngIf="(showAdminList | async) && enableRegionFilter" (change)="checkadminarea(admsel)" [hidden] = "userLoggedIn == 'dide'" formControlName="adminarea">
                  <option value="0"></option>
                  <option *ngFor="let AdminAreaSelection$  of AdminAreaSelections$ | async; let i=index" [value] = "AdminAreaSelection$.id"> {{AdminAreaSelection$.name}}</option>
                </select>
          </div>
          <div class="col-md-11 offset-md-1">
                <label *ngIf="(showAdminList | async) && enableRegionFilter">Σχολείο</label>
                <select #schsel class="form-control"  *ngIf="(showAdminList | async) && enableRegionFilter" (change)="checkschool(schsel)" formControlName="schoollist">
                  <option value="0"></option>
                  <option *ngFor="let SchoolSelection$  of SchoolSelections$ | async; let i=index" [value] = "SchoolSelection$.epal_id"> {{SchoolSelection$.epal_name}} </option>
                </select>
          </div>

          <button type="button" class="btn-link" (click)="toggleCourseFilter()" *ngIf = "reportId == 3" >
              > Φίλτρο Επιλογής Τομέα / Ειδικότητας
          </button>
          <br>
          <div  class="col-md-11 offset-md-1">
                <label for="classid" *ngIf = "enableCourseFilter" >Τάξη</label><br/>
                <select #class_sel  class="form-control" (change)="checkclass(class_sel)" *ngIf = "enableCourseFilter" formControlName="classid" >
                  <option value="0" ></option>
                  <option value="1" >Α' Λυκείου</option>
                  <option value="2" >Β' Λυκείου</option>
                  <option value="3" >Γ' Λυκείου</option>
                  <option value="4" >Δ' Λυκείου</option>
                </select>
          </div>
          <div class="col-md-11 offset-md-1">
                <label *ngIf="(showSectorList | async) && enableCourseFilter && (classSelected == 2 || classSelected == 3 || classSelected == 4) ">Τομέας</label>
                <select #secsel class="form-control"  *ngIf="(showSectorList | async) && enableCourseFilter && (classSelected == 2 || classSelected == 3 || classSelected == 4)"
                      (change)="checksector(secsel)" formControlName="sector">
                  <option value="0"></option>
                  <option *ngFor="let SectorSelection$  of SectorSelections$ | async; let i=index" [value] = "SectorSelection$.id"> {{SectorSelection$.name}}</option>
                </select>
          </div>
          <div class="col-md-11 offset-md-1">
                <label *ngIf="(showCourseList | async) && enableCourseFilter && (classSelected == 3 || classSelected == 4)">Ειδικότητα</label>
                <select #coursel class="form-control"  *ngIf="(showCourseList | async) && enableCourseFilter && (classSelected == 3 || classSelected == 4)"
                      (change)="checkcourse(coursel)" formControlName="course">
                  <option value="0"></option>
                  <option *ngFor="let CourseSelection$  of CourseSelections$ | async; let i=index" [value] = "CourseSelection$.id"> {{CourseSelection$.name}}</option>
                </select>
          </div>

          <br>
          <button type="submit" class="btn btn-alert"  (click)="createReport(regsel)" [hidden]="minedu_userName == ''" >
          <i class="fa fa-file-text"></i>
              Δημιουργία Αναφοράς
          </button>
          <button type="submit" class="btn btn-alert pull-right"  (click)="navigateBack()" [hidden]="minedu_userName == ''" >
              Επιστροφή
          </button>
          <br><br>
        </form>

        <div *ngIf="validCreator == 1 ">
          <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch(search.value)">
          <div class="smart-table-container" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>

        <button type="button" class="alert alert-info pull-right" (click)="export2Csv()" [hidden]="validCreator != 1">
        <i class="fa fa-download"></i>
            <br>Εξαγωγή σε csv
        </button>
        <button type="button" class="alert alert-info pull-left" (click)="createDiagram()" [hidden]="validCreator != 1 || schSelected == 0 || (reportId != 2 ) ">
        <i class="fa fa-bar-chart"></i>
            Διάγραμμα
        </button>

        <div class="d3-chart" *ngIf = "validCreator == 1" #chart>
        </div>
        <br><br><br><br><br>

    </div>

   `
})

@Injectable() export default class ReportAllStat implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private RegionSelections$: BehaviorSubject<any>;
    private AdminAreaSelections$: BehaviorSubject<any>;
    private SchoolSelections$: BehaviorSubject<any>;
    private SectorSelections$: BehaviorSubject<any>;
    private CourseSelections$: BehaviorSubject<any>;
    private RegionRetrieve$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private RegionSelectionsSub: Subscription;
    private AdminAreaSelectionsSub: Subscription;
    private SchoolSelectionsSub: Subscription;
    private SectorSelectionsSub: Subscription;
    private CourseSelectionsSub: Subscription;
    private RegionRetrieveSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data;
    private validCreator: number;
    private reportId: number;
    private source: LocalDataSource;
    private showAdminList: BehaviorSubject<boolean>;
    private showSectorList: BehaviorSubject<boolean>;
    private showCourseList: BehaviorSubject<boolean>;
    private regionSelected: number;
    private adminAreaSelected: number;
    private schSelected: number;
    private classSelected: number;
    private sectorSelected: number;
    private courseSelected: number;
    private enableRegionFilter: boolean;
    private enableCourseFilter: boolean;
    private userLoggedIn: string;

    columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
    @Input() settings: any;
    private reportSchema = new  reportsSchema();

    //csvObj:csvCreator ;
    private csvObj = new csvCreator();

    private createGraph: boolean;
    //d3 creator
    private chartObj = new chartCreator();
    @ViewChild('chart') public chartContainer: ElementRef;
    private d3data: Array<any>;

    //private repid: number;
    private routerSub: any;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          this.formGroup = this.fb.group({
              region: ['', []],
              adminarea: ['', []],
              schoollist: ['', []],
              classid: ['', []],
              sector: ['', []],
              course: ['', []],
          });

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          this.generalReport$ = new BehaviorSubject([{}]);
          this.RegionSelections$ = new BehaviorSubject([{}]);
          this.AdminAreaSelections$ = new BehaviorSubject([{}]);
          this.SchoolSelections$ = new BehaviorSubject([{}]);
          this.SectorSelections$ = new BehaviorSubject([{}]);
          this.CourseSelections$ = new BehaviorSubject([{}]);
          this.RegionRetrieve$ = new BehaviorSubject([{}]);
          this.minedu_userName = '';
          this.validCreator = -1;
          this.showAdminList = new BehaviorSubject(false);
          this.showSectorList = new BehaviorSubject(false);
          this.showCourseList = new BehaviorSubject(false);
          this.regionSelected = 0;
          this.adminAreaSelected = 0;
          this.schSelected = 0;
          this.classSelected = 0;
          this.sectorSelected = 0;
          this.courseSelected = 0;
          this.enableRegionFilter = false;
          this.enableCourseFilter = false;
          this.createGraph = false;

    }

    ngOnInit() {

      this.loginInfoSub = this._ngRedux.select(state => {
          if (state.loginInfo.size > 0) {
              state.loginInfo.reduce(({}, loginInfoToken) => {
                this.minedu_userName = loginInfoToken.minedu_username;
                this.minedu_userPassword = loginInfoToken.minedu_userpassword;

                this.userLoggedIn = loginInfoToken.auth_role;
                if (loginInfoToken.auth_role == PDE_ROLE || loginInfoToken.auth_role == DIDE_ROLE)  {
                    console.log("inside..");
                    let regId = -1;
                    this.minedu_userName = loginInfoToken.auth_token;
                    this.minedu_userPassword = loginInfoToken.auth_token;
                    if (loginInfoToken.auth_role == PDE_ROLE || loginInfoToken.auth_role == DIDE_ROLE) {

                      //CALL CONTROLLER THAT RETURNS ID OF PDE

                      this.RegionRetrieveSub = this._hds.getUserRegistryNo(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
                          this.RegionRetrieve$.next(data);
                          this.data = data;
                      },
                          error => {
                              this.RegionRetrieve$.next([{}]);
                              console.log("Error Getting getUserRegistryNo");
                          },
                          () => {
                            regId = this.data['id'];
                            console.log("Success Getting getUserRegistryNo");

                            if (loginInfoToken.auth_role == PDE_ROLE) {
                              this.regionSelected = regId;
                              this.showAdminList.next(true);

                              console.log("Nikos1..");
                              console.log(this.regionSelected);
                              this.checkregion(this. regionSelected);
                            }
                            else if (loginInfoToken.auth_role == DIDE_ROLE) {
                              this.adminAreaSelected = regId;
                              this.showAdminList.next(false);
                              this.checkadminarea(this.adminAreaSelected);
                              //console.log("Test");
                              //console.log(this.adminAreaSelected);
                            }

                          }
                        );
                  }
                }
                return loginInfoToken;
              }, {});
          }
          return state.loginInfo;
      }).subscribe(this.loginInfo$);

      this.routerSub = this.activatedRoute.params.subscribe(params => {
      this.reportId = +params['reportId'];
      //console.log("Hello");
      //console.log(this.reportId);
     });


    this.showFilters();

    }

    ngOnDestroy() {

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      if (this.generalReportSub)
          this.generalReportSub.unsubscribe();
      if (this.RegionSelectionsSub)
          this.RegionSelectionsSub.unsubscribe();
      if (this.AdminAreaSelectionsSub)
          this.AdminAreaSelectionsSub.unsubscribe();
      if (this.SchoolSelectionsSub)
          this.SchoolSelectionsSub.unsubscribe();
      if (this.SectorSelectionsSub)
          this.SectorSelectionsSub.unsubscribe();
      if (this.CourseSelectionsSub)
          this.CourseSelectionsSub.unsubscribe();
      if (this.showAdminList)
          this.showAdminList.unsubscribe();
      if (this.showSectorList)
          this.showSectorList.unsubscribe();
      if (this.showCourseList)
          this.showCourseList.unsubscribe();
      if (this.RegionRetrieveSub)
          this.RegionRetrieveSub.unsubscribe();

    }


createReport(regionSel) {

  this.validCreator = 0;
  this.createGraph = false;

  let route;
  if (this.reportId === 1)  {
    route = "/ministry/general-report/";
    this.settings = this.reportSchema.genReportSchema;
  }
  else if (this.reportId === 2)  {
    route = "/ministry/report-completeness/";
    this.settings = this.reportSchema.reportCompletenessSchema;
  }
  else if (this.reportId === 3)  {
    route = "/ministry/report-all-stat/";
    this.settings = this.reportSchema.reportAllStatSchema;
  }

 let regSel = 0, admSel = 0, schSel = 0;
 if (this.enableRegionFilter) {
   //if (regionSel.value != 0)
    //regSel = regionSel.value;
   regSel = this.regionSelected;
   admSel = this.adminAreaSelected;
   schSel = this.schSelected;
 }

 let clSel = 0, secSel = 0, courSel = 0;
 if (this.enableCourseFilter) {
   clSel = this.classSelected;
   secSel = this.sectorSelected;
   courSel = this.courseSelected;
 }

 if (this.userLoggedIn == PDE_ROLE) {
    regSel = this.regionSelected;
    console.log("Nikos2..");
    console.log(regSel);
  }
 else if (this.userLoggedIn == DIDE_ROLE)
    admSel = this.adminAreaSelected;

  this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, regSel, admSel, schSel, clSel, secSel, courSel).subscribe(data => {
      this.generalReport$.next(data);
      this.data = data;

      //console.log("Debugging..");
      //whehever you find column "num" cast it to number value in order to be ordered properly
      for (let i=0;i<this.data.length;i++)  {
        this.data[i].num = Number(data[i].num);
        this.data[i].percentage = Number(data[i].percentage);

        this.data[i].percTotal = Number(data[i].percTotal);
        this.data[i].percA = Number(data[i].percA);
        this.data[i].percB = Number(data[i].percB);
        this.data[i].percC = Number(data[i].percC);
      }
  },
    error => {
      this.generalReport$.next([{}]);
      console.log("Error Getting generalReport");
    },
    () => {
      console.log("Success Getting generalReport");
      this.validCreator = 1;
      this.source = new LocalDataSource(this.data);
      this.columnMap = new Map<string,TableColumn>();

      //pass parametes to csv class object
      this.csvObj.columnMap = this.columnMap;
      this.csvObj.source = this.source;
      this.csvObj.settings = this.settings;
      //this.prepareColumnMap();
      this.csvObj.prepareColumnMap();
    }
  )

}

navigateBack()  {
  this.router.navigate(['/ministry/minister-reports']);
}

showFilters() {

    this.RegionSelectionsSub = this._hds.getRegions(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
        this.RegionSelections$.next(data);
    },
        error => {
            this.RegionSelections$.next([{}]);
            console.log("Error Getting RegionSelections");
        },
        () => console.log("Success Getting RegionSelectionsSub"));

}

toggleRegionFilter()  {

  this.enableRegionFilter = !this.enableRegionFilter;

}

toggleCourseFilter()  {

  this.enableCourseFilter = !this.enableCourseFilter;
}

checkregion(regionId) {

    if (typeof regionId.value != "undefined")
      this.regionSelected = regionId.value;
    this.adminAreaSelected = 0;
    this.schSelected = 0;

    //if (regionId.value != 0)  {

    this.AdminAreaSelectionsSub = this._hds.getAdminAreas(this.minedu_userName, this.minedu_userPassword, this.regionSelected).subscribe(data => {
        this.AdminAreaSelections$.next(data);
    },
        error => {
            this.AdminAreaSelections$.next([{}]);
            console.log("Error Getting AdminAreaSelections");
        },
        () => {
          console.log("Success Getting AdminAreaSelectionsSub");
          this.showAdminList.next(true);
        }
      );

      this.SchoolSelectionsSub = this._hds.getSchoolsPerRegion(this.minedu_userName, this.minedu_userPassword, this.regionSelected).subscribe(data => {
          this.SchoolSelections$.next(data);
      },
          error => {
              this.SchoolSelections$.next([{}]);
              console.log("Error Getting SchoolSelections");
          },
          () => {
            console.log("Success Getting SchoolSelectionsSub");
            this.showAdminList.next(true);
          }

        );

      //} //end if

  }

  checkadminarea(adminId) {

    this.schSelected = 0;

    console.log("TI EINAI;")
    console.log(adminId);

    if (typeof adminId.value != "undefined")
      this.adminAreaSelected = adminId.value;
    this.SchoolSelectionsSub = this._hds.getSchoolsPerAdminArea(this.minedu_userName, this.minedu_userPassword, this.adminAreaSelected).subscribe(data => {
        this.SchoolSelections$.next(data);
    },
        error => {
            this.SchoolSelections$.next([{}]);
            console.log("Error Getting SchoolSelections");
        },
        () => {
          console.log("Success Getting SchoolSelectionsSub");
          this.showAdminList.next(true);
        }

      );
  }

  checkschool(schId) {

      this.schSelected = schId.value;

  }

  checkclass(classId) {

    this.classSelected = classId.value;
    this.sectorSelected = 0;
    this.courseSelected = 0;

    console.log("What?");
    console.log(this.classSelected);

    if (this.classSelected == 2 || this.classSelected == 3 || this.classSelected == 4)  {
      this.SectorSelectionsSub = this._hds.getSectors(this.minedu_userName, this.minedu_userPassword, this.classSelected).subscribe(data => {
          this.SectorSelections$.next(data);
      },
          error => {
              this.SectorSelections$.next([{}]);
              console.log("Error Getting SectorSelections");
          },
          () => {
            console.log("Success Getting SectorSelections");
            this.showSectorList.next(true);
          }
        );
    } //end if


  }

  checksector(sectorId) {

    this.courseSelected = 0;
    this.sectorSelected = sectorId.value;

    this.CourseSelectionsSub = this._hds.getCourses(this.minedu_userName, this.minedu_userPassword, this.sectorSelected).subscribe(data => {
          this.CourseSelections$.next(data);
      },
          error => {
              this.CourseSelections$.next([{}]);
              console.log("Error Getting CourseSelections");
          },
          () => {
            console.log("Success Getting CourseSelections");
            this.showCourseList.next(true);
          }

      );


  }

  checkcourse(courseId) {

      this.courseSelected = courseId.value;

  }



  onSearch(query: string = '') {

    this.csvObj.onSearch(query);
  }

  export2Csv()  {

    this.csvObj.export2Csv();

  }


createDiagram() {
  if (!this.createGraph)  {
    this.generateGraphData();
    this.chartObj.d3data = this.d3data;
    this.chartObj.chartContainer = this.chartContainer;
    this.chartObj.createChart();
    this.chartObj.updateChart();
    this.createGraph = true;
  }
}

generateGraphData() {

   this.d3data = [];

   if (this.reportId === 2)  {
     let labelsX = [];
     labelsX.push("Σχολείο");
     labelsX.push("Α\' τάξη");
     labelsX.push("Β\' τάξη");
     labelsX.push("Γ\' τάξη");
     labelsX.push("Δ\' τάξη");

     this.d3data.push([
       labelsX[0],
       this.data[0].percTotal,
     ]);
     this.d3data.push([
       labelsX[1],
       this.data[0].percA,
     ]);
     this.d3data.push([
       labelsX[2],
       this.data[0].percB,
     ]);
     this.d3data.push([
       labelsX[3],
       this.data[0].percC,
     ]);
     this.d3data.push([
       labelsX[4],
       this.data[0].percD,
     ]);

   }

   /*
   else if (this.reportId === 3) {

     let labelsX = [];
     labelsX.push("1η Προτίμηση");
     labelsX.push("2η Προτίμηση");
     labelsX.push("3η Προτίμηση");
     labelsX.push("Μη τοποθετημένοι");
     console.log("Length:");
     console.log(this.data.length);
     for (let i = 0; i < this.data.length   ; i++) {
       this.d3data.push([
         //labelsX[i-1],
         this.data[i].section,
         this.data[i].percentage,
       ]);
    // }


   }


  }
  */




 }






}
