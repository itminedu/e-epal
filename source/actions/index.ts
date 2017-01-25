import { CourseFieldsActions } from './coursefields.actions';
import { RegionSchoolsActions } from './regionschools.actions';
import { StudentDataFieldsActions } from './studentdatafields.actions';
const ACTION_PROVIDERS = [ CourseFieldsActions, RegionSchoolsActions, StudentDataFieldsActions  ];

export {
  CourseFieldsActions,
  RegionSchoolsActions,
  StudentDataFieldsActions,
  ACTION_PROVIDERS,
};
