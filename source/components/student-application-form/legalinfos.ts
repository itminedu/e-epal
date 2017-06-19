import { Component, Injectable } from "@angular/core";
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector: 'legal-info',
    template: `
        <p align="left"><strong> Νομοθεσία  </strong></p>
        <ul class="list-group">
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/ypourgikh.pdf" target="_blank">Υπουργική Απόφαση - αριθμ. Φ1α/98933/Δ4</a>
        </li>
        <li class="list-group-item isclickable oddout" >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/egkyklios.pdf" target="_blank">Εγκύκλιος του Υ.Π.Π.Ε.Θ.- αρ.πρωτ. 89047/ΓΔ4/26-05-2017 </a>
        </li>
        </ul>

    <br>
    <br>
    <p align="left"><strong> Χρήσιμες Πληροφορίες  </strong></p>
        <ul class="list-group">
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/infos.pdf" target="_blank">Ενημερωτικά Στοιχεία</a>
        </li>
        <li class="list-group-item isclickable oddout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="../pdfs/files/diptixo.pdf" target="_blank">Η Επαγγελματική Εκπαίδευση αναβαθμίζεται</a>
        </li>
        <li class="list-group-item isclickable evenout"  >
            <a class="col-md-12" style="font-size: 0.8em; font-weight: bold;" href="http://www.minedu.gov.gr/texniki-ekpaideusi-2/odigos-spoudon-gia-to-epal" target="_blank">Οδηγός Σπουδών για το ΕΠΑΛ </a>
        </li>
        </ul>
        <div class="row" style="margin-top: 30px; margin-bottom: 30px;">
            <div class="col-md-6">
                <button type="button" class="btn-primary btn-lg pull-left isclickable" style="width: 9em;" (click)="goBack()" >
                    <span style="font-size: 0.9em; font-weight: bold;">Επιστροφή</span>
                </button>
            </div>
            <div class="col-md-6">
                <button type="button" class="btn-primary btn-lg pull-right isclickable" style="width: 9em;" (click)="goHome()" >
                    <span style="font-size: 0.9em; font-weight: bold;">Αρχική</span>
                </button>
            </div>
        </div>

   `
})

@Injectable() export default class LegalInfo {
    constructor(private router: Router, private loc: Location) {

    }

    public goBack(): void {
        this.loc.back();

    }

    public goHome(): void {
        this.router.navigate(['']);
    }

}
