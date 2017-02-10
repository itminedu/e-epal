import {Http,Response, RequestOptions, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { IAmkaFill } from '../store/amkafill/amkafills.types';


@Injectable()
export class AmkaCheckService {
    private _url = "https://wso2.minedu.gov.gr/amka/v1.1/" ;
    private respond :Object
    constructor(private _http: Http) {
    };

    checkstudentamka(amka: any) {
        let authToken = '7bed3fc5-f9f5-3613-abcd-3b08bab0f625';
        let headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', `Bearer ${authToken}`);

        let options = new RequestOptions({headers : headers});

        let parameter1 = 'ksdhkshf' ;
        
        this._http.get(this._url+ amka.name +'/'+ parameter1 ,options)
            .map(response =><IAmkaFill[]>response.json() )
            .subscribe(res =>this.respond = res);
        return this.respond;

    }
}