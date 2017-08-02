import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { API_ENDPOINT } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { ILoginInfoRecords } from "../../store/logininfo/logininfo.types";
import { IAppState } from "../../store/store";
import { ChartCreator } from "./chart-creator";
import { CsvCreator } from "./csv-creator";
import { ReportsSchema, TableColumn } from "./reports-schema";

@Component({
    selector: "report-general",
    template: `

  <div>
        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <form [formGroup]="formGroup"  #form>

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

    private formGroup: FormGroup;
    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data: any;
    private validCreator: number;
    private createGraph: boolean;

    private source: LocalDataSource;
    columnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
    @Input() settings: any;
    private reportSchema = new ReportsSchema();
    private csvObj = new CsvCreator();

    private chartObj = new ChartCreator();
    @ViewChild("chart") public chartContainer: ElementRef;
    private d3data: Array<any>;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.formGroup = this.fb.group({
            region: ["", []],
            adminarea: ["", []],
            schoollist: ["", []],
        });

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.generalReport$ = new BehaviorSubject([{}]);
        this.minedu_userName = "";
        this.validCreator = -1;
        this.createGraph = false;
    }

    ngOnInit() {
        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({ }, loginInfoObj) => {
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
        this.createGraph = false;

        let route = "/ministry/general-report/";
        this.settings = this.reportSchema.genReportSchema;

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
                console.log("Error Getting generalReport");
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


    createDiagram() {
        if (!this.createGraph) {
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

        let labelsX = [];
        labelsX.push("1η Προτίμηση");
        labelsX.push("2η Προτίμηση");
        labelsX.push("3η Προτίμηση");
        labelsX.push("Μη τοποθετημένοι");
        labelsX.push("Προσωρινά τοποθετημένοι σε ολιγομελή");
        for (let i = 1; i <= 5; i++) {
            this.d3data.push([
                labelsX[i - 1],
                this.data[i].numStudents / this.data[0].numStudents,
            ]);
        }
    }

}
