"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const http_1 = require("@angular/http");
const core_1 = require("@angular/core");
const core_2 = require("@angular/core");
const lib_1 = require("../../../node_modules/ng2-smart-table/build/src/ng2-smart-table/lib");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
const app_settings_1 = require("../../app.settings");
let StudentsList = class StudentsList {
    constructor(http) {
        this.http = http;
        this.settings = {
            columns: {
                id: {
                    title: 'ID'
                },
                name: {
                    title: 'Ονοματεπώνυμο'
                },
                surname: {
                    title: 'Επώνυμο'
                },
                address: {
                    title: 'Διεύθυνση'
                },
                epalstudentclass_id: {
                    title: 'Τμήμα'
                }
            }
        };
    }
    ngOnInit() {
        this.data = [];
        this.students = [];
        this.getStudents(this.http); //called after the constructor and called  after the first ngOnChanges()
    }
    getStudents(http) {
        //    this.http.get('http://eduslim2.minedu.gov.gr/drupal/students/list')
        this.data = new lib_1.ServerDataSource(http, { endPoint: `${app_settings_1.AppSettings.API_ENDPOINT}/students/list` });
        //        this.data = new ServerDataSource(http, {endPoint: 'http://eduslim2.minedu.gov.gr/drupal/students/list'});
        /*    this.http.get('http://eepal.dev/drupal/students/list')
              // Call map on the response observable to get the parsed people object
              .map(response => <Student[]>response.json())
                    .subscribe(data => DataSource.load(this.data = data), // put the data returned from the server in our variable
                        error => console.log("Error HTTP GET Service"), // in case of failure show this message
                        () => console.log(this.data));//run this code in all cases); */
    }
};
StudentsList = __decorate([
    core_2.Component({
        selector: 'students-list',
        template: `
    <div>
    <ng2-smart-table [settings]="settings" [source]="data"></ng2-smart-table>
    </div>
  `
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], StudentsList);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StudentsList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudHMtbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0dWRlbnRzLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHdDQUErQztBQUUvQyx3Q0FBeUM7QUFDekMsd0NBQWdEO0FBR2hELDZGQUF1RztBQUN2RyxpQ0FBK0I7QUFDL0IsdUNBQXFDO0FBQ3JDLHFEQUErQztBQVVqQyxJQUFxQixZQUFZLEdBQWpDO0lBdUJWLFlBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBcEJ2QixhQUFRLEdBQUc7WUFDZCxPQUFPLEVBQUU7Z0JBQ0wsRUFBRSxFQUFFO29CQUNBLEtBQUssRUFBRSxJQUFJO2lCQUNkO2dCQUNELElBQUksRUFBRTtvQkFDRixLQUFLLEVBQUUsZUFBZTtpQkFDekI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLEtBQUssRUFBRSxTQUFTO2lCQUNuQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLFdBQVc7aUJBQ3JCO2dCQUNELG1CQUFtQixFQUFFO29CQUNqQixLQUFLLEVBQUUsT0FBTztpQkFDakI7YUFDSjtTQUNKLENBQUM7SUFHRixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSx3RUFBd0U7SUFDeEcsQ0FBQztJQUNELFdBQVcsQ0FBQyxJQUFVO1FBQ2xCLHlFQUF5RTtRQUN4RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksc0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEdBQUcsMEJBQVcsQ0FBQyxZQUFZLGdCQUFnQixFQUFFLENBQUMsQ0FBQztRQUMzRyxtSEFBbUg7UUFDM0c7Ozs7O3VGQUsrRTtJQUVuRixDQUFDO0NBQ0osQ0FBQTtBQTNDa0MsWUFBWTtJQVQ5QyxnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGVBQWU7UUFDekIsUUFBUSxFQUFFOzs7O0dBSVg7S0FDRixDQUFDO0lBRUQsaUJBQVUsRUFBRTtxQ0F1QmlCLFdBQUk7R0F2QkMsWUFBWSxDQTJDOUM7O2tCQTNDa0MsWUFBWSJ9