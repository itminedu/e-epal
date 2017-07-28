import {createLogger} from "redux-logger";

import { IAppState, rootReducer, deimmutify } from "./store";
import { ISectorFieldRecord, ISectorFieldRecords } from "./sectorfields/sectorfields.types";
import { IRRegion, IRRegionSchool, IRegionRecord, IRegionRecords, IRegionSchoolRecord, IRegionSchoolRecords } from "./regionschools/regionschools.types";
import { ISectors, ISector, ISectorCourse } from "./sectorcourses/sectorcourses.types";
import { IStudentDataField, IStudentDataFields } from "./studentdatafields/studentdatafields.types";
import { IEpalClass, IEpalClasses } from "./epalclasses/epalclasses.types";
import { ILoginInfoToken, ILoginInfo } from "./logininfo/logininfo.types";

export {
IAppState,
rootReducer,
ISectorFieldRecord,
ISectorFieldRecords,
IRRegion,
IRegionRecord,
IRegionRecords,
IRegionSchoolRecord,
IRegionSchoolRecords,
IRRegionSchool,
ISectors,
ISector,
ISectorCourse,
IStudentDataField,
IStudentDataFields,
IEpalClass,
IEpalClasses,
ILoginInfo,
};

const myLogger = createLogger({
    level: "info",
    collapsed: true,
    stateTransformer: deimmutify
});
export const middleware = [
    myLogger
];
