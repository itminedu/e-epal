import { IStudentDataFieldRecord, IStudentDataFieldRecords } from "./studentdatafields.types";
import { studentDataFieldsReducer } from "./studentdatafields.reducer";
import { deimmutifyStudentDataFields } from "./studentdatafields.transformers";

export {
    IStudentDataFieldRecord,
    IStudentDataFieldRecords,
    studentDataFieldsReducer,
    deimmutifyStudentDataFields,
};
