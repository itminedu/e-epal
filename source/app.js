"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
require("reflect-metadata");
require("babel-polyfill");
require("core-js/es6");
require("core-js/es7/reflect");
const core_1 = require("@angular/core");
const ng2_redux_1 = require("ng2-redux");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const http_1 = require("@angular/http");
const common_1 = require("@angular/common");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const main_1 = require("./containers/main");
const app_routes_1 = require("./app.routes");
/* Here we import services */
const helper_data_service_1 = require("./services/helper-data-service");
const user_data_service_1 = require("./services/user-data-service");
const actions_1 = require("./actions");
const ng2_smart_table_1 = require("ng2-smart-table");
class MyLocalization extends common_1.NgLocalization {
    getPluralCategory(value) {
        if (value < 5) {
            return 'few';
        }
    }
}
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            router_1.RouterModule,
            forms_1.ReactiveFormsModule,
            app_routes_1.APP_ROUTER_PROVIDERS,
            http_1.HttpModule,
            ng2_smart_table_1.Ng2SmartTableModule,
            ng2_redux_1.NgReduxModule,
        ],
        declarations: [
            main_1.default,
            app_routes_1.APP_DECLARATIONS,
        ],
        bootstrap: [main_1.default],
        providers: [
            { provide: common_1.APP_BASE_HREF, useValue: '/' },
            { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
            { provide: common_1.NgLocalization, useClass: MyLocalization },
            ng2_redux_1.DevToolsExtension,
            actions_1.ACTION_PROVIDERS,
            //    Service1, again services here
            helper_data_service_1.HelperDataService,
            user_data_service_1.UserDataService,
        ]
    })
], AppModule);
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSw0QkFBMEI7QUFDMUIsMEJBQXdCO0FBQ3hCLHVCQUFxQjtBQUNyQiwrQkFBNkI7QUFDN0Isd0NBQXlDO0FBQ3pDLHlDQUFzRTtBQUN0RSxnRUFBd0Q7QUFDeEQsMENBR3dCO0FBRXhCLDRDQUE2QztBQUM3Qyx3Q0FBMkM7QUFDM0MsNENBS3lCO0FBRXpCLGdGQUEyRTtBQUUzRSw0Q0FBcUM7QUFDckMsNkNBQXNFO0FBRXRFLDZCQUE2QjtBQUM3Qix3RUFBaUU7QUFDakUsb0VBQTZEO0FBRTdELHVDQUE2QztBQUU3QyxxREFBc0Q7QUFHdEQsb0JBQXFCLFNBQVEsdUJBQWM7SUFDeEMsaUJBQWlCLENBQUMsS0FBVTtRQUN6QixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDaEIsQ0FBQztJQUNKLENBQUM7Q0FDSDtBQThCRCxJQUFNLFNBQVMsR0FBZjtDQUFrQixDQUFBO0FBQVosU0FBUztJQTVCZCxlQUFRLENBQUM7UUFDUixPQUFPLEVBQU87WUFDWixnQ0FBYTtZQUNiLG1CQUFXO1lBQ1gscUJBQVk7WUFDWiwyQkFBbUI7WUFDbkIsaUNBQW9CO1lBQ3BCLGlCQUFVO1lBQ1YscUNBQW1CO1lBQ25CLHlCQUFhO1NBRWQ7UUFDRCxZQUFZLEVBQUU7WUFDWixjQUFJO1lBQ0osNkJBQWdCO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFLENBQUUsY0FBSSxDQUFFO1FBQ25CLFNBQVMsRUFBRTtZQUNULEVBQUUsT0FBTyxFQUFFLHNCQUFhLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUN6QyxFQUFFLE9BQU8sRUFBRSx5QkFBZ0IsRUFBRSxRQUFRLEVBQUUsNkJBQW9CLEVBQUU7WUFDN0QsRUFBRSxPQUFPLEVBQUUsdUJBQWMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFO1lBQ3JELDZCQUFpQjtZQUNqQiwwQkFBZ0I7WUFDcEIsbUNBQW1DO1lBQy9CLHVDQUFpQjtZQUNqQixtQ0FBZTtTQUNoQjtLQUNGLENBQUM7R0FDSSxTQUFTLENBQUc7QUFFbEIsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMifQ==