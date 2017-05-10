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
import {csvCreator} from './csv-creator';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';

//import * as d3 from 'd3';
//import * as _ from '..

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'report-all-stat',
    //encapsulation: ViewEncapsulation.None,
    template: `

  <div>

        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <form [formGroup]="formGroup"  #form>

          <h5> >Επιλογή Φίλτρων <br><br></h5>

          <div class="form-group">
                <label>Περιφερειακή Διεύθυνση</label>
                <select #regsel class="form-control" (change)="checkregion(regsel)" formControlName="region">
                  <option *ngFor="let RegionSelection$  of RegionSelections$ | async; let i=index"  [value] = "RegionSelection$.id"> {{RegionSelection$.name}} </option>
                </select>
          </div>
          <div class="form-group">
                <label *ngIf="showAdminList | async">Διεύθυνση Εκπαίδευσης</label>
                <select #admsel class="form-control"  *ngIf="showAdminList | async"  (change)="checkadminarea(admsel)" formControlName="adminarea">
                  <option *ngFor="let AdminAreaSelection$  of AdminAreaSelections$ | async; let i=index" [value] = "AdminAreaSelection$.id"> {{AdminAreaSelection$.name}}</option>
                </select>
          </div>
          <div class="form-group">
                <label *ngIf="showAdminList | async">Σχολείο</label>
                <select #schsel class="form-control"  *ngIf="showAdminList | async"  (change)="checkschool(schsel)" formControlName="schoollist">
                  <option *ngFor="let SchoolSelection$  of SchoolSelections$ | async; let i=index" [value] = "SchoolSelection$.epal_id"> {{SchoolSelection$.epal_name}} </option>
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
    private generalReportSub: Subscription;
    private RegionSelectionsSub: Subscription;
    private AdminAreaSelectionsSub: Subscription;
    private SchoolSelectionsSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data;
    private validCreator: number;
    //private createGraph: boolean;
    private reportId: number;
    private source: LocalDataSource;
    private showAdminList: BehaviorSubject<boolean>;
    private adminAreaSelected: number;
    private schSelected: number;

    columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
    @Input() settings: any;
    private reportSchema = new  reportsSchema();

    //csvObj:csvCreator ;
    private csvObj = new csvCreator();

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
          });

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          this.generalReport$ = new BehaviorSubject([{}]);
          this.RegionSelections$ = new BehaviorSubject([{}]);
          this.AdminAreaSelections$ = new BehaviorSubject([{}]);
          this.SchoolSelections$ = new BehaviorSubject([{}]);
          this.minedu_userName = '';
          this.validCreator = -1;
          //this.createGraph = false;
          //this.reportId = 0;
          this.showAdminList = new BehaviorSubject(false);
          this.adminAreaSelected = 0;
          this.schSelected = 0;
          //this.source = new LocalDataSource(this.data);




    }

    ngOnInit() {

      this.loginInfoSub = this._ngRedux.select(state => {
          if (state.loginInfo.size > 0) {
              state.loginInfo.reduce(({}, loginInfoToken) => {
                this.minedu_userName = loginInfoToken.minedu_username;
                this.minedu_userPassword = loginInfoToken.minedu_userpassword;
                  return loginInfoToken;
              }, {});
          }
          return state.loginInfo;
      }).subscribe(this.loginInfo$);

      this.routerSub = this.activatedRoute.params.subscribe(params => {
       this.reportId = +params['reportId'];
       console.log("Hello");
       console.log(this.reportId);
     });


      this.showFilters();

      //this.csvObj = new csvCreator();

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
      if (this.showAdminList)
          this.showAdminList.unsubscribe();

    }


createReport(regionSel) {

  this.validCreator = 0;

  //console.log("Testing1..");
  //console.log(this.reportId);

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
  //console.log("Testing2..");
  //console.log(route);

 let regSel = 0;
 if (regionSel.value != 0)
  regSel = regionSel.value;

  //this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, routePath, regSel, this.adminAreaSelected, this.schSelected).subscribe(data => {
  this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, regSel, this.adminAreaSelected, this.schSelected).subscribe(data => {
      this.generalReport$.next(data);
      this.data = data;
      //console.log("Let see..");
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

checkregion(regionId) {

    this.adminAreaSelected = 0;
    this.schSelected = 0;

    this.AdminAreaSelectionsSub = this._hds.getAdminAreas(this.minedu_userName, this.minedu_userPassword, regionId.value).subscribe(data => {
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

      this.SchoolSelectionsSub = this._hds.getSchoolsPerRegion(this.minedu_userName, this.minedu_userPassword, regionId.value).subscribe(data => {
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

  checkadminarea(adminId) {

    this.schSelected = 0;

    console.log("TI EINAI;")
    console.log(adminId);
    console.log(adminId.value);

    this.adminAreaSelected = adminId.value;
    this.SchoolSelectionsSub = this._hds.getSchoolsPerAdminArea(this.minedu_userName, this.minedu_userPassword, adminId.value).subscribe(data => {
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



onSearch(query: string = '') {

  this.csvObj.onSearch(query);
}

export2Csv()  {

  this.csvObj.export2Csv();

}


/*
export2Csv(): void {

  const columns: TableColumn[] = Array.from(this.columnMap.values());

  let encodedStr = columns.reduce((acct, current: TableColumn) => {

    if (current.isExport != false) {
      return acct += '"' + current.title + '",';
    }
    else {
      return acct;
    }
  }, '');
  encodedStr = encodedStr.slice(0, -1);
  encodedStr += '\r\n';

  let fields: string[] = columns.reduce((acct, column: TableColumn) => {

    if (column.isExport != false) {
      acct.push(column.field);
    }
    return acct;
  }, []);

  this.source.getAll().then((rows) => {

    rows.forEach((row) => {
      fields.forEach((field) => {
        if (row.hasOwnProperty(field)) {
          let value = row[field];

          if (!value) {
            value = "";
          }
          let valuePrepare = this.columnMap.get(field).valuePrepareFunction;
          if (valuePrepare) {
            value = valuePrepare.call(null, value, row);
          }
          encodedStr += '"' + value + '",'
        }
      });
      encodedStr = encodedStr.slice(0, -1);
      encodedStr += '\r\n';
    });

    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    //Set utf-8 header to let excel recognize its encoding
    let blob = new Blob(["\ufeff", encodedStr], {type: 'text/csv'});
    a.href = window.URL.createObjectURL(blob);
    a.download = (this.settings.fileName || 'epalSystemReport') + "all_stat" +  '.csv';
    a.click();
  });
}


prepareColumnMap(): void {

  for (const key in this.settings.columns) {

    if (!this.settings.columns.hasOwnProperty(key)) {
      continue;
    }

    const title: string = this.settings.columns[key]['title'];
    let column: TableColumn = new TableColumn();
    column.type = this.settings.columns[key]['type'];
    column.title = this.settings.columns[key]['title'];
    column.field = key;
    column.isDisplay = this.settings.columns[key]['isDisplay'];
    column.isExport = this.settings.columns[key]['isExport'];
    column.valuePrepareFunction = this.settings.columns[key]['valuePrepareFunction'];
    this.columnMap.set(column.field, column);

    if (this.settings.columns[key].isDisplay == false) {
      delete this.settings.columns[key];
    }
  }
}
*/








}
