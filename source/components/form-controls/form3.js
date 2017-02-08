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
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const student_1 = require("../students/student");
const app_settings_1 = require("../../app.settings");
let Form3 = class Form3 {
    constructor(http) {
        this.http = http;
        this.student = new student_1.Student(0, '', '', '', '', 1);
    }
    onSubmit(studentform) {
        let headers = new http_1.Headers({
            //"Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
            "Authorization": "Basic bmthdHNhb3Vub3M6emVtcmFpbWU=",
            "Accept": "*/*",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json",
            // "Content-Type": "text/plain",  // try to skip preflight
            //"X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            //"X-CSRF-Token": "fj1QtF_Z_p6kE19EdCnN08zoSjVfcT4Up-ciW6I0IG8"
            "X-CSRF-Token": "LU92FaWYfImfZxfldkF5eVnssdHoV7Aa9fg8K1bWYUc"
        });
        let options = new http_1.RequestOptions({ headers: headers, withCredentials: true });
        console.log(this.student);
        this.http.post(`${app_settings_1.AppSettings.API_ENDPOINT}/entity/epal_student`, this.student, options)
            .map((res) => res.json())
            .subscribe(success => { alert("Η εγγραφή έγινε με επιτυχία"); console.log("success post"); }, // put the data returned from the server in our variable
        error => console.log("Error HTTP POST Service"), // in case of failure show this message
        () => console.log("write this message anyway")); //run this code in all cases);
    }
};
Form3 = __decorate([
    core_1.Component({
        selector: 'form3',
        template: `
  <div>
    <form #studentform="ngForm" (submit)="onSubmit(studentform)" class="col-sm-8">
      <div class="form-group">
        <label>Όνομα</label>
        <input type="text" [(ngModel)]="student.name" name="name"
          required class="form-control" />
      </div>
      <div class="form-group">
        <label>Επώνυμο</label>
        <input type="text" [(ngModel)]="student.surname" name="surname"
          required class="form-control" />
      </div>
      <div class="form-group">
        <label>Διεύθυνση</label>
        <input type="text" [(ngModel)]="student.address" name="address"
          required class="form-control" />
      </div>
      <div class="form-group">
      <label>Ημερομηνία Γέννησης</label>
      <input type="date" [(ngModel)]="student.birthdate"
       class="form-control" name="birthdate" />
      </div>
      <input type="submit"  [disabled]="!studentform.valid" value="Υποβολή" class="btn btn-success" />
    </form>
  </div>
  `
    }),
    __metadata("design:paramtypes", [http_1.Http])
], Form3);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Form3;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybTMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3JtMy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHdDQUF3RTtBQUV4RSxpREFBOEM7QUFNOUMscURBQStDO0FBZ0MvQyxJQUFxQixLQUFLLEdBQTFCO0lBSUksWUFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsUUFBUSxDQUFDLFdBQWdCO1FBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxDQUFDO1lBQ3RCLGlGQUFpRjtZQUNoRixlQUFlLEVBQUUsb0NBQW9DO1lBQ3RELFFBQVEsRUFBRSxLQUFLO1lBQ2Ysa0NBQWtDLEVBQUUsTUFBTTtZQUMxQyxjQUFjLEVBQUUsa0JBQWtCO1lBQ2xDLDBEQUEwRDtZQUMxRCwrREFBK0Q7WUFDL0QsK0RBQStEO1lBQy9ELGNBQWMsRUFBRSw2Q0FBNkM7U0FDaEUsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxPQUFPLEdBQUcsSUFBSSxxQkFBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM5RSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLDBCQUFXLENBQUMsWUFBWSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQzthQUduRixHQUFHLENBQUMsQ0FBQyxHQUFhLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2xDLFNBQVMsQ0FBQyxPQUFPLE1BQUssS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBLENBQUEsQ0FBQyxFQUFFLHdEQUF3RDtRQUNuSixLQUFLLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLHVDQUF1QztRQUN4RixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUEsOEJBQThCO0lBQ3RGLENBQUM7Q0FDSixDQUFBO0FBL0JvQixLQUFLO0lBOUJ6QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLE9BQU87UUFDakIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCWDtLQUNGLENBQUM7cUNBSzRCLFdBQUk7R0FKYixLQUFLLENBK0J6Qjs7a0JBL0JvQixLQUFLIn0=