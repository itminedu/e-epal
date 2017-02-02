import { CourseFieldsActions } from './coursefields.actions';
import { SectorFieldsActions } from './sectorfields.actions';
import { RegionSchoolsActions } from './regionschools.actions';
import { SectorCoursesActions } from './sectorcourses.actions';
import { StudentDataFieldsActions } from './studentdatafields.actions';
import { ClassFieldsActions } from './classfields.actions';
const ACTION_PROVIDERS = [ CourseFieldsActions, SectorFieldsActions, RegionSchoolsActions, SectorCoursesActions, StudentDataFieldsActions, ClassFieldsActions ];

export {
  CourseFieldsActions,
  SectorFieldsActions,
  RegionSchoolsActions,
  SectorCoursesActions,
  StudentDataFieldsActions,
  ClassFieldsActions,
  ACTION_PROVIDERS,
};
