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
import MinistryHome from '../components/ministry.home';
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
import AfterSubmit from '../components/student-application-form/after.submit';
import DirectorView from '../components/director/director-view';
import DirectorButtons from '../components/director/director.buttons';
import PerfectureView from '../components/infoviews/perfecture-view';
import DirectorClassCapacity from '../components/director/director-classcapacity';
import MinisterView from '../components/minister/minister-view';
import MinisterReports from '../components/minister/minister-reports';
import ReportAllStat from '../components/minister/report-all-stat';
import ReportGeneral from '../components/minister/report-general';
import InformStudents from '../components/minister/minister-informstudents';
import SchoolAuthGuard from '../guards/school.auth.guard';
import StudentAuthGuard from '../guards/student.auth.guard';
import RegionEduAuthGuard from '../guards/regionedu.auth.guard';
import Breadcrumbs from '../components/main/breadcrumbs';

export const MainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'school', component: SchoolHome },
  { path: 'ministry', component: MinistryHome },
  { path: 'breadcrumbs', component: Breadcrumbs },
  { path: 'parent-form', component: ParentForm, canActivate: [StudentAuthGuard] },
  { path: 'student-application-form-main', component: StudentApplicationMain, canActivate: [StudentAuthGuard] },
//  { path: 'students-list', component: StudentsList },
  { path: 'course-fields-select', component: CourseFieldsSelect, canActivate: [StudentAuthGuard] },
  { path: 'epal-class-select', component: EpalClassesSelect, canActivate: [StudentAuthGuard] },
  { path: 'sector-fields-select', component: SectorFieldsSelect, canActivate: [StudentAuthGuard] },
  { path: 'region-schools-select', component: RegionSchoolsSelect, canActivate: [StudentAuthGuard] },
  { path: 'sectorcourses-fields-select', component: SectorCoursesSelect, canActivate: [StudentAuthGuard] },
  { path: 'application-preview', component: ApplicationPreview, canActivate: [StudentAuthGuard] },
  { path: 'schools-order-select', component: SchoolsOrderSelect, canActivate: [StudentAuthGuard] },
  { path: 'application-submit', component: ApplicationSubmit, canActivate: [StudentAuthGuard] },
  { path: 'submited-preview', component: SubmitedPreview, canActivate: [StudentAuthGuard] },
  { path: 'submited-person', component: SubmitedPerson, canActivate: [StudentAuthGuard] },
  { path: 'post-submit', component: AfterSubmit, canActivate: [StudentAuthGuard] },
  { path: 'school/director-view', component: DirectorView, canActivate: [SchoolAuthGuard] },
  { path: 'school/director-buttons', component: DirectorButtons },
  { path: 'school/director-classcapacity', component: DirectorClassCapacity, canActivate: [SchoolAuthGuard] },
  { path: 'ministry/minister-view', component: MinisterView },
  { path: 'ministry/minister-reports', component: MinisterReports },
  { path: 'ministry/report-all-stat/:reportId', component: ReportAllStat },
  { path: 'ministry/report-general/:reportId', component: ReportGeneral },
  { path: 'ministry/minister-informstudents', component: InformStudents },
  { path: 'school/perfecture-view', component: PerfectureView, canActivate: [RegionEduAuthGuard] },
];

export const MainDeclarations = [
  CamelCasePipe,
  RemoveSpaces,
  StudentsList,
  Home,
  SchoolHome,
  MinistryHome,
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
  AfterSubmit,
  DirectorView,
  DirectorClassCapacity,
  MinisterView,
  MinisterReports,
  ReportAllStat,
  ReportGeneral,
  InformStudents,
  PerfectureView,
  Breadcrumbs,
  DirectorButtons
];
