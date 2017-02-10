import {Http,Response, RequestOptions, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class AmkaCheckService {
    private _url = "https://wso2.minedu.gov.gr/amka/v1.1/" ;
    constructor(private _http: Http) {
    };

    checkstudentamka(amka: any) {
        

        let authToken = '7bed3fc5-f9f5-3613-abcd-3b08bab0f625';
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', `Bearer ${authToken}`);

        let options = new RequestOptions({headers : headers});

        let parameter1 = 'ksdhkshf' ;
        
        return this._http.get(this._url+ amka.name +'/'+ parameter1 ,options)
            .map(response => response.json() );

    }
}