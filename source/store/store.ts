import { combineReducers } from "redux";
import * as sectorFields from "./sectorfields";
import * as regions from "./regionschools";
import * as sectors from "./sectorcourses";
import * as studentDataFields from "./studentdatafields";
import * as epalclasses from "./epalclasses";
import * as loginInfo from "./logininfo";

export interface IAppState {
    sectorFields?: sectorFields.ISectorFieldRecords;
    regions?: regions.IRegionRecords;
    sectors?: sectors.ISectors;
    studentDataFields?: studentDataFields.IStudentDataFields;
    epalclasses?: epalclasses.IEpalClasses;
    loginInfo?: loginInfo.ILoginInfo;
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
