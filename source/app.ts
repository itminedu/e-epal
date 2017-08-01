import "reflect-metadata";
import "babel-polyfill";
import "core-js/es6";
import "core-js/es7/reflect";
import { NgModule } from "@angular/core";
import { NgReduxModule, DevToolsExtension, NgRedux } from "@angular-redux/store";
import {BrowserModule} from "@angular/platform-browser";
import { CookieModule } from "ngx-cookie";
import { MyDatePickerModule } from "mydatepicker";
import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import {
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";

import {RouterModule} from "@angular/router";
import { HttpModule } from "@angular/http";
import {
    APP_BASE_HREF,
    HashLocationStrategy,
    LocationStrategy,
    NgLocalization,
} from "@angular/common";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import Main from "./containers/main";
import { APP_ROUTER_PROVIDERS, APP_DECLARATIONS } from "./app.routes";

import {HelperDataService} from "./services/helper-data-service";
import {LoaderService} from "./services/Spinner.service";
import {AuthService} from "./services/auth.service";
import SchoolAuthGuard from "./guards/school.auth.guard";
import SchoolStudentsLockedGuard from "./guards/school.students.locked.guard";
import SchoolCapacityLockedGuard from "./guards/school.capacity.locked.guard";
import StudentAuthGuard from "./guards/student.auth.guard";
import ReportsAuthGuard from "./guards/reports.auth.guard";
import StudentLockGuard from "./guards/student.lock.guard";
import RegionEduAuthGuard from "./guards/regionedu.auth.guard";
import EduAdminAuthGuard from "./guards/eduadmin.auth.guard";
import MinistryAuthGuard from "./guards/ministry.auth.guard";

import * as $ from "jquery";
import { ACTION_PROVIDERS } from "./actions";
import Home from "./components/home";
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";

import HeaderComponent from "./components/header/header.component";
import NavbarComponent from "./components/navbar/navbar.component";
import MainComponent from "./components/main/main.component";
import FooterComponent from "./components/footer/footer.component";

import {enableProdMode} from "@angular/core";

class MyLocalization extends NgLocalization {
    getPluralCategory(value: any) {
        if (value < 5) {
            return "few";
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        MyDatePickerModule,
        FormsModule,
        NguiAutoCompleteModule,
        RouterModule,
        ReactiveFormsModule,
        APP_ROUTER_PROVIDERS,
        HttpModule,
        Ng2SmartTableModule,
        NgReduxModule,
        CookieModule.forRoot()
    ],
    declarations: [
        Main, FooterComponent, HeaderComponent, NavbarComponent, MainComponent,
        APP_DECLARATIONS,
    ],
    bootstrap: [Main],
    providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: NgLocalization, useClass: MyLocalization },
        DevToolsExtension,
        ACTION_PROVIDERS,
        // Service1, again services here
        HelperDataService,
        LoaderService,
        AuthService,
        SchoolAuthGuard,
        SchoolStudentsLockedGuard,
        SchoolCapacityLockedGuard,
        StudentAuthGuard,
        StudentLockGuard,
        RegionEduAuthGuard,
        EduAdminAuthGuard,
        MinistryAuthGuard,
        ReportsAuthGuard
    ]
})
class AppModule { }

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
