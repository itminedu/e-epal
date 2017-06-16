import { Component, OnInit, OnDestroy } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { Http, Headers, RequestOptions} from '@angular/http';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import { LOGININFO_INITIAL_STATE } from '../../store/logininfo/logininfo.initial-state';
import { LoginInfoActions } from '../../actions/logininfo.actions';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'legal-info',
    template: `

   
      <form  #form>  
        <p align="left"><strong> Νομοθεσία  </strong></p>        
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/ypourgikh.pdf" target="_blank">Υπουργική Απόφαση - αριθμ. Φ1α/98933/Δ4</a>
        </li>
        <li class="list-group-item isclickable oddout" >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/egkyklios.pdf" target="_blank">Εγκύκλιος του Υ.Π.Π.Ε.Θ.- αρ.πρωτ. 89047/ΓΔ4/26-05-2017 </a>
        </li>

    <br>
    <br>
    <p align="left"><strong> Χρήσιμες Πληροφορίες  </strong></p>        
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/infos.pdf" target="_blank">Ενημερωτικά Στοιχεία</a>
        </li>
        <li class="list-group-item isclickable oddout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/diptixo.pdf" target="_blank">Η Επαγγελματική Εκπαίδευση αναβαθμίζεται</a>
        </li>
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="http://www.minedu.gov.gr/texniki-ekpaideusi-2/odigos-spoudon-gia-to-epal" target="_blank">Οδηγός Σπουδών για το ΕΠΑΛ </a>
        </li>
        <br>
        <br>
         </form>
 

   `
})

@Injectable() export default class LegalInfo implements OnInit, OnDestroy {

 
    constructor() {

    }


    ngOnDestroy() {

    }

    ngOnInit() {

  }


}
