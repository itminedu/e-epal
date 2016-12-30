import {Component, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from "@angular/core";

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
import { CourseField } from './coursefield';
import {AppSettings} from '../../app.settings';

@Component({
    selector: 'course-fields-select',
    template: `
     <form [formGroup]="formGroup">
        <div formArrayName="formArray">
            <div *ngIf="courseFields.length === 0" class="loading">Loading&#8230;</div>
            <div *ngFor="let control of cfs.controls; let i=index">
            <div class="row">
            <div class="col-md-2 pull-right">
                <input type="checkbox" formControlName="{{i}}">
            </div>
            <div class="col-md-10 pull-left">
                {{courseFields[i].name}}
            </div>
            </div>
            </div>
        </div>
<!--        <button (click)="addInput()">Add Input</button>  -->
    </form>
    <pre>{{formGroup.value | json}}</pre>
  `
})
@Injectable() export default class CourseFieldsSelect implements OnInit {
    public formGroup: FormGroup;
    public cfs = new FormArray([]);
    public courseFields: CourseField[];

    constructor(private http: Http, private fb: FormBuilder) {
        this.courseFields = [];
        this.formGroup = this.fb.group({
            formArray: this.cfs
        });

    };

    ngOnInit() {
        this.getCourseFields(this.http);//called after the constructor and called  after the first ngOnChanges()
    }

    getCourseFields(http: Http) {

        this.http.get(`${AppSettings.API_ENDPOINT}/coursefields/list`)
        // this.http.get('http://eduslim2.minedu.gov.gr/drupal/coursefields/list')
            // Call map on the response observable to get the parsed people object
            .map(response => <CourseField[]>response.json())
            .subscribe(data => {
                console.log(data);
                this.courseFields = data;
                for (let i = 0; i < this.courseFields.length; i++) {
                    this.cfs.push(new FormControl('', []));
                    //                    this.courseFields[i] = new CourseField(0,'');
                }

            }, // put the data returned from the server in our variable
            error => console.log("Error HTTP GET Service"), // in case of failure show this message
            () => console.log("this.courseFields"));//run this code in all cases); */
    }

    /*    onSubmit(studentform: any) {
            let headers = new Headers({
                "Authorization": "Basic cmVzdHVzZXI6czNjckV0MFAwdWwwJA==", // encoded user:pass
                "Access-Control-Allow-Credentials": "true",
                "Content-Type": "application/json",
                // "Content-Type": "text/plain",  // try to skip preflight
                "X-CSRF-Token": "hVtACDJjFRSyE4bgGJENHbXY0B9yNhF71Fw-cYHSDNY"
            });
            let options = new RequestOptions({ headers: headers, withCredentials: true });

            this.http.post('http://eepal.dev/drupal/entity/student', this.student, options)
                // Call map on the response observable to get the parsed people object
                .map((res: Response) => res.json())
                .subscribe(success => {alert("Η εγγραφή έγινε με επιτυχία"); console.log("success post")}, // put the data returned from the server in our variable
                error => console.log("Error HTTP POST Service"), // in case of failure show this message
                () => console.log("write this message anyway"));//run this code in all cases);
        } */


        /*    addInput() {
                alert('hello');
                console.log(this.formGroup);
                this.cfs.push(new FormControl('', []));
                //        this.formGroup.formArray.push(this.fb.control(''));
            }; */

}
