import { ISectors, ISector, ISectorCourse } from './sectorcourses.types';
import { INITIAL_STATE } from './sectorcourses.initial-state';
import { Seq } from 'immutable';

import {
  SECTORCOURSES_RECEIVED,
  SECTORCOURSES_SELECTED_SAVE
} from '../../constants';

export function sectorCoursesReducer(state: ISectors = INITIAL_STATE, action): ISectors {
  switch (action.type) {
    case SECTORCOURSES_RECEIVED:
        let newSectors = Array<ISector>();
        let i=0;
        action.payload.sectors.forEach(sector => {
            newSectors.push(<ISector>{sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: Array<ISectorCourse>() });
            sector.courses.forEach(course => {
                newSectors[i].courses.push(<ISectorCourse>{course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: course.selected });
            })
            i++;
        });
        return Seq(newSectors).map(n => n).toList();

    case SECTORCOURSES_SELECTED_SAVE:
        let sectorsWithSelections = Array<ISector>();
        let ind=0, j = 0;
        state.forEach(sector => {
            sectorsWithSelections.push(<ISector>{sector_id: sector.sector_id, sector_name: sector.sector_name, sector_selected: sector.sector_selected, courses: Array<ISectorCourse>()});
            sector.courses.forEach(course => {
                sectorsWithSelections[ind].courses.push(<ISectorCourse>{course_id: course.course_id, course_name: course.course_name, globalIndex: course.globalIndex, selected: action.payload.sectorCoursesSelected[j]});
                j++;
            })
            ind++;
        });
        return Seq(sectorsWithSelections).map(n => n).toList();
    default: return state;
  }
};
