import { List } from 'immutable';

export interface ISectorField {
    id: number;
    name: string;
    selected: boolean;
}

export type ISectorFields = List<ISectorField>;
