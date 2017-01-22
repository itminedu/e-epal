import {
  Routes,
  RouterModule,
} from '@angular/router';

import {CamelCasePipe} from '../pipes/camelcase';
import Form3 from '../components/form-controls/form3';
//import ApplicantInfoFormComponent from '../components/form-controls/applicantinfo-form.component';
import StudentApplicationMain from '../components/student-application-form/application.form.main';
import StudentsList from '../components/students/students-list';
import Home from '../components/home';
import CourseFieldsSelect from '../components/student-application-form/course.fields.select';

export const MainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'form3', component: Form3 },
//  { path: 'applicant-data-form', component: ApplicantInfoFormComponent },
  { path: 'student-application-form-main', component: StudentApplicationMain },
  { path: 'students-list', component: StudentsList },
  { path: 'course-fields-select', component: CourseFieldsSelect }
];

export const MainDeclarations = [
  CamelCasePipe,
  Form3,
  //ApplicantInfoFormComponent,
  StudentsList,
  Home,
  CourseFieldsSelect,
  StudentApplicationMain
];
