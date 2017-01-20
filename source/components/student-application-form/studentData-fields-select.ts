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
  <form [formGroup]="studentDataGroup" (ngSubmit)="saveSelected()" #applicantForm="ngForm">

 <div *ngFor="let studentdataField$ of studentdataFields$ | async; "> </div>
<!--
     <div formArrayName="formArray">
         <div *ngFor="let studentdataField$ of studentdataFields$ | async; ">

         <div class="row">

         <div class="col-md-1">
             <input type="checkbox" formControlName="{{i}}">
         </div>
         <div class="col-md-11 pull-left">
             {{studentdataField$.guardianADT}}
         </div>

         </div>

         </div>
     </div>
-->
    <label>ΑΜΚΑ μαθητή</label><input type="text"  formControlName="studentAmka"   >

     <label>Όνομα μαθητή</label><input type="text"  formControlName="studentFirstname"  >
     <small [hidden]="(studentDataGroup.controls.studentFirstname.pristine || !studentDataGroup.controls.studentFirstname.hasError('isnumeric')) ">
         Το όνομα δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.studentFirstname.pristine || !studentDataGroup.controls.studentFirstname.hasError('isempty')) ">
         Δώστε το όνομα του μαθητή..<br/>
     </small>

     <label>Επώνυμο μαθητή</label><input type="text" formControlName="studentSurname" >
     <small [hidden]="(studentDataGroup.controls.studentSurname.pristine || !studentDataGroup.controls.studentSurname.hasError('isnumeric')) ">
         Το επώνυμο δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.studentSurname.pristine || !studentDataGroup.controls.studentSurname.hasError('isempty')) ">
         Δώστε το επώνυμο του μαθητή..<br/>
     </small>

     <label>Όνομα κηδεμόνα</label><input type="text" formControlName="guardianFirstname" >
     <small [hidden]="(studentDataGroup.controls.guardianFirstname.pristine || !studentDataGroup.controls.guardianFirstname.hasError('isnumeric')) ">
         Το όνομα δεν μπορεί να περιέχει αριθμητικά ψηφία!<br/>
     </small>
     <small [hidden]="(studentDataGroup.controls.guardianFirstname.pristine || !studentDataGroup.controls.guardianFirstname.hasError('isempty')) ">
         Δώστε το όνομα του κηδεμόνα..<br/>
     </small>

     <label>Επώνυμο κηδεμόνα</label><input type="text" formControlName="guardianSurname" >
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
     <select formControlName="certificateType" required>
       <option value="Παρακαλώ επιλέξτε..">Παρακαλώ επιλέξτε..</option>
       <option value="Απολυτήριο Γυμνασίου">Απολυτήριο Γυμνασίου</option>
       <option value="Απολυτήριο Λυκείου">Απολυτήριο Λυκείου</option>
     </select>
     <br/>
     <small [hidden]="(studentDataGroup.controls.certificateType.pristine || !studentDataGroup.controls.certificateType.hasError('isempty')) ">
         Επιλέξτε τον τύπο απολυτηρίου..<br/>
     </small>
     <br/>

     <label for="relationToStudent">Η αίτηση γίνεται από:</label><br/>
     <select formControlName="relationToStudent" >
       <option value="Παρακαλώ επιλέξτε..">Παρακαλώ επιλέξτε..</option>
       <option value="Γονέας/Κηδεμόνας">Γονέας/Κηδεμόνας</option>
       <option value="Μαθητής">Μαθητής</option>
    </select>
    <br>
    <small [hidden]="(studentDataGroup.controls.relationToStudent.pristine || !studentDataGroup.controls.relationToStudent.hasError('isempty')) ">
        Επιλέξτε από ποιον γίνεται αίτηση..<br/>
    </small>
    <br/><br/>

    <!--
       <div class="row">
       <div class="col-md-2 col-md-offset-5">
       -->
     <div id="outer">
      <!--
      <script type="text/javascript">
        var status="on";
        document.getElementById('bck').innerHTML=status;
      </script>
      -->

        <div class="inner"><button name="bck" class="btn-primary btn-lg pull-center" (click)="saveSelected()" > << Πίσω </button> </div>
        <div class="inner"><button name="nxt"  class="btn-primary btn-lg pull-center" (click)="saveSelected()" [disabled]="!applicantForm.form.valid"> Επόμενο >> </button> </div>
     </div>

 </form>

  `


})




 @Injectable() export default class StudentDataFieldsSelect implements OnInit {

   private studentdataFields$: Observable<IStudentDataFields>;
   relationsToStudentChoices = ['Παρακαλώ επιλέξτε..','Γονέας/Κηδεμόνας',  'Μαθητής'];

   public studentDataGroup: FormGroup;
   //public cfs = new FormArray([]);

   constructor(private http: Http, private fb: FormBuilder, private _cfa: StudentDataFieldsActions, private _ngRedux: NgRedux<IAppState>) {

        let studentAmkaCtrl = this.fb.control('', Validators.required);
        this.studentDataGroup = this.fb.group({
          // formArray: this.cfs,
           studentAmka: [{value:'', disabled: studentAmkaCtrl}],

           studentFirstname: ['', validateName],
           studentSurname: ['', validateName],
           guardianFirstname: ['', validateName],
           guardianSurname: ['', validateName],
           regionAddress: ['', Validators.required],
           regionTK: ['', Validators.required],
           regionArea: ['', Validators.required],
           certificateType: ['Παρακαλώ επιλέξτε..', validateListChoices],
           relationToStudent: ['Παρακαλώ επιλέξτε..', validateListChoices],

           //studentSurname: new FormControl("test", Validators.required)
       });

   };

   ngOnInit() {
       this._cfa.getStudentDataFields();

       //(<FormControl>this.studentDataGroup.controls['studentFirstname'])
      //     .setValue('John', { onlySelf: true });

       /*
       this.studentdataFields$ = this._ngRedux.select(state => {
          console.log("hello");
           for (let studentdataField in state.studentdataFields) {
               //this.cfs.push(new FormControl('', []));
                console.log(this.studentDataGroup.value.studentFirstname);
               ;
           }
           return state.studentdataFields;
       });
       */

       this.studentdataFields$ = this._ngRedux.select(state => {
          //console.log("hello");
           state.studentdataFields.reduce(({}, studentdataField) =>{
               //this.cfs.push(new FormControl(studentdataField.selected, []));
               //console.log( this.studentDataGroup.value.studentFirstname);
              console.log(studentdataField.studentFirstname);
              console.log("hello2");

              if ((studentdataField.studentAmka).length > 0)
                (<FormControl>this.studentDataGroup.controls['studentAmka']).setValue(studentdataField.studentAmka, {  });
              if ((studentdataField.studentFirstname).length > 0)
                (<FormControl>this.studentDataGroup.controls['studentFirstname']).setValue(studentdataField.studentFirstname, {  });
              if ((studentdataField.studentSurname).length > 0)
                (<FormControl>this.studentDataGroup.controls['studentSurname']).setValue(studentdataField.studentSurname, {  });
              if ((studentdataField.guardianFirstname).length > 0)
                (<FormControl>this.studentDataGroup.controls['guardianFirstname']).setValue(studentdataField.guardianFirstname, {  });
              if ((studentdataField.guardianSurname).length > 0)
                (<FormControl>this.studentDataGroup.controls['guardianSurname']).setValue(studentdataField.guardianSurname, {  });
              if ((studentdataField.regionAddress).length > 0)
                (<FormControl>this.studentDataGroup.controls['regionAddress']).setValue(studentdataField.regionAddress, {  });
              if ((studentdataField.regionTK).length > 0)
                (<FormControl>this.studentDataGroup.controls['regionTK']).setValue(studentdataField.regionTK, {  });
              if ((studentdataField.regionArea).length > 0)
                (<FormControl>this.studentDataGroup.controls['regionArea']).setValue(studentdataField.regionArea, {  });
              if ((studentdataField.certificateType).length > 0)
                (<FormControl>this.studentDataGroup.controls['certificateType']).setValue(studentdataField.certificateType, {  });
              if ((studentdataField.relationToStudent).length > 0)
                (<FormControl>this.studentDataGroup.controls['relationToStudent']).setValue(studentdataField.relationToStudent, {  });



               return studentdataField;
           }, {});
           return state.studentdataFields;
       });

   }



  saveSelected() {
      //let test = this.studentDataGroup.value.studentFirstname;
      //console.log(test);

      //console.log(this.studentDataGroup.value.studentFirstname);
      //console.log(this.studentDataGroup.value.studentSurname);
      console.log(this.studentDataGroup.value.relationToStudent);

      this._cfa.saveStudentDataFields(this.studentDataGroup.value.studentFirstname, this.studentDataGroup.value.studentSurname,
        this.studentDataGroup.value.guardianFirstname,this.studentDataGroup.value.guardianSurname,
        this.studentDataGroup.value.studentdataFieldsStudentAmka,
        this.studentDataGroup.value.regionAddress,this.studentDataGroup.value.regionTK,
        this.studentDataGroup.value.regionArea,
        this.studentDataGroup.value.certificateType,this.studentDataGroup.value.relationToStudent );
      //this._cfa.saveStudentDataFields(this.studentDataGroup.value.studentSurname);
      //this._cfa.saveStudentDataFields("nikos");
  }


}



function validateName(c: FormControl) {
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

 function validateListChoices(c: FormControl) {
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
