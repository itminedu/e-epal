import {
  Routes,
  RouterModule,
} from '@angular/router';

import {CamelCasePipe} from '../pipes/camelcase';
import {RemoveSpaces} from '../pipes/removespaces';
import Info from '../components/student-application-form/info';
import ParentForm from '../components/student-application-form/parent.form';
import StudentApplicationMain from '../components/student-application-form/application.form.main';
import Home from '../components/home';
import SchoolHome from '../components/school.home';
import MinistryHome from '../components/ministry.home';
import CourseFieldsSelect from '../components/student-application-form/course.fields.select';
import Disclaimer from '../components/student-application-form/disclaimer';
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
import EduadminView from '../components/infoviews/eduadmin-view';
import DirectorClassCapacity from '../components/director/director-classcapacity';
import MinisterView from '../components/minister/minister-view';
import MinisterReports from '../components/minister/minister-reports';
import ReportAllStat from '../components/minister/report-all-stat';
import ReportGeneral from '../components/minister/report-general';
import ReportUsers from '../components/minister/report-users';
import ReportNoCapacity from '../components/minister/report-no-capacity';
import InformStudents from '../components/minister/minister-informstudents';
import MinisterSettings from '../components/minister/minister-settings';
import SchoolAuthGuard from '../guards/school.auth.guard';
import SchoolStudentsLockedGuard from '../guards/school.students.locked.guard';
import SchoolCapacityLockedGuard from '../guards/school.capacity.locked.guard';
import StudentAuthGuard from '../guards/student.auth.guard';
import StudentLockGuard from '../guards/student.lock.guard';
import RegionEduAuthGuard from '../guards/regionedu.auth.guard';
import  EduAdminAuthGuard from  '../guards/eduadmin.auth.guard';
import HelpDesk from  '../components/student-application-form/help-desk';
import MinistryAuthGuard from '../guards/ministry.auth.guard';
import ReportsAuthGuard from '../guards/reports.auth.guard';
import Breadcrumbs from '../components/main/breadcrumbs';

export const MainRoutes: Routes = [
  { path: '', component: Home },
  { path: 'info', component: Info, canActivate: [StudentAuthGuard] },
  { path: 'logout', component: Home },
  { path: 'school', component: SchoolHome },
  { path: 'school/logout', component: SchoolHome },
  { path: 'ministry', component: MinistryHome },
  { path: 'ministry/logout', component: MinistryHome },
//  { path: 'breadcrumbs', component: Breadcrumbs },
  { path: 'parent-form', component: ParentForm, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'student-application-form-main', component: StudentApplicationMain, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'course-fields-select', component: CourseFieldsSelect, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'intro-statement', component: Disclaimer, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'epal-class-select', component: EpalClassesSelect, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'sector-fields-select', component: SectorFieldsSelect, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'region-schools-select', component: RegionSchoolsSelect, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'sectorcourses-fields-select', component: SectorCoursesSelect, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'application-preview', component: ApplicationPreview, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'schools-order-select', component: SchoolsOrderSelect, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'application-submit', component: ApplicationSubmit, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'submited-preview', component: SubmitedPreview, canActivate: [StudentAuthGuard] },
  { path: 'submited-person', component: SubmitedPerson, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'post-submit', component: AfterSubmit, canActivate: [StudentAuthGuard, StudentLockGuard] },
  { path: 'school/director-view', component: DirectorView, canActivate: [SchoolAuthGuard, SchoolStudentsLockedGuard] },
  { path: 'school/director-buttons', component: DirectorButtons, canActivate: [SchoolAuthGuard]  },
  { path: 'school/director-classcapacity', component: DirectorClassCapacity, canActivate: [SchoolAuthGuard, SchoolCapacityLockedGuard] },
  { path: 'ministry/minister-view', component: MinisterView, canActivate: [MinistryAuthGuard]  },
  { path: 'ministry/minister-reports', component: MinisterReports, canActivate: [ReportsAuthGuard] },
  { path: 'ministry/report-all-stat/:reportId', component: ReportAllStat, canActivate: [ReportsAuthGuard] },
  { path: 'ministry/report-general', component: ReportGeneral, canActivate: [MinistryAuthGuard]  },
  { path: 'ministry/report-users/:reportId', component: ReportUsers, canActivate: [MinistryAuthGuard]  },
  { path: 'ministry/report-no-capacity/:reportId', component: ReportNoCapacity, canActivate: [MinistryAuthGuard]  },
  { path: 'ministry/minister-informstudents', component: InformStudents, canActivate: [MinistryAuthGuard]  },
  { path: 'ministry/minister-settings', component: MinisterSettings, canActivate: [MinistryAuthGuard] },
  { path: 'school/perfecture-view', component: PerfectureView, canActivate: [RegionEduAuthGuard] },
  { path: 'school/eduadmin-view', component: EduadminView, canActivate: [EduAdminAuthGuard] },
  { path: 'help-desk', component: HelpDesk },
];

export const MainDeclarations = [
  CamelCasePipe,
  RemoveSpaces,
  Home,
  SchoolHome,
  MinistryHome,
  CourseFieldsSelect,
  Disclaimer,
  EpalClassesSelect,
  SectorFieldsSelect,
  RegionSchoolsSelect,
  SectorCoursesSelect,
  ParentForm,
  Info,
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
  ReportUsers,
  ReportNoCapacity,
  InformStudents,
  MinisterSettings,
  PerfectureView,
  Breadcrumbs,
  DirectorButtons,
  EduadminView,
  HelpDesk,
];
