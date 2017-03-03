import { ICriteria, ICriter } from './criteria.types';

export function deimmutifyCriteria(state: ICriter): ICriteria[] {
    let fetchedCriteria = new Array();

    state.forEach(criteria => {
        fetchedCriteria.push(<ICriteria>{orphanmono: criteria.orphanmono, orphantwice: criteria.orphantwice, threechildren: criteria.threechildren,
          manychildren: criteria.manychildren, twins: criteria.twins, disability: criteria.disability, studies: criteria.studies, income: criteria.income,
        });
    });
    return fetchedCriteria;
};
