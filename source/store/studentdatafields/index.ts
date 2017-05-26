import { IStudentDataField, IStudentDataFields } from './studentdatafields.types';
import { studentDataFieldsReducer } from './studentdatafields.reducer';
import { deimmutifyStudentDataFields } from './studentdatafields.transformers';

export {
  IStudentDataField,
  IStudentDataFields,
  studentDataFieldsReducer,
  deimmutifyStudentDataFields,
};
