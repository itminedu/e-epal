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
        <div class="row"> 
             <breadcrubs></breadcrubs>
        </div>
            Έχει υποβληθεί αίτηση για εγγραφή στην Επαγγελματική Εκπαίδευση των παρακάτω ατόμων:
           
              <ul class="list-group main-view">
               <div *ngFor="let UserData$  of SubmitedApplic$ | async; let i=index; let isOdd=odd; let isEven=even"  >
                 <li class="list-group-item isclickable" [class.oddout]="isOdd" [class.evenout]="isEven" (click)="setActiveUser(UserData$.id)" [class.selectedout]="userActive === UserData$.id" >
                  <h5> {{UserData$.name}}&nbsp;{{UserData$.studentsurname}} </h5>
                 </li>
                  <div id = "target">

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



                     <p><b>Επιλογές ΕΠΑΛ</b> </p>
                     <br>
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
 

    public StudentId;
    private userActive = <number>-1;

    constructor(private _hds: HelperDataService,
                private activatedRoute: ActivatedRoute,
                private router: Router ,
              )
    {
       this.SubmitedApplic$ = new BehaviorSubject([{}]);
       this.SubmitedDetails$ = new BehaviorSubject([{}]);
       this.EpalChosen$ = new BehaviorSubject([{}]);
    }

    ngOnDestroy()
    {
        if (this.SubmitedUsersSub)
            this.SubmitedUsersSub.unsubscribe();
        if (this.SubmitedDetailsSub)
            this.SubmitedDetailsSub.unsubscribe();
        if (this.EpalChosenSub)
            this.EpalChosenSub.unsubscribe();
        this.SubmitedDetails$.unsubscribe();
        this.EpalChosen$.unsubscribe();
        this.SubmitedApplic$.unsubscribe();

    }
 
    ngOnInit() {


        this.SubmitedUsersSub = this._hds.getSubmittedPreviw().subscribe(data => {
          this.SubmitedApplic$.next(data)},
            error => {
                this.SubmitedApplic$.next([{}]);
                console.log("Error Getting Schools");
            },
            () => console.log("Getting Schools"));
        console.log(this.SubmitedApplic$);


    



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
      this.SubmitedDetailsSub = this._hds.getStudentDetails(this.userActive+1).subscribe(data => {
        this.SubmitedDetails$.next(data)},
            error => {
                this.SubmitedDetails$.next([{}]);
                console.log("Error Getting Schools");
            },
             () => console.log("Getting Schools"));
      this.EpalChosenSub = this._hds.getEpalchosen(this.userActive+1).subscribe(data => {
        this.EpalChosen$.next(data)},
            error => {
                this.EpalChosen$.next([{}]);
                console.log("Error Getting Schools");
            },
             () => console.log("Getting Schools"));


   }

 createPdf()
    {
       console.log("lalalalalala"); 


       html2canvas(document.getElementById("target")).then(function(canvas)
        {
            var img = canvas.toDataURL();
            var doc = new jsPDF('p', 'mm');
            console.log(img, doc, "lalalalalala");
            doc.addImage(img, 'PNG', 10, 10);
            doc.save('applications.pdf');
        });
    }









createPdf1()
    {

      var srcpath;
      var imgageData = new Image();
      imgageData.id = "pic";
      var doc = new jsPDF({
              unit:'px', 
              format:'a4'
            });
       console.log("lalalalalala"); 
html2canvas(document.getElementById("target")), {
    onrendered: function (canvas) {
        srcpath = canvas.toDataURL("image/png");
        imgageData.src=srcpath;
        doc.addImage(imgageData , 'PNG',  20, 20,400,150);
    }
    }

   }   


}
