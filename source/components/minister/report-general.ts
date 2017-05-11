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

import * as d3 from 'd3';

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'report-general',
    //encapsulation: VciewEncapsulation.None,
    template: `

  <div>

        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <form [formGroup]="formGroup"  #form>

          <h5> >Επιλογή Φίλτρων <br><br></h5>
          <h6> Δεν υπάρχουν διαθέσιμα φίλτρα <br><br><br></h6>

          <!--
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
          -->

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
          <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch_class(search.value)">
          <div class="smart-table-container" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>

        <button type="button" class="alert alert-info pull-right" (click)="export2Csv_class()" [hidden]="validCreator != 1">
        <i class="fa fa-download"></i>
            <br>Εξαγωγή σε csv
        </button>
        <button type="button" class="alert alert-info pull-left" (click)="createDiagram()" [hidden]="validCreator != 1 ">
        <i class="fa fa-bar-chart"></i>
            Διάγραμμα
        </button>

        <div class="d3-chart" *ngIf = "validCreator == 1" #chart>
        </div>

    </div>

   `
})

@Injectable() export default class ReportGeneral implements OnInit, OnDestroy {

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
    private createGraph: boolean;
    private reportId: number;
    private source: LocalDataSource;
    private showAdminList: BehaviorSubject<boolean>;
    private adminAreaSelected: number;
    private schSelected: number;

    columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
    @Input() settings: any;
    private reportSchema = new  reportsSchema();

    private csvObj = new csvCreator();
    private routerSub: any;

    private chartObj = new chartCreator();

    //d3 test
    @ViewChild('chart') public chartContainer: ElementRef;
    //@Input() private d3data: Array<any>;
    private d3data: Array<any>;
    private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
    private chart: any;
    private width: number;
    private height: number;
    private xScale: any;
    private yScale: any;
    private colors: any;
    private xAxis: any;
    private yAxis: any;

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
          this.createGraph = false;
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

      //this.showFilters();

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
  this.createGraph = false;
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
 //if (regionSel.value != 0)
  //regSel = regionSel.value;

  //this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, routePath, regSel, this.adminAreaSelected, this.schSelected).subscribe(data => {
  this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, regSel, this.adminAreaSelected, this.schSelected).subscribe(data => {
      this.generalReport$.next(data);
      this.data = data;
      //console.log("Let see..");
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

    this.source.setFilter([
      // fields we want to include in the search
      {
        field: 'name',
        search: query
      }
    ], false);


  // second parameter specifying whether to perform 'AND' or 'OR' search
  // (meaning all columns should contain search query or at least one)
  // 'AND' by default, so changing to 'OR' by setting false here
}

onSearch_class(query: string = '') {

  this.csvObj.onSearch(query);
}

export2Csv_class()  {

  this.csvObj.export2Csv();

}


createDiagram() {
  if (!this.createGraph)  {
    this.generateGraphData();
    this.chartObj.d3data = this.d3data;
    this.chartObj.chartContainer = this.chartContainer;
    //this.createChart();
    //this.updateChart();
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
     //for (let i = 0; i <  this.data.length; i++) {
     for (let i = 1; i <=  4; i++) {
       this.d3data.push([
         //this.data[i].name,
         labelsX[i-1],
         this.data[i].numStudents /   this.data[0].numStudents,
       ]);
     }
   }
 }

createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area

    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    // define X & Y domains
    let xDomain = this.d3data.map(d => d[0]);
    let yDomain = [0, d3.max(this.d3data, d => d[1])];
    //let yDomain = [0, 1000];

    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);
    //this.yScale = d3.scaleLinear().domain(yDomain).range([1000, 0]);

    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.d3data.length]).range(<any[]>['red', 'blue']);


    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));

    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));

  }

  updateChart() {
   // update scales & axis
   this.xScale.domain(this.d3data.map(d => d[0]));
   this.yScale.domain([0, d3.max(this.d3data, d => d[1])]);
   this.colors.domain([0, this.d3data.length]);
   this.xAxis.transition().call(d3.axisBottom(this.xScale));
   this.yAxis.transition().call(d3.axisLeft(this.yScale));

   let update = this.chart.selectAll('.bar')
     .data(this.d3data);

   // remove exiting bars
   update.exit().remove();

   // update existing bars
   this.chart.selectAll('.bar').transition()
     .attr('x', d => this.xScale(d[0]))
     .attr('y', d => this.yScale(d[1]))
     .attr('width', d => this.xScale.bandwidth())
     .attr('height', d => this.height - this.yScale(d[1]))
     .style('fill', (d, i) => this.colors(i));

   // add new bars
   update
     .enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('x', d => this.xScale(d[0]))
     .attr('y', d => this.yScale(0))
     .attr('width', this.xScale.bandwidth())
     .attr('height', 0)
     .style('fill', (d, i) => this.colors(i))
     .transition()
     .delay((d, i) => i * 10)
     .attr('y', d => this.yScale(d[1]))
     .attr('height', d => this.height - this.yScale(d[1]));
 }









}
