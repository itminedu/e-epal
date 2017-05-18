import { Component, OnInit, OnDestroy,ElementRef, ViewChild} from "@angular/core";
let jsPDF = require('jspdf');
import { Injectable } from "@angular/core";
import { AppSettings } from '../../app.settings';
import { HelperDataService } from '../../services/helper-data-service';
import {Observable} from "rxjs/Observable";
import {IStudentDataFields, IStudentDataField} from '../../store/studentdatafields';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Removetags} from '../../pipes/removehtmltags';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store/store';
import { ILoginInfo } from '../../store/logininfo/logininfo.types';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as html2canvas from "html2canvas"
 
@Component({
    selector: 'submited-preview',
    template: `
    <div class = "loading" *ngIf="(showLoader$ | async) === true"></div>
         <div class="row">
             <breadcrumbs></breadcrumbs>
        </div>
            Έχει υποβληθεί αίτηση για εγγραφή στην Επαγγελματική Εκπαίδευση των παρακάτω ατόμων:

              <ul class="list-group main-view">
               <div *ngFor="let UserData$  of SubmitedApplic$ | async; let i=index; let isOdd=odd; let isEven=even"  >

                 <li class="list-group-item isclickable" [class.oddout]="isOdd"
                 [class.evenout]="isEven" (click)="setActiveUser(UserData$.id)" [class.selectedout]="userActive === UserData$.id" >
                  <h5> {{UserData$.name}}&nbsp;{{UserData$.studentsurname}} </h5>
                 </li>
                  <div #target class = "target "id = "target">

                  <div *ngFor="let StudentDetails$  of SubmitedDetails$ | async" [hidden]="UserData$.id !== userActive" >
                      <table>
                        <tr><td>
                          <div class="form-group" *ngIf="StudentDetails$.relationtostudent === 'Μαθητής' ">
                            <label for="guardianfirstname">Όνομα κηδεμόνα</label><p class="form-control" id="guardianfirstname" style="border:1px solid #eceeef;">{{StudentDetails$.guardianfirstname}} </p>
                          </div>
                        </td>
                        <td>
                         <div class="form-group" *ngIf="StudentDetails$.relationtostudent === 'Μαθητής' ">
                            <label for="guardiansurname">Επώνυμο κηδεμόνα</label><p class="form-control" id="guardiansurname" style="border:1px solid #eceeef;">{{StudentDetails$.guardiansurname}} </p>
                          </div>
                        </td></tr>
                      </table>
                      <div class="form-group"><label for="name">Όνομα μαθητή</label> <p class="form-control" id="name" style="border:1px solid #eceeef;">    {{StudentDetails$.name}} </p> </div>
                      <div><label for="studentsurname">Επώνυμο μαθητή</label> <p class="form-control" id = "studentsurname" style="border:1px solid #eceeef;"> {{StudentDetails$.studentsurname}} </p></div>
                      <div><label for="fatherfirstname">Όνομα Πατέρα</label> <p class="form-control" id = "fatherfirstname" style="border:1px solid #eceeef;"> {{StudentDetails$.fatherfirstname}} </p></div>
                      <div><label for="fathersurname">Επώνυμο Πατέρα</label> <p class="form-control" id = "fathersurname" style="border:1px solid #eceeef;"> {{StudentDetails$.fathersurname}} </p></div>
                      <div><label for="motherfirstname">Όνομα Μητέρας</label> <p class="form-control" id = "motherfirstname" style="border:1px solid #eceeef;"> {{StudentDetails$.motherfirstname}} </p></div>
                      <div><label for="mothersurname">Επώνυμο Μητέρας</label> <p class="form-control" id = "mothersurname" style="border:1px solid #eceeef;"> {{StudentDetails$.mothersurname}} </p></div>
                      <div><label for="birthdate">Ημερομηνία Γέννησης</label> <p class="form-control" id = "birthdate" style="border:1px solid #eceeef;"> {{StudentDetails$.birthdate}} </p></div>


                      <table>
                              <tr>
                                  <td>
                                      <div class="form-group">
                                          <label for="regionaddress">Διεύθυνση κατοικίας</label><p class="form-control" id = "regionaddress" style="border:1px solid #eceeef;"> {{StudentDetails$.regionaddress}} </p>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="form-group">
                                          <label for="regiontk">TK </label><p class="form-control" id = "regiontk" style="border:1px solid #eceeef;"> {{StudentDetails$.regiontk}} </p>
                                      </div>
                                  </td>
                                  <td>
                                      <div class="form-group">
                                          <label for="regionarea">Πόλη/Περιοχή</label><p class="form-control" id = "regionarea" style="border:1px solid #eceeef;"> {{StudentDetails$.regionarea}} </p>
                                      </div>
                                  </td>
                             </tr>
                      </table>
                      <div><label for="certificatetype">Τύπος απολυτηρίου</label> <p class="form-control" id = "certificatetype" style="border:1px solid #eceeef;"> {{StudentDetails$.certificatetype}} </p></div>
                      <div><label for="telnum">Τηλέφωνο επικοινωνίας</label> <p class="form-control" id = "telnum" style="border:1px solid #eceeef;"> {{StudentDetails$.telnum}} </p></div>
                      <div><label for="relationtostudent">Η αίτηση γίνεται από</label> <p class="form-control" id = "relationtostudent" style="border:1px solid #eceeef;"> {{StudentDetails$.relationtostudent}} </p></div>

                    <h5>Κοινωνικά Κριτίρια </h5>
                    <div *ngFor="let critiriaChoices$  of CritirioChosen$ | async" [hidden]="UserData$.id !== userActive">
                         {{critiriaChoices$.critirio}}
                    </div>

                    <h5>Εισοδηματικά Κριτίρια </h5>
                    <div *ngFor="let incomeChoices$  of incomeChosen$ | async" [hidden]="UserData$.id !== userActive">
                         {{incomeChoices$.critirio}}
                     </div>

                    <h5>Επιλογές ΕΠΑΛ</h5>
                    <div *ngFor="let epalChoices$  of EpalChosen$ | async" [hidden]="UserData$.id !== userActive">
                         Σχολείο: {{epalChoices$.epal_id}}
                         Σειρά Προτίμισης:{{epalChoices$.choice_no}}
                    </div>
                   </div>
              </div>
             </div>
            </ul>
            <br>
            <button type="button" (click)="createPdf()">Εξαγωγή σε PDF</button>

   `
})

@Injectable() export default class SubmitedPreview implements OnInit , OnDestroy{


    private SubmitedApplic$: BehaviorSubject<any>;
    private SubmitedUsersSub: Subscription;
    private SubmitedDetails$: BehaviorSubject<any>;
    private SubmitedDetailsSub: Subscription;

    private EpalChosen$: BehaviorSubject<any>;
    private EpalChosenSub: Subscription;

    private incomeChosen$: BehaviorSubject<any>;
    private incomeChosenSub: Subscription;
    private CritirioChosen$: BehaviorSubject<any>;
    private CritirioChosenSub: Subscription;
    private showLoader$: BehaviorSubject<boolean>;


    public StudentId;
    private userActive = <number>-1;

  @ViewChild('target') element: ElementRef;

    constructor(private _hds: HelperDataService,
                private activatedRoute: ActivatedRoute,
                private router: Router ,
              )
    {
       this.SubmitedApplic$ = new BehaviorSubject([{}]);
       this.SubmitedDetails$ = new BehaviorSubject([{}]);
       this.EpalChosen$ = new BehaviorSubject([{}]);
       this.CritirioChosen$ = new BehaviorSubject([{}]);
       this.incomeChosen$ = new BehaviorSubject([{}]);
       this.showLoader$ = new BehaviorSubject(false);
    }

    ngOnDestroy()
    {
        if (this.SubmitedUsersSub)
            this.SubmitedUsersSub.unsubscribe();
        if (this.SubmitedDetailsSub)
            this.SubmitedDetailsSub.unsubscribe();
        if (this.EpalChosenSub)
            this.EpalChosenSub.unsubscribe();
        if (this.CritirioChosenSub)
            this.CritirioChosenSub.unsubscribe();
        if (this.incomeChosenSub)
            this.incomeChosenSub.unsubscribe();

        this.SubmitedDetails$.unsubscribe();
        this.EpalChosen$.unsubscribe();
        this.SubmitedApplic$.unsubscribe();

    }

    ngOnInit() {

        this.showLoader$.next(true);

        this.SubmitedUsersSub = this._hds.getSubmittedPreviw().subscribe(
            data => {
                this.SubmitedApplic$.next(data);
                this.showLoader$.next(false);
            },
            error => {
                this.SubmitedApplic$.next([{}]);
                this.showLoader$.next(false);
                console.log("Error Getting Schools");
            },
            () => {
                console.log("Getting Schools")
                this.showLoader$.next(false);
            });

    }




  setActiveUser(ind,i)
  {
      ind = +ind;
      console.log(this.userActive,"RA",ind);
      if (ind === this.userActive){
        ind = -1;
      }
      ind--;
      this.userActive = ind+1 ;
      this.showLoader$.next(true);
      this.SubmitedDetailsSub = this._hds.getStudentDetails(this.userActive+1).subscribe(data => {
          this.SubmitedDetails$.next(data);
          this.showLoader$.next(false);
    },
            error => {
                this.SubmitedDetails$.next([{}]);
                console.log("Error Getting Schools");
                this.showLoader$.next(false);
            },
             () => {
                 console.log("Getting Schools");
                 this.showLoader$.next(false);
             });
      this.EpalChosenSub = this._hds.getEpalchosen(this.userActive+1).subscribe(data => {
        this.EpalChosen$.next(data)},
            error => {
                this.EpalChosen$.next([{}]);
                console.log("Error Getting Schools");
            },
             () => console.log("Getting Schools"));
    this.CritirioChosenSub = this._hds.getCritiria(this.userActive+1, 1).subscribe(data => {
        this.CritirioChosen$.next(data)},
            error => {
                this.CritirioChosen$.next([{}]);
                console.log("Error Getting Schools");
            },
             () => console.log("Getting Schools"));
    this.incomeChosenSub = this._hds.getCritiria(this.userActive+1, 2).subscribe(data => {
          this.incomeChosen$.next(data)},
              error => {
                  this.incomeChosen$.next([{}]);
                  console.log("Error Getting Schools");
              },
               () => console.log("Getting Schools"));

   }

 createPdf1()
    {

       html2canvas(document.getElementById("target")).then(function(canvas)
        {


          var img=new Image();
          img.src=canvas.toDataURL();
          img.onload=function(){
            console.log(img,"img");
            var doc = new jsPDF();
            console.log(img, doc, "ok");
            doc.addImage(img, 'PNG',0, 0, 210, 297);
            console.log(img, doc, "ok2");
            doc.save('applications.pdf');
 
          }





          },
          function(error){
              console.log("i fail");
            });
     }




createPdf()
{

html2canvas(document.getElementById("target"), <Html2Canvas.Html2CanvasOptions>{
      onrendered: function(canvas: HTMLCanvasElement) {
        var img = canvas.toDataURL();
                  var doc = new jsPDF();
                               
                  console.log("mphkaneo");
             setTimeout(function(){
               

                 
    }, 10000);
              doc.addImage(img, 'PNG',0, 0, 1000, 1000);
                  console.log("mphkaneoneo");
                  doc.save('applications.pdf');
}
}); }
  
  

}
 

