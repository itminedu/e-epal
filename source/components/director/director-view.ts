import { Component, OnDestroy, OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs/Rx";

import { HelperDataService } from "../../services/helper-data-service";

@Component({
    selector: "director-classcapacity",
    template: `


      <div id="applicationDeleteConfirm" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
              <h3 class="modal-title pull-left"><i class="fa fa-close"></i>&nbsp;&nbsp;Διαγραφή Δήλωσης Προτίμησης ΕΠΑΛ</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>Επιλέξατε να διαγράψετε τη δήλωση προτίμησης ΕΠΑΛ. Παρακαλούμε επιλέξτε Επιβεβαίωση</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="hideConfirmModal()">Ακύρωση</button>
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal" (click)="deleteApplicationDo()">Επιβεβαίωση</button>
          </div>
        </div>
      </div>
    </div>

    <div id="applicationDeleteError" (onHidden)="onHidden()" class="modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
              <h3 class="modal-title pull-left"><i class="fa fa-ban"></i>&nbsp;&nbsp;Αποτυχία Διαγραφής Δήλωσης Προτίμησης ΕΠΑΛ</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
              <p>Η δήλωσή δεν διαγράφηκε. Δεν μπορείτε να διαγράψετε τη δήλωσή μαθητή εαν έχετε κάνει την επιβεβαίωση εγγραφής.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-right" data-dismiss="modal" (click)="hideErrorModal()">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
    <div class = "loading" *ngIf="(showLoader | async) === true"></div>
    <div style="min-height: 500px;">
    <form>
       <p style="margin-top: 20px; line-height: 2em;"> H παρακάτω λίστα διαμορφώνει τη δυναμική του σχολείου σας σε τμήματα με κριτήριο τον αριθμό των διαθεσίμων αιθουσών.  </p>
       <p style="margin-top: 20px; line-height: 2em;"> Παρακαλείστε να καταγράψετε τον αριθμό των τμημάτων ανά τάξη, τομέα και ειδικότητα.  </p>

      <div class="row">
         <div class="col-md-10" style="font-weight: bold;"> Τα τμήματα του σχολείου σας.</div>
         <div class="col-md-2" style="font-weight: bold;"> <span class="pull-right" style="text-align: right; padding-right: 2px;">Αριθμός Μαθητών</span></div>
      </div>
      <div *ngFor="let CoursesPerSchools$  of CoursesPerSchool$ | async; let i=index; let isOdd=odd; let isEven=even" >
                <li class="list-group-item isclickable" (click)="setActive(i)"
                (click)="findstudent(CoursesPerSchools$.class, CoursesPerSchools$.newsector, CoursesPerSchools$.newspecialit)"
                [class.changelistcolor]= "CoursesPerSchools$.size < CoursesPerSchools$.limitdown"
                [class.oddout]="isOdd" [class.evenout]="isEven"  [class.selectedout]="courseActive === i" >
                <div class="row"  style="line-height: 2em;">
                  <div class="col-md-10" style="font-weight: bold;" >{{CoursesPerSchools$.taxi}}</div>
                  <div class="col-md-2" style="font-weight: bold;" ><span class="pull-right" style="text-align: right; padding-right: 2px;">{{CoursesPerSchools$.size}}</span></div>
                </div>
                </li>

               <div [hidden]="courseActive !== i" *ngIf="(retrievedStudent | async)">
                 <div *ngFor="let StudentDetails$  of StudentInfo$ | async; let j=index; let isOdd=odd; let isEven=even" class="row list-group-item isclickable"
                 [class.selectedappout]="StudentActive === j"
                 [class.confirmed]="StudentDetails$.checkstatus === '1'"
                 [class.notconfirmed]="StudentDetails$.checkstatus === '0'"
                 [class.notchecked]="(StudentDetails$.checkstatus !== '1') && (StudentDetails$.checkstatus !== '0')"
                 [class.oddout]="isOdd" [class.evenout]="isEven" style="margin: 0px 2px 0px 2px;">
                    <div class="col-md-5" style="font-size: 0.8em; font-weight: bold;" (click) ="setActiveStudent(j)" >{{StudentDetails$.studentsurname}}</div>
                    <div class="col-md-5" style="font-size: 0.8em; font-weight: bold;" (click) ="setActiveStudent(j)">{{StudentDetails$.name}}</div>
                    <div class="col-md-2" style="font-size: 1.5em; font-weight: bold;"><i class="fa fa-trash isclickable" (click)="deleteApplication(StudentDetails$.id, CoursesPerSchools$.class, CoursesPerSchools$.newsector, CoursesPerSchools$.newspecialit)"></i></div>

                    <div [hidden]="StudentActive !== j" class="col-md-2 pull-right" style="color: black;" > <span aria-hidden="true"><button type="button" class="btn-primary btn-sm pull-right" (click) ="setActiveStudentnew(j)">Κλείσιμο</button></span>  </div>

                    <div style="width: 100%; color: #000000;">
                    <div [hidden]="StudentActive !== j"  style="margin: 20px 10px 10px 10px;">

                     <p style="margin-top: 10px; margin-bottom: 5px; line-height: 2em;"> Παρακαλούμε, αφού γίνει ο έλεγχος των στοιχείων του μαθητή επιβεβαιώστε τη δυνατότητα εγγραφής του.</p>

                     <div class="row" style="margin-bottom: 20px;">
                     <div class="col-md-8">&nbsp;</div>
                     <div class="col-md-4">
                      <strong><label>Επιβεβαίωση Εγγραφής:</label> </strong>
                      <select class="form-control pull-right" #cb name="{{StudentDetails$.id}}" (change)="confirmStudent(StudentDetails$.id, cb, j)">
                          <option value="1" [selected]="StudentDetails$.checkstatus === '1' ">Ναι</option>
                          <option value="2" [selected]="StudentDetails$.checkstatus === '0' ">Όχι</option>
                          <option value="3" [selected]="StudentDetails$.checkstatus != '0' && StudentDetails$.checkstatus != '1'">Δεν ελέγχθηκε</option>
                      </select>
                      </div>
                     </div>

                     <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                         <div class="col-md-3" style="font-size: 0.8em;">Αριθμός Δήλωσης Προτίμησης ΕΠΑΛ</div>
                         <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.id}}</div>
                         <div class="col-md-3" style="font-size: 0.8em;">Υποβλήθηκε</div>
                         <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.created}}</div>
                     </div>

                       <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία αιτούμενου</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.guardian_name}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.guardian_surname}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα πατέρα</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.guardian_fathername }}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα μητέρας</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.guardian_mothername }}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Διεύθυνση</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.regionaddress}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">ΤΚ - Πόλη</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.regiontk}} - {{StudentDetails$.regionarea}}</div>
                       </div>

                       <div class="row evenin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-12" style="font-size: 1em; font-weight: bold; text-align: center;">Στοιχεία μαθητή</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα μαθητή</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.name}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Επώνυμο μαθητή</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.studentsurname}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα Πατέρα</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.fatherfirstname}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Όνομα Μητέρας</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.motherfirstname}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Ημερομηνία Γέννησης</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.birthdate}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Τηλέφωνο Επικοινωνίας</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.telnum}}</div>
                       </div>

                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Σχολείο τελευταίας φοίτησης</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolname}}</div>
                           <div class="col-md-3" style="font-size: 0.8em;">Σχολικό έτος τελευταίας φοίτησης</div>
                           <div class="col-md-3" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.lastschool_schoolyear}}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Τάξη τελευταίας φοίτησης</div>
                           <div *ngIf="StudentDetails$.lastschool_class === '1'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Α</div>
                           <div *ngIf="StudentDetails$.lastschool_class === '2'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Β</div>
                           <div *ngIf="StudentDetails$.lastschool_class === '3'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Γ</div>
                           <div *ngIf="StudentDetails$.lastschool_class === '4'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Δ</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Δήλωση από:</div>
                           <div class="col-md-9" style="font-size: 0.8em; font-weight: bold">{{ StudentDetails$.relationtostudent }}</div>
                       </div>
                       <div class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Τάξη φοίτησης για το νέο σχολικό έτος</div>
                           <div *ngIf="StudentDetails$.currentclass === '1'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Α</div>
                           <div *ngIf="StudentDetails$.currentclass === '2'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Β</div>
                           <div *ngIf="StudentDetails$.currentclass === '3'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Γ</div>
                           <div *ngIf="StudentDetails$.currentclass === '4'" class="col-md-9" style="font-size: 0.8em; font-weight: bold">Δ</div>
                       </div>
                       <div *ngIf="StudentDetails$.currentclass === '2'" class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Τομέας φοίτησης για το νέο σχολικό έτος</div>
                           <div class="col-md-9" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.currentsector}}</div>
                       </div>
                       <div *ngIf="StudentDetails$.currentclass === '3' || StudentDetails$.currentclass === '4'" class="row oddin" style="margin: 0px 2px 0px 2px; line-height: 2em;">
                           <div class="col-md-3" style="font-size: 0.8em;">Ειδικότητα φοίτησης για το νέο σχολικό έτος</div>
                           <div class="col-md-9" style="font-size: 0.8em; font-weight: bold">{{StudentDetails$.currentcourse}}</div>
                       </div>

                 </div>
                 </div>


                 </div>
               </div>
       </div>
      </form>
      </div>


  <div id="checksaved" (onHidden)="onHidden('#checksaved')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-success">
            <h3 class="modal-title pull-left"><i class="fa fa-check-square-o"></i>&nbsp;&nbsp;Η επιλογή σας έχει αποθηκευτεί</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#checksaved')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Η επιλογή σας έχει αποθηκευτεί</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>


<div id="dangermodal" (onHidden)="onHidden('#dangermodal')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
            <h3 class="modal-title pull-left"><i class="fa fa-ban"></i>&nbsp;&nbsp;Η επιλογή σας δεν έχει αποθηκευτεί</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#dangermodal')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Παρακαλώ προσπαθήστε ξανα!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>


    <div id="emptyselection" (onHidden)="onHidden('#emptyselection')"
    class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header modal-header-danger">
            <h3 class="modal-title pull-left"><i class="fa fa-ban"></i>&nbsp;&nbsp;Δεν υπάρχουν μαθητές</h3>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal('#emptyselection')">
              <span aria-hidden="true"><i class="fa fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body">
            <p>Δεν υπάρχουν μαθητές με δήλωση προτίμησης το συγκεκριμένο τμήμα του σχολείου σας!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Κλείσιμο</button>
          </div>
        </div>
      </div>
    </div>
   `
})

@Injectable() export default class DirectorClassCapacity implements OnInit, OnDestroy {

    private CoursesPerSchool$: BehaviorSubject<any>;
    private CoursesPerSchoolSub: Subscription;
    private StudentInfo$: BehaviorSubject<any>;
    private StudentInfoSub: Subscription;
    private retrievedStudent: BehaviorSubject<boolean>;
    private SavedStudentsSub: Subscription;
    private SavedStudents$: BehaviorSubject<any>;
    private courseActive = <number>-1;
    private StudentActive = <number>-1;
    private showLoader: BehaviorSubject<boolean>;
    private opened;
    private applicationId = <number>0;
    private taxi = <number>0;
    private sector = <number>0;
    private special = <number>0;

    constructor(
        private _hds: HelperDataService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.CoursesPerSchool$ = new BehaviorSubject([{}]);
        this.showLoader = new BehaviorSubject(false);
        this.StudentInfo$ = new BehaviorSubject([{}]);
        this.retrievedStudent = new BehaviorSubject(false);
        this.SavedStudents$ = new BehaviorSubject({});
        this.opened = false;
    }

    public showConfirmModal(): void {
        (<any>$("#applicationDeleteConfirm")).modal("show");
    }

    public showErrorModal(): void {
        (<any>$("#applicationDeleteError")).modal("show");
    }

    public hideConfirmModal(): void {
        (<any>$("#applicationDeleteConfirm")).modal("hide");
    }
    public hideErrorModal(): void {
        (<any>$("#applicationDeleteError")).modal("hide");
    }

    public showModal(popupMsgId): void {
        (<any>$(popupMsgId)).modal("show");
    }

    public hideModal(popupMsgId): void {

        (<any>$(popupMsgId)).modal("hide");
    }

    public onHidden(popupMsgId): void {

    }

    ngOnDestroy() {
        (<any>$("#applicationDeleteConfirm")).remove();
        (<any>$("#applicationDeleteError")).remove();
    }

    ngOnInit() {
        (<any>$("#checksaved")).appendTo("body");
        (<any>$("#dangermodal")).appendTo("body");
        (<any>$("#emptyselection")).appendTo("body");
        (<any>$("#applicationDeleteConfirm")).appendTo("body");
        (<any>$("#applicationDeleteError")).appendTo("body");
        this.showLoader.next(true);
        this.CoursesPerSchoolSub = this._hds.FindCoursesPerSchool().subscribe(x => {
            this.CoursesPerSchool$.next(x);
            this.showLoader.next(false);
        },
            error => {
                this.CoursesPerSchool$.next([{}]);
                console.log("Error Getting courses perSchool");
                this.showLoader.next(false);
            });
    }

    findstudent(taxi, sector, special) {
        this.showLoader.next(true);
        this.retrievedStudent.next(false);
        this.StudentInfoSub = this._hds.getStudentPerSchool(taxi, sector, special)
            .subscribe(data => {
                this.StudentInfo$.next(data);
                this.retrievedStudent.next(true);
                this.showLoader.next(false);
            },
            error => {
                this.StudentInfo$.next([{}]);
                console.log("Error Getting Students");
                this.showLoader.next(false);
                this.showModal("#emptyselection");
            });

    }

    setActive(ind) {
        this.StudentActive = -1;
        if (this.courseActive === ind) {
            ind = -1;
        }
        this.courseActive = ind;
    }

    setActiveStudent(ind) {
        this.opened = true;
        if (this.StudentActive === ind) {
            ind = -1;
        }
        this.StudentActive = ind;
    }

    setActiveStudentnew(ind) {
        this.opened = false;
        if (this.StudentActive === ind) {
            ind = -1;
        }
        this.StudentActive = ind;
    }

    confirmStudent(student, cb, ind) {
        let rtype;
        if (cb.value === 1)
            rtype = "1";
        if (cb.value === 2)
            rtype = "0";
        if (cb.value === 3)
            rtype = null;
        let type = cb.value;
        this.showLoader.next(true);

        let std = this.StudentInfo$.getValue();
        std[ind].checkstatus = rtype;

        this.SavedStudentsSub = this._hds.saveConfirmStudents(student, type).subscribe(data => {
            this.SavedStudents$.next(data);
            this.StudentInfo$.next(std);
            this.showLoader.next(false);
            this.showModal("#checksaved");
        },
            error => {
                this.SavedStudents$.next([{}]);
                console.log("Error saving Students");
                this.showLoader.next(false);
                this.showModal("#dangermodal");
            });
    }

    deleteApplication(appId: number, taxi, sector, special): void {

        this.applicationId = appId;
        this.taxi = taxi;
        this.sector = sector;
        this.special = special;
        this.showConfirmModal();
    }

    deleteApplicationDo(): void {

        this.hideConfirmModal();
        this.showLoader.next(true);
        this._hds.deleteApplicationforDirector(this.applicationId).then(data => {
            this.StudentInfoSub.unsubscribe();
            this.CoursesPerSchoolSub.unsubscribe();
            this.showLoader.next(false);
            this.StudentActive = -1;

            this.CoursesPerSchoolSub = this._hds.FindCoursesPerSchool().subscribe(x => {
                this.CoursesPerSchool$.next(x);
                this.showLoader.next(false);

            },
                error => {
                    this.CoursesPerSchool$.next([{}]);
                    console.log("Error Getting courses perSchool");
                    this.showLoader.next(false);
                });
            this.StudentInfoSub = this._hds.getStudentPerSchool(this.taxi, this.sector, this.special)
                .subscribe(data => {
                    this.StudentInfo$.next(data);
                    this.retrievedStudent.next(true);
                    this.showLoader.next(false);
                },
                error => {
                    this.StudentInfo$.next([{}]);
                    console.log("Error Getting Students");
                    this.showLoader.next(false);
                    this.showModal("#emptyselection");
                });
        }).catch(err => {
            this.showErrorModal();
            this.showLoader.next(false);
        });
    }
}
