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
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';



@Component({ 
    selector: 'submited-preview',
    template: `
         <div class="row"> 
             <breadcrubs></breadcrubs>
        </div>
            Έχει υποβληθεί αίτηση για εγγραφή στην Επαγγελματική Εκπαίδευση των παρακάτω ατόμων:
           
              <ul class="list-group main-view">
               <div *ngFor="let UserData$  of SubmitedApplic$ | async; let i=index; let isOdd=odd; let isEven=even"  >
                 <li class="list-group-item isclickable" [class.oddout]="isOdd" 
                 [class.evenout]="isEven" (click)="setActiveUser(UserData$.id)" [class.selectedout]="userActive === UserData$.id" >
                  <h5> {{UserData$.name}}&nbsp;{{UserData$.studentsurname}} </h5>
                   </li>
                  <div id = "target">
               


                  <div *ngFor="let StudentDetails$  of SubmitedDetails$ | async" [hidden]="UserData$.id !== userActive" >
                       <form [formGroup]="studentDataGroup" >
                                    <form [formGroup]="applicantDataGroup">
                                      <table>
                                        <tr><td>
                                          <div class="form-group">
                                            <label for="guardianfirstname">Όνομα κηδεμόνα</label><input class="form-control" type="text" formControlName="guardianfirstname" disabled = "true">
                                          </div>
                                        </td>
                                        <td>
                                          <div class="form-group">
                                            <label for="guardiansurname">Επώνυμο κηδεμόνα</label><input class="form-control" type="text" formControlName="guardiansurname" disabled = "true">
                                          </div>
                                        </td></tr>
                                      </table>
                                    </form>

                                    <div class="form-group">
                                        <label for="name">Όνομα μαθητή</label><input class="form-control" type="text" formControlName="name">
                                    </div>
                                   
                                    <div class="form-group">
                                        <label for="studentsurname">Επώνυμο μαθητή</label><input class="form-control" type="text" formControlName="studentsurname">
                                    </div>
                                   
                                    <div class="form-group">
                                        <label for="fatherfirstname">Όνομα πατέρα</label><input class="form-control" type="text" formControlName="fatherfirstname">
                                    </div>
                                   
                                    <div class="form-group">
                                        <label for="fathersurname">Επώνυμο πατέρα</label><input class="form-control" type="text" formControlName="fathersurname">
                                    </div>
                                   
                                    <div class="form-group">
                                        <label for="motherfirstname">Όνομα μητέρας</label><input class="form-control" type="text" formControlName="motherfirstname">
                                    </div>
                                   
                                    <div class="form-group">
                                        <label for="mothersurname">Γένος μητέρας</label><input class="form-control" type="text" formControlName="mothersurname">
                                    </div>
                                   
                                   
                                  <div class="form-group">
                                      <label for="studentbirthdate">Ημερομηνία γέννησης</label>
                                      <input class="form-control" type="date" formControlName="studentbirthdate">
                                  </div>

                                    <table>
                                        <tr>
                                            <td>
                                                <div class="form-group">
                                                    <label for="regionaddress">Διεύθυνση κατοικίας</label><input class="form-control" type="text" formControlName="regionaddress">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-group">
                                                    <label for="regiontk">TK </label><input class="form-control" type="text" formControlName="regiontk">
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-group">
                                                    <label for="regionarea">Πόλη/Περιοχή</label><input class="form-control" type="text" formControlName="regionarea">
                                                </div>
                                            </td>
                                        </tr>
                                    </table>


                                    <div class="form-group">
                                        <label for="telnum">Τηλέφωνο επικοινωνίας</label><input class="form-control" type="text" formControlName="telnum">
                                    </div>

                                 
                                  </form>



                                 

                          



                 <strong> Όνομα:</strong>    <p style="border:1px solid #eceeef;">    {{StudentDetails$.name}} </p>
                 <strong> Επώνυμο:</strong>    <p style="border:1px solid #eceeef;">    {{StudentDetails$.studentsurname}} </p>
                 <strong> Όνομα Πατέρα:</strong>  <p style="border:1px solid #eceeef;"> {{StudentDetails$.fatherfirstname}}</p>
                 <strong> Επώνυμο Πατέρα:</strong> <p style="border:1px solid #eceeef;">{{StudentDetails$.fathersurname}}</p>
                 <strong> Όνομα Μητέρας:</strong>  <p style="border:1px solid #eceeef;">{{StudentDetails$.motherfirstname}}</p>
                 <strong> Επώνυμο Μητέρας:</strong> <p style="border:1px solid #eceeef;">{{StudentDetails$.mothersurname}}</p>
                 <strong> Ημερομηνία Γέννησης:</strong> <p style="border:1px solid #eceeef;">{{StudentDetails$.birthdate}}</p>
                 <p><b>Επιλογές ΕΠΑΛ</b> </p>
                 <br>
               </div>
                
                <div *ngFor="let epalChoices$  of EpalChosen$ | async" [hidden]="UserData$.id !== userActive">
                     Σχολείο: {{epalChoices$.epal_id}}
                     Σειρά Προτίμισης:{{epalChoices$.choice_no}}
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
    public studentDataGroup: FormGroup;
    public applicantDataGroup: FormGroup;


    public StudentId;
    private userActive = <number>-1;

    constructor(private _hds: HelperDataService,
                private activatedRoute: ActivatedRoute,
                private router: Router ,
                private fb: FormBuilder)
    {
       this.SubmitedApplic$ = new BehaviorSubject([{}]);
       this.SubmitedDetails$ = new BehaviorSubject([{}]);
       this.EpalChosen$ = new BehaviorSubject([{}]);

      this.studentDataGroup = this.fb.group({
            epaluser_id: [,[]],
            name: ['ΝΙΚΟΣ'],
            studentsurname: ['ΚΑΤΣΑΟΥΝΟΣ'],
            studentbirthdate: [''],
        });

        this.applicantDataGroup = this.fb.group({
          guardianfirstname: ['ΑΝΑΣΤΑΣΙΟΣ'],
          guardiansurname: ['ΚΑΤΣΑΟΥΝΟΣ'],
        });




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
        
       html2canvas(document.getElementById("target")).then(function(canvas)
        {
            var img = canvas.toDataURL();
            var doc = new jsPDF('p', 'mm');
            doc.addImage(img, 'PNG', 10, 10);
            doc.save('applications.pdf');
        });
    }
}
