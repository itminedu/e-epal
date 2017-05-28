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
    selector: 'report-general',
    template: `

  <div>
        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <form [formGroup]="formGroup"  #form>

          <h5> >Επιλογή Φίλτρων <br><br></h5>
          <h6> Δεν υπάρχουν διαθέσιμα φίλτρα <br><br><br></h6>

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
        <button type="button" class="alert alert-info pull-left" (click)="createDiagram()" [hidden]="validCreator != 1 ">
        <i class="fa fa-bar-chart"></i>
            Διάγραμμα
        </button>

        <div class="d3-chart" *ngIf = "validCreator == 1" #chart>
        </div>
        <br><br><br><br><br>

    </div>

   `
})

@Injectable() export default class ReportGeneral implements OnInit, OnDestroy {

    public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data;
    private validCreator: number;
    private createGraph: boolean;
    private reportId: number;
    private routerSub: any;

    private source: LocalDataSource;
    columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
    @Input() settings: any;
    private reportSchema = new  reportsSchema();
    private csvObj = new csvCreator();

    private chartObj = new chartCreator();
    @ViewChild('chart') public chartContainer: ElementRef;
    private d3data: Array<any>;


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
          this.minedu_userName = '';
          this.validCreator = -1;
          this.createGraph = false;

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

     });

    }

    ngOnDestroy() {

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      if (this.generalReportSub)
          this.generalReportSub.unsubscribe();
          if (this.loginInfo$)
            this.loginInfo$.unsubscribe();
          if (this.generalReport$)
              this.generalReport$.unsubscribe();

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

 let regSel = 0;

 this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, 0, 0, 0, 0, 0,0).subscribe(data => {
      this.generalReport$.next(data);
      this.data = data;
  },
    error => {
      this.generalReport$.next([{}]);
      this.validCreator = -1;
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
      this.csvObj.prepareColumnMap();
    }
  )

}

navigateBack()  {
  this.router.navigate(['/ministry/minister-reports']);
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

   if (this.reportId === 1)  {
     let labelsX = [];
     labelsX.push("1η Προτίμηση");
     labelsX.push("2η Προτίμηση");
     labelsX.push("3η Προτίμηση");
     labelsX.push("Μη τοποθετημένοι");
     for (let i = 1; i <=  4; i++) {
       this.d3data.push([
         labelsX[i-1],
         this.data[i].numStudents /   this.data[0].numStudents,
       ]);
     }
   }
 }











}
