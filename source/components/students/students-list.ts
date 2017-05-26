import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from "@angular/core";
import {Component, OnInit} from '@angular/core';
import { Student } from './student';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ServerDataSource } from '../../../node_modules/ng2-smart-table/build/src/ng2-smart-table/lib';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {AppSettings} from '../../app.settings';
@Component({
    selector: 'students-list',
    template: `
    <div>
    <ng2-smart-table [settings]="settings" [source]="data"></ng2-smart-table>
    </div>
  `
})

@Injectable() export default class StudentsList implements OnInit {
    public students: Student[];
    public data;
    public settings = {
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

    constructor(private http: Http) {
    }

    ngOnInit() {
        this.data = [];
        this.students = [];
        this.getStudents(this.http);//called after the constructor and called  after the first ngOnChanges()
    }
    getStudents(http: Http) {
        //    this.http.get('http://eduslim2.minedu.gov.gr/drupal/students/list')
         this.data = new ServerDataSource(http, { endPoint: `${AppSettings.API_ENDPOINT}/students/list` });
//        this.data = new ServerDataSource(http, {endPoint: 'http://eduslim2.minedu.gov.gr/drupal/students/list'});
        /*    this.http.get('http://eepal.dev/drupal/students/list')
              // Call map on the response observable to get the parsed people object
              .map(response => <Student[]>response.json())
                    .subscribe(data => DataSource.load(this.data = data), // put the data returned from the server in our variable
                        error => console.log("Error HTTP GET Service"), // in case of failure show this message
                        () => console.log(this.data));//run this code in all cases); */

    }
}
