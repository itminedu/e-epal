import {
  Routes,
  RouterModule,
} from '@angular/router';

import {CamelCasePipe} from '../pipes/camelcase';
import Form3 from '../components/form-controls/form3';
import StudentApplicationMain from '../components/student-application-form/application.form.main';
import StudentsList from '../components/students/students-list';
import Home from '../components/home';
import CourseFieldsSelect from '../components/student-application-form/course.fields.select';
import SectorFieldsSelect from '../components/student-application-form/sector.fields.select';
import RegionSchoolsSelect from '../components/student-application-form/region.schools.select';
import SectorCoursesSelect from '../components/student-application-form/sector.courses.select';
import ApplicationPreview from '../components/student-application-form/application.preview';

export const MainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'form3', component: Form3 },
  { path: 'student-application-form-main', component: StudentApplicationMain },
  { path: 'students-list', component: StudentsList },
  { path: 'course-fields-select', component: CourseFieldsSelect },
  { path: 'sector-fields-select', component: SectorFieldsSelect },
  { path: 'region-schools-select', component: RegionSchoolsSelect },
  { path: 'sectorcourses-fields-select', component: SectorCoursesSelect },
  { path: 'application-preview', component: ApplicationPreview }
];

export const MainDeclarations = [
  CamelCasePipe,
  Form3,
  StudentsList,
  Home,
  CourseFieldsSelect,
  SectorFieldsSelect,
  RegionSchoolsSelect,
  SectorCoursesSelect,
  StudentApplicationMain,
  ApplicationPreview
];
