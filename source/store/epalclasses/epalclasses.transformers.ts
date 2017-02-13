import { IEpalClasses, IEpalClass } from './epalclasses.types';

export function deimmutifyEpalClasses(state: IEpalClasses): IEpalClass[] {
    let fetchedEpalClasses = new Array();
    state.forEach(epalclass => {
        fetchedEpalClasses.push(<IEpalClass>{name: epalclass.name});
    });
    return fetchedEpalClasses;
};



