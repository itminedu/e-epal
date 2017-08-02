import { combineReducers } from "redux";

import * as epalclasses from "./epalclasses";
import * as loginInfo from "./logininfo";
import * as regions from "./regionschools";
import * as sectors from "./sectorcourses";
import * as sectorFields from "./sectorfields";
import * as studentDataFields from "./studentdatafields";

export interface IAppState {
    sectorFields?: sectorFields.ISectorFieldRecords;
    regions?: regions.IRegionRecords;
    sectors?: sectors.ISectorRecords;
    studentDataFields?: studentDataFields.IStudentDataFieldRecords;
    epalclasses?: epalclasses.IEpalClassRecords;
    loginInfo?: loginInfo.ILoginInfoRecords;
};

export const rootReducer = combineReducers<IAppState>({
    sectorFields: sectorFields.sectorFieldsReducer,
    regions: regions.regionSchoolsReducer,
    sectors: sectors.sectorCoursesReducer,
    studentDataFields: studentDataFields.studentDataFieldsReducer,
    epalclasses: epalclasses.epalclassesReducer,
    loginInfo: loginInfo.loginInfoReducer,
});

export function deimmutify(state: IAppState): Object {
    return {
        sectorFields: sectorFields.deimmutifySectorFields(state.sectorFields),
        regions: regions.deimmutifyRegionSchools(state.regions),
        sectors: sectors.deimmutifySectorCourses(state.sectors),
        studentdataFields: studentDataFields.deimmutifyStudentDataFields(state.studentDataFields),
        epalclasses: epalclasses.deimmutifyEpalClasses(state.epalclasses),
        loginInfo: loginInfo.deimmutifyLoginInfo(state.loginInfo),
    };
}
