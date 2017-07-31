import { ISectorRecords, ISectorRecord, ISectorCourseRecord, ISector, ISectorCourse } from "./sectorcourses.types";
import { SECTOR_COURSES_INITIAL_STATE } from "./sectorcourses.initial-state";
import { List } from "immutable";
import {recordify} from "typed-immutable-record";

import {
    SECTORCOURSES_RECEIVED,
    SECTORCOURSES_SECTOR_SELECTED_SAVE,
    SECTORCOURSES_SELECTED_SAVE,
    SECTORCOURSES_INIT
} from "../../constants";

export function sectorCoursesReducer(state: ISectorRecords = SECTOR_COURSES_INITIAL_STATE, action): ISectorRecords {
    switch (action.type) {
        case SECTORCOURSES_RECEIVED:
        let newSectors = Array<ISectorRecord>();
        let newCourses = Array<ISectorCourseRecord>();
        let i = 0, j = 0;
        let ii = 0;

        action.payload.sectors.forEach(sector => {
            sector.courses.forEach(course => {
                newCourses.push(recordify<ISectorCourse, ISectorCourseRecord>({ course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: course.selected }));
                ii++;
            });
            newSectors.push(recordify<ISector, ISectorRecord>({ sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: List(newCourses) }));
            newCourses = Array<ISectorCourseRecord>();
            i++;
        });
        return List(newSectors);

        case SECTORCOURSES_SECTOR_SELECTED_SAVE:
            return state.withMutations(function(list) {
                if (action.payload.prevChoice >= 0)
                    list.setIn([action.payload.prevChoice, "sector_selected"], false);
                if (action.payload.newChoice >= 0)
                    list.setIn([action.payload.newChoice, "sector_selected"], true);
            });

        case SECTORCOURSES_SELECTED_SAVE:
            return state.withMutations(function(list) {
                list.setIn([action.payload.oldSIndex, "sector_selected"], false);
                list.setIn([action.payload.sIndex, "sector_selected"], true);
                list.setIn([action.payload.oldSIndex, "courses"], list.get(action.payload.oldSIndex).get("courses").setIn([action.payload.oldCIndex, "selected"], false));
                list.setIn([action.payload.sIndex, "courses"], list.get(action.payload.sIndex).get("courses").setIn([action.payload.cIndex, "selected"], action.payload.checked));
            });


/*            let sectorsWithSelections = Array<ISector>();
            let ind = 0;
            j = 0;
            state.forEach(sector => {
                sectorsWithSelections.push(<ISector>{ sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: action.payload.sectorSelected[ind], courses: Array<ISectorCourse>() });
                sector.courses.forEach(course => {
                    sectorsWithSelections[ind].courses.push(<ISectorCourse>{ course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: action.payload.sectorCoursesSelected[j] });
                    j++;
                });
                ind++;
            });
            return Seq(sectorsWithSelections).map(n => n).toList(); */
        case SECTORCOURSES_INIT:
            return SECTOR_COURSES_INITIAL_STATE;
        default: return state;
    }
};
