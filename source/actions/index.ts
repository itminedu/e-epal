import { CourseFieldsActions } from './coursefields.actions';
import { SectorFieldsActions } from './sectorfields.actions';
import { RegionSchoolsActions } from './regionschools.actions';
import { SectorCoursesActions } from './sectorcourses.actions';
import { StudentDataFieldsActions } from './studentdatafields.actions';
const ACTION_PROVIDERS = [ CourseFieldsActions, SectorFieldsActions, RegionSchoolsActions, SectorCoursesActions, StudentDataFieldsActions  ];

export {
  CourseFieldsActions,
  SectorFieldsActions,
  RegionSchoolsActions,
  SectorCoursesActions,
  StudentDataFieldsActions,
  ACTION_PROVIDERS,
};
