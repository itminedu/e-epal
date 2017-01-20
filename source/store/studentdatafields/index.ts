import { IStudentDataField, IStudentDataFields } from './studentdatafields.types';
import { studentdataFieldsReducer } from './studentdatafields.reducer';
import { deimmutifyStudentDataFields } from './studentdatafields.transformers';

export {
  IStudentDataField,
  IStudentDataFields,
  studentdataFieldsReducer,
  deimmutifyStudentDataFields,
};
