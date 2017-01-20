import {Component} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Student } from '../students/student';

import {
    FormControl,
    FormGroup
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
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
})
export default class Form3 {
    public student;


    constructor(private http: Http) {
        this.student = new Student(0, '', '', '', '', 1);
    }

    onSubmit(studentform: any) {
        let headers = new Headers({
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
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        console.log(this.student);

        this.http.post(`${AppSettings.API_ENDPOINT}/entity/epal_student`, this.student, options)
    //    this.http.post('http://eduslim2.minedu.gov.gr/drupal/entity/epal_student', this.student, options)
            // Call map on the response observable to get the parsed people object
            .map((res: Response) => res.json())
            .subscribe(success => {alert("Η εγγραφή έγινε με επιτυχία"); console.log("success post")}, // put the data returned from the server in our variable
            error => console.log("Error HTTP POST Service"), // in case of failure show this message
            () => console.log("write this message anyway"));//run this code in all cases);
    }
}
