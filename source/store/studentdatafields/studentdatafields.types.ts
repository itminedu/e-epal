import { List } from "immutable";
import {TypedRecord} from "typed-immutable-record";

export interface IStudentDataField {
    epaluser_id: number;
    name: string;
    studentsurname: string;
    fatherfirstname: string;
    fathersurname: string;
    motherfirstname: string;
    mothersurname: string;
    studentbirthdate: Date;
    studentamka: string;
    regionaddress: string;
    regiontk: string;
    regionarea: string;
    lastschool_schoolname: any;
    lastschool_schoolyear: string;
    lastschool_class: string;
    relationtostudent: string;
    currentclass: string;
    points: number;
    telnum: string;
}

export interface IStudentDataFieldRecord extends TypedRecord<IStudentDataFieldRecord>, IStudentDataField { };
export type IStudentDataFieldRecords = List<IStudentDataFieldRecord>;
// export type IStudentDataFields = List<IStudentDataField>;
