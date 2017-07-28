import { List } from "immutable";
import {TypedRecord} from "typed-immutable-record";

export interface ISectorField {
    id: number;
    name: string;
    selected: boolean;
}

export interface ISectorFieldRecord extends TypedRecord<ISectorFieldRecord>, ISectorField { };
export type ISectorFieldRecords = List<ISectorFieldRecord>;
// export type ISectorFields = List<ISectorField>;
