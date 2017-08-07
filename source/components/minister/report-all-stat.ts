import { NgRedux } from "@angular-redux/store";
import { Injectable } from "@angular/core";
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalDataSource } from "ng2-smart-table";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { API_ENDPOINT } from "../../app.settings";
import { DIDE_ROLE, PDE_ROLE } from "../../constants";
import { HelperDataService } from "../../services/helper-data-service";
import { LOGININFO_INITIAL_STATE } from "../../store/logininfo/logininfo.initial-state";
import { ILoginInfoRecords } from "../../store/logininfo/logininfo.types";
import { IAppState } from "../../store/store";
import { ChartCreator } from "./chart-creator";
import { CsvCreator } from "./csv-creator";
import { ReportsSchema, TableColumn } from "./reports-schema";

@Component({
    selector: "report-all-stat",
    template: `

    <div class="reports-container">
        <div class = "loading" *ngIf="validCreator === 0" ></div>

        <form [formGroup]="formGroup"  #form>
            <div [ngSwitch]="reportId">
                <h5 *ngSwitchCase="2">Συνολική Πληρότητα σχολικών μονάδων ΕΠΑΛ ανά τάξη</h5>
                <h5 *ngSwitchCase="3">Αριθμός Μαθητών και Πληρότητα σχολικών μονάδων ΕΠΑΛ</h5>
                <h5 *ngSwitchCase="5">Ολιγομελή τμήματα (Προσωρινά τοποθετημένοι μαθητές)</h5>
                <h5 *ngSwitchDefault>Αναφορά</h5>
            </div>
            <h6>Επιλογή Φίλτρων</h6>
            <button type="button" class="btn btn-sm" (click)="toggleRegionFilter()" >
                <div *ngIf = "userLoggedIn === 'supervisor'">Φίλτρο Επιλογής Περιφ/κής Δ/νσης - Δ/νσης Εκπ/σης - Σχολείου</div>
                <div *ngIf = "userLoggedIn === 'dide'">Φίλτρο Επιλογής Σχολείου</div>
                <div *ngIf = "userLoggedIn === 'pde'">Φίλτρο Επιλογής Δ/νσης Εκπ/σης - Σχολείου</div>
            </button>

            <div  class="col-md-11 offset-md-1">
            <label *ngIf = "enableRegionFilter && userLoggedIn === 'supervisor'"> Περιφερειακή Διεύθυνση </label>
            <select #regsel class="form-control" (change)="checkregion(regsel)" *ngIf = "enableRegionFilter" [value] = "regionSelected" [hidden] = "userLoggedIn !== 'supervisor'" formControlName="region">
                <option value="0"></option>
                <option *ngFor="let RegionSelection$  of RegionSelections$ | async; let i=index" [value] = "RegionSelection$.id"> {{RegionSelection$.name}} </option>
            </select>
            </div>
            <div class="col-md-11 offset-md-1">
            <label *ngIf="(showAdminList | async) && enableRegionFilter && userLoggedIn !== 'dide'">Διεύθυνση Εκπαίδευσης</label>
            <select #admsel class="form-control"  *ngIf="(showAdminList | async) && enableRegionFilter" (change)="checkadminarea(admsel)" [hidden] = "userLoggedIn === 'dide'" formControlName="adminarea">
                <option value="0"></option>
                <option *ngFor="let AdminAreaSelection$  of AdminAreaSelections$ | async; let i=index" [value] = "AdminAreaSelection$.id"> {{AdminAreaSelection$.name}}</option>
            </select>
            </div>
            <div class="col-md-11 offset-md-1">
            <label *ngIf="(showAdminList | async) && enableRegionFilter">Σχολείο</label>
            <select #schsel class="form-control"  *ngIf="(showAdminList | async) && enableRegionFilter" (change)="checkschool(schsel)" formControlName="schoollist">
                <option value="0"></option>
                <option *ngFor="let SchoolSelection$  of SchoolSelections$ | async; let i=index" [value] = "SchoolSelection$.epal_id"> {{SchoolSelection$.epal_name}} </option>
            </select>
            </div>

            <div *ngIf = "reportId === 3 || reportId === 5" >
                <button type="button" class="btn btn-sm" (click)="toggleCourseFilter()" >Φίλτρο Επιλογής Τομέα / Ειδικότητας</button>

                <div  class="col-md-11 offset-md-1">
                    <label for="classid" *ngIf = "enableCourseFilter" >Τάξη</label>
                    <select #class_sel  class="form-control" (change)="checkclass(class_sel)" *ngIf = "enableCourseFilter" formControlName="classid" >
                        <option value="0" ></option>
                        <option value="1" >Α' Λυκείου</option>
                        <option value="2" >Β' Λυκείου</option>
                        <option value="3" >Γ' Λυκείου</option>
                        <option value="4" >Δ' Λυκείου</option>
                    </select>
                </div>
                <div class="col-md-11 offset-md-1">
                    <label *ngIf="(showSectorList | async) && enableCourseFilter && (classSelected === 2 || classSelected === 3 || classSelected === 4) ">Τομέας</label>
                    <select #secsel class="form-control"  *ngIf="(showSectorList | async) && enableCourseFilter && (classSelected === 2 || classSelected === 3 || classSelected === 4)"
                            (change)="checksector(secsel)" formControlName="sector">
                        <option value="0"></option>
                        <option *ngFor="let SectorSelection$  of SectorSelections$ | async; let i=index" [value] = "SectorSelection$.id"> {{SectorSelection$.name}}</option>
                    </select>
                </div>
                <div class="col-md-11 offset-md-1">
                    <label *ngIf="(showCourseList | async) && enableCourseFilter && (classSelected === 3 || classSelected === 4)">Ειδικότητα</label>
                    <select #coursel class="form-control"  *ngIf="(showCourseList | async) && enableCourseFilter && (classSelected === 3 || classSelected === 4)"
                            (change)="checkcourse(coursel)" formControlName="course">
                        <option value="0"></option>
                        <option *ngFor="let CourseSelection$  of CourseSelections$ | async; let i=index" [value] = "CourseSelection$.id"> {{CourseSelection$.name}}</option>
                    </select>
                </div>
            </div>

            <button type="submit" class="btn btn-alert"  (click)="createReport(regsel)" [hidden]="minedu_userName === ''" >
            <i class="fa fa-file-text"></i>
                Δημιουργία Αναφοράς
            </button>
            <button type="submit" class="btn btn-alert pull-right"  (click)="navigateBack()" [hidden]="minedu_userName === ''" >
                Επιστροφή
            </button>
        </form>

        <div *ngIf="validCreator === 1 ">
            <input #search class="search" type="text" placeholder="Αναζήτηση..." (keydown.enter)="onSearch(search.value)">
            <div class="smart-table-container table table-hover table-striped" reportScroll>
            <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
            </div>
        </div>

        <button type="button" class="alert alert-info pull-right" (click)="export2Csv()" [hidden]="validCreator !== 1"><i class="fa fa-download"></i> Εξαγωγή σε csv</button>
        <button type="button" class="alert alert-info pull-left" (click)="createDiagram()" [hidden]="validCreator !== 1 || schSelected === 0 || (reportId !== 2 ) "><i class="fa fa-bar-chart"></i> Διάγραμμα</button>
        <div class="d3-chart" *ngIf = "validCreator === 1" #chart></div>
    </div>
   `
})

@Injectable() export default class ReportAllStat implements OnInit, OnDestroy {

    private formGroup: FormGroup;
    private loginInfo$: BehaviorSubject<ILoginInfoRecords>;
    private loginInfoSub: Subscription;
    private generalReport$: BehaviorSubject<any>;
    private RegionSelections$: BehaviorSubject<any>;
    private AdminAreaSelections$: BehaviorSubject<any>;
    private SchoolSelections$: BehaviorSubject<any>;
    private SectorSelections$: BehaviorSubject<any>;
    private CourseSelections$: BehaviorSubject<any>;
    private RegionRetrieve$: BehaviorSubject<any>;
    private generalReportSub: Subscription;
    private RegionSelectionsSub: Subscription;
    private AdminAreaSelectionsSub: Subscription;
    private SchoolSelectionsSub: Subscription;
    private SectorSelectionsSub: Subscription;
    private CourseSelectionsSub: Subscription;
    private RegionRetrieveSub: Subscription;
    private apiEndPoint = API_ENDPOINT;
    private minedu_userName: string;
    private minedu_userPassword: string;
    private distStatus = "READY";
    private data: any;
    private validCreator: number;
    private reportId: number;
    private source: LocalDataSource;
    private showAdminList: BehaviorSubject<boolean>;
    private showSectorList: BehaviorSubject<boolean>;
    private showCourseList: BehaviorSubject<boolean>;
    private regionSelected: number;
    private adminAreaSelected: number;
    private schSelected: number;
    private classSelected: number;
    private sectorSelected: number;
    private courseSelected: number;
    private distribFinalized: number;
    private enableRegionFilter: boolean;
    private enableCourseFilter: boolean;
    private userLoggedIn: string;

    columnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
    @Input() settings: any;
    private reportSchema = new ReportsSchema();

    // csvObj:CsvCreator ;
    private csvObj = new CsvCreator();

    private createGraph: boolean;
    // d3 creator
    private chartObj = new ChartCreator();
    @ViewChild("chart") public chartContainer: ElementRef;
    private d3data: Array<any>;

    // private repid: number;
    private routerSub: any;

    constructor(private fb: FormBuilder,
        private _ngRedux: NgRedux<IAppState>,
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.formGroup = this.fb.group({
            region: ["", []],
            adminarea: ["", []],
            schoollist: ["", []],
            classid: ["", []],
            sector: ["", []],
            course: ["", []],
        });

        this.loginInfo$ = new BehaviorSubject(LOGININFO_INITIAL_STATE);
        this.generalReport$ = new BehaviorSubject([{}]);
        this.RegionSelections$ = new BehaviorSubject([{}]);
        this.AdminAreaSelections$ = new BehaviorSubject([{}]);
        this.SchoolSelections$ = new BehaviorSubject([{}]);
        this.SectorSelections$ = new BehaviorSubject([{}]);
        this.CourseSelections$ = new BehaviorSubject([{}]);
        this.RegionRetrieve$ = new BehaviorSubject([{}]);
        this.minedu_userName = "";
        this.validCreator = -1;
        this.showAdminList = new BehaviorSubject(false);
        this.showSectorList = new BehaviorSubject(false);
        this.showCourseList = new BehaviorSubject(false);
        this.regionSelected = 0;
        this.adminAreaSelected = 0;
        this.schSelected = 0;
        this.classSelected = 0;
        this.sectorSelected = 0;
        this.courseSelected = 0;
        this.enableRegionFilter = false;
        this.enableCourseFilter = false;
        this.createGraph = false;

    }

    ngOnInit() {

        this.loginInfoSub = this._ngRedux.select("loginInfo")
            .map(loginInfo => <ILoginInfoRecords>loginInfo)
            .subscribe(loginInfo => {
                if (loginInfo.size > 0) {
                    loginInfo.reduce(({}, loginInfoObj) => {
                        this.minedu_userName = loginInfoObj.minedu_username;
                        this.minedu_userPassword = loginInfoObj.minedu_userpassword;

                        this.userLoggedIn = loginInfoObj.auth_role;
                        if (loginInfoObj.auth_role === PDE_ROLE || loginInfoObj.auth_role === DIDE_ROLE) {
                            let regId = -1;
                            this.minedu_userName = loginInfoObj.auth_token;
                            this.minedu_userPassword = loginInfoObj.auth_token;
                            if (loginInfoObj.auth_role === PDE_ROLE || loginInfoObj.auth_role === DIDE_ROLE) {

                                this.RegionRetrieveSub = this._hds.getUserRegistryNo(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
                                    this.RegionRetrieve$.next(data);
                                    this.data = data;
                                    regId = this.data["id"];

                                    if (loginInfoObj.auth_role === PDE_ROLE) {
                                        this.regionSelected = regId;
                                        this.showAdminList.next(true);

                                        this.checkregion(this.regionSelected);
                                    }
                                    else if (loginInfoObj.auth_role === DIDE_ROLE) {
                                        this.adminAreaSelected = regId;
                                        this.showAdminList.next(false);
                                        this.checkadminarea(this.adminAreaSelected);
                                    }
                                },
                                    error => {
                                        this.RegionRetrieve$.next([{}]);
                                    });
                            }
                        }
                        return loginInfoObj;
                    }, {});
                }
                this.loginInfo$.next(loginInfo);
            }, error => console.log("error selecting loginInfo"));

        this.routerSub = this.activatedRoute.params.subscribe(params => {
            this.reportId = +params["reportId"];
        });

        this.showFilters();
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
        if (this.SectorSelectionsSub)
            this.SectorSelectionsSub.unsubscribe();
        if (this.CourseSelectionsSub)
            this.CourseSelectionsSub.unsubscribe();
        if (this.RegionRetrieveSub)
            this.RegionRetrieveSub.unsubscribe();
    }

    createReport(regionSel) {

        this.validCreator = 0;
        this.createGraph = false;

        let route;
        if (this.reportId === 1) {
            route = "/ministry/general-report/";
            this.settings = this.reportSchema.genReportSchema;
        }
        else if (this.reportId === 2) {
            route = "/ministry/report-completeness/";
            this.settings = this.reportSchema.reportCompletenessSchema;
        }
        else if (this.reportId === 3) {
            route = "/ministry/report-all-stat/";
            this.distribFinalized = 1;
            this.settings = this.reportSchema.reportAllStatSchema;
            this.settings.fileName = "e-ΕΠΑΛ Αριθμός Μαθητών και Πληρότητα σχολικών μονάδων ΕΠΑΛ";
        }
        else if (this.reportId === 5) {
            route = "/ministry/report-all-stat/";
            this.distribFinalized = 0;
            this.settings = this.reportSchema.reportAllStatSchema;
            this.settings.fileName = "e-ΕΠΑΛ Ολιγομελή τμήματα - Προσωρινά τοποθετημένοι μαθητές";
        }

        let regSel = 0, admSel = 0, schSel = 0;
        if (this.enableRegionFilter) {
            // if (regionSel.value !== 0)
            // regSel = regionSel.value;
            regSel = this.regionSelected;
            admSel = this.adminAreaSelected;
            schSel = this.schSelected;
        }

        let clSel = 0, secSel = 0, courSel = 0;
        if (this.enableCourseFilter) {
            clSel = this.classSelected;
            secSel = this.sectorSelected;
            courSel = this.courseSelected;
        }

        if (this.userLoggedIn === PDE_ROLE) {
            regSel = this.regionSelected;
        }
        else if (this.userLoggedIn === DIDE_ROLE) {
            admSel = this.adminAreaSelected;
        }

        this.generalReportSub = this._hds.makeReport(this.minedu_userName, this.minedu_userPassword, route, regSel, admSel, schSel, clSel, secSel, courSel, this.distribFinalized).subscribe(data => {
            this.generalReport$.next(data);
            this.data = data;

            for (let i = 0; i < this.data.length; i++) {
                this.data[i].num = Number(data[i].num);
                this.data[i].percentage = Number(data[i].percentage);

                this.data[i].percTotal = Number(data[i].percTotal);
                this.data[i].percA = Number(data[i].percA);
                if (Number.isNaN(this.data[i].percA)) {
                    this.data[i].percA = "-";
                }
                this.data[i].percB = Number(data[i].percB);
                if (Number.isNaN(this.data[i].percB)) {
                    this.data[i].percB = "-";
                }
                this.data[i].percC = Number(data[i].percC);
                if (Number.isNaN(this.data[i].percC)) {
                    this.data[i].percC = "-";
                }
            }
            this.validCreator = 1;
            this.source = new LocalDataSource(this.data);
            this.columnMap = new Map<string, TableColumn>();

            // pass parametes to csv class object
            this.csvObj.columnMap = this.columnMap;
            this.csvObj.source = this.source;
            this.csvObj.settings = this.settings;
            // this.prepareColumnMap();
            this.csvObj.prepareColumnMap();
        },
        error => {
            this.generalReport$.next([{}]);
            console.log("Error Getting generalReport");
        });
    }

    navigateBack() {
        this.router.navigate(["/ministry/minister-reports"]);
    }

    showFilters() {

        this.RegionSelectionsSub = this._hds.getRegions(this.minedu_userName, this.minedu_userPassword).subscribe(data => {
            this.RegionSelections$.next(data);
        },
            error => {
                this.RegionSelections$.next([{}]);
                console.log("Error Getting RegionSelections");
            });
    }

    toggleRegionFilter() {

        this.enableRegionFilter = !this.enableRegionFilter;

    }

    toggleCourseFilter() {

        this.enableCourseFilter = !this.enableCourseFilter;
    }

    checkregion(regionId) {

        if (typeof regionId.value !== "undefined")
            this.regionSelected = regionId.value;
        this.adminAreaSelected = 0;
        this.schSelected = 0;

        this.AdminAreaSelectionsSub = this._hds.getAdminAreas(this.minedu_userName, this.minedu_userPassword, this.regionSelected).subscribe(data => {
            this.AdminAreaSelections$.next(data);
            this.showAdminList.next(true);
        },
            error => {
                this.AdminAreaSelections$.next([{}]);
                console.log("Error Getting AdminAreaSelections");
            });

        this.SchoolSelectionsSub = this._hds.getSchoolsPerRegion(this.minedu_userName, this.minedu_userPassword, this.regionSelected).subscribe(data => {
            this.SchoolSelections$.next(data);
            this.showAdminList.next(true);
        },
            error => {
                this.SchoolSelections$.next([{}]);
                console.log("Error Getting SchoolSelections");
            });
    }

    checkadminarea(adminId) {

        this.schSelected = 0;

        if (typeof adminId.value !== "undefined")
            this.adminAreaSelected = adminId.value;
        this.SchoolSelectionsSub = this._hds.getSchoolsPerAdminArea(this.minedu_userName, this.minedu_userPassword, this.adminAreaSelected).subscribe(data => {
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

    checkclass(classId) {
        this.classSelected = classId.value;
        this.sectorSelected = 0;
        this.courseSelected = 0;

        if (this.classSelected === 2 || this.classSelected === 3 || this.classSelected === 4) {
            this.SectorSelectionsSub = this._hds.getSectors(this.minedu_userName, this.minedu_userPassword, this.classSelected).subscribe(data => {
                this.SectorSelections$.next(data);
                this.showSectorList.next(true);
            },
                error => {
                    this.SectorSelections$.next([{}]);
                    console.log("Error Getting SectorSelections");
                });
        } // end if
    }

    checksector(sectorId) {
        this.courseSelected = 0;
        this.sectorSelected = sectorId.value;

        this.CourseSelectionsSub = this._hds.getCourses(this.minedu_userName, this.minedu_userPassword, this.sectorSelected).subscribe(data => {
            this.CourseSelections$.next(data);
            this.showCourseList.next(true);
        },
            error => {
                this.CourseSelections$.next([{}]);
                console.log("Error Getting CourseSelections");
            });
    }

    checkcourse(courseId) {
        this.courseSelected = courseId.value;
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
        if (this.reportId === 2) {
            let labelsX = [];
            labelsX.push("Σχολείο");
            labelsX.push("Α\' τάξη");
            labelsX.push("Β\' τάξη");
            labelsX.push("Γ\' τάξη");
            labelsX.push("Δ\' τάξη");

            this.d3data.push([
                labelsX[0],
                this.data[0].percTotal,
            ]);
            this.d3data.push([
                labelsX[1],
                this.data[0].percA,
            ]);
            this.d3data.push([
                labelsX[2],
                this.data[0].percB,
            ]);
            this.d3data.push([
                labelsX[3],
                this.data[0].percC,
            ]);
            this.d3data.push([
                labelsX[4],
                this.data[0].percD,
            ]);
        }
    }
}
