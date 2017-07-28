/* import { List } from "immutable";
import { ISectorField } from "./sectorfields.types";

export const SECTOR_FIELDS_INITIAL_STATE = List<ISectorField>(); */

import { List } from "immutable";
import { ISectorFieldRecord, ISectorField } from "./sectorfields.types";
import {recordify} from "typed-immutable-record";

export const SECTOR_FIELDS_INITIAL_STATE = List<ISectorFieldRecord>();
