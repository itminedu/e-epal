import { IAmkaFills, IAmkaFill } from './amkafills.types';

export function deimmutifyAmkaFills(state: IAmkaFills): IAmkaFill[] {
    let fetchedAmkaFills = new Array();
    state.forEach(amkafill => {
        fetchedAmkaFills.push(<IAmkaFill>{name: amkafill.name});
    });
    return fetchedAmkaFills;
};



