import { SectorFieldsActions } from "./sectorfields.actions";
import { RegionSchoolsActions } from "./regionschools.actions";
import { SectorCoursesActions } from "./sectorcourses.actions";
import { StudentDataFieldsActions } from "./studentdatafields.actions";
import { EpalClassesActions } from "./epalclass.actions";
import { LoginInfoActions} from "./logininfo.actions";

const ACTION_PROVIDERS = [SectorFieldsActions, RegionSchoolsActions, SectorCoursesActions, StudentDataFieldsActions,
    EpalClassesActions, LoginInfoActions];

export {
SectorFieldsActions,
RegionSchoolsActions,
SectorCoursesActions,
StudentDataFieldsActions,
EpalClassesActions,
LoginInfoActions,
ACTION_PROVIDERS,
};
