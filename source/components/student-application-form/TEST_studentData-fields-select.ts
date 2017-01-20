import {Component, OnInit} from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Injectable} from "@angular/core";
import {CourseFieldsActions} from '../../actions/coursefields.actions';
import {StudentDataFieldsActions} from '../../actions/studentdatafields.actions';

import { DevToolsExtension, NgRedux, select } from 'ng2-redux';
import { ICourseField, ICourseFields } from '../../store/coursefields/coursefields.types';
import { IStudentDataField, IStudentDataFields } from '../../store/studentdatafields/studentdatafields.types';
import { IAppState } from '../../store/store';

import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    FormsModule,
    Validators,
} from '@angular/forms';
import {AppSettings} from '../../app.settings';

@Component({
  //moduleId: module.id,
  selector: 'studentdata-fields-select',

  //templateUrl: './eepal-front/source/components/form-controls/applicantinfo-form.component.html'

  template: `
  <form [formGroup]="studentDataGroup">


  <div formArrayName="formArray">
      <div *ngFor="let studentdataField$ of studentdataFields$ | async; let i=index">
      <div class="row">
      <div class="col-md-1">
          <input type="checkbox" formControlName="{{i}}">
      </div>
<!--
      <div class="col-md-11 pull-left">
          {{studentdataField$.studentFirstname}}
      </div>
-->
      </div>
      </div>
  </div>







     <label>Όνομα μαθητή</label><input type="text" formControlName="studentFirstname"  required >
     <small [hidden]="(studentDataGroup.controls.studentFirstname.pristine || !studentDataGroup.controls.studentFirstname.hasError('isnumeric')) ">
         Το όνομα δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.studentFirstname.pristine || !studentDataGroup.controls.studentFirstname.hasError('isempty')) ">
         Δώστε το όνομα του μαθητή..<br/>
     </small>

     <label>Επώνυμο μαθητή</label><input type="text" formControlName="studentSurname"  required>
     <small [hidden]="(studentDataGroup.controls.studentSurname.pristine || !studentDataGroup.controls.studentSurname.hasError('isnumeric')) ">
         Το επώνυμο δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.studentSurname.pristine || !studentDataGroup.controls.studentSurname.hasError('isempty')) ">
         Δώστε το επώνυμο του μαθητή..<br/>
     </small>

     <label>Όνομα κηδεμόνα</label><input type="text" formControlName="guardianFirstname"  required>
     <small [hidden]="(studentDataGroup.controls.guardianFirstname.pristine || !studentDataGroup.controls.guardianFirstname.hasError('isnumeric')) ">
         Το όνομα δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.guardianFirstname.pristine || !studentDataGroup.controls.guardianFirstname.hasError('isempty')) ">
         Δώστε το όνομα του κηδεμόνα..<br/>
     </small>

     <label>Επώνυμο κηδεμόνα</label><input type="text" formControlName="guardianSurname"  required>
     <small [hidden]="(studentDataGroup.controls.guardianSurname.pristine || !studentDataGroup.controls.guardianSurname.hasError('isnumeric')) ">
         Το επώνυμο δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.guardianSurname.pristine || !studentDataGroup.controls.guardianSurname.hasError('isempty')) ">
         Δώστε το επώνυμο του κηδεμόνα..<br/>
     </small>

     <table><tr>
     <td>
     <div   class="form-group">
        <label>Διεύθυνση κατοικίας</label><input type="text" formControlName="regionAddress" >
     </div>
     </td>
     <td>
     <div   class="form-group">
        <label>TK </label><input type="text" formControlName="regionTK" >
     </div>
     </td>
     <td>
     <div   class="form-group">
        <label>Πόλη/Περιοχή</label><input type="text" formControlName="regionArea" >
     </div>
     </td>
     </tr></table>

     <label for="certificateType">Τύπος απολυτηρίου</label><br/>
     <select formControlName="certificateType"  required>
       <option value="Παρακαλώ επιλέξτε..">Παρακαλώ επιλέξτε..</option>
       <option value="Απολυτήριο Γυμνασίου">Απολυτήριο Γυμνασίου</option>
       <option value="Απολυτήριο Λυκείου">Απολυτήριο Λυκείου</option>
     </select>
     <small [hidden]="(studentDataGroup.controls.certificateType.pristine || !studentDataGroup.controls.certificateType.hasError('isempty')) ">
         Δώστε τον τύπο απολυτηρίου..<br/>
     </small>
     <br/><br/>


     <label for="relationToStudent">Η αίτηση γίνεται από:</label><br/>
     <select formControlName="relationToStudent" >
       <option value="Παρακαλώ επιλέξτε..">Παρακαλώ επιλέξτε..</option>
       <option value="Γονέας/Κηδεμόνας">Γονέας/Κηδεμόνας</option>
       <option value="Μαθητής">Μαθητής</option>
    </select>
    <br/>




     <div class="row">
     <div class="col-md-2 col-md-offset-5">
         <button class="btn-primary btn-lg pull-center" (click)="saveSelected()">Συνέχεια</button>
     </div>
     </div>
 </form>

  `


})




 @Injectable() export default class StudentDataFieldsSelect implements OnInit {

   private studentdataFields$: Observable<IStudentDataFields>;
   //relationsToStudentChoices = ['Παρακαλώ επιλέξτε..','Γονέας/Κηδεμόνας',  'Μαθητής'];

   public studentDataGroup: FormGroup;

   public cfs = new FormArray([]);

   constructor(private http: Http, private fb: FormBuilder, private _cfa: StudentDataFieldsActions, private _ngRedux: NgRedux<IAppState>) {

/*
     this.studentDataGroup = this.fb.group({
       studentFirstname: {},
       studentSurname: {},
       guardianFirstname: {},
       guardianSurname: {},
       regionAddress: {},
       regionTK: {},
       regionArea: {},
       certificateType: {},
       relationToStudent: {},
   });
*/


    this.studentDataGroup = this.fb.group({
          formArray: this.cfs,
          studentFirstname: ['', validateName],
          studentSurname: ['', validateName],
          guardianFirstname: ['', validateName],
          guardianSurname: ['', validateName],
          regionAddress: ['', Validators.required],
          regionTK: ['', Validators.required],
          regionArea: ['', Validators.required],
          certificateType: ['Παρακαλώ επιλέξτε..', Validators.required],
          relationToStudent: ['Παρακαλώ επιλέξτε..', Validators.required],
        });




    };


   ngOnInit() {

       this._cfa.getStudentDataFields();

       this.studentdataFields$ = this._ngRedux.select(state => {
         console.log("test");
           state.studentdataFields.reduce(({}, studentdataField) =>{
               //this.cfs.push(new FormControl(studentdataField.studentFirstname, []));
               console.log(studentdataField.studentFirstname);
               return studentdataField;
           }, {});
           return state.studentdataFields;
       });
       /*
        console.log(this.studentDataGroup.value.studentFirstname);
       this.studentdataFields$ = this._ngRedux.select(state => {
              console.log("this.studentDataGroup.value.studentFirstname");
           state.studentdataFields.reduce(({}, studentdataField) =>{
              console.log("this.studentDataGroup.value.studentFirstname");
*/
             //this.studentDataG = this.fb.group({
                 //formArray: this.cfs,

                /*
                 this.studentDataGroup.studentFirstname = new FormControl(studentFirstname, validateName);
                  this.studentDataGroup.studentSurname = new FormControl(studentSurname, validateName);
                 this.studentDataGroup.guardianFirstname = new FormControl(guardianFirstname, validateName);
                 this.studentDataGroup.guardianSurname = new FormControl(guardianSurname, validateName);
                 this.studentDataGroup.regionAddress = new FormControl(regionAddress, validateName);
                 this.studentDataGroup.regionTK = new FormControl(regionTK, validateName);
                 this.studentDataGroup.regionArea = new FormControl(regionArea, validateName);
                 this.studentDataGroup.certificateType = new FormControl(certificateType, validateName);
                 this.studentDataGroup.relationToStudent = new FormControl(relationToStudent, validateName);
                */

                 //studentSurname: new FormControl("test", Validators.required)
             //});
              //new FormControl(studentdataField.studentFirstname, []);
               //this.cfs.push(new FormControl(studentdataField.studentFirstname, []));
               //console.log(studentdataField.studentFirstname);





   }

   /*
   ngOnInit() {
       this._cfa.getStudentDataFields();

       this.studentdataFields$ = this._ngRedux.select(state => {
           for (let studentdataField in state.studentdataFields) {
               this.cfs.push(new FormControl('', []));
           }
           return state.studentdataFields;
       });

   }
   */



  saveSelected() {
      //let test = this.studentDataGroup.value.studentFirstname;
      //console.log(test);

      //console.log(this.studentDataGroup.value.studentFirstname);
      //console.log(this.studentDataGroup.value.studentSurname);
      console.log(this.studentDataGroup.value.relationToStudent);

      this._cfa.saveStudentDataFields(this.studentDataGroup.value.studentFirstname, this.studentDataGroup.value.studentSurname,
        this.studentDataGroup.value.guardianFirstname,this.studentDataGroup.value.guardianSurname,
        this.studentDataGroup.value.studentdataFieldsStudentAmka,this.studentDataGroup.value.regionAddress,
        this.studentDataGroup.value.regionTK, this.studentDataGroup.value.regionArea,
        this.studentDataGroup.value.certificateType,this.studentDataGroup.value.relationToStudent );
      //this._cfa.saveStudentDataFields(this.studentDataGroup.value.studentSurname);
      //this._cfa.saveStudentDataFields("nikos");
  }


}



function validateName(c: FormControl) {

  //var str = "texttexttext";
  var dig = ['0','1','2','3','4','5','6','7','8','9'];
  for (var i = 0, len = dig.length; i < len; ++i) {
      if (c.value.indexOf(dig[i]) != -1) {
          // str contains arr[i]
          console.log('not valid')
          return {
            isnumeric: true
          }
      }
  }
/*
   if(c.value.indexOf('1') >= 0) {
     console.log('not valid')
     return {
       isnumeric: true
     }
   }
   */
  if(c.value == "") {
     console.log('not valid')
     return {
       isempty: true
     }
   }
   // Null means valid, believe it or not
   console.log('valid')
   return null
 }


 function validateCertificate(c: FormControl) {
    console.log("New text:");
    console.log(c.value);
     if(c.value == "Παρακαλώ επιλέξτε..") {
      console.log('not valid')
      return {
        isempty: true
      }
    }
    // Null means valid, believe it or not
    console.log('valid')
    return null
  }
