import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input, ViewEncapsulation } from "@angular/core";
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
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';

import {reportsSchema, TableColumn} from './reports-schema';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';

import * as d3 from 'd3';


//import * as _ from '..';

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'minister-reports',
    encapsulation: ViewEncapsulation.None,
    template: `

  <div>

        <!--
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
                  <option *ngFor="let AdminAreaSelection$  of AdminAreaSelections$ | async; let i=index" [value] = "AdminAreaSelection$.id"> {{AdminAreaSelection$.name}} {{AdminAreaSelection$.id}}</option>
                </select>
          </div>
          <div class="form-group">
                <label *ngIf="showAdminList | async">Σχολείο</label>
                <select #schsel class="form-control"  *ngIf="showAdminList | async"  (change)="checkschool(schsel)" formControlName="schoollist">
                  <option *ngFor="let SchoolSelection$  of SchoolSelections$ | async; let i=index" [value] = "SchoolSelection$.epal_id"> {{SchoolSelection$.epal_name}} </option>
                </select>
          </div>
          <button type="submit" class="btn btn-alert"  (click)="createReport(reportId, regsel)" [hidden]="minedu_userName == ''" >
          <i class="fa fa-file-text"></i>
              Δημιουργία Αναφοράς
          </button>
        </form>
        -->






        <h5><br> >Επιλογή Αναφοράς<br><br></h5>
        <!-- btn-block "btn btn-default  -->

        <div class="col-md-1">
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(1)" [hidden]="minedu_userName == ''" >
          <i class="fa fa-file-text"></i>
              Κατανομή Μαθητών με Βάση τη Σειρά Προτίμησης
          </button>
          <br><br>
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(2)" [hidden]="minedu_userName == ''" >
          <i class="fa fa-file-text"></i>
              Πληρότητα Σχολείων
          </button>
          <br><br>
          <button type="button" class="btn btn-alert"  (click)="nav_to_reportpath(3)" [hidden]="minedu_userName == ''" >
          <i class="fa fa-file-text"></i>
              Μαθητές ανά Τάξη/Τομέα/Ειδικότητα
          </button>
          <br><br>
        </div>

        <!--
        <div *ngIf="validCreator ">
          <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch(search.value)">
          <div class="smart-table-container" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>

        <button type="button" class="alert alert-info pull-right" (click)="export2Csv()" [hidden]="!validCreator">
        <i class="fa fa-download"></i>
            Εξαγωγή σε csv
        </button>
        <button type="button" class="alert alert-info pull-left" (click)="createDiagram()" [hidden]="!validCreator ||  charIsHidden() ">
        <i class="fa fa-bar-chart"></i>
            Διάγραμμα
        </button>
        -->

    </div>

    <!--
    <div class="d3-chart" *ngIf = "!charIsHidden() && validCreator" #chart>
    </div>
    -->



      <!--<div *ngFor="let generalReports$  of generalReport$ | async; let i=index">-->

   `
})

@Injectable() export default class MinisterReports implements OnInit, OnDestroy {

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
    private validCreator: boolean;
    private createGraph: boolean;
    private reportId: number;
    private source: LocalDataSource;
    private showAdminList: BehaviorSubject<boolean>;
    private adminAreaSelected: number;
    private schSelected: number;

    columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
    @Input() settings: any;
    private reportSchema = new  reportsSchema();

    //d3 test
    @ViewChild('chart') private chartContainer: ElementRef;
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
          this.validCreator = false;
          this.createGraph = false;
          this.reportId = 0;
          this.showAdminList = new BehaviorSubject(false);
          this.adminAreaSelected = 0;
          this.schSelected = 0;
          //this.showAdminList = false;
          //this.source = new LocalDataSource(this.data);

    }

    ngOnDestroy() {

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      //this.loginInfo$.unsubscribe();
      if (this.generalReportSub)
          this.generalReportSub.unsubscribe();
      //this.generalReport$.unsubscribe();
      if (this.RegionSelectionsSub)
          this.RegionSelectionsSub.unsubscribe();
      if (this.AdminAreaSelectionsSub)
          this.AdminAreaSelectionsSub.unsubscribe();
      if (this.SchoolSelectionsSub)
          this.SchoolSelectionsSub.unsubscribe();
      if (this.showAdminList)
          this.showAdminList.unsubscribe();

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

      this.showFilters();




      /*
      setTimeout(() => {
        this.generateData();
        // change the data periodically
        setInterval(() => this.generateData(), 3000);
      }, 1000);
      */

      //this.generateData();
      //this.createChart();
      //this.updateChart();

    }



nav_to_reportpath(repId) {
  this.reportId = repId;
  if (this.reportId == 1)
    this.router.navigate(['/ministry/report-general', this.reportId]);
  if (this.reportId == 2 || this.reportId == 3)
    this.router.navigate(['/ministry/report-all-stat', this.reportId]);

}


createReport(routePath, regionSel) {

  //this.reportId = 0;
  this.validCreator = false;
  this.createGraph = false;

  /*
  if (routePath === "/ministry/general-report/")  {
    this.reportId = 1;
    this.settings = this.reportSchema.genReportSchema;
  }
  else if (routePath === "/ministry/report-completeness/")  {
    this.reportId = 2;
    this.settings = this.reportSchema.reportCompletenessSchema;
  }
  else if (routePath === "/ministry/report-all-stat/")  {
    this.reportId = 3;
    this.settings = this.reportSchema.reportAllStatSchema;
  }
  */
  let route;
  if (routePath === 1)  {
    route = "/ministry/general-report/";
    this.settings = this.reportSchema.genReportSchema;
  }
  else if (routePath === 2)  {
    route = "/ministry/report-completeness/";
    this.settings = this.reportSchema.reportCompletenessSchema;
  }
  else if (routePath === 3)  {
    route = "/ministry/report-all-stat/";
    this.settings = this.reportSchema.reportAllStatSchema;
  }



 let regSel = 0;
 //let admSel = 0, schSel = 0;

 if (regionSel.value != 0)
  regSel = regionSel.value;

//For some reason, template #vars can not work..
 /*
 if (typeof adminSel !== 'undefined') {
  console.log("YES2");
  admSel = adminSel.value;
  console.log("YES3");
}
if (typeof schoolSel !== 'undefined')
  schSel = schoolSel.value;
*/


  //this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, routePath, regSel, this.adminAreaSelected, this.schSelected).subscribe(data => {
  this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, regSel, this.adminAreaSelected, this.schSelected).subscribe(data => {
      this.generalReport$.next(data);
      this.data = data;
      console.log("Let see..");
      //console.log(this.data);
      //console.log(this.data[0].name);
      //console.log(this.data.length);
  },
    error => {
      this.generalReport$.next([{}]);
      console.log("Error Getting generalReport");
    },
    () => {
      console.log("Getting generalReport");
      this.validCreator = true;
      this.source = new LocalDataSource(this.data);
      //this.source.load(this.data);
      //this.settings = _.merge(this.defaultSettings, this.report1Schema);
      //this.settings = this.report1Schema;
      this.columnMap = new Map<string,TableColumn>();
      //columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
      this.prepareColumnMap();

      //this.generateData2();
      //this.createChart();
      //this.updateChart();
    }
  )

}

  showFilters() {
    //this.reportId = 3;

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
    a.download = (this.settings.fileName || 'eplaSystemReport') + this.reportId +  '.csv';
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


createDiagram() {
  if (!this.createGraph)  {
    this.generateGraphData();
    this.createChart();
    this.updateChart();
    this.createGraph = true;
  }
}

/*
generateData() {
   this.d3data = [];
   for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
     this.d3data.push([
       `Index ${i}`,
       Math.floor(Math.random() * 100)
     ]);
   }
 }
 */

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

  charIsHidden() {
    if (this.reportId === 2 || this.reportId === 3)
      return true;
  }


}
