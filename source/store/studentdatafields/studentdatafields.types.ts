import { List } from 'immutable';

export interface IStudentDataField {
  studentFirstname: string;
  studentSurname: string;
  guardianFirstname: string;
  guardianSurname: string;
  //guardianADT: string;
  studentAmka: string;
  regionAddress: string;
  regionTK: string;
  regionArea: string;
  certificateType: string;
  relationToStudent: string;
}

export type IStudentDataFields = List<IStudentDataField>;

/* export const CourseFieldRecord = Record({
  id: 0,
  name: '---',
  selected: 0
}); */
