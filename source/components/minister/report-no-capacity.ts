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
    selector: "report-no-capacity",
    template: `

    <div class="reports-container">
        <div class = "loading" *ngIf="validCreator == 0" ></div>

        <form [formGroup]="formGroup"  #form>
            <h5>Σχολικές μονάδες που δεν έχουν δηλώσει Χωρητικότητα τμημάτων</h5>
            <h6>Επιλογή Φίλτρων</h6>
            <div class="row">
                <div class="col-md-1"><input type="checkbox" formControlName="capacityEnabled" (click)="toggleCapacityFilter()" ></div>
                <div class="col-md-9"><label for="capacityEnabled"><i>Εμφάνιση ΚΑΙ των σχολείων που έχουν καθορίσει χωρητικότητα</i></label></div>
            </div>

            <button type="submit" class="btn btn-alert"  (click)="createReport()" [hidden]="minedu_userName == ''" ><i class="fa fa-file-text"></i> Δημιουργία Αναφοράς</button>
            <button type="submit" class="btn btn-alert pull-right"  (click)="navigateBack()" [hidden]="minedu_userName == ''" > Επιστροφή</button>
        </form>

        <div *ngIf="validCreator == 1 ">
          <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch(search.value)">
          <div class="smart-table-container table table-hover table-striped" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
          </div>
        </div>

        <button type="button" class="alert alert-info pull-right" (click)="export2Csv()" [hidden]="validCreator != 1"><i class="fa fa-download"></i> Εξαγωγή σε csv</button>
    </div>
   `
})

@Injectable() export default class ReportNoCapacity implements OnInit, OnDestroy {

    private formGroup: FormGroup;
    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data;
    private validCreator: number;
    private reportId: number;
    private routerSub: any;
    private enableCapacityFilter: boolean;

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
            capacityEnabled: ["", []],
        });

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.generalReport$ = new BehaviorSubject([{}]);
        this.minedu_userName = "";
        this.validCreator = -1;
        this.enableCapacityFilter = false;

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

        this.routerSub = this.activatedRoute.params.subscribe(params => {
            this.reportId = +params["reportId"];

        });

    }

    ngOnDestroy() {

        if (this.loginInfoSub)
            this.loginInfoSub.unsubscribe();
        if (this.generalReportSub)
            this.generalReportSub.unsubscribe();
    }

    createReport() {
        this.validCreator = 0;

        let route;
        if (this.reportId === 4) {
            route = "/ministry/report-no-capacity/";
            this.settings = this.reportSchema.reportNoCapacity;
        }
        else {
            return;
        }

        this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, this.enableCapacityFilter, 0, 0, 0, 0, 0, 0).subscribe(data => {
            this.generalReport$.next(data);
            this.data = data;
            this.validCreator = 1;
            this.source = new LocalDataSource(this.data);
            this.columnMap = new Map<string, TableColumn>();

            // pass parametes to csv class object
            this.csvObj.columnMap = this.columnMap;
            this.csvObj.source = this.source;
            this.csvObj.settings = this.settings;
            this.csvObj.prepareColumnMap();
        },
            error => {
                this.generalReport$.next([{}]);
                this.validCreator = -1;
                console.log("Error Getting ReportNoCapacity");
            });

    }

    toggleCapacityFilter() {
        this.enableCapacityFilter = !this.enableCapacityFilter;
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
