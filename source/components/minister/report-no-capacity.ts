import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { HelperDataService } from "../../services/helper-data-service";
import { Observable} from "rxjs/Observable";
import { Http, Headers, RequestOptions} from "@angular/http";
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "../../store/store";
import { Router, ActivatedRoute, Params} from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";
import { ILoginInfo } from "../../store/logininfo/logininfo.types";
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";
import {ReportsSchema, TableColumn} from "./reports-schema";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import {CsvCreator} from "./csv-creator";
import {ChartCreator} from "./chart-creator";

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from "@angular/forms";


import { API_ENDPOINT } from "../../app.settings";

@Component({
    selector: "report-no-capacity",
    template: `

  <div>
        <div
          class = "loading" *ngIf="validCreator == 0" >
        </div>

        <form [formGroup]="formGroup"  #form>
          <h5> >Επιλογή Φίλτρων <br><br></h5>
          <div class="row">
            <div class="col-md-1 ">
              <input type="checkbox" formControlName="capacityEnabled"
              (click)="toggleCapacityFilter()" >
            </div>
            <div class="col-md-9">
              <label for="capacityEnabled"><i>Εμφάνιση ΚΑΙ των σχολείων που έχουν καθορίσει χωρητικότητα</i></label>
            </div>
          </div>
          <br><br>

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

    </div>

   `
})

@Injectable() export default class ReportNoCapacity implements OnInit, OnDestroy {

    private formGroup: FormGroup;
    private loginInfo$: BehaviorSubject<ILoginInfo>;
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
            .map(loginInfo => <ILoginInfo>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoToken) => {
                        this.minedu_userName = loginInfoToken.minedu_username;
                        this.minedu_userPassword = loginInfoToken.minedu_userpassword;
                        return loginInfoToken;
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
