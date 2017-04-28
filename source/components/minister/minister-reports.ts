import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input} from "@angular/core";
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

//import * as _ from '..';



/*
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,

} from '@angular/forms';
*/

import { API_ENDPOINT } from '../../app.settings';

/*
class TableColumn {
  field: string;
  title: string;
  type: string;
  isDisplay: boolean;
  isExport: boolean;
  valuePrepareFunction: Function;
}
*/

@Component({
    selector: 'minister-reports',
    template: `

  <div>
      <!--<form [formGroup]="formGroup"  #form>-->


        <div
          class = "loading" *ngIf="!validCreator && reportId" >
        </div>

        <button type="submit" class="btn btn-default btn-block"  (click)="createReport('/ministry/general-report/')" [hidden]="minedu_userName == ''" >
            Συγκεντρωτικά Αποτελέσματα Κατανομής
        </button>
        <button type="submit" class="btn btn-default btn-block"  (click)="createReport('/ministry/report-completeness/')" [hidden]="minedu_userName == ''" >
            Κατανομή Μαθητών ανά Σχολείο
        </button>

          <!--<div *ngFor="let generalReports$  of generalReport$ | async; let i=index">-->
        <div *ngIf="validCreator ">
          <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch(search.value)">
          <div class="smart-table-container" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>


        <!--
        <div *ngIf="validCreator  && reportId == 2">
          <div class="smart-table-container" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>-->

        <button type="submit" class="alert alert-info" (click)="export2Csv()" [hidden]="!validCreator" >
            Εξαγωγή σε csv
        </button>

      <!--</form>-->
    </div>

   `
})

@Injectable() export default class MinisterReports implements OnInit, OnDestroy {

    //public formGroup: FormGroup;
    loginInfo$: BehaviorSubject<ILoginInfo>;
    loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    //private data: string;
    private data;
    private validCreator: boolean;
    private reportId: number;
    private source: LocalDataSource;

    columnMap: Map<string,TableColumn> = new Map<string,TableColumn>();
    @Input() settings: any;
    private reportSchema = new  reportsSchema();

    /*
    genReportSchema = {
      actions: false,
      columns: {
        name: {
          title: 'Κατηγορία',
          filter: false
        },
        numStudents: {
          title: 'Αριθμός',
          filter: false
        }
      }
    };


    report1Schema = {
      actions: false,
      columns: {
        schoolName: {
          title: 'Σχολείο',
          filter: false
        },
        numStudents: {
          title: 'Αριθμός',
          filter: false
        },
        capacityTotal: {
          title: 'Χωρ/τα',
          filter: false
        },
        percTotal: {
          title: 'Πληρότητα',
          filter: false
        },
        numStudentsA: {
          title: 'Α Τάξη',
          filter: false
        },
        capacityA: {
          title: 'Χωρ/τα',
          filter: false
        },
        percA: {
          title: 'Πληρότητα',
          filter: false
        },
        numStudentsB: {
          title: 'Β Τάξη',
          filter: false
        },
        capacityB: {
          title: 'Χωρ/τα',
          filter: false
        },
        percB: {
          title: 'Πληρότητα',
          filter: false
        },
        numStudentsC: {
          title: 'Γ Τάξη',
          filter: false
        },
        capacityC: {
          title: 'Χωρ/τα',
          filter: false
        },
        percC: {
          title: 'Πληρότητα',
          filter: false
        },
      }


    };
    */


    constructor(/*private fb: FormBuilder,*/
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

          //this.formGroup = this.fb.group({

          //});

          this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
          this.generalReport$ = new BehaviorSubject([{}]);
          this.minedu_userName = '';
          this.validCreator = false;
          this.reportId = 0;
          //this.source = new LocalDataSource(this.data);

    }

    ngOnDestroy() {

      if (this.loginInfoSub)
        this.loginInfoSub.unsubscribe();
      this.loginInfo$.unsubscribe();

      if (this.generalReportSub)
          this.generalReportSub.unsubscribe();
      this.generalReport$.unsubscribe();

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

    }


createReport(routePath) {

  this.validCreator = false;
  if (routePath === "/ministry/general-report/")  {
    this.reportId = 1;
    //this.settings = this.genReportSchema;
    this.settings = this.reportSchema.genReportSchema;
  }
  else if (routePath === "/ministry/report-completeness/")  {
    this.reportId = 2;
    //this.settings = this.report1Schema;
      this.settings = this.reportSchema.reportCompletenessSchema;
  }

  this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, routePath).subscribe(data => {
      this.generalReport$.next(data);
      this.data = data;
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
      this.prepareColumnMap();
    }
  )

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

/*
private doFilterLocal(): void {

  this.easyqService.getData({
    table: this.table,
    filter: '((date >="' + this.from + '") and (date <="' + this.to + '"))',
    order: 'date desc'
  }).subscribe((rows) => {
    this.dataSource.load(rows);
    this.msgs.push({severity: 'info', summary: '刷新成功', detail: ''});
  });
}
*/



}
