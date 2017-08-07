import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { API_ENDPOINT } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { ILoginInfoRecords } from "../../store/logininfo/logininfo.types";
import { IAppState } from "../../store/store";
import { CsvCreator } from "./csv-creator";
import { ReportsSchema, TableColumn } from "./reports-schema";

@Component({
    selector: "report-users",
    template: `

    <div class="reports-container">
        <div class = "loading" *ngIf="validCreator == 0"></div>

        <h5>Αριθμός Αιτήσεων / Εγγεγραμμένων Χρηστών</h5>
        <h6>Επιλογή Φίλτρων: Δεν υπάρχουν διαθέσιμα φίλτρα</h6>

        <button type="submit" class="btn btn-alert" (click)="createReport()" [hidden]="minedu_userName == ''"><i class="fa fa-file-text"></i> Δημιουργία Αναφοράς</button>
        <button type="submit" class="btn btn-alert pull-right"  (click)="navigateBack()" [hidden]="minedu_userName == ''" >Επιστροφή</button>

        <div *ngIf="validCreator == 1 ">
          <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch(search.value)">
          <div class="smart-table-container table table-hover table-striped" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>

        <button type="button" class="alert alert-info pull-right" (click)="export2Csv()" [hidden]="validCreator != 1">
        <i class="fa fa-download"></i> Εξαγωγή σε csv</button>
    </div>
   `
})

@Injectable() export default class ReportUsers implements OnInit, OnDestroy {

    loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data;
    private validCreator: number;
    private routerSub: any;

    private source: LocalDataSource;
    columnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
    @Input() settings: any;
    private reportSchema = new ReportsSchema();
    private csvObj = new CsvCreator();

    constructor(
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.generalReport$ = new BehaviorSubject([{}]);
        this.minedu_userName = "";
        this.validCreator = -1;
    }

    ngOnInit() {

        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoObj) => {
                        this.minedu_userName = loginInfoObj.minedu_username;
                        this.minedu_userPassword = loginInfoObj.minedu_userpassword;
                        return loginInfoObj;
                    }, {});
                }
                this.loginInfo$.next(loginInfo);
            }, error => console.log("error selecting loginInfo"));
    }

    ngOnDestroy() {
        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
        if (this.generalReportSub)
            this.generalReportSub.unsubscribe();
    }

    createReport() {
        this.validCreator = 0;
        let route = "/ministry/report-users/";
        this.settings = this.reportSchema.ReportUsersSchema;

        this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, 0, 0, 0, 0, 0, 0, 0)
            .subscribe(data => {
                this.generalReport$.next(data);
                this.data = data;
                this.validCreator = 1;
                this.source = new LocalDataSource(this.data);
                this.columnMap = new Map<string, TableColumn>();

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
        this.router.navigate(["/ministry/minister-reports"]);
    }

    onSearch(query: string = "") {
        this.csvObj.onSearch(query);
    }

    export2Csv() {
        this.csvObj.export2Csv();
    }

}
