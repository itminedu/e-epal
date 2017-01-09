import { ICourseField, ICourseFields } from './coursefields.types';
import { courseFieldsReducer } from './coursefields.reducer';
import { deimmutifyCourseFields, reimmutifyCourseFields } from './coursefields.transformers';

export {
  ICourseField,
  ICourseFields,
  courseFieldsReducer,
  deimmutifyCourseFields,
  reimmutifyCourseFields,
};
