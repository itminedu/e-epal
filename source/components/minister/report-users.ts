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

import { API_ENDPOINT } from '../../app.settings';

@Component({
    selector: 'report-users',
    template: `

  <div>
        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <h5> >Επιλογή Φίλτρων <br><br></h5>
        <h6> Δεν υπάρχουν διαθέσιμα φίλτρα <br><br><br></h6>

        <button type="submit" class="btn btn-alert"  (click)="createReport()" [hidden]="minedu_userName == ''" >
        <i class="fa fa-file-text"></i>
            Δημιουργία Αναφοράς
        </button>
        <button type="submit" class="btn btn-alert pull-right"  (click)="navigateBack()" [hidden]="minedu_userName == ''" >
            Επιστροφή
        </button>
        <br><br>

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

@Injectable() export default class ReportUsers implements OnInit, OnDestroy {

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
    //private reportId: number;
    private routerSub: any;

    private source: LocalDataSource;
    columnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
    @Input() settings: any;
    private reportSchema = new reportsSchema();
    private csvObj = new csvCreator();


    constructor(private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.generalReport$ = new BehaviorSubject([{}]);
        this.minedu_userName = '';
        this.validCreator = -1;

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


    createReport() {

        this.validCreator = 0;

        let route;
        route = "/ministry/report-users/";
        this.settings = this.reportSchema.ReportUsersSchema;

        this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, 0, 0, 0, 0, 0, 0, 0).subscribe(data => {
            this.generalReport$.next(data);
            this.data = data;
            this.validCreator = 1;
            this.source = new LocalDataSource(this.data);
            this.columnMap = new Map<string, TableColumn>();

            //pass parametes to csv class object
            this.csvObj.columnMap = this.columnMap;
            this.csvObj.source = this.source;
            this.csvObj.settings = this.settings;
            this.csvObj.prepareColumnMap();
        },
            error => {
                this.generalReport$.next([{}]);
                this.validCreator = -1;
                console.log("Error Getting ReportUsers");
            });

    }

    navigateBack() {
        this.router.navigate(['/ministry/minister-reports']);
    }


    onSearch(query: string = '') {

        this.csvObj.onSearch(query);
    }


    export2Csv() {

        this.csvObj.export2Csv();

    }

}
