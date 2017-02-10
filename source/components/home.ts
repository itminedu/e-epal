import {Component} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray
} from '@angular/forms';
@Component({
  selector: 'home',
  template: `
  <div>
    <h4>Στοιχεία Σύνδεσης</h4>
	   <form [formGroup]="formGroup">
           <div class="form-group">
              <label for="UserName">Όνομα Χρήστη</label><input class="form-control" type="text" formControlName="Username">
            </div> 
            <div class="form-group">
              <label for="Paswd">Κωδικός Ασφαλείας</label><input class="form-control" type="password" formControlName="Paswd">
            </div>  
            <div class="row">
              <div class="col-md-2 col-md-offset-5">
                <button type="button" class="btn-primary btn-lg pull-center" (click)="checkvalidation()">
                Συνέχεια<span class="glyphicon glyphicon-menu-right"></span>
                </button>
            </div>
            <div *ngIf="emptyselection==true">
                 Παρακαλώ συμπληρώστε το ΑΜΚΑ του μαθητή
            </div>
        </div>
     </form>	
  </div>
  `
})
export default class Home { 
	public formGroup: FormGroup;
       constructor(private fb: FormBuilder) {
       this.formGroup = this.fb.group({
            Username: [],
            Paswd : []
            });
        };


	checkvalidation() {
		if (this.fb.group.arguments == 'admin')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             	
		{


		  }



        }