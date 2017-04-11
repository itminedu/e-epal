import {
  Routes,
  RouterModule,
} from '@angular/router';

import {CamelCasePipe} from '../pipes/camelcase';
import {RemoveSpaces} from '../pipes/removespaces';
import ParentForm from '../components/student-application-form/parent.form';
import StudentApplicationMain from '../components/student-application-form/application.form.main';
import StudentsList from '../components/students/students-list';
import Home from '../components/home';
import SchoolHome from '../components/school.home';
import CourseFieldsSelect from '../components/student-application-form/course.fields.select';
import EpalClassesSelect from '../components/student-application-form/epal.class.select';
import SectorFieldsSelect from '../components/student-application-form/sector.fields.select';
import RegionSchoolsSelect from '../components/student-application-form/region.schools.select';
import SectorCoursesSelect from '../components/student-application-form/sector.courses.select';
import ApplicationPreview from '../components/student-application-form/application.preview';
import SchoolsOrderSelect from '../components/student-application-form/schools-order-select';
import ApplicationSubmit from '../components/student-application-form/application.submit';
import SubmitedPreview from '../components/student-application-form/submited.aplication.preview';
import SubmitedPerson from '../components/student-application-form/submitedstudent.preview';
import DirectorView from '../components/director/director-view';
import DirectorClassCapacity from '../components/director/director-classcapacity';

export const MainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'school', component: SchoolHome },
  { path: 'parent-form', component: ParentForm },
  { path: 'student-application-form-main', component: StudentApplicationMain },
  { path: 'students-list', component: StudentsList },
  { path: 'course-fields-select', component: CourseFieldsSelect },
  { path: 'epal-class-select', component: EpalClassesSelect },
  { path: 'sector-fields-select', component: SectorFieldsSelect },
  { path: 'region-schools-select', component: RegionSchoolsSelect },
  { path: 'sectorcourses-fields-select', component: SectorCoursesSelect },
  { path: 'application-preview', component: ApplicationPreview },
  { path: 'schools-order-select', component: SchoolsOrderSelect },
  { path: 'application-submit', component: ApplicationSubmit },
  { path: 'submited-preview', component: SubmitedPreview },
  { path: 'submited-person', component: SubmitedPerson },
  { path: 'director-view', component: DirectorView },
  { path: 'director-classcapacity', component: DirectorClassCapacity },
];

export const MainDeclarations = [
  CamelCasePipe,
  RemoveSpaces,
  StudentsList,
  Home,
  SchoolHome,
  CourseFieldsSelect,
  EpalClassesSelect,
  SectorFieldsSelect,
  RegionSchoolsSelect,
  SectorCoursesSelect,
  ParentForm,
  StudentApplicationMain,
  ApplicationPreview,
  SchoolsOrderSelect,
  ApplicationSubmit,
  SubmitedPreview,
  SubmitedPerson,
  DirectorView,
  DirectorClassCapacity
];
