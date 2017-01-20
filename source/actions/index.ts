import { CourseFieldsActions } from './coursefields.actions';
import { StudentDataFieldsActions } from './studentdatafields.actions';
const ACTION_PROVIDERS = [ CourseFieldsActions, StudentDataFieldsActions  ];

export {
  CourseFieldsActions,
  StudentDataFieldsActions,
  ACTION_PROVIDERS,
};
