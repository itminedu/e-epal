import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { ICourseField } from '../store/coursefields/coursefields.types';
import { IRegion, IRegions, IRegionSchool } from '../store/regionschools/regionschools.types';
import { AppSettings } from '../app.settings';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class HelperDataService {
    constructor(private http: Http) {
    };
    getCourseFields() {
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/coursefields/list`)
            .map(response => <ICourseField[]>response.json())
            .subscribe(data => {
                resolve(data);
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("Course Fields Received"));//run this code in all cases); */
        });
    };

    getRegionsWithSchools() {
        return new Promise((resolve, reject) => {
            this.http.get(`${AppSettings.API_ENDPOINT}/regions/list`)
            .map(response => response.json())
            .subscribe(data => {
//                console.log(data);
                resolve(this.transformRegionSchoolsSchema(data));
            }, // put the data returned from the server in our variable
            error => {
                console.log("Error HTTP GET Service"); // in case of failure show this message
                reject("Error HTTP GET Service");
            },
            () => console.log("region schools service"));//run this code in all cases); */
        });
    };

    transformRegionSchoolsSchema(regionSchools: any) {
        let rsa = Array<IRegion>();
        let trackRegionId: string;
        let trackIndex: number;

        trackRegionId = "";
        trackIndex = -1;

        let j=0;
        regionSchools.forEach(regionSchool => {
            if (trackRegionId !== regionSchool.region_id) {
                trackIndex++;
                rsa.push(<IRegion>{'region_id': regionSchool.region_id, 'region_name': regionSchool.region_name, 'epals': Array<IRegionSchool>()});
                trackRegionId = regionSchool.region_id;
            }
            rsa[trackIndex].epals.push(<IRegionSchool>{'epal_id': regionSchool.epal_id, 'epal_name': regionSchool.epal_name, 'globalIndex': j, 'selected': false});
            j++;
        });
        return rsa;
    }

}
