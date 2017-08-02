import { List } from "immutable";
import { TypedRecord } from "typed-immutable-record";

export interface IEpalClass {
    name: string;
}

export interface IEpalClassRecord extends TypedRecord<IEpalClassRecord>, IEpalClass { };
export type IEpalClassRecords = List<IEpalClassRecord>;
