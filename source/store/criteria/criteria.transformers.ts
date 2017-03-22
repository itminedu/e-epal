import { ICriteria, ICriter } from './criteria.types';

export function deimmutifyCriteria(state: ICriter): ICriteria[] {
    let fetchedCriteria = new Array();

    state.forEach(criteria => {
        fetchedCriteria.push(<ICriteria>{id: criteria.id, name: criteria.name,  mutual_disabled_id: criteria.mutual_disabled_id, selected: criteria.selected,
        });
    });
    return fetchedCriteria;
};
