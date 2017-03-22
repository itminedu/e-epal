import { CourseFieldsActions } from './coursefields.actions';
import { SectorFieldsActions } from './sectorfields.actions';
import { RegionSchoolsActions } from './regionschools.actions';
import { SectorCoursesActions } from './sectorcourses.actions';
import { StudentDataFieldsActions } from './studentdatafields.actions';
import { EpalClassesActions } from './epalclass.actions';
import { LoginInfoActions} from './logininfo.actions';
import { CriteriaActions} from './criteria.actions';

const ACTION_PROVIDERS = [ CourseFieldsActions, SectorFieldsActions, RegionSchoolsActions, SectorCoursesActions, StudentDataFieldsActions,
  EpalClassesActions, LoginInfoActions, CriteriaActions];

export {
  CourseFieldsActions,
  SectorFieldsActions,
  RegionSchoolsActions,
  SectorCoursesActions,
  StudentDataFieldsActions,
  EpalClassesActions,
  LoginInfoActions,
  CriteriaActions,

  ACTION_PROVIDERS,
};
